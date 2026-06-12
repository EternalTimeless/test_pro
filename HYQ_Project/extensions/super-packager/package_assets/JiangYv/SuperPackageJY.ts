import { sys } from "cc";
import PBASDK from "./PBASDK-v3/PBASDK";

// 扩展Window接口
declare global {
    interface Window {
        isTCE?: boolean;
        materialName?: string;
    }
}

export class SuperPackageJY {
    private static instance: SuperPackageJY;

    // 私有构造函数，防止外部实例化
    private constructor() {}

    // 获取单例实例
    public static get Instance(): SuperPackageJY {
        if (!SuperPackageJY.instance) {
            SuperPackageJY.instance = new SuperPackageJY();
        }
        return SuperPackageJY.instance;
    }

    get materialName(): string {
        return window.materialName || '无（会在使用SuperPackage打包后自动注入）';
    }

    /**
     * 下载
     */
    public Download() {
        PBASDK.ClickDownloadBar();

        // 获取当前平台直接跳转网页以防止甲方说为什么不跳😆
        if(sys.isBrowser){
            if(sys.os === sys.OS.IOS) {
                //@ts-ignore
                window.super_html && sys.openURL(super_html.appstore_url);
            }else{
                //@ts-ignore
                window.super_html && sys.openURL(super_html.google_play_url);
            }
        }
    }

    /**
     * 自动跳转下载
     */
    public AutoDownload() {
        if(!window.isTCE) {
            console.log('不跳转，因为不是自动跳转版本');
            return;
        };
        PBASDK.AuToJumpDownload();

        // 获取当前平台直接跳转网页以防止甲方说为什么不跳😆
        if(sys.isBrowser){
            if(sys.os === sys.OS.IOS) {
                //@ts-ignore
                window.super_html && sys.openURL(super_html.appstore_url);
            }else{
                //@ts-ignore
                window.super_html && sys.openURL(super_html.google_play_url);
            }
        }
    }

    /**
     * 强制跳转下载（打包工具会自动判断是不是TCE版本选择跳不跳转）
     */
    public DownloadTCE() {
        if(!window.isTCE) {
            console.log('不跳转，因为不是TCE版本或者未注入window.isTCE变量');
            return;
        };
        PBASDK.AuToJumpDownload();

        // 获取当前平台直接跳转网页以防止甲方说为什么不跳😆
        if(sys.isBrowser){
            if(sys.os === sys.OS.IOS) {
                //@ts-ignore
                window.super_html && sys.openURL(super_html.appstore_url);
            }else{
                //@ts-ignore
                window.super_html && sys.openURL(super_html.google_play_url);
            }
        }
    }
}
