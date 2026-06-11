import { copyFile, existsSync, mkdir, readdir, readFileSync, writeFileSync, remove, lstatSync } from "fs-extra";
import { Utils } from "../utils/utils";
import { join, dirname } from "path";
import AdmZip from 'adm-zip';

/**
 * 平台/渠道枚举
 */
export enum PlatformEnum {
    APPLOVIN = 'applovin',
    BIGO = 'bigo',
    COMMON = 'common',
    COMMON_MIN = 'common_min',
    FACEBOOK = 'facebook',
    GOOGLE = 'google',
    IRONSOURCE = 'ironsource',
    IRONSOURCE2025 = 'ironsource2025',
    KWAI = 'kwai',
    LIFTOFF = 'liftoff',
    MINTEGRAL = 'mintegral',
    MOLOCO = 'moloco',
    NEFTA = 'nefta',
    PANGLE = 'pangle',
    TIKTOK = 'tiktok',
    UNITY = 'unity',
    VUNGLE = 'vungle',
    SNAPCHAT = 'snapchat'
}

class Packer {
    async pack(packConfig: PackConfig) {
        const { gameAbbr, packageDate, adName, plannerAbbr, companyPrefix, packageDir, selectedPlatforms } = packConfig;
        const projectPath = Editor.Project.path;
        const projectName = Editor.Project.name;
        
        //获取默认build目录
        const defaultBuildDir = join(projectPath, 'build');

        // 使用Utils工具类转换路径
        const packageDirPath = Utils.convertProjectPath(packageDir);

        // 创建打包目录
        const superPackageDir = await this.createPackageDirectories(defaultBuildDir);

        // 创建常规版和强制跳转版目录
        const normalVersionDir = join(superPackageDir, '常规版');
        const tceVersionDir = join(superPackageDir, '强制跳转版');
        
        await mkdir(normalVersionDir, { recursive: true });
        await mkdir(tceVersionDir, { recursive: true });

        // 处理每个平台
        for (const platform of selectedPlatforms) {
            await this.processPlatform({
                platform,
                packageDirPath,
                gameAbbr,
                packageDate,
                adName,
                plannerAbbr,
                companyPrefix,
                normalVersionDir,
                tceVersionDir
            });
        }

        console.log('究极无敌打包工具打包完成');

        return superPackageDir;
    }

    /**
     * 创建打包目录
     */
    private async createPackageDirectories(defaultBuildDir: string): Promise<string> {
        const superPackageDir = join(defaultBuildDir, 'super_package');
        if (!existsSync(superPackageDir)) {
            await mkdir(superPackageDir, { recursive: true });
        } else {
            await remove(superPackageDir);
            await mkdir(superPackageDir, { recursive: true });
        }
        return superPackageDir;
    }

    /**
     * 处理单个平台
     */
    private async processPlatform(params: {
        platform: string,
        packageDirPath: string,
        gameAbbr: string,
        packageDate: string,
        adName: string,
        plannerAbbr: string,
        companyPrefix: string,
        normalVersionDir: string,
        tceVersionDir: string
    }) {
        const { 
            platform, 
            packageDirPath, 
            gameAbbr, 
            packageDate, 
            adName, 
            plannerAbbr, 
            companyPrefix, 
            normalVersionDir, 
            tceVersionDir 
        } = params;
        
        const platformDir = Editor.Utils.Path.join(packageDirPath, platform);

        // 检查平台目录是否存在
        if (!existsSync(platformDir)) {
            console.error(`平台目录不存在: ${platformDir}`);
            return;
        }

        // 获取平台目录下所有文件
        const files = await readdir(platformDir);
        
        // 处理平台特定逻辑
        await this.processPlatformSpecificLogic(platform, platformDir, files, gameAbbr);
        
        // 查找符合格式的文件并处理
        for (const file of files) {
            // 获取文件的完整路径以检查是否为文件
            const fullPath = join(platformDir, file);
            
            // 跳过目录，只处理文件
            if (!existsSync(fullPath) || !lstatSync(fullPath).isFile()) {
                continue;
            }
            
            // 获取文件名和扩展名
            const filenameParts = file.split('.');
            const filename = filenameParts[0];
            const fileExt = filenameParts.length > 1 ? filenameParts[filenameParts.length - 1] : '';

            // 如果没有扩展名，跳过该文件
            if (!fileExt) {
                console.log(`跳过无扩展名的文件: ${file}`);
                continue;
            }

            // Facebook平台只处理zip文件
            if (platform === PlatformEnum.FACEBOOK && fileExt !== 'zip') {
                continue;
            }

            // 检查文件名是否符合 projectName_platform 格式
            if (filename.endsWith(`_${platform}`) || (platform === PlatformEnum.SNAPCHAT && filename.endsWith('_snapchat_portrait'))) {
                // 生成文件名
                const newFileNames = this.generateFileNames(
                    gameAbbr, packageDate, adName, plannerAbbr, companyPrefix, platform, fileExt
                );
                
                // 处理文件
                await this.processFile(
                    join(platformDir, file),
                    fileExt,
                    join(normalVersionDir, newFileNames.normal),
                    join(tceVersionDir, newFileNames.tce),
                    adName
                );
                
                // 每个渠道找到一个文件后，就break
                break;
            }
        }
    }

