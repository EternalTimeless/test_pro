import { sys } from "cc";
import super_html_playable from "./super_html_playable";

// 扩展Window接口
declare global {
    interface Window {
        isTCE?: boolean;
        materialName?: string;
        isKR?: boolean;
    }
}

export class SuperPackage {
    private static _instance: SuperPackage;
    /**
     * 谷歌链接（打包工具中设置会自动同步到这里）
     */
    private _google_play_url: string = "https://play.google.com/store/apps/details?id=com.greenmushroom.boomblitz.gp&hl=en_US";
    /**
     * 苹果链接（打包工具中设置会自动同步到这里）
     */
    private _appstore_url: string = "https://apps.apple.com/us/app/top-heroes/id6450953550";

    // 私有构造函数，防止外部实例化
    private constructor() {
        super_html_playable.set_google_play_url(this._google_play_url);
        super_html_playable.set_app_store_url(this._appstore_url);
    }

    // 获取单例实例
    public static get Instance(): SuperPackage {
        if (!SuperPackage._instance) {
            SuperPackage._instance = new SuperPackage();
        }
        return SuperPackage._instance;
    }

    get materialName(): string {
        return window.materialName || '无（会在使用SuperPackage打包后自动注入）';
    }

    /**
     * 是否为KR版本(只有在SSD有用)
     */
    get isKR(): boolean {
        return window.isKR || false;
    }

    /**
     * 下载
     */
    public Download() {
        super_html_playable.download();

        // 如果是浏览器直接跳转网页以防止甲方说为什么不跳😆
        this._openurl();
    }

    /**
     * 自动跳转下载
     */
    public AutoDownload() {
        if(!window.isTCE) {
            console.log('不跳转，因为不是TCE版本或者未注入window.isTCE变量');
            return;
        };
        super_html_playable.download();

        // 如果是浏览器直接跳转网页以防止甲方说为什么不跳😆
        this._openurl();
    }

    /**
     * 强制跳转下载（打包工具会自动判断是不是TCE版本选择跳不跳转）
     */
    public DownloadTCE() {
        if(!window.isTCE) {
            console.log('不跳转，因为不是TCE版本或者未注入window.isTCE变量');
            return;
        };
        super_html_playable.download();

        // 如果是浏览器直接跳转网页以防止甲方说为什么不跳😆
        this._openurl();
    }

    private _openurl(){
        // return;
        if(sys.isBrowser){
            if(sys.os === sys.OS.IOS) {
                sys.openURL(this._appstore_url);
            }else{
                sys.openURL(this._google_play_url);
            }
        }
    }
}

SuperPackage.Instance
