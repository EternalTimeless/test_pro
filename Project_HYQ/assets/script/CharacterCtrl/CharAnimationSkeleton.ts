// import { _decorator, AnimationClip, Component, easing, instantiate, Material, Node, resources, sp, tween, UIOpacity, v3, Vec3 } from 'cc';
// import { CharAnimationBase } from './CharAnimationBase';
// import { CommonEvent, ComponentEvent, PrefabPathEnum } from '../Common/CommonEnum';
// const { ccclass, property } = _decorator;
// /**
//  * 动画信息数据
//  */
// export interface AnimationInfo {
//     name: string;
//     duration: number;
//     isLoop: boolean;
// }
// /**
//  * 当前播放动画数据
//  */
// export interface CurrentAnimationData {
//     name: string;
//     duration: number;
//     isLoop: boolean;
//     currentTime: number;
//     timeScale: number;
//     isPlaying: boolean;
// }

// @ccclass('CharAnimationSkeleton')
// export class CharAnimationSkeleton extends CharAnimationBase {
//     @property({ type: sp.Skeleton, displayName: '骨骼动画', tooltip: '角色的Spine骨骼动画组件' })
//     protected skeleton: sp.Skeleton = null;
//     /**遮罩动画 */
//     @property({ type: sp.Skeleton, displayName: '遮罩动画', tooltip: '遮罩动画的Spine骨骼动画组件' })
//     protected maskSkeleton: sp.Skeleton = null;
//     @property({ type: sp.Skeleton, displayName: '闪白动画', tooltip: '闪白动画的Spine骨骼动画组件' })
//     protected flashSkeleton: sp.Skeleton = null;
//     /** 闪白效果淡出动画状态 */
//     private isPlayingFlashFadeOut: boolean = false;
//     private _hasModel: boolean = false;
//     // 基础动画
//     private _baseAnimationInfo: Map<string, AnimationInfo> = new Map();
//     /** 当前播放的动画数据 */
//     private currentAnimationData: CurrentAnimationData | null = null;

//     /**
//      * Track事件监听器（提取为类方法以避免重复创建函数）
//      * @param entry TrackEntry对象
//      * @param event 事件对象
//      */
//     private onTrackEvent(entry: sp.spine.TrackEntry, event: sp.spine.Event): void {
//         // 攻击帧事件
//         if (event instanceof sp.spine.Event) {
//             if (event.data.name === 'ATK' || event.data.name === "atk") {
//                 // console.error("攻击帧触发");
//                 this.node.emit(ComponentEvent.OnAttackFrame);
//             }
//         }
//     }

//     onLoad(): void {
//         this._hasModel = !!this.skeleton;
//         if (this._hasModel) {
//             //3.8.7引擎BUG:如果动画是循环播放（Loop）通过代码设置的不循环，setEndListener回调会在动画播放的第一帧触发, 如果在回调中进行逻辑处理, 会导致问题, 弃用
//             // this.skeleton.setEndListener(this.onAnimationComplete.bind(this));
//             // 每次循环结束下一帧开始之前 触发
//             this.skeleton.setCompleteListener(this.onceLoopAnimationComplete.bind(this));
//         }
//         if (this.flashSkeleton) {
//             this.flashSkeleton.node.active = false;
//         }
//         const initialScale = this.skeleton.node.getScale();
//         Vec3.copy(this.initialNodeScale, initialScale);
//         this.skeleton.color.set(255, 255, 255, 255);
//         this.setupAnimationMix();
//     }
//     public initAnimation(): void {
//         this.cacheAnimationDurations();
//     }
//     /**
//      * 缓存所有动画的原始时长
//      */
//     private cacheAnimationDurations(): void {
//         if (!this._hasModel) return;

//         const animNames = [
//             this.attackAnimName,
//             this.runAttackAnimName,
//             this.moveAnimName,
//             this.idleAnimName,
//             this.deadAnimName,
//             this.skillAnimName
//         ];

