import { _decorator, Camera, Component, easing, log, Node, Quat, tween, v3, Vec3, view, math, GeometryRenderer, screen } from 'cc';
import { GameInfo, SceneType } from '../Common/GameInfo';
const { ccclass, property } = _decorator;

@ccclass('CameraCtrl')
export class CameraCtrl extends Component {
    public static instance: CameraCtrl;
    @property({ type: Node, displayName: "跟随节点" })
    private root: Node;
    @property({ displayName: "3D相机偏移坐标" })
    public OffVector3D: Vec3 = new Vec3();
    @property({ displayName: "3D相机跟随角度" })
    private FollowEulerAngles: Vec3 = new Vec3();
    private _sceneCW: number;
    private _sceneCH: number;

    public mainCamera: Camera = null!;
    private readonly DEFAULT_INTERVAL: number = 0.05;
    private power: number = 0;
    private duration: number = 0;
    private timer: number = 0;
    private _isFollowingRoot: boolean = true;
    private sceneType: SceneType = SceneType.D2;
    // 3D震动相关属性
    private _shakeDuration: number = 0;
    private _shakePower: number = 0;
    private _shakeTimer: number = 0;
    private _originalPosition: Vec3 = new Vec3();
    private _originalRotation: Quat = new Quat();
    private _isShaking: boolean = false;

    public get sceneCW() {
        if (this._sceneCW == null) {
            let size = view.getDesignResolutionSize();
            this._sceneCW = size.width / 2;
        }
        return this._sceneCW
    }

    public get sceneCH() {
        if (this._sceneCH == null) {
            let size = view.getDesignResolutionSize();
            this._sceneCH = size.height / 2;
        }
        return this._sceneCH
    }
    protected onLoad(): void {
        this.sceneType = GameInfo.SceneType;
        CameraCtrl.instance = this;
    }
    // public geometryRenderer: GeometryRenderer = null;
    start() {
        log(`w:${this.sceneCW}`);
        log(`h:${this.sceneCH}`);
        this.mainCamera = this.node.getComponent(Camera);
        //开启射线绘制需要调用initGeometryRenderer
        // this.mainCamera.camera.initGeometryRenderer();
        // this.geometryRenderer = this.mainCamera.camera.geometryRenderer;
        if (!this.root) return;
        if (this.mainCamera.projection == Camera.ProjectionType.ORTHO) {
            //2D相机一定是正交模式,默认Z:1000
            this.node.setWorldPosition(this.root.worldPosition.x + this.OffVector3D.x, this.root.worldPosition.y + this.OffVector3D.y, this.root.worldPosition.z + this.OffVector3D.z)
            this.node.setRotationFromEuler(this.FollowEulerAngles);
            //2d相机视野范围  默认orthoHeight = 800
            // this.mainCamera.orthoHeight = 800;
        } else {
            //透视相机
            this.node.setWorldPosition(this.root.worldPosition.x + this.OffVector3D.x, this.root.worldPosition.y + this.OffVector3D.y, this.root.worldPosition.z + this.OffVector3D.z)
            this.node.setRotationFromEuler(this.FollowEulerAngles);
            //3d相机视野范围
            // this.mainCamera.fov = 60;
        }
    }
    public get isCameraFollow() {
        return this._isFollowingRoot;
    }
    public set isCameraFollow(value: boolean) {
        this._isFollowingRoot = value;
    }
    /**切换相机跟随视角节点 */
    public changeCameraFollow(node: Node) {
        this.root = node;
    }
    /**设置相机跟随点 */
    setFollowPoint(node: Node, time: number = 2, cb?: () => void) {
        this.root = node;
        tween(this.node).to(time, { eulerAngles: this.FollowEulerAngles }, { easing: easing.smooth }).start();
        tween(this.node).to(time, { worldPosition: v3(this.root.worldPosition.x + this.OffVector3D.x, this.OffVector3D.y, this.root.worldPosition.z + this.OffVector3D.z) }, { easing: easing.smooth }).call(() => {
            cb && cb();
        }).start();
    }
    /**相机移动到目标节点 */
    moveToTarget(node: Node, time: number = 1, cb?: () => void) {
        this._isFollowingRoot = false;
        let dx = node.worldPosition.x
        let dy = node.worldPosition.y
        let dz = node.worldPosition.z
        if (this.sceneType == SceneType.D2) {
            dz = 1000;
        } else {
            dx += this.OffVector3D.x;
            dy += this.OffVector3D.y;
            dz += this.OffVector3D.z;
        }
        tween(this.node).to(time, { worldPosition: v3(dx, dy, dz) }, { easing: easing.smooth })
            .call(() => {
                cb && cb();
            })
            .start()
    }
    /**设置相机透视视野范围FOV */
    zoomPerspective(fov: number, time: number = 2, cb?: () => void) {
        tween(this.mainCamera)
            .to(0.5, { fov: fov }, { easing: easing.smooth })
            .call(() => { cb && cb(); })
            .start();
    }
    /**设置相机正交模式的高度 orthoHeight */
    zoomOrtho(orthoHeight: number, time: number = 2, cb?: () => void) {
        tween(this.mainCamera)
            .to(time, { orthoHeight: orthoHeight }, { easing: easing.smooth })
            .call(() => { cb && cb(); })
            .start()
    }
    update(deltaTime: number) {
        if (!this._isFollowingRoot || GameInfo.instance.Pause || GameInfo.instance.Over) return;

        // 更新3D震动
        if (this.sceneType === SceneType.D3) {
            this.update3DShake(deltaTime);
        } else {
            this.updateShake(deltaTime);
        }

        let node = this.root;
        if (node) {
            if (this.sceneType == SceneType.D2) {
                this.move2D(node);
            } else {
                this.move3D(node);
            }
        }
    }
    move2D(node: Node) {
        let pv = node.worldPosition;
        let pos = this.node.worldPosition;
        let dx = pv.x - pos.x;
        let dy = pv.y - pos.y;
        if (Math.abs(dx) < 10) {
            dx = 0;
        }
        if (Math.abs(dy) < 10) {
            dy = 0;
        }
        this.node.setWorldPosition(pos.x + dx * 0.1, pos.y + dy * 0.1, 1000)
    }
    move3D(node: Node) {
        let pv = node.worldPosition;
        let pos = this.node.worldPosition;
        let dx = pv.x + this.OffVector3D.x - pos.x;
        let dy = pv.y + this.OffVector3D.y - pos.y;
        let dz = pv.z + this.OffVector3D.z - pos.z;
        if (Math.abs(dx) < 0.05) {
            dx = 0;
        }
        if (Math.abs(dz) < 0.05) {
            dz = 0;
        }
        this.node.setWorldPosition(pos.x + dx * 0.1, pos.y + dy * 0.1, pos.z + dz * 0.1)
    }


