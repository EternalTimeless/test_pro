// import { _decorator, CCFloat, Color, Component, Node, sp, Sprite, tween } from 'cc';
// const { ccclass, property } = _decorator;

// @ccclass('DamageEffect2DComp')
// export class DamageEffect2DComp extends Component {

//     @property({ type: CCFloat, displayName: "闪烁持续时间" })
//     flashDuration: number = 0.5;

//     @property({ type: Node, displayName: "闪烁的节点" })
//     protected flashNode: Node = null;
//     @property({ type: sp.Skeleton, displayName: '闪烁的骨骼' })
//     protected flashSkeleton: sp.Skeleton | null = null;
//     flashColor: Color = new Color(255, 0, 0, 255);

//     // 状态
//     public isFlashing: boolean = false;
//     private flashTimeLeft: number = 0;
//     private originalSpriteColor: Color = new Color();
//     private originalSkColor: Color = new Color();
//     private flashSprite: Sprite = null;

//     onLoad() {
//         if (this.flashNode) {
//             // 获取Sprite组件
//             this.flashSprite = this.flashNode.getComponent(Sprite);
//             // 保存原始颜色
//             if (this.flashSprite) {
//                 this.originalSpriteColor = this.flashSprite.color.clone();
//             }
//         }
//         if (this.flashSkeleton) {
//             this.originalSkColor = this.flashSkeleton.color.clone();
//         }
//     }

//     onDestroy() {
//     }
//     initialize() {
//         if (this.flashSprite) {
//             this.flashSprite.color = this.originalSpriteColor
//         }
//         if (this.flashSkeleton) {
//             this.flashSkeleton.color.set(this.originalSkColor)
//         }
//         this.isFlashing = false;
//     }
//     update(deltaTime: number) {
//         // 更新免疫状态
//         if (this.isFlashing) {
//             this.flashTimeLeft -= deltaTime;
//             if (this.flashTimeLeft <= 0) {
//                 this.isFlashing = false;
//             }
//         }
//     }

//     // 当受到伤害时调用
//     public onDamaged() {
//         if (!this.isFlashing) {
//             this.showDamageEffect();
//             this.startFlash();
//         }
//     }

//     // 显示伤害效果
//     public showDamageEffect() {
//         if (this.flashSprite) {
//             // 停止之前的tween
//             tween(this.flashSprite).stop();

//             // 闪烁效果
//             tween(this.flashSprite)
//                 .to(this.flashDuration / 2, { color: this.flashColor })
//                 .to(this.flashDuration / 2, { color: this.originalSpriteColor })
//                 .start();
//         }
//         if (this.flashSkeleton) {
//             // 停止之前的tween
//             tween(this.flashSkeleton).stop();

//             // 闪烁效果
//             tween(this.flashSkeleton)
//                 .to(this.flashDuration / 2, { color: this.flashColor })
//                 .to(this.flashDuration / 2, { color: this.originalSkColor })
//                 .start();
//         }
//     }

//     // 启动闪红效果
//     public startFlash() {
//         this.isFlashing = true;
//         this.flashTimeLeft = this.flashDuration;
//     }
// }