//         for (const name of animNames) {
//             const state = this.skeleton.findAnimation(name);
//             if (state) {
//                 const info: AnimationInfo = {
//                     name: name,
//                     duration: state.duration,
//                     isLoop: false // 默认不循环，播放时设置
//                 }
//                 this._baseAnimationInfo.set(name, info);
//             }
//         }
//         // try {
//         //     const skeletonData = this.skeleton.skeletonData;
//         //     // 使用 getRuntimeData 方法获取运行时数据
//         //     if (skeletonData && (skeletonData as any).getRuntimeData) {
//         //         const runtimeData = (skeletonData as any).getRuntimeData();
//         //         if (runtimeData && runtimeData.animations) {
//         //             for (let i = 0; i < runtimeData.animations.length; i++) {
//         //                 const anim = runtimeData.animations[i];
//         //                 if (anim && anim.name && !this._baseAnimationInfo.has(anim.name)) {
//         //                     const animInfo: AnimationInfo = {
//         //                         name: anim.name,
//         //                         duration: anim.duration,
//         //                         isLoop: false
//         //                     };
//         //                     this._baseAnimationInfo.set(anim.name, animInfo);
//         //                     // console.log(`加载额外动画信息: ${anim.name}, 时长: ${anim.duration}秒`);
//         //                 }
//         //             }
//         //         }
//         //     }
//         // } catch (error) {
//         //     console.warn('无法获取额外动画信息:', error);
//         // }
//     }
//     /**
//      * 设置动画混合
//      */
//     private setupAnimationMix() {
//         if (!this.skeleton) return;

//         if (this.node.name == "Player") {
//             // 混合动画
//             this.skeleton.setMix(this.idleAnimName, this.moveAnimName, 0.2);
//             this.skeleton.setMix(this.idleAnimName, this.attackAnimName, 0.2);
//             this.skeleton.setMix(this.moveAnimName, this.idleAnimName, 0.2);
//             this.skeleton.setMix(this.moveAnimName, this.runAttackAnimName, 0.2);

//             this.skeleton.setMix(this.attackAnimName, this.idleAnimName, 0.2);
//             this.skeleton.setMix(this.runAttackAnimName, this.moveAnimName, 0.2);
//             this.skeleton.setMix(this.runAttackAnimName, this.idleAnimName, 0.2);
//         }

//     }
//     /**
//      * 获取动画信息
//      * @param animName 动画名称
//      */
//     getAnimationInfo(animName: string): AnimationInfo | null {
//         return this._baseAnimationInfo.get(animName) || null;
//     }
//     /**
//      * 更新函数，用于追踪动画时间
//      */
//     update(dt: number) {
//         // 调用父类的update
//         // super.update(dt);
//         // 更新动画时间
//     }
//     public calculateTimeScale(targetDuration: number, animName: string): number {
//         const baseDuration = this.getAnimationInfo(animName)
//         if (!baseDuration || baseDuration.duration <= 0 || targetDuration <= 0) return 1;

//         // 保留一位小数，采用Math.floor策略
//         const rawTimeScale = baseDuration.duration / targetDuration;
//         return Math.floor(rawTimeScale * 10) / 10;
//     }
//     /**设置当前播放动画速度 */
//     public setCurrentAnimationTimeScale(timeScale: number): void {
//         if (!this.currentAnimationData) return;
//         const track = this.skeleton.getCurrent(0);
//         track.timeScale = timeScale
//         this.currentAnimationData.timeScale = timeScale;
//     }
//     //若为骨骼动画则与播放速度叠加 例如this.skeleton.getCurrent(0).timeScale
//     public setTimeScale(timeScale: number): void {
//         if (!this.skeleton) return;
//         this.skeleton.timeScale = timeScale;
//     }
//     public resetTimeScale() {
//         if (!this.skeleton) return;
//         this.skeleton.timeScale = this.defaultTimeScale;
//     }
//     /**
//      * 播放动画（支持空模型）
//      */
//     public playAnimation(name: string, loop: boolean, timeScale: number = 1, fadeDuration: number = 0.1, isShowLight: boolean = false): void {
//         if (!this.skeleton) return;

//         const state = this.skeleton.findAnimation(name);
//         if (!state) {
//             console.error(`Animation ${name} not found for character`);
//             return;
//         }
//         // 检查是否已经在播放相同动画
//         if (this.currentAnimationData && this.currentAnimationData.name === name && this.currentAnimationData.isPlaying) {
//             return;
//         }

//         let nextTrack = this.skeleton.setAnimation(0, name, loop);
//         nextTrack.timeScale = timeScale;
//         if (this.maskSkeleton) {
//             let maskTrack = this.maskSkeleton.setAnimation(0, name, loop);
//             maskTrack.timeScale = timeScale;
//         }
//         const animInfo = this.getAnimationInfo(name);
//         const duration = animInfo ? animInfo.duration : nextTrack.animationEnd;

