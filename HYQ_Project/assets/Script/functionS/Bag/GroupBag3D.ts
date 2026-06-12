import { _decorator, CCFloat, CCInteger, Component, Mat4, Node, Vec2, Vec3 } from 'cc';
import { BagBase } from './Base/BagBase';
import LayerManager from '../../Base/LayerManager';
import TweenTool from '../../Tool/TweenTool';
import { Prop } from './Prop';
import { SceneType } from '../../Base/EnumList';
const { ccclass, property } = _decorator;

@ccclass('GroupBag3D')
export class GroupBag3D extends BagBase {

    public get NODECOUNT(): number {

        let count = this.count + this.propCount;
        if (this.showMaxCount != -1 && this.showMaxCount <= count) {
            count = this.showMaxCount - 1;
        }
        return count;
    }

    private sceneType: SceneType = SceneType.D2;

    protected onLoad(): void {
        super.onLoad();
        this.sceneType = LayerManager.instance.SceneType;
    }

    @property({
        tooltip: '一行中道具的个数',
        type: CCInteger
    })
    public horizontal: number = 3;

    @property({
        tooltip: '每层道具的总数',
        type: CCInteger
    })
    public layerCount: number = 9;

    @property({
        tooltip: '当前节点下 的初始位置 0:X  1:y  ',
    })
    public startPos: Vec3 = new Vec3();

    @property({
        tooltip: '每行偏移量  0:X  1:y  ',
    })
    public horizontalOffset: Vec2 = new Vec2();

    @property({
        tooltip: '每列偏移量  0:X  1:y  ',
    })
    public verticalOffset: Vec2 = new Vec2();


    @property({
        tooltip: '局部坐标角度仅限2d使用',
        type: CCFloat
    })
    public angle: number = 0;

    // ============ 竹子弯曲效果配置 ============
    @property({
        tooltip: '[总开关]是否启用竹子弯曲效果',
    })
    public enableBendingEffect: boolean = false;

    @property({
        tooltip: '弯曲增长速度（移动时弯曲达到最大的速度）',
        type: CCFloat,
        min: 0.1,
        max: 10,
        visible: function (this: GroupBag3D) { return this.enableBendingEffect; }
    })
    public bendingSpeed: number = 3.0;

    @property({
        tooltip: '弹簧刚度（越大回弹越有力，建议100-200）',
        type: CCFloat,
        min: 50,
        max: 300,
        visible: function (this: GroupBag3D) { return this.enableBendingEffect; }
    })
    public springStiffness: number = 150;

    @property({
        tooltip: '阻尼比（控制回弹次数，0.4=4次，0.5=3次，0.6=2次）',
        type: CCFloat,
        min: 0.1,
        max: 1.0,
        visible: function (this: GroupBag3D) { return this.enableBendingEffect; }
    })
    public dampingRatio: number = 0.5;

    @property({
        tooltip: '最大弯曲距离（单位）',
        type: CCFloat,
        min: 0.01,
        max: 5,
        visible: function (this: GroupBag3D) { return this.enableBendingEffect; }
    })
    public maxBendingDistance: number = 0.5;

    @property({
        tooltip: '弯曲计算基准层数（控制弯曲梯度，值越大弯曲越平缓）',
        type: CCInteger,
        min: 1,
        max: 20,
        visible: function (this: GroupBag3D) { return this.enableBendingEffect; }
    })
    public bendingBaseLayers: number = 5;

    // ============ 内部变量 ============
    /** 目标弯曲程度（0-1）*/
    private _bendingProgress: number = 0;
    /** 实际弯曲程度（可能超过0-1，用于回弹效果）*/
    private _currentBend: number = 0;
    /** 弯曲变化速度（用于弹簧物理模拟）*/
    private _bendVelocity: number = 0;
    /** 是否正在移动（外部控制）*/
    private _isMoving: boolean = false;
    /** 弯曲方向向量（固定为节点z轴负方向，模拟惯性）*/
    private readonly _bendingDir: Vec3 = new Vec3(0, 0, -1);
    /** 原始位置缓存（用于重置）*/
    private readonly _originalPositions: Vec3[] = [];


