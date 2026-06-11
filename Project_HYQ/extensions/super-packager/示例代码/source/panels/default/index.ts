import { readFileSync } from 'fs-extra';
import { join } from 'path';
import { PackConfig, packer, PlatformEnum } from '../../core/packer';
/**
 * @zh 如果希望兼容 3.3 之前的版本可以使用下方的代码
 * @en You can add the code below if you want compatibility with versions prior to 3.3
 */
// Editor.Panel.define = Editor.Panel.define || function(options: any) { return options }
module.exports = Editor.Panel.define({
    listeners: {
        show() { console.log('show'); },
        hide() { console.log('hide'); },
    },
    template: readFileSync(join(__dirname, '../../../static/template/default/index.html'), 'utf-8'),
    style: readFileSync(join(__dirname, '../../../static/style/default/index.css'), 'utf-8'),
    $: {
        gameAbbr: '#input-game-abbr',
        packageDate: '#input-package-date',
        adName: '#input-ad-name',
        plannerAbbr: '#input-planner-abbr',
        companyPrefix: '#input-company-prefix',
        packageDir: '#input-package-dir',
        packageBtn: '#package-btn',
        platformApplovin: '#platform-applovin',
        platformBigo: '#platform-bigo',
        platformCommon: '#platform-common',
        platformCommonMin: '#platform-common_min',
        platformFacebook: '#platform-facebook',
        platformGoogle: '#platform-google',
        platformIronsource: '#platform-ironsource',
        platformIronsource2025: '#platform-ironsource2025',
        platformKwai: '#platform-kwai',
        platformLiftoff: '#platform-liftoff',
        platformMintegral: '#platform-mintegral',
        platformMoloco: '#platform-moloco',
        platformNefta: '#platform-nefta',
        platformPangle: '#platform-pangle',
        platformTiktok: '#platform-tiktok',
        platformUnity: '#platform-unity',
        platformVungle: '#platform-vungle',
        platformSnapchat: '#platform-snapchat',
    },
    methods: {
        getGameAbbr() {
            return this.$.gameAbbr ? (this.$.gameAbbr as any).value || '' : '';
        },
        
        getPackageDate() {
            return this.$.packageDate ? (this.$.packageDate as any).value || '' : '';
        },
        
        getAdName() {
            return this.$.adName ? (this.$.adName as any).value || '' : '';
        },
        
        getPlannerAbbr() {
            return this.$.plannerAbbr ? (this.$.plannerAbbr as any).value || '' : '';
        },
        
        getCompanyPrefix() {
            return this.$.companyPrefix ? (this.$.companyPrefix as any).value || 'RBN' : 'RBN';
        },
        
        getPackageDir() {
            return this.$.packageDir ? (this.$.packageDir as any).value || 'project://build/super-html' : 'project://build/super-html';
        },
        
        getSelectedPlatforms() {
            const platforms: PlatformEnum[] = [];
            
            if (this.$.platformApplovin && (this.$.platformApplovin as any).checked) platforms.push(PlatformEnum.APPLOVIN);
            if (this.$.platformBigo && (this.$.platformBigo as any).checked) platforms.push(PlatformEnum.BIGO);
            if (this.$.platformCommon && (this.$.platformCommon as any).checked) platforms.push(PlatformEnum.COMMON);
            if (this.$.platformCommonMin && (this.$.platformCommonMin as any).checked) platforms.push(PlatformEnum.COMMON_MIN);
            if (this.$.platformFacebook && (this.$.platformFacebook as any).checked) platforms.push(PlatformEnum.FACEBOOK);
            if (this.$.platformGoogle && (this.$.platformGoogle as any).checked) platforms.push(PlatformEnum.GOOGLE);
            if (this.$.platformIronsource && (this.$.platformIronsource as any).checked) platforms.push(PlatformEnum.IRONSOURCE);
            if (this.$.platformIronsource2025 && (this.$.platformIronsource2025 as any).checked) platforms.push(PlatformEnum.IRONSOURCE2025);
            if (this.$.platformKwai && (this.$.platformKwai as any).checked) platforms.push(PlatformEnum.KWAI);
            if (this.$.platformLiftoff && (this.$.platformLiftoff as any).checked) platforms.push(PlatformEnum.LIFTOFF);
            if (this.$.platformMintegral && (this.$.platformMintegral as any).checked) platforms.push(PlatformEnum.MINTEGRAL);
            if (this.$.platformMoloco && (this.$.platformMoloco as any).checked) platforms.push(PlatformEnum.MOLOCO);
            if (this.$.platformNefta && (this.$.platformNefta as any).checked) platforms.push(PlatformEnum.NEFTA);
            if (this.$.platformPangle && (this.$.platformPangle as any).checked) platforms.push(PlatformEnum.PANGLE);
            if (this.$.platformTiktok && (this.$.platformTiktok as any).checked) platforms.push(PlatformEnum.TIKTOK);
            if (this.$.platformUnity && (this.$.platformUnity as any).checked) platforms.push(PlatformEnum.UNITY);
            if (this.$.platformVungle && (this.$.platformVungle as any).checked) platforms.push(PlatformEnum.VUNGLE);
            if (this.$.platformSnapchat && (this.$.platformSnapchat as any).checked) platforms.push(PlatformEnum.SNAPCHAT);
            
            return platforms;
        },
        
        async saveData() {
            const data = {
                gameAbbr: this.getGameAbbr(),
                packageDate: this.getPackageDate(),
                adName: this.getAdName(),
                plannerAbbr: this.getPlannerAbbr(),
                companyPrefix: this.getCompanyPrefix(),
                packageDir: this.getPackageDir(),
                selectedPlatforms: this.getSelectedPlatforms(),
            };
            
            await Editor.Profile.setConfig('playabel-packager', 'packager-config', data);
            console.log('配置已保存');
        },
        
        async loadData() {
            try {
                const data = await Editor.Profile.getConfig('playabel-packager', 'packager-config');
                if (data) {
                    if (this.$.gameAbbr && data.gameAbbr) (this.$.gameAbbr as any).value = data.gameAbbr;
                    if (this.$.packageDate && data.packageDate) (this.$.packageDate as any).value = data.packageDate;
                    if (this.$.adName && data.adName) (this.$.adName as any).value = data.adName;
                    if (this.$.plannerAbbr && data.plannerAbbr) (this.$.plannerAbbr as any).value = data.plannerAbbr;
                    if (this.$.companyPrefix && data.companyPrefix) (this.$.companyPrefix as any).value = data.companyPrefix;
                    if (this.$.packageDir && data.packageDir) (this.$.packageDir as any).value = data.packageDir;
                    
                    if (data.selectedPlatforms && Array.isArray(data.selectedPlatforms)) {
                        data.selectedPlatforms.forEach((platform: PlatformEnum | string) => {
                            // 从平台值中获取实际字符串值
                            let platformStr: string;
                            if (typeof platform === 'string') {
                                // 如果是字符串，说明是从旧配置中加载的
                                platformStr = platform;
                            } else {
                                // 如果是枚举，需要转换为字符串
                                platformStr = platform;
                            }
                            
                            // 处理字符串构建属性名
                            const propName = `platform${platformStr.charAt(0).toUpperCase() + platformStr.slice(1).replace('_', 'Min')}` as keyof typeof this.$;
                            if (this.$[propName]) {
                                (this.$[propName] as any).checked = true;
                            }
                        });
                    }
                    
                    console.log('配置已加载');
                }
            } catch (e) {
                console.error('加载配置失败:', e);
            }
        },
        
        async handlePackage() {
            const gameAbbr = this.getGameAbbr();
            const packageDate = this.getPackageDate();
            const adName = this.getAdName();
            const plannerAbbr = this.getPlannerAbbr();
            const companyPrefix = this.getCompanyPrefix();
            const packageDir = this.getPackageDir();
            const selectedPlatforms = this.getSelectedPlatforms();
            
            console.log('游戏名称缩写:', gameAbbr);
            console.log('打包日期:', packageDate);
            console.log('试玩广告名称:', adName);
            console.log('甲方策划名字缩写:', plannerAbbr);
            console.log('公司前缀:', companyPrefix);
            console.log('打包目录:', packageDir);
            console.log('选择的平台:', selectedPlatforms);
            
            await this.saveData();

            const packConfig: PackConfig = {
                gameAbbr,
                packageDate,
                adName,
                plannerAbbr,
                companyPrefix,
                packageDir,
                selectedPlatforms,
            }
            
            const path = await packer.pack(packConfig);

            // 打开打包好的文件夹
            if (path) {
                const { shell } = require('electron');
                shell.showItemInFolder(path);
                console.log('已打开文件夹:', path);
            }
            
        },
    },
    ready() {
        if (this.$.packageBtn) {
            this.$.packageBtn.addEventListener('confirm', this.handlePackage.bind(this));
        }
        
        this.loadData();
    },
    beforeClose() { },
    close() { },
});