//         // 注册Track事件监听器
//         // 说明：每次setAnimation会返回新的TrackEntry对象，需要为新的Track重新注册监听
//         // setTrackEventListener会覆盖同一TrackEntry上之前的监听器
//         // 旧TrackEntry会被Spine Runtime自动清理，无需手动清除监听器
//         this.skeleton.setTrackEventListener(nextTrack, this.onTrackEvent.bind(this));
//         // 更新当前动画数据
//         this.currentAnimationData = {
//             name,
//             duration: duration,
//             isLoop: loop,
//             currentTime: 0,
//             timeScale: timeScale,
//             isPlaying: true
//         };

//         if (isShowLight && this.flashSkeleton) {
//             const flashMaterial = this.flashSkeleton.customMaterial;
//             if (flashMaterial) {
//                 flashMaterial.setProperty('whiteAmount', 0.8);
//                 this.flashSkeleton.setAnimation(0, name, loop);
//                 this.flashSkeleton.node.active = true;
//                 this.flashSkeleton.timeScale = timeScale;

//                 this.flashSkeleton.node.setScale(this.skeleton.node.scale);
//                 const targetScale = this.skeleton.node.getScale().multiplyScalar(1.5);
//                 tween(this.flashSkeleton.node)
//                     .to(1.2, { scale: targetScale })
//                     .start();

//                 const opacity = this.flashSkeleton.getComponent(UIOpacity);
//                 if (opacity) {
//                     opacity.opacity = 0;
//                     tween(opacity)
//                         .to(0.4, { opacity: 255 })
//                         .start();
//                 } else {
//                     console.warn('闪白动画UIOpacity组件未找到，请检查flashSkeleton的节点配置');
//                 }
//             } else {
//                 console.warn('闪白动画材质未设置，请检查flashSkeleton的材质配置');
//             }
//         }
//     }

//     /**
//      * 获取当前骨骼动画
//      */
//     public getSkeletonComponent(): sp.Skeleton {
//         return this.skeleton;
//     }
//     /**
//      * 获取当前动画名称
//      */
//     public getCurrentAnimationName(): string {
//         return this.currentAnimationData?.name || '';
//     }

//     /**
//      * 获取动画进度
//      */
//     public getCurAnimationProgress(): number {
//         let currentTrack = this.skeleton.getCurrent(0);
//         if (currentTrack) {
//             return Math.min(1, currentTrack.trackTime / currentTrack.animationEnd);
//         }
//         // if (!this.currentAnimationData || !this.currentAnimationData.isPlaying) {
//         //     return 0;
//         // }

//         // if (this.currentAnimationData.duration <= 0) {
//         //     return 0;
//         // }

//         // // 修正：currentTime已经是考虑了timeScale的时间
//         // // 所以直接用 currentTime / duration 即可得到正确的进度
//         // return Math.min(1, this.currentAnimationData.currentTime / this.currentAnimationData.duration);
//     }

//     /**
//      * 获取指定动画的持续时间, 如果animName为空, 则获取当前动画时长
//      * 
//      * 注意: 获取的是原始时长, 若动画有放缩倍率需要自行计算
//      * @param animName 动画名称，为空时获取当前动画时长
//      * @returns 动画持续时间（秒）
//      */
//     public getAnimationDuration(animName: string): number {
//         if (!this.skeleton) return 0;
//         let duration = 0;
//         if (animName) {
//             const animInfo = this.getAnimationInfo(animName);
//             if (animInfo) {
//                 duration = animInfo.duration;
//             } else {
//                 const state = this.skeleton.findAnimation(animName);
//                 duration = state ? state.duration : 0;
//             }
//         } else {
//             // 获取当前动画时长
//             if (this.currentAnimationData) {
//                 duration = this.currentAnimationData.duration;
//             } else if (this.skeleton) {
//                 // 回退到通过skeleton获取
//                 const currentTrack = this.skeleton.getCurrent(0);
//                 duration = currentTrack ? currentTrack.animationEnd : 0;
//             }
//         }
//         return duration;
//     }
//     /**
//      * 停止所有动画
//      */
//     public stopAllAnimations(): void {
//         this.pauseAnimation();
//     }
//     /**
//      * 暂停当前动画
//      */
//     public pauseAnimation(): void {
//         if (!this.skeleton) return;
//         // console.error("暂停动画", this.currentAnimationData?.name || "");
//         if (this.currentAnimationData) {
//             this.currentAnimationData.isPlaying = false;
//         }
//         this.skeleton.paused = true;
//     }