    /**
     * 处理平台特定逻辑
     */
    private async processPlatformSpecificLogic(
        platform: string, 
        platformDir: string, 
        files: string[],
        gameAbbr: string
    ) {
        // MOLOCO平台特殊处理
        if(platform === PlatformEnum.MOLOCO && ['TH', 'TW', 'LW'].includes(gameAbbr)) {
            await this.processMolocoFiles(platformDir, files);
        }
        
        // TIKTOK平台特殊处理
        if(platform === PlatformEnum.TIKTOK) {
            await this.processTiktokFiles(platformDir, files);
        }

        // SNAPCHAT平台特殊处理
        if(platform === PlatformEnum.SNAPCHAT) {
            await this.processSnapchatFiles(platformDir, files);
        }
    }

    /**
     * 处理MOLOCO平台的文件
     */
    private async processMolocoFiles(platformDir: string, files: string[]) {
        // 读取head脚本文件内容
        const headJsPath = join(__dirname, '../../configs/moloco_head.js');
        const headJsContent = readFileSync(headJsPath, 'utf-8');
        const headScript = `<script>${headJsContent}</script>`;
        
        // 读取body脚本文件内容
        const bodyJsPath = join(__dirname, '../../configs/moloco_body.js');
        const bodyJsContent = readFileSync(bodyJsPath, 'utf-8');
        const bodyScript = `<script>${bodyJsContent}</script>`;

        for (const file of files) {
            // 检查文件是否是HTML文件
            if (file.endsWith('.html')) {
                const sourceFilePath = join(platformDir, file);
                
                try {
                    // 读取HTML文件内容
                    let content = readFileSync(sourceFilePath, 'utf-8');
                    let modified = false;
                    
                    // 插入到head
                    const headPos = content.indexOf('</head>');
                    if (headPos !== -1) {
                        content = content.substring(0, headPos) + `\n${headScript}\n` + content.substring(headPos);
                        modified = true;
                    }
                    
                    // 插入到body
                    const bodyPos = content.indexOf('</body>');
                    if (bodyPos !== -1) {
                        content = content.substring(0, bodyPos) + `\n${bodyScript}\n` + content.substring(bodyPos);
                        modified = true;
                    }
                    
                    if (modified) {
                        writeFileSync(sourceFilePath, content, 'utf-8');
                        console.log(`成功更新 ${file}`);
                        console.log(`已插入 ${headScript.length} 字符到<head>`);
                        console.log(`已插入 ${bodyScript.length} 字符到<body>`);
                    } else {
                        console.log(`文件 ${file} 未找到</head>或</body>标签`);
                    }
                } catch (error) {
                    console.error(`处理文件 ${file} 时出错:`, error);
                }
            }
        }
    }

