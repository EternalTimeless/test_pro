import { _decorator, CCFloat, Component, easing, Node, ParticleSystem, Tween, tween, v3, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('BlockCtrl')
export class BlockCtrl extends Component {
    @property({ type: CCFloat, displayName: '浮动高度' })
    jumpHeight: number = 0.5;
    @property({ type: CCFloat, displayName: '上升时间' })
    riseDuration: number = 0.2;
    @property({ type: CCFloat, displayName: '下降时间' })
    fallDuration: number = 0.2;
    @property({ type: CCFloat, displayName: '延迟因子' })
    delayFactor = 0.3;
    @property(Node)
    floatBlockRoot: Node = null;
    @property(Node)
    waveEffect: Node = null;
    @property(Node)
    waterEffect: Node = null;
    private effectParticle: ParticleSystem[] = [];
    private distances: number[] = [];
    private blocksGroup: { [dist: number]: Node[] } = {};
    private minNonZeroDist = 1; // 最小非零曼哈顿距离
    protected onLoad(): void {
        this.calculateMaxDistance();
        this.initEffectParticle();
    }
    protected onDisable(): void {
        this.resetAnimation();
    }
    initEffectParticle() {
        const processNode = (node: Node) => {
            for (let i = 0; i < node.children.length; i++) {
                const child = node.children[i];
                const particle = child.getComponent(ParticleSystem);
                if (particle) {
                    this.effectParticle.push(particle);
                }
                if (child.children.length > 0) {
                    processNode(child);
                }
            }
        };
        processNode(this.waveEffect);
        processNode(this.waterEffect);
        this.waveEffect.setScale(v3(0.2, 0.2, 0.2));
        this.waterEffect.setScale(v3(0.5, 0.5, 0.5));
    }
    /** 获取不同层的地块数组 */
    calculateMaxDistance() {
        // 获取所有地块节点
        const blocks = this.floatBlockRoot.children;
        // 计算最小曼哈顿距离 
        this.minNonZeroDist = Infinity;
        blocks.forEach(block => {
            const pos = block.position;
            const dist = Math.abs(pos.x) + Math.abs(pos.z);
            if (dist > 0 && dist < this.minNonZeroDist) {
                this.minNonZeroDist = dist;
            }
        });
        if (this.minNonZeroDist === Infinity) this.minNonZeroDist = 1;
        // 按网格距离分组
        for (let block of blocks) {
            const dist = Math.abs(block.position.x) + Math.abs(block.position.z);
            const gridDist = Math.round(dist / this.minNonZeroDist);
            if (!this.blocksGroup[gridDist]) {
                this.blocksGroup[gridDist] = [];
            }
            this.blocksGroup[gridDist].push(block);
        }
        // 储存距离顺序数组
        this.distances = Object.keys(this.blocksGroup).map(Number).sort((a, b) => a - b);
    }
    // 播放波浪抖动效果
    public playWaveEffect(worldPos: Vec3, cb: () => void, cb2: () => void) {
        this.node.setWorldPosition(worldPos);
        let len = 0;
        this.node.active = true;
        //按距离顺序播放动画
        for (let dist of this.distances) {
            len++;
            for (let block of this.blocksGroup[dist]) {
                this.animateBlock(block, dist * this.delayFactor);
            }
        }
        let time = len * this.delayFactor + this.riseDuration + this.fallDuration;
        for (let particle of this.effectParticle) {
            particle.play();
        }
        this.scheduleOnce(() => {
            cb && cb();
        }, time * 0.5);
        tween(this.waveEffect)
            .to(time, { scale: v3(1.5, 1.5, 1.5) }, { easing: easing.quadOut })
            .call(() => {
                this.node.active = false;
                this.resetAnimation();
                cb2 && cb2();
            })
            .start();
        tween(this.waterEffect)
            .to(time, { scale: v3(3.5, 3.5, 3.5) }, { easing: easing.quadOut })
            .start();
        // this.scheduleOnce(() => {
        // }, time);
    }
    // 执行单个地块动画
    private animateBlock(block: Node, delay: number) {
        const originalPos = block.position.clone();
        originalPos.y = 0;
        tween(block)
            .delay(delay) // 按距离延迟
            .to(this.riseDuration, { position: v3(originalPos.x, originalPos.y + this.jumpHeight, originalPos.z) }, { easing: easing.quadOut }) // 快速上升
            .to(this.fallDuration, { position: originalPos }, { easing: easing.quadIn }) // 下降
            .start();
    }
    resetAnimation() {
        for (let dist of this.distances) {
            for (let block of this.blocksGroup[dist]) {
                Tween.stopAllByTarget(block);
                const originalPos = block.position.clone();
                originalPos.y = -0.05;
                block.setPosition(originalPos);
            }
        }
        Tween.stopAllByTarget(this.waveEffect);
        Tween.stopAllByTarget(this.waterEffect);
        for (let particle of this.effectParticle) {
            particle.stop();
        }
        this.waveEffect.setScale(v3(0.2, 0.2, 0.2));
        this.waterEffect.setScale(v3(0.5, 0.5, 0.5));
    }
}