//     /**
//      * 恢复当前动画
//      */
//     public resumeAnimation(): void {
//         if (!this.skeleton) return;
//         if (this.currentAnimationData) {
//             this.currentAnimationData.isPlaying = true;
//         }
//         this.skeleton.paused = false;
//     }
//     public getAnimationNode(): Node | null {
//         return this.skeleton ? this.skeleton.node : null;
//     }
//     /**
//      * 动画完成回调
//      */
//     private onAnimationComplete(): void {
//         // 如果闪白效果开启，在动画完成时关闭
//         if (this.flashSkeleton && this.flashSkeleton.node.active) {
//             if (!this.isPlayingFlashFadeOut) {
//                 this.resetFlashEffect();
//             }
//         }
//         // 触发动画完成事件
//         this.node.emit(ComponentEvent.OnAnimationComplete, this.currentAnimationData?.name || "");
//     }
//     /**循环动画播完一次回调 */
//     private onceLoopAnimationComplete(): void {
//         // 如果闪白效果开启，在动画完成时关闭
//         if (this.flashSkeleton && this.flashSkeleton.node.active) {
//             if (!this.isPlayingFlashFadeOut) {
//                 this.resetFlashEffect();
//             }
//         }
//         // 触发循环动画单次播放完成事件（用于攻击动画等循环动画的逻辑处理）
//         this.node.emit(ComponentEvent.OnLoopAnimationComplete, this.currentAnimationData?.name || "");
//     }
//     /**
//      * 获取所有已加载的动画名称
//      * @returns 动画名称数组
//      */
//     public getAllAnimationNames(): string[] {
//         return Array.from(this._baseAnimationInfo.keys());
//     }
//     /**
//      * 显示受伤效果
//      */
//     public showDamageEffect(): void {
//         // TODO: 由子类实现具体的受伤效果
//     }

//     /**
//      * 显示治疗效果
//      */
//     public showHealEffect(): void {
//         // TODO: 由子类实现具体的治疗效果
//     }

//     /**
//      * 显示免疫效果
//      */
//     public showImmuneEffect(): void {
//         // TODO: 由子类实现具体的免疫效果
//     }

//     protected showSlowEffect(): void {
//         // TODO: 实现减速效果
//     }

//     protected resetAllColorEffects(): void {
//         // TODO: 重置所有颜色效果
//     }
//     /**手动切换移动动画名字, 切换时会自动播放动画 */
//     public changeMoveAnimName(animName: string) {
//         this.moveAnimName = animName;
//         this.playMove();
//     }
//     /**只设置移动动画名字，不立即播放（用于在其他状态下预设动画） */
//     public setMoveAnimName(animName: string) {
//         this.moveAnimName = animName;
//     }
//     /**移动动画 */
//     public playMove(timeScale: number = 1) {
//         this.playAnimation(this.moveAnimName, true, timeScale)
//     }
//     /**空闲动画 */
//     public playIdle(timeScale: number = 1) {
//         this.playAnimation(this.idleAnimName, true, timeScale)
//     }
//     /**死亡动画 */
//     public playDead(timeScale: number = 1) {
//         this.playAnimation(this.deadAnimName, false, timeScale)
//     }
//     /**攻击动画 */
//     public playAttack(timeScale: number) {
//         this.playAnimation(this.attackAnimName, true, timeScale)
//     }
//     /**移动攻击动画 */
//     public playRunAttack(timeScale: number) {
//         this.playAnimation(this.runAttackAnimName, true, timeScale)
//     }
//     /**
//      * 重置闪白效果
//      */
//     private resetFlashEffect() {
//         if (this.flashSkeleton) {
//             // 设置淡出动画状态为true
//             this.isPlayingFlashFadeOut = true;

//             // 获取当前缩放值
//             const currentScale = this.flashSkeleton.node.getScale();
//             // 缩小动画
//             tween(this.flashSkeleton.node)
//                 .to(0.15, { scale: currentScale.multiplyScalar(0.5) })
//                 .call(() => {
//                     // 动画结束后关闭节点
//                     this.flashSkeleton.node.active = false;
//                     // 重置缩放，为下次显示做准备
//                     this.flashSkeleton.node.setScale(this.skeleton.node.getScale().multiplyScalar(2));
//                     // 重置淡出动画状态
//                     this.isPlayingFlashFadeOut = false;
//                 })
//                 .start();

//             // 如果有透明度组件，添加淡出效果
//             const opacity = this.flashSkeleton.getComponent(UIOpacity);
//             if (opacity) {
//                 tween(opacity)
//                     .to(0.15, { opacity: 0 })
//                     .start();
//             }
//         }
//     }
// }


