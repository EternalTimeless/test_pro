import { copyFile, existsSync, mkdir, readdir, readFileSync, writeFileSync, remove, lstatSync } from "fs-extra";
import { Utils, NamingRuleManager, NamingRuleConfig } from "../utils/utils";
import { join, dirname, resolve } from "path";
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
    /**
     * 获取配置文件的绝对路径
     * @param relativePath 相对于扩展根目录的相对路径
     * @returns 配置文件的绝对路径
     */
    private getConfigPath(relativePath: string): string {
        // 在开发环境：__dirname 指向 src/core
        // 在打包环境：__dirname 指向 dist
        // 都需要回到扩展根目录才能找到 configs 目录
        let extensionRoot: string;
        
        if (__dirname.endsWith('src/core') || __dirname.endsWith('src\\core')) {
            // 开发环境：从 src/core 回到根目录
            extensionRoot = resolve(__dirname, '../..');
        } else {
            // 打包环境：从 dist 回到根目录
            extensionRoot = resolve(__dirname, '..');
        }
        
        return resolve(extensionRoot, relativePath);
    }

    async pack(packConfig: PackConfig) {
        const { gameAbbr, packageDate, adName, plannerAbbr, companyPrefix, packageDir, selectedPlatforms, configValues } = packConfig;
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

        // 如果是SSD游戏，创建KR版本目录
        let krVersionDir: string | null = null;
        if (gameAbbr === 'SSD') {
            krVersionDir = join(superPackageDir, 'KR版本');
            await mkdir(krVersionDir, { recursive: true });
            console.log('检测到SSD游戏，已创建KR版本目录');
        }

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
                tceVersionDir,
                krVersionDir,
                configValues: configValues || {}
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
        tceVersionDir: string,
        krVersionDir: string | null,
        configValues: Record<string, any>
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
            tceVersionDir,
            krVersionDir,
            configValues
        } = params;
        
        const platformDir = join(packageDirPath, platform);

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
                const newFileNames = await this.generateFileNames(
                    gameAbbr, packageDate, adName, plannerAbbr, companyPrefix, platform, fileExt, undefined, configValues
                );

                // 如果是SSD游戏且有KR版本目录，生成KR版本文件名
                let krFileName: string | null = null;
                if (krVersionDir && gameAbbr === 'SSD') {
                    const krFileNames = await this.generateFileNames(
                        gameAbbr, packageDate, adName, plannerAbbr, companyPrefix, platform, fileExt, 'KR', configValues
                    );
                    krFileName = join(krVersionDir, krFileNames.normal);
                }
                
                // 处理文件
                await this.processFile(
                    join(platformDir, file),
                    fileExt,
                    join(normalVersionDir, newFileNames.normal),
                    join(tceVersionDir, newFileNames.tce),
                    adName,
                    krFileName
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
        if((platform === PlatformEnum.MOLOCO) && ['TH', 'TW', 'LW'].includes(gameAbbr)) {
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
        // 读取head脚本片段
        const headSnippetPath = this.getConfigPath('configs/moloco_head.html');
        const headScript = readFileSync(headSnippetPath, 'utf-8');
        
        // 读取body脚本片段
        const bodySnippetPath = this.getConfigPath('configs/moloco_body.html');
        const bodyScript = readFileSync(bodySnippetPath, 'utf-8');

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
                        console.log(`已插入 ${headScript.length} 字符到头部`);
                        console.log(`已插入 ${bodyScript.length} 字符到身体`);
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
                    const configPath = this.getConfigPath('configs/configTT.json');
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
                    const configPath = this.getConfigPath('configs/configSnapchat.json');
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
     * 生成文件名（使用可配置的命名规则）
     */
    private async generateFileNames(
        gameAbbr: string,
        packageDate: string,
        adName: string,
        plannerAbbr: string,
        companyPrefix: string,
        platform: string,
        fileExt: string,
        language?: string,
        extraConfigValues?: Record<string, any>
    ) {
        // 获取当前命名规则
        const namingRule = await NamingRuleManager.getCurrentRule();

        // 准备配置项的值
        // 如果是KR版本，在adName后添加"^概率公示"
        const finalAdName = language === 'KR' ? `${adName}^概率公示` : adName;

        // 合并基础配置值和额外配置值
        // 注意：如果明确传入了 language 参数（如 KR 版本），优先使用该参数
        const configValues = {
            gameAbbr,
            packageDate,
            adName: finalAdName,
            plannerAbbr,
            companyPrefix,
            platformName: platform.charAt(0).toUpperCase() + platform.slice(1),
            ...extraConfigValues,  // 先使用用户输入的值（包括 language、serialNumber 等）
            // 如果明确传入了 language 参数（如 KR 版本），则覆盖用户输入，确保 KR 版本始终使用 'KR'
            ...(language ? { language } : {})
        };
        
        // 生成普通版文件名
        const normalName = NamingRuleManager.generateFileName(
            namingRule.normalTemplate,
            namingRule.configItems,
            namingRule.separator,
            platform,
            configValues
        );
        
        // 生成TCE版文件名
        const tceName = NamingRuleManager.generateFileName(
            namingRule.tceTemplate,
            namingRule.configItems,
            namingRule.separator,
            platform,
            configValues
        );
        
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
        adName: string,
        krVersionPath?: string | null
    ) {
        try {
            console.log(`开始处理文件: ${sourceFilePath}`);
            console.log(`文件扩展名: ${fileExt}`);
            console.log(`常规版目标路径: ${normalVersionPath}`);
            console.log(`TCE版目标路径: ${tceVersionPath}`);
            if (krVersionPath) {
                console.log(`KR版目标路径: ${krVersionPath}`);
            }
            
            // 检查源文件是否存在
            if (!existsSync(sourceFilePath)) {
                throw new Error(`源文件不存在: ${sourceFilePath}`);
            }
            
            // 检查源文件是否是文件而不是目录
            if (!lstatSync(sourceFilePath).isFile()) {
                throw new Error(`源路径不是文件: ${sourceFilePath}`);
            }
            
            if (fileExt === 'html') {
                await this.processHtmlFile(sourceFilePath, normalVersionPath, tceVersionPath, adName, krVersionPath);
            } else if (fileExt === 'zip') {
                await this.processZipFile(sourceFilePath, normalVersionPath, tceVersionPath, adName, krVersionPath);
            } else {
                // 对于其他类型的文件，直接复制
                await copyFile(sourceFilePath, normalVersionPath);
                await copyFile(sourceFilePath, tceVersionPath);
                if (krVersionPath) {
                    await copyFile(sourceFilePath, krVersionPath);
                }
                const versions = krVersionPath ? '常规版、强制跳转版和KR版' : '常规版和强制跳转版';
                console.log(`文件 ${sourceFilePath} 已复制到${versions}目录`);
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
        adName: string,
        krVersionPath?: string | null
    ) {
        // 读取源文件内容
        const htmlContent = readFileSync(sourceFilePath, 'utf-8');
        
        // 为常规版本注入 window.isTCE = false
        const normalVersionContent = this.injectTCEVariable(htmlContent, false, adName);
        writeFileSync(normalVersionPath, normalVersionContent, 'utf-8');
        
        // 为TCE版本注入 window.isTCE = true
        const tceVersionContent = this.injectTCEVariable(htmlContent, true, adName);
        writeFileSync(tceVersionPath, tceVersionContent, 'utf-8');
        
        // 如果有KR版本路径，处理KR版本
        if (krVersionPath) {
            const krVersionContent = this.injectTCEVariable(htmlContent, false, adName, true);
            writeFileSync(krVersionPath, krVersionContent, 'utf-8');
        }
        
        const versions = krVersionPath ? '常规版、强制跳转版和KR版' : '常规版和强制跳转版';
        console.log(`HTML文件 ${sourceFilePath} 已处理并复制到${versions}目录`);
    }

    /**
     * 处理ZIP文件
     */
    private async processZipFile(
        sourceFilePath: string,
        normalVersionPath: string,
        tceVersionPath: string,
        adName: string,
        krVersionPath?: string | null
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
                
                // 如果有KR版本路径，处理KR版本
                if (krVersionPath) {
                    for (const htmlFile of htmlFiles) {
                        const htmlPath = join(tempDir, htmlFile);
                        const htmlContent = readFileSync(htmlPath, 'utf-8');
                        writeFileSync(htmlPath, this.injectTCEVariable(htmlContent, false, adName, true), 'utf-8');
                    }
                    
                    // 压缩为 KR 版
                    const krZip = new AdmZip();
                    krZip.addLocalFolder(tempDir);
                    krZip.writeZip(krVersionPath);
                }
                
                const versions = krVersionPath ? '常规版、强制跳转版和KR版' : '常规版和强制跳转版';
                console.log(`ZIP文件 ${sourceFilePath} 已处理并复制到${versions}目录`);
            } else {
                // 如果没有找到 HTML 文件，直接复制
                await copyFile(sourceFilePath, normalVersionPath);
                await copyFile(sourceFilePath, tceVersionPath);
                if (krVersionPath) {
                    await copyFile(sourceFilePath, krVersionPath);
                }
                const versions = krVersionPath ? '常规版、强制跳转版和KR版' : '常规版和强制跳转版';
                console.log(`ZIP文件 ${sourceFilePath} 无HTML文件，已直接复制到${versions}目录`);
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
     * 在HTML内容中注入window.isTCE变量、window.materialName变量和window.isKR变量
     * @param htmlContent HTML文件内容
     * @param isTCE 是否为TCE版本
     * @param adName 试玩广告名称
     * @param isKR 是否为KR版本
     * @returns 注入变量后的HTML内容
     */
    private injectTCEVariable(htmlContent: string, isTCE: boolean, adName: string, isKR?: boolean): string {
        // 生成materialName，优先级：TCE > KR > 普通版
        let materialName = adName;
        if (isTCE) {
            materialName = `${adName}TCE`;
        } else if (isKR) {
            materialName = `${adName}^概率公示`;
        }
        
        // 构建注入脚本
        let injectionScript = `<script>window.isTCE = ${isTCE}; window.materialName = "${materialName}";`;
        if (isKR !== undefined) {
            injectionScript += ` window.isKR = ${!!isKR};`;
        }
        injectionScript += '</script>';
        
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
        
        // 如果指定了isKR，检查是否已经有window.isKR定义
        if (isKR !== undefined) {
            if (htmlContent.includes('window.isKR =')) {
                // 替换已有的定义
                htmlContent = htmlContent.replace(/window\.isKR\s*=\s*(true|false)\s*;/g, `window.isKR = ${!!isKR};`);
            }
        }
        
        // 如果没有任何定义，则注入新脚本  
        const hasIsTCE = htmlContent.includes('window.isTCE =');
        const hasMaterialName = htmlContent.includes('window.materialName =');
        const hasIsKR = htmlContent.includes('window.isKR =');
        
        if (!hasIsTCE && !hasMaterialName && (isKR === undefined || !hasIsKR)) {
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
    /**
     * 所有配置项的值（包括动态配置项如 language、serialNumber 等）
     */
    configValues?: Record<string, any>;
}