    /**获取 放置的位置 */
    public get placePropPos() {
        this.count++;
        this._placeTime = this.placeTimeInterval;
        let count = this.NODECOUNT;
        return this.getPropPlaceWordPos(count - 1);
    }
    public getPropPlacePos(count: number) {
        this.tempV3.set(Vec3.ZERO);
        // this._showAddArrow = true;
        let layer = Math.floor(count / this.layerCount);
        let layerY = layer * this.layerHeight;
        let layerCount = count % this.layerCount;
        let rx = Math.floor(layerCount % this.horizontal);
        let ry = Math.floor(layerCount / this.horizontal);
        if (this.sceneType == SceneType.D2) {
            let dx = this.startPos.x + rx * this.horizontalOffset.x + ry * this.verticalOffset.x;
            let dy = this.startPos.y + rx * this.horizontalOffset.y + ry * this.verticalOffset.y + layerY;
            this.tempV3.add3f(dx, dy, 0);
        } else {
            let dx = this.startPos.x + rx * this.horizontalOffset.x + ry * this.verticalOffset.x;
            let dz = this.startPos.z + rx * this.horizontalOffset.y + ry * this.verticalOffset.y;
            let y = layerY + this.startPos.y;
            this.tempV3.add3f(dx, y, dz);
        }
        return this.tempV3;
    }
    /**添加道具 */
    public set addProp(prop: Prop) {
        if (this.showMaxCount == -1 || this.showMaxCount > this.propList.length) {
            this.getPropPlacePos(this.propList.length);
            this.node.addChild(prop.node);

            // 缓存原始位置（用于弯曲效果重置）
            let originalPos = new Vec3(this.tempV3.x, this.tempV3.y, this.tempV3.z);
            this._originalPositions[this.propList.length] = originalPos;
            this.propList.push(prop);

            prop.node.setPosition(this.tempV3);
            TweenTool.scaleShake(prop.node).call(() => {
                prop.node.setScale(Vec3.ONE);
            }).start();
            if (this.sceneType == SceneType.D2 && this.angle != -1) {

                // prop.tran.priority = 0;
                prop.node.angle = this.angle;
            }
        } else {
            this.showCount++;
            prop.remove();
        }
        this.count--;
    }


    protected _onUpdata(dt: number) {
        // 只有启用弯曲效果时才执行
        if (!this.enableBendingEffect) {
            return;
        }

        // 步骤1：更新目标弯曲程度
        this.updateTargetBending(dt);

        // 步骤2：弹簧物理模拟
        this.updateSpringPhysics(dt);

        // 步骤3：应用弯曲效果
        this.applyBending();
    }

    // ============ 对外接口 ============
    /**
     * 设置背包是否在移动
     * @param isMoving true=正在移动, false=已停止
     */
    public setMoving(isMoving: boolean): void {
        if (!this.enableBendingEffect) {
            return;
        }
        this._isMoving = isMoving;
    }

    // ============ 核心逻辑 ============
    /** 更新目标弯曲程度 */
    private updateTargetBending(dt: number): void {
        if (this._isMoving) {
            // 移动中：目标逐渐增加到1
            this._bendingProgress += this.bendingSpeed * dt;
            if (this._bendingProgress > 1) {
                this._bendingProgress = 1;
            }
        } else {
            // 停止移动：目标直接设为0（让弹簧系统处理回弹）
            this._bendingProgress = 0;
        }
    }

    /** 弹簧物理模拟（核心） */
    private updateSpringPhysics(dt: number): void {
        // 计算偏离目标的距离
        let displacement = this._currentBend - this._bendingProgress;

        // 弹簧力：胡克定律 F = -k × x
        let springForce = -this.springStiffness * displacement;

        // 阻尼力：F = -c × v
        // 临界阻尼系数 = 2 * sqrt(k)，实际阻尼系数 = 临界阻尼 × dampingRatio
        let criticalDamping = 2 * Math.sqrt(this.springStiffness);
        let dampingCoefficient = criticalDamping * this.dampingRatio;
        let dampingForce = -dampingCoefficient * this._bendVelocity;

        // 总力
        let totalForce = springForce + dampingForce;

        // 更新速度和位置（欧拉积分）
        this._bendVelocity += totalForce * dt;
        this._currentBend += this._bendVelocity * dt;

        // 强制停止：当速度和位移都很小时直接归零
        if (Math.abs(this._bendVelocity) < 0.01 && Math.abs(displacement) < 0.001) {
            this._bendVelocity = 0;
            this._currentBend = this._bendingProgress;
        }
    }

    /** 应用弯曲效果到道具 */
    private applyBending(): void {
        // 当前弯曲程度太小，重置所有位置
        if (Math.abs(this._currentBend) < 0.001) {
            this.resetAllPropsPosition();
            return;
        }

        // 弯曲方向固定为节点的z轴负方向（移动方向的反方向，模拟惯性）
        this._bendingDir.set(0, 0, -1);

        // 应用偏移到每个道具
        for (let i = 0; i < this.propList.length; i++) {
            let prop = this.propList[i];
            if (!prop || !prop.node) continue;

            // 计算当前道具在第几层
            let layerIndex = Math.floor(i / this.layerCount);

            // 使用固定的基准层数计算比例（确保无论多少道具，每层的偏移量一致）
            let layerRatio = layerIndex / this.bendingBaseLayers;

            // 弯曲因子（二次曲线，顶部更明显）
            let bendingFactor = Math.pow(layerRatio, 2);

            // 计算偏移量（沿z轴方向）
            let offset = new Vec3();
            Vec3.multiplyScalar(offset, this._bendingDir, this._currentBend * bendingFactor * this.maxBendingDistance);

            // 获取原始位置并应用偏移
            let originalPos = this._originalPositions[i];
            if (originalPos) {
                prop.node.setPosition(
                    originalPos.x + offset.x,
                    originalPos.y + offset.y,
                    originalPos.z + offset.z
                );
            }
        }
    }

    /** 重置所有道具到原始位置 */
    private resetAllPropsPosition(): void {
        for (let i = 0; i < this.propList.length; i++) {
            let prop = this.propList[i];
            if (!prop || !prop.node) continue;

            let originalPos = this._originalPositions[i];
            if (originalPos) {
                prop.node.setPosition(originalPos);
            }
        }
    }

}