    /**
     * 处理TIKTOK平台的文件
     */
    private async processTiktokFiles(platformDir: string, files: string[]) {
        for (const file of files) {
            // 检查文件是否是ZIP文件
            if (file.endsWith('.zip')) {
                const sourceFilePath = join(platformDir, file);
                const tempDir = join(dirname(sourceFilePath), 'temp_unzip');
                
                // 创建临时目录
                if (!existsSync(tempDir)) {
                    await mkdir(tempDir, { recursive: true });
                }

                try {
                    // 解压文件
                    const zip = new AdmZip(sourceFilePath);
                    zip.extractAllTo(tempDir, true);

                    // 复制配置文件
                    const configPath = join(__dirname, '../../configs/configTT.json');
                    const configContent = readFileSync(configPath);
                    // 如果有config.json文件，则删除
                    if (existsSync(join(tempDir, 'config.json'))) {
                        await remove(join(tempDir, 'config.json'));
                    }
                    writeFileSync(join(tempDir, 'config.json'), configContent);

                    // 处理错误的sdk接入
                    // 获取index.html文件
                    const indexHtmlPath = join(tempDir, 'index.html');
                    if (existsSync(indexHtmlPath)) {
                        const indexHtmlContent = readFileSync(indexHtmlPath, 'utf-8');
                        // 修复sdk接入
                        const fixedHtmlContent = this.fixTikTokSDK(indexHtmlContent);
                        writeFileSync(indexHtmlPath, fixedHtmlContent, 'utf-8');
                        console.log(`已修复 ${file} 中的TikTok SDK接入问题`);
                    }

                    // 重新压缩
                    const newZip = new AdmZip();
                    newZip.addLocalFolder(tempDir);
                    newZip.writeZip(sourceFilePath);
                } finally {
                    // 清理临时目录
                    await remove(tempDir);
                }
            }
        }
    }

    
    /**
     * 处理SNAPCHAT平台的文件
     */
    private async processSnapchatFiles(platformDir: string, files: string[]) {
        for (const file of files) {
            // 检查文件是否是ZIP文件
            if (file.endsWith('_snapchat_portrait.zip')) {
                const sourceFilePath = join(platformDir, file);
                const tempDir = join(dirname(sourceFilePath), 'temp_unzip');
                
                // 创建临时目录
                if (!existsSync(tempDir)) {
                    await mkdir(tempDir, { recursive: true });
                }

                try {
                    // 解压文件
                    const zip = new AdmZip(sourceFilePath);
                    zip.extractAllTo(tempDir, true);

                    // 复制配置文件
                    const configPath = join(__dirname, '../../configs/configSnapchat.json');
                    const configContent = readFileSync(configPath);
                    // 如果有config.json文件，则删除
                    if (existsSync(join(tempDir, 'config.json'))) {
                        await remove(join(tempDir, 'config.json'));
                    }
                    writeFileSync(join(tempDir, 'config.json'), configContent);

                    // 重新压缩
                    const newZip = new AdmZip();
                    newZip.addLocalFolder(tempDir);
                    newZip.writeZip(sourceFilePath);
                } finally {
                    // 清理临时目录
                    await remove(tempDir);
                }
            }
        }
    }

    /**
     * 生成文件名
     */
    private generateFileNames(
        gameAbbr: string,
        packageDate: string,
        adName: string,
        plannerAbbr: string,
        companyPrefix: string,
        platform: string,
        fileExt: string
    ) {
        const platformName = platform.charAt(0).toUpperCase() + platform.slice(1);
        const normalName = [gameAbbr, packageDate, adName, plannerAbbr, companyPrefix, platformName, "ALL"].join('_');
        const tceName = [gameAbbr, packageDate, adName + "TCE", plannerAbbr, companyPrefix, platformName, "ALL"].join('_');
        
        return {
            normal: `${normalName}.${fileExt}`,
            tce: `${tceName}.${fileExt}`
        };
    }

    /**
     * 处理文件
     */
    private async processFile(
        sourceFilePath: string,
        fileExt: string,
        normalVersionPath: string,
        tceVersionPath: string,
        adName: string
    ) {
        try {
            console.log(`开始处理文件: ${sourceFilePath}`);
            console.log(`文件扩展名: ${fileExt}`);
            console.log(`常规版目标路径: ${normalVersionPath}`);
            console.log(`TCE版目标路径: ${tceVersionPath}`);
            
            // 检查源文件是否存在
            if (!existsSync(sourceFilePath)) {
                throw new Error(`源文件不存在: ${sourceFilePath}`);
            }
            
            // 检查源文件是否是文件而不是目录
            if (!lstatSync(sourceFilePath).isFile()) {
                throw new Error(`源路径不是文件: ${sourceFilePath}`);
            }
            
            if (fileExt === 'html') {
                await this.processHtmlFile(sourceFilePath, normalVersionPath, tceVersionPath, adName);
            } else if (fileExt === 'zip') {
                await this.processZipFile(sourceFilePath, normalVersionPath, tceVersionPath, adName);
            } else {
                // 对于其他类型的文件，直接复制
                await copyFile(sourceFilePath, normalVersionPath);
                await copyFile(sourceFilePath, tceVersionPath);
                console.log(`文件 ${sourceFilePath} 已复制到常规版和强制跳转版目录`);
            }
            
            console.log(`文件处理完成: ${sourceFilePath}`);
        } catch (error) {
            console.error(`处理文件时出错: ${sourceFilePath}`);
            console.error(`错误详情:`, error);
            throw error;
        }
    }

