import { _decorator, Component, Node, director, tween, game } from 'cc';
import { PrintComponent } from "./PrintComponent";
import PLASDK, { PLASDK_EVENT } from './PLASDK';

const { ccclass, property } = _decorator;

@ccclass('StutterCheck')
export default class StutterCheck extends Component {

    private static _instance: StutterCheck = null!;
    public static get instance(): StutterCheck {
        if (!this._instance) {
            const StutterCheckNode = new Node("StutterCheck");
            director.getScene().addChild(StutterCheckNode);
            this._instance = StutterCheckNode.addComponent(StutterCheck);
        }
        return this._instance;
    }

    private m_fps = 0.016
    protected start(): void {
        this.m_fps = parseFloat((1/Number(game.frameRate)).toFixed(3))
    }

    private m_totalDuration:number=0
    get totalDuration(){
        return this.m_totalDuration
    }

    private m_isGameStart=false
    private m_pd_duration:number=0
    // 玩家操作后上报数据
    public startReport(): void {
        this.m_isGameStart=true

        // 每10s上报一次流畅度
        this.schedule(() => {
            this.reportStutter();
        }, 10);

        this.scheduleOnce(() => {
            PLASDK.SendData(PLASDK_EVENT.CHALLENGE_PASS_25);
        }, 30);
        this.scheduleOnce(() => {
            PLASDK.SendData(PLASDK_EVENT.CHALLENGE_PASS_50);
        }, 60);
        this.scheduleOnce(() => {
            PLASDK.SendData(PLASDK_EVENT.CHALLENGE_PASS_75);
        }, 90);
    }
    // 游戏结束后停止上报
    public stopReport() {
        this.m_isGameStart=false
        this.unscheduleAllCallbacks();
    }

    private avgDT = 1 / 60;
    private pd_big_jank_count = 0;
    private pd_big_jank_time = 0;
    private pd_small_jank_count = 0;
    private pd_small_jank_time = 0;
    private frameCount = 0; // 新增帧计数
    private fpsList: number[] = []; // 新增fps数组
    private pd_fps_10_jank_count = 0

    protected update(dt: number): void {

        this.m_totalDuration+=dt

        if (!this.m_isGameStart) {
            return;
        }

        this.frameCount++; // 每帧自增
        if (dt > this.avgDT * 2 && dt > 0.125) {
            this.pd_big_jank_count++;
            this.pd_big_jank_time += (dt * 1000);
        }
        if (dt > this.avgDT * 2 && dt > 0.08333) {
            this.pd_small_jank_count++;
            this.pd_small_jank_time += (dt * 1000);
        }
        if (dt > 0) {
            const curFps = 1/dt
            this.fpsList.push(curFps) // 记录每帧fps
            if (curFps<10){
                this.pd_fps_10_jank_count++
            }
        }

        this.m_pd_duration+=dt
    }

    /**
     * 计算分位数
     */
    private getPercentile(arr: number[], percentile: number): number {
        if (arr.length === 0) return 0;
        const sorted = arr.slice().sort((a, b) => a - b);
        const idx = Math.ceil(percentile * sorted.length) - 1;
        return sorted[Math.max(0, Math.min(idx, sorted.length - 1))];
    }

    /**
     * stutter事件 流畅度
     */
    public reportStutter() {

        // 计算分位数
        const fpsList = this.fpsList;
        // 计算平均帧率
        const avgFps = fpsList.length > 0 ? (fpsList.reduce((a, b) => a + b, 0) / fpsList.length) : 0;

        let data = {
            pd_duration         : Math.ceil(this.m_pd_duration*1000),
            pd_big_jank_count   : this.pd_big_jank_count,
            pd_big_jank_time    : Number(this.pd_big_jank_time.toFixed(2)),
            pd_small_jank_count : this.pd_small_jank_count,
            pd_small_jank_time  : Number(this.pd_small_jank_time.toFixed(2)),
            pd_fps_0_1          : Math.ceil(this.getPercentile(fpsList, 0.001)),
            pd_fps_01           : Math.ceil(this.getPercentile(fpsList, 0.01)),
            pd_fps_10           : Math.ceil(this.getPercentile(fpsList, 0.10)),
            pd_fps_20           : Math.ceil(this.getPercentile(fpsList, 0.20)),
            pd_fps_30           : Math.ceil(this.getPercentile(fpsList, 0.30)),
            pd_fps_50           : Math.ceil(this.getPercentile(fpsList, 0.50)),
            pd_fps              : Math.round(avgFps),
            pd_logic_module_tag : `stage-${PrintComponent.stage}`,
            pd_fps_10_jank_count: this.pd_fps_10_jank_count,
        };

        this.m_pd_duration              = 0
        this.pd_big_jank_count          = 0;
        this.pd_big_jank_time           = 0;
        this.pd_small_jank_count        = 0;
        this.pd_small_jank_time         = 0;
        this.frameCount                 = 0; // 重置帧计数
        this.pd_fps_10_jank_count       = 0
        this.fpsList                    = []; // 重置fps数组

        PrintComponent.reportStutter(data);
    }

}