    /**
     * 将输入方向转换为世界空间方向
     * @param inputDir 输入方向（相对于摄像机的方向，x=左右、z=前后，与 Hero 中 VirtualInput 一致）
     * @returns 世界空间方向（约束在 XZ 水平面(World XZ plane)上）
     */
    public convertInputToWorldDirection(inputDir: Vec3): Vec3 {
        const worldDir = v3();
        const quat = this.node.getWorldRotation();

        const rightW = v3();
        const localZW = v3();
        Vec3.transformQuat(rightW, Vec3.UNIT_X, quat);
        Vec3.transformQuat(localZW, Vec3.UNIT_Z, quat);

        // 水平右向：相机轴向在世界 XZ 上的投影（归一化）
        const rightH = v3(rightW.x, 0, rightW.z);
        if (rightH.lengthSqr() < 1e-10) {
            rightH.set(1, 0, 0);
        } else {
            Vec3.normalize(rightH, rightH);
        }

        // 水平前后：局部 +Z 在 XZ 上的投影；纯俯视时该投影为零，用 UP×右 得到稳定的地面“朝前”
        const localZH = v3(localZW.x, 0, localZW.z);
        const forwardH = v3();
        if (localZH.lengthSqr() > 1e-10) {
            Vec3.normalize(forwardH, localZH);
        } else {
            Vec3.cross(forwardH, Vec3.UP, rightH);
            Vec3.normalize(forwardH, forwardH);
        }

        worldDir.x = rightH.x * inputDir.x + forwardH.x * inputDir.z;
        worldDir.y = 0;
        worldDir.z = rightH.z * inputDir.x + forwardH.z * inputDir.z;

        // 如果方向不为零，则归一化
        if (!Vec3.equals(worldDir, Vec3.ZERO)) {
            Vec3.normalize(worldDir, worldDir);
        }
        return worldDir;
    }
    /**
     * 3d世界坐标转换为UI坐标
     * @param worldPos 世界坐标
     * @param out 输出坐标
     * @returns 
     */
    viewportProject(worldPos: Vec3, out?: Vec3): Vec3 {
        let outPos: Vec3;
        if (out)
            outPos = out;
        else
            outPos = v3();

        const screenPos = this.mainCamera.worldToScreen(worldPos);
        const designSize = view.getDesignResolutionSize();
        const screenSize = view.getVisibleSize();
        const canvasSize = screen.windowSize;
        let scaleW = canvasSize.width / screenSize.width;
        let scaleH = canvasSize.height / screenSize.height;
        console.error(screenSize, designSize, canvasSize, this.mainCamera.rect);
        console.error(view.getScaleX(), view.getScaleY(), scaleW, scaleH);
        outPos.x = screenPos.x * view.getScaleX() + screenSize.width * 0.5;
        outPos.y = screenPos.y * view.getScaleY() + screenSize.height * 0.5;
        return outPos;
    }
    /**
     * 3D场景基于位置的震动
     * @param duration 持续时间
     * @param power 震动强度
     */
    public screenShake3D(duration: number, power: number): void {
        if (this._shakeDuration <= 0 || power > this._shakePower) {
            this._shakePower = power;
            this._shakeDuration = duration;
            this._shakeTimer = 0;
            this._isShaking = true;

            // 保存原始位置
            this._originalPosition.set(this.node.worldPosition);
        }
    }