    /**
     * 处理HTML文件
     */
    private async processHtmlFile(
        sourceFilePath: string,
        normalVersionPath: string,
        tceVersionPath: string,
        adName: string
    ) {
        // 读取源文件内容
        const htmlContent = readFileSync(sourceFilePath, 'utf-8');
        
        // 为常规版本注入 window.isTCE = false
        const normalVersionContent = this.injectTCEVariable(htmlContent, false, adName);
        writeFileSync(normalVersionPath, normalVersionContent, 'utf-8');
        
        // 为TCE版本注入 window.isTCE = true
        const tceVersionContent = this.injectTCEVariable(htmlContent, true, adName);
        writeFileSync(tceVersionPath, tceVersionContent, 'utf-8');
        
        console.log(`HTML文件 ${sourceFilePath} 已处理并复制到常规版和强制跳转版目录`);
    }

    /**
     * 处理ZIP文件
     */
    private async processZipFile(
        sourceFilePath: string,
        normalVersionPath: string,
        tceVersionPath: string,
        adName: string
    ) {
        const tempDir = join(dirname(sourceFilePath), 'temp_unzip_tce');
        
        try {
            // 创建临时目录
            if (!existsSync(tempDir)) {
                await mkdir(tempDir, { recursive: true });
            }
            
            // 解压文件
            const zip = new AdmZip(sourceFilePath);
            zip.extractAllTo(tempDir, true);
            
            // 查找并处理 HTML 文件
            const htmlFiles = (await readdir(tempDir)).filter(f => f.endsWith('.html'));
            
            if (htmlFiles.length > 0) {
                // 处理常规版
                for (const htmlFile of htmlFiles) {
                    const htmlPath = join(tempDir, htmlFile);
                    const htmlContent = readFileSync(htmlPath, 'utf-8');
                    writeFileSync(htmlPath, this.injectTCEVariable(htmlContent, false, adName), 'utf-8');
                }
                
                // 压缩为常规版
                const normalZip = new AdmZip();
                normalZip.addLocalFolder(tempDir);
                normalZip.writeZip(normalVersionPath);
                
                // 处理 TCE 版
                for (const htmlFile of htmlFiles) {
                    const htmlPath = join(tempDir, htmlFile);
                    const htmlContent = readFileSync(htmlPath, 'utf-8');
                    writeFileSync(htmlPath, this.injectTCEVariable(htmlContent, true, adName), 'utf-8');
                }
                
                // 压缩为 TCE 版
                const tceZip = new AdmZip();
                tceZip.addLocalFolder(tempDir);
                tceZip.writeZip(tceVersionPath);
                
                console.log(`ZIP文件 ${sourceFilePath} 已处理并复制到常规版和强制跳转版目录`);
            } else {
                // 如果没有找到 HTML 文件，直接复制
                await copyFile(sourceFilePath, normalVersionPath);
                await copyFile(sourceFilePath, tceVersionPath);
                console.log(`ZIP文件 ${sourceFilePath} 无HTML文件，已直接复制到常规版和强制跳转版目录`);
            }
        } finally {
            // 清理临时目录
            await remove(tempDir);
        }
    }

    /**
     * 修复TikTok平台的SDK接入问题
     * @param htmlContent HTML文件内容
     * @returns 修复后的HTML内容
     */
    private fixTikTokSDK(htmlContent: string): string {
        const SDK_URL = 'https://sf16-muse-va.ibytedtos.com/obj/union-fe-nc-i18n/playable/sdk/playable-sdk.js';
        
        // 1. 移除错误的嵌套script标签
        // 匹配类似 <script type="text/javascript"><script src="..."></script></script> 的错误结构
        let fixedContent = htmlContent.replace(
            /<script[^>]*>\s*<script\s+src="[^"]*playable-sdk\.js"><\/script>\s*<\/script>/gi,
            ''
        );
        
