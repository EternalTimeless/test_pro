import StutterCheck from "./StutterCheck";

interface IVec3 {
    x?: number, y?: number, z?: number,
}
export enum PlayerAction {
    next = 'next',                              //点击next跳转商店
    again = 'again',                            //点击again跳转商店
    download = 'download',                      //点击download跳转商店
    automatic_jump = 'automatic_jump',          //自动跳转商店
}

export enum EventName {
    loading = 'loading',                        //loading结束时上报
    game_start = 'game_start',                  //点击开始游戏、拖动人物开始游戏、进入试玩立即开始游戏、点击again且再次游戏时上报
    game_end = 'game_end',                      //每次游戏结束，上报游戏结果
    actionbar = 'actionbar',                    //因为点击按钮、自动跳转等行为导致页面跳转到商店时上报
    interrupt = 'interrupt',                    //因为点击跳转、弹窗跳转、页面切换、页面关闭等行为导致的页面关闭和不可见时，上报
    game_touch = 'game_touch',                  //游戏存在操作角色行为时上报，
    stutter = "stutter",                        //流畅度
    heartbeat = "heartbeat",                    //一秒内是否有操作行为
}

export class PrintComponent {
    //媒体渠道
    private static media = "moloco"

    //素材名称和版本
    private static material = "";

    private static appid = "TH"

    private static userId: string;

    private static uuid: string;

    //游戏开始时间戳
    private static lastGameStartTime: number;

    //累计游戏次数
    private static totalGamesPlayed: number;

    private static isPlaying: boolean;

    private static hasVoice_on = false;

    private static m_stage = 0;
    static get stage(){
        return this.m_stage
    }
    static set stage(_){
        this.m_stage=_
    }

    private static maxStage;

    private static m_duration:number=0

    public static init(material:string, maxStage = 1) {
        //初始化
        this.material = material;
        this.lastGameStartTime = 0;
        this.totalGamesPlayed = 1;
        this.isPlaying = false;
        this.userId = this.getUserId();
        this.uuid = 'uuid_' + Math.random().toString(36).substr(2, 9)

        this.maxStage = maxStage;
    }

    private static getUserId() {
        let canvas = window.document.getElementById('GameCanvas') as HTMLCanvasElement;

        return this.hashString(canvas.toDataURL('image/png')).toString();
    }

    private static hashString(str) {
        let hash = 0;
        for (let char of str) {
            hash = (hash << 5) - hash + char.charCodeAt(0);
        }
        return hash;
    }

    private static getCurrentDuration() {
        return parseInt((StutterCheck.instance.totalDuration*1000).toFixed(0))
    }

    /**
     * 上报事件
     */
    private static reportEvent(eventType: EventName, additionalParams = {}) {
        let params: any = {
            'material': this.material,
            'media': this.media,
            'appid': this.appid,
            'user_id': this.userId,
            'uuid': this.uuid,
            ...additionalParams,
            //  'debug_mode': true
        };
        if (!params.duration) {
            params.duration = this.getCurrentDuration();
            if (params.duration == 0){
                params.duration = 1
            }
        }


        // ga打点只打流畅度
        if (eventType == EventName.stutter){
            window["gtag"] && window["gtag"]('event', eventType, params);
        }
        window["pba_send_msg"] && window["pba_send_msg"](eventType, params)
        console.log("report_log", eventType, params)
    }

    /**
     * loading结束调用
     */
    public static loading() {
        this.reportCUid()
        this.reportEvent(EventName.loading);
        StutterCheck.instance
    }

    public static reportCUid(){
        let cuid = Array.from({ length: 10 }, () => Math.floor(Math.random() * 10)).join('')
        window["pba_init_cuid"] && window["pba_init_cuid"](cuid)
        console.log("report_log cuid:", cuid)
    }

    /**
     * 游戏开始时调用
     */
    private static m_gameStartTime:number = 0
    public static startGame() {
        if (!this.isPlaying) {
            // 随机生成一个玩家的cuid并发送 随机生成一个10位数
            this.isPlaying = true;
            this.lastGameStartTime = Date.now();
            let m_stage: any = ++this.m_stage;
            if (m_stage == this.maxStage || this.maxStage==1) { // game_start和game_end：只有一关就上报final，而不是1
                m_stage = 'final'
            }
            this.reportEvent(EventName.game_start, { "stage":m_stage, 'total_games_played': this.totalGamesPlayed });
            this.m_gameStartTime = this.getCurrentDuration()
        }
    }
    

    /**
     * 点击重新开始时调用
     */
    public static replay() {
        this.m_stage = 0;
        ++this.totalGamesPlayed;
    }

    /**
     * 操作主角时调用
     * @param type type = "touch-start" | "touch-end"
     * @param pos 主角位置
     */
    public static game_interaction(type: "touch-start"|"touch-end") {
        this.reportEvent(EventName.game_touch, {
            type:type,
        });
    }

    /**
     * 游戏结束时调用
     */
    public static endGame(isWin:boolean) {
        if (this.isPlaying) {
            this.isPlaying = false;
            let m_stage: any = this.m_stage;
            if (m_stage == this.maxStage || this.maxStage==1) { // game_start和game_end：只有一关就上报final，而不是1
                m_stage = 'final'
            }
            this.reportEvent(EventName.game_end, {
                stage:m_stage,
                total_games_played: this.totalGamesPlayed,
                value: isWin ? 'win' : 'lose',
                game_duration: this.getCurrentDuration() - this.m_gameStartTime
            });
        }
    }

    /**
     * 跳转到商店调用
     */
    public static actionbar(action: PlayerAction) {
        this.reportEvent(EventName.actionbar, { value: action });
    }

    public static reportStutter(data){
        this.reportEvent(EventName.stutter, data)
    }

    /** 心跳上报 */
    public static reportKeepAlive(isact: boolean) {
        this.reportEvent(EventName.heartbeat, { isact: isact });
    }
}
