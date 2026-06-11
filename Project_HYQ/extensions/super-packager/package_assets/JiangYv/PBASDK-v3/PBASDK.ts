// 引用
import super_html_playable from "./super_html_playable";

import {PrintComponent, PlayerAction} from "./PrintComponent";
import StutterCheck from "./StutterCheck";
import PLASDK, { PLASDK_EVENT } from "./PLASDK";

export default class PBASDK {
    // SDK 版本号（只读）
    public static readonly _Version: string = "1.0.0";

    /** 游戏加载后调用 */
    public static Init(material:string, maxStage:number): void {
        // 获取谷歌链接和苹果链接（打包工具中设置会自动同步到这里）
        const google_play = "https://play.google.com/store/apps/details?id=com.funfizz.palmon.gp";
        // 获取苹果链接（打包工具中设置会自动同步到这里）
        const appstore = "https://apps.apple.com/app/palmon-survival/id6739345737";

        super_html_playable.set_google_play_url(google_play);
        super_html_playable.set_app_store_url(appstore);

        PLASDK.SendData(PLASDK_EVENT.LOADING); // TODO 目前TH没有合适的loading界面
        PrintComponent.init(material, maxStage);
        PrintComponent.loading()
        PLASDK.SendData(PLASDK_EVENT.LOADED);
        PLASDK.SendData(PLASDK_EVENT.DISPLAYED);
    }

    /** 📌 SDK 的 `ClickDownloadBar` 方法 */
    public static ClickDownloadBar(): void {
        PrintComponent.actionbar(PlayerAction.download);
        super_html_playable.download();
        PLASDK.SendData(PLASDK_EVENT.CTA_CLICKED);
    }

    /** 📌 SDK 的 自动跳转方法 */
    public static AuToJumpDownload(){
        PrintComponent.actionbar(PlayerAction.automatic_jump);
        super_html_playable.download();
        PLASDK.SendData(PLASDK_EVENT.ENDCARD_SHOWN);
    }

    /** 📌 模拟游戏结束 */
    public static GameEnd(isWin:boolean): void {
        StutterCheck.instance.stopReport()
        PrintComponent.endGame(isWin);
        StutterCheck.instance.reportStutter()
        super_html_playable.game_end();
        if(isWin){
            PLASDK.SendData(PLASDK_EVENT.CHALLENGE_SOLVED);
        }else{
            PLASDK.SendData(PLASDK_EVENT.CHALLENGE_FAILED);
        }
        PLASDK.SendData(PLASDK_EVENT.COMPLETED);
    }

    /** 📌 模拟进入游戏章节 */
    public static EnterSection(section: number): void {
        PrintComponent.stage = section
        PrintComponent.endGame(true);
    }

    /** ---- touch begin ---- */
    static TouchStart() {
        PrintComponent.game_interaction("touch-start")
    }

    static TouchEnd() {
        PrintComponent.game_interaction("touch-end")
    }
    /** ---- touch begin ---- */

    /** 首次点击屏幕调用 */
    static GameStart(){
        PrintComponent.startGame()
        // 上报流畅度
        StutterCheck.instance.startReport()
        PLASDK.SendData(PLASDK_EVENT.CHALLENGE_STARTED);
    }

    static Replay(){
        PrintComponent.replay()
        PLASDK.SendData(PLASDK_EVENT.CHALLENGE_RETRY);
    }

}

