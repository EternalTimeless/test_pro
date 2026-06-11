// import { _decorator, Component, CCFloat, CCInteger, Vec3, v3 } from 'cc';
// const { ccclass, property } = _decorator;

// /**
//  * 世界坐标轨迹环缓冲（环形采样 Ring Buffer）
//  * 供贪吃蛇式跟随读取滞后采样点；由 FollowChainManager 统一驱动 sample(dt)。
//  */
// @ccclass('TrailRecorder')
// export class TrailRecorder extends Component {
//     @property({ type: CCFloat, displayName: '采样间隔(秒)', tooltip: '每隔多久写入一个世界坐标采样点' })
//     sampleInterval = 1 / 20;

//     @property({ type: CCInteger, displayName: '缓冲容量', tooltip: '最多保留的采样点数量' })
//     bufferCapacity = 400;

//     private _interval = 1 / 20;
//     private _capacity = 400;
//     private _buffer: Vec3[] = [];
//     private _writeIndex = 0;
//     /** 已写入过的采样总数（用于判断是否攒够滞后） */
//     private _totalPushed = 0;
//     private _accum = 0;
//     private _paused = false;

//     private readonly _scratch = v3();

//     onLoad(): void {
//         this.applyConfig();
//     }

//     /** 与 FollowChainManager.bindChain 传入参数对齐 */
//     configure(sampleIntervalSec: number, capacity: number): void {
//         this.sampleInterval = sampleIntervalSec;
//         this.bufferCapacity = capacity;
//         this.applyConfig();
//         this.clear();
//     }

//     private applyConfig(): void {
//         this._interval = Math.max(1e-4, this.sampleInterval);
//         this._capacity = Math.max(8, Math.floor(this.bufferCapacity));
//         if (this._buffer.length !== this._capacity) {
//             this._buffer = [];
//             for (let i = 0; i < this._capacity; i++) {
//                 this._buffer.push(v3());
//             }
//         }
//     }

//     setPaused(p: boolean): void {
//         this._paused = p;
//     }

//     clear(): void {
//         this._writeIndex = 0;
//         this._totalPushed = 0;
//         this._accum = 0;
//     }

//     /** 管理器每帧调用：按间隔写入当前节点世界坐标 */
//     sample(dt: number): void {
//         if (!this.enabled || this._paused || !this.node?.isValid) {
//             return;
//         }
//         this._accum += dt;
//         while (this._accum >= this._interval) {
//             this._accum -= this._interval;
//             this.pushCurrentWorldPosition();
//         }
//     }

//     private pushCurrentWorldPosition(): void {
//         const wp = this.node.worldPosition;
//         const slot = this._buffer[this._writeIndex];
//         slot.set(wp.x, wp.y, wp.z);
//         this._writeIndex = (this._writeIndex + 1) % this._capacity;
//         this._totalPushed++;
//     }

//     /**
//      * 读取滞后采样点：stepsBack=0 为最近一次写入，stepsBack=1 为上一次，以此类推
//      * @returns 是否读到有效数据（缓冲尚未填满时对过大 stepsBack 仍返回最早可读点）
//      */
//     getDelayedWorldPosition(stepsBack: number, out: Vec3): boolean {
//         if (this._totalPushed === 0 || this._buffer.length === 0) {
//             return false;
//         }
//         const maxBack = Math.min(stepsBack, this._totalPushed - 1);
//         const newestIdx = this._totalPushed <= this._capacity ? this._writeIndex - 1 : (this._writeIndex - 1 + this._capacity) % this._capacity;
//         const idx = (newestIdx - maxBack + this._capacity * 2) % this._capacity;
//         const src = this._buffer[idx];
//         out.set(src.x, src.y, src.z);
//         return true;
//     }
// }