// ├─applovin
// │      MergFight_applovin.html
// │
// ├─bigo
// │      MergFight_bigo.zip
// │
// ├─common
// │      MergFight_common.html
// │
// ├─common_min
// │      MergFight_common_min.html
// │
// ├─facebook
// │      MergFight_facebook.html
// │      MergFight_facebook.zip
// │
// ├─google
// │      MergFight_google.zip
// │      MergFight_google_landscape.zip
// │      MergFight_google_portrait.zip
// │
// ├─ironsource
// │      MergFight_ironsource.html
// │
// ├─ironsource2025
// │      MergFight_ironsource2025.html
// │
// ├─kwai
// │      MergFight_kwai.zip
// │
// ├─liftoff
// │      MergFight_liftoff.zip
// │
// ├─mintegral
// │      MergFight_mintegral.zip
// │
// ├─moloco
// │      MergFight_moloco.html
// │
// ├─nefta
// │      MergFight_nefta.html
// │      MergFight_nefta.zip
// │
// ├─pangle
// │      MergFight_pangle.zip
// │      MergFight_pangle_landscape.zip
// │      MergFight_pangle_portrait.zip
// │
// ├─tiktok
// │      MergFight_tiktok.zip
// ├─unity
// │      MergFight_unity.html
// │
// └─vungle
//         MergFight_vungle.zip