    /**
     * 3D场景基于旋转的震动
     * @param duration 持续时间
     * @param power 震动强度（角度）
     */
    public screenShake3DRotation(duration: number, power: number): void {
        if (this._shakeDuration <= 0 || power > this._shakePower) {
            this._shakePower = power;
            this._shakeDuration = duration;
            this._shakeTimer = 0;
            this._isShaking = true;

            // 保存原始旋转
            this._originalRotation.set(this.node.getRotation());
        }
    }

    /**
     * 3D场景组合震动（位置+旋转）
     * @param duration 持续时间
     * @param positionPower 位置震动强度
     * @param rotationPower 旋转震动强度
     */
    public screenShake3DCombined(duration: number, positionPower: number, rotationPower: number): void {
        if (this._shakeDuration <= 0 || positionPower > this._shakePower) {
            this._shakePower = Math.max(positionPower, rotationPower);
            this._shakeDuration = duration;
            this._shakeTimer = 0;
            this._isShaking = true;

            // 保存原始位置和旋转
            this._originalPosition.set(this.node.worldPosition);
            this._originalRotation.set(this.node.getRotation());
        }
    }

    /**
     * 更新3D震动效果
     * @param dt 时间增量
     */
    private update3DShake(dt: number): void {
        if (!this._isShaking || this._shakeDuration <= 0) return;

        this._shakeDuration -= dt;
        this._shakeTimer -= dt;

        if (this._shakeTimer <= 0) {
            this._shakeTimer = this.DEFAULT_INTERVAL;

            // 位置震动
            const randomX = (Math.random() * 2 - 1) * this._shakePower;
            const randomY = (Math.random() * 2 - 1) * this._shakePower;
            const randomZ = (Math.random() * 2 - 1) * this._shakePower;

            // // 旋转震动
            // const randomRotX = (Math.random() * 2 - 1) * this._shakePower * 0.1;
            // const randomRotY = (Math.random() * 2 - 1) * this._shakePower * 0.1;
            // const randomRotZ = (Math.random() * 2 - 1) * this._shakePower * 0.1;

            // 应用震动
            this.node.setWorldPosition(
                this._originalPosition.x + randomX,
                this._originalPosition.y + randomY,
                this._originalPosition.z + randomZ
            );

            // const rotation = quat();
            // Quat.fromEuler(rotation, randomRotX, randomRotY, randomRotZ);
            // this.node.setRotation(rotation);
        }

        // 震动结束，恢复原始状态
        if (this._shakeDuration <= 0) {
            this._isShaking = false;
            this.node.setWorldPosition(this._originalPosition);
            // this.node.setRotation(this._originalRotation);
        }
    }

    /**
     * 2D屏幕震动
     * @param duration 持续时间
     * @param power 震动强度
     */
    public screenShake(duration: number, power: number): void {
        // 如果新的震动强度更大，则替换当前震动
        if (this.duration <= 0 || power > this.power) {
            this.power = power;
            this.duration = duration;
            this.timer = 0;
        }
    }
    /**2D屏幕震动 */
    public updateShake(dt: number): void {
        if (!this.mainCamera || this.duration <= 0) return;

        this.duration -= dt;
        this.timer -= dt;

        if (this.timer <= 0) {
            this.timer = this.DEFAULT_INTERVAL;
            const randomX = Math.random() * this.power * 2 - this.power;
            const randomY = Math.random() * this.power * 2 - this.power;
            this.mainCamera.node.translate(v3(randomX, randomY, 1000));
        }
    }
}