        // 2. 移除单独存在的错误SDK引用（在head部分）
        fixedContent = fixedContent.replace(
            /<script\s+src="[^"]*playable-sdk\.js"><\/script>/gi,
            ''
        );
        
        // 3. 修复占位符语法错误
        fixedContent = fixedContent.replace(
            /<script[^>]*>\s*\.\.\.\s*<\/script>/gi,
            '<script type="text/javascript"></script>'
        );
        
        // 4. 确保SDK脚本在body内部且在其他所有JS之前
        // 查找 <body> 标签位置
        const bodyStartMatch = fixedContent.match(/<body[^>]*>/i);
        if (bodyStartMatch) {
            const bodyStartIndex = bodyStartMatch.index! + bodyStartMatch[0].length;
            
            // 检查是否已经有正确的SDK引用
            const hasCorrectSDK = fixedContent.includes(`src="${SDK_URL}"`);
            
            if (!hasCorrectSDK) {
                // 在 <body> 标签后立即插入SDK脚本，确保在其他所有脚本之前
                const sdkScript = `\n<!-- 试玩广告 js-sdk 接入 - 放在主体内且在其他所有 JS 之前 -->\n<script src="${SDK_URL}"></script>\n`;
                fixedContent = fixedContent.substring(0, bodyStartIndex) + 
                              sdkScript + 
                              fixedContent.substring(bodyStartIndex);
            }
        }
        
        return fixedContent;
    }

    /**
     * 在HTML内容中注入window.isTCE变量和window.materialName变量
     * @param htmlContent HTML文件内容
     * @param isTCE 是否为TCE版本
     * @param adName 试玩广告名称
     * @returns 注入变量后的HTML内容
     */
    private injectTCEVariable(htmlContent: string, isTCE: boolean, adName: string): string {
        const materialName = isTCE ? `${adName}TCE` : adName;
        const injectionScript = `<script>window.isTCE = ${isTCE}; window.materialName = "${materialName}";</script>`;
        
        // 检查是否已经有window.isTCE定义
        if (htmlContent.includes('window.isTCE =')) {
            // 替换已有的定义
            htmlContent = htmlContent.replace(/window\.isTCE\s*=\s*(true|false)\s*;/g, `window.isTCE = ${isTCE};`);
        }
        
        // 检查是否已经有window.materialName定义
        if (htmlContent.includes('window.materialName =')) {
            // 替换已有的定义
            htmlContent = htmlContent.replace(/window\.materialName\s*=\s*[^;]+;/g, `window.materialName = "${materialName}";`);
        }
        
        // 如果没有任何定义，则注入新脚本
        if (!htmlContent.includes('window.isTCE =') && !htmlContent.includes('window.materialName =')) {
            // 在head标签结束前注入脚本
            if (htmlContent.includes('</head>')) {
                return htmlContent.replace('</head>', `${injectionScript}\n</head>`);
            }
            // 如果没有head标签，则在body标签开始后注入
            else if (htmlContent.includes('<body')) {
                return htmlContent.replace(/(<body[^>]*>)/i, `$1\n${injectionScript}`);
            }
            // 如果都没有，则在html开始标签后注入
            else if (htmlContent.includes('<html')) {
                return htmlContent.replace(/(<html[^>]*>)/i, `$1\n${injectionScript}`);
            }
            // 如果连html标签都没有，则在文件开头注入
            else {
                return `${injectionScript}\n${htmlContent}`;
            }
        }
        
        return htmlContent;
    }
}

export const packer: Packer = new Packer();

export interface PackConfig {
    /**
     * 游戏名称缩写
     */
    gameAbbr: string;
    /**
     * 打包日期
     */
    packageDate: string;
    /**
     * 试玩广告名称
     */
    adName: string;
    /**
     * 甲方策划名字缩写
     */
    plannerAbbr: string;
    /**
     * 公司前缀
     */
    companyPrefix: string;
    /**
     * 打包目录
     */
    packageDir: string;
    /**
     * 选择的平台
     */
    selectedPlatforms: PlatformEnum[];
}
