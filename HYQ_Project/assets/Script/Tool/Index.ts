import { Camera, director, Line, math, Node, Rect, UITransform, v3, Vec2, Vec3, screen, BoxCollider } from "cc";
import PoolManager from "../Base/PoolManager";

const tempV3 = new Vec3();
const tempV3_2 = new Vec3();
const tempV2 = new Vec2();

export const worldPosTNodePos = (node: Node, pos: Vec3) => {
    let layerTran = node.getComponent(UITransform);
    layerTran.convertToNodeSpaceAR(pos, tempV3);
    return tempV3;
}

export const vectorPower_v2 = (self: Node, target: Node, power: number = 1, yOff: number = 0) => {
    vectorPower2(self.worldPosition, target.worldPosition, power, yOff);
    tempV2.set(tempV3.x, tempV3.y);
    return tempV2;
}
export const vectorPower = (self: Node, target: Node, power: number = 1, yOff: number = 0) => {
    return vectorPower2(self.worldPosition, target.worldPosition, power, yOff);
}
export const vectorPower2 = (self: Vec3, target: Vec3, power: number = 1, yOff: number = 0, isY: boolean = false) => {
    tempV3.set(target);
    tempV3.y += yOff;
    Vec3.subtract(tempV3, tempV3, self);
    if (isY) {
        tempV3.y = 0; // 忽略高度差
    }
    tempV3.normalize();
    return tempV3.multiplyScalar(power);
}

export const vectorMoveSpeed = (start: Vec3, end: Vec3) => {
    Vec3.subtract(tempV3, end, start);
    tempV3.normalize();
    return tempV3;
}

export const getPosRandomPos = (startPos: Vec3, r: number = 128, lockVector: Vec3 = Vec3.ZERO, disVector: Vec3 = Vec3.ONE) => {
    // 球体内均匀随机点：使用球坐标系
    const theta = Math.random() * 2 * Math.PI;  // 方位角 [0, 2π]
    const phi = Math.acos(2 * Math.random() - 1);  // 极角 [0, π]
    const radius = Math.cbrt(Math.random()) * r;  // 半径，立方根保证均匀分布

    // 球坐标转笛卡尔坐标
    let x = radius * Math.sin(phi) * Math.cos(theta);
    let y = radius * Math.sin(phi) * Math.sin(theta);
    let z = radius * Math.cos(phi);

    // 应用 lockVector：锁定某轴的正/负方向
    x = lockVector.x == 0 ? x : lockVector.x > 0 ? Math.abs(x) : Math.abs(x) * -1;
    y = lockVector.y == 0 ? y : lockVector.y > 0 ? Math.abs(y) : Math.abs(y) * -1;
    z = lockVector.z == 0 ? z : lockVector.z > 0 ? Math.abs(z) : Math.abs(z) * -1;
    // 应用 disVector：禁用某轴（设为0）
    x = disVector.x == 1 ? x : 0;
    y = disVector.y == 1 ? y : 0;
    z = disVector.z == 1 ? z : 0;
    tempV3.set(startPos.x + x, startPos.y + y, startPos.z + z);
    return tempV3;
}




export const angleTVector = (angle: number) => {
    let x = Math.cos(angle);
    let y = Math.sin(angle);
    tempV2.set(x, y);
    return tempV2;
}


/**
 * 判断玩家是否朝向目标 
 * @param playerPos 玩家世界坐标
 * @param targetPos 目标世界坐标
 * @param playerForward 玩家的前向向量（需归一化）
 * @param maxAllowedAngle 最大允许夹角（单位：度，默认 30°）
 * @returns 是否满足朝向条件
 */
// export const isFacingTarget = (playerPos: Vec3, targetPos: Vec3, playerForward: Vec3, maxAllowedAngle: number = 30): boolean => {
//     // 1. 计算玩家到目标的方向向量
//     vectorPower2(playerPos, targetPos);

//     const directionToTarget = tempV3;

//     // 处理玩家和目标位置重合的情况
//     if (directionToTarget.length() < 1e-5) return true;

//     directionToTarget.normalize();

//     // 2. 计算点积（直接比较余弦值，避免反三角函数计算）
//     const dot = Vec3.dot(playerForward, directionToTarget);
//     const cosThreshold = Math.cos(math.toRadian(maxAllowedAngle));

//     // 3. 判断夹角是否在允许范围内
//     return dot >= cosThreshold;
// }

/**
 * 判断玩家是否朝向目标（忽略高度差，仅水平方向）
 * @param playerPos 玩家世界坐标
 * @param targetPos 目标世界坐标
 * @param playerForward 玩家的前向向量（需归一化）
 * @param maxAllowedAngle 最大允许夹角（单位：度，默认 30°）
 * @returns 是否满足水平方向朝向条件
 */
// export const isFacingTargetHorizontal = (playerPos: Vec3, targetPos: Vec3, playerForward: Vec3, maxAllowedAngle: number = 30): boolean => {
//     // 1. 计算水平方向向量（忽略 Y 轴）
//     // if (!line1) {
//     //     init();
//     // }
//     // vectorPower2(playerPos, targetPos);

//     tempV3.set(targetPos).subtract(playerPos);
//     tempV3.y = 0; // 忽略高度差
//     tempV3.normalize();
//     const directionToTarget = tempV3;
//     // directionToTarget.y = 0; // 忽略高度差

//     // let v3_1 = new Vec3();
//     // v3_1.set(directionToTarget).multiplyScalar(5).add(playerPos);
//     // line1.positions = [playerPos, v3_1];

//     // 处理玩家和目标水平位置重合的情况
//     if (directionToTarget.length() < 1e-5) return true;

//     // 2. 投影玩家前向向量到水平面
//     const playerForwardHorizontal = tempV3_2.set(playerForward).multiplyScalar(-1);
//     tempV3_2.y = 0;

//     // v3_1.set(playerForwardHorizontal).multiplyScalar(5).add(playerPos);
//     // line2.positions = [playerPos, v3_1];

//     // 处理前向向量垂直向上的极端情况
//     if (playerForwardHorizontal.length() < 1e-5) return false;

//     // 3. 计算点积（水平方向）
//     const dot = Vec3.dot(playerForwardHorizontal, directionToTarget);
//     // let an = Math.acos(dot);
//     // an = math.toDegree(an);
//     const cosThreshold = Math.cos(math.toRadian(maxAllowedAngle));

//     // log(an);
//     return dot >= cosThreshold;
// }

const COS_CACHE = new Map<number, number>();
/**
 * 判断玩家是否朝向目标
 * @param vector 方向
 * @param playerForward 玩家的前向向量（需归一化）
 * @param maxAllowedAngle 最大允许夹角（单位：度，默认 30°）
 * @returns 是否满足水平方向朝向条件
 */
export const isFacingTargetHorizontal_vec = (targetDirection: Vec3, playerForward: Vec3, maxAllowedAngle: number = 30, ignoreHeight: boolean = false): boolean => {
    if (targetDirection.lengthSqr() < 1e-10) return true;

    const dir = Vec3.copy(tempV3, targetDirection);
    const forward = Vec3.copy(tempV3_2, playerForward).multiplyScalar(-1);

    if (ignoreHeight) {
        dir.y = 0;
        forward.y = 0;
        if (dir.lengthSqr() < 1e-10) return true;
    }
    Vec3.normalize(dir, dir);
    // 使用缓存避免重复计算相同角度的余弦值
    let cosThreshold: number;
    if (COS_CACHE.has(maxAllowedAngle)) {
        cosThreshold = COS_CACHE.get(maxAllowedAngle);
    } else {
        cosThreshold = Math.cos(math.toRadian(maxAllowedAngle));
        COS_CACHE.set(maxAllowedAngle, cosThreshold);
    }
    return Vec3.dot(forward, dir) >= cosThreshold;
};



let line1: Line;
let line2: Line;

const init = () => {
    let scene = director.getScene();
    let node1 = new Node();
    scene.addChild(node1);
    node1.setWorldPosition(Vec3.ZERO);
    line1 = node1.addComponent(Line);
    let node2 = new Node();
    scene.addChild(node2);
    node2.setWorldPosition(Vec3.ZERO);
    line2 = node2.addComponent(Line);
    line1.width.constant = 0.2;
    line2.width.constant = 0.2;

}

// 导出一个函数，用于计算垂直于给定方向的位置
export const CalculatePerpendicularPosition = (dir: Vec3, r: number, count: number) => {
    // 定义一个数组，用于存储计算出的位置
    let ve3Arr: Vec3[] = [];
    // 获取垂直于给定方向的向量
    let uw = getPerpendicularVectors(dir);
    // 定义角度
    let angle = 0;
    // 定义每个位置之间的角度间隔
    let offDeg = 360 / count;
    // 循环计算每个位置
    for (let i = 0; i < count; i++) {
        // 将角度转换为弧度
        let deg = angle * Math.PI / 180;
        // 更新角度
        angle += offDeg;
        // 计算x和y的值
        let x = Math.cos(deg);
        let y = Math.sin(deg);
        // 将x和y的值乘以垂直于给定方向的向量
        Vec3.multiplyScalar(tempV3, uw.u, x);
        Vec3.multiplyScalar(tempV3_2, uw.w, y);
        // 计算位置
        let pos = v3();
        Vec3.add(pos, tempV3, tempV3_2);
        // 将位置乘以半径
        pos.multiplyScalar(r);
        // 将位置添加到数组中
        ve3Arr.push(pos);
    }
    // 返回计算出的位置数组
    return ve3Arr;
}



// 导出一个函数，用于获取与给定向量垂直的两个向量
export const getPerpendicularVectors = (dir: Vec3): { u: Vec3, w: Vec3 } => {
    // 声明两个向量u和w
    let u: Vec3, w: Vec3;
    u = v3();
    w = v3();
    // 如果给定向量为零向量，则返回两个零向量
    if (dir == Vec3.ZERO) {
        return { u: Vec3.ZERO, w: Vec3.ZERO };
    } else {
        // 将给定向量归一化
        dir.normalize();
        // 如果给定向量与向上向量点积的绝对值小于0.99，则将向上向量作为参考向量，否则将向前向量作为参考向量
        let reference: Vec3 = Math.abs(Vec3.dot(dir, Vec3.UP)) < 0.99 ? Vec3.UP : Vec3.FORWARD;
        // 将给定向量和参考向量叉乘，得到向量u，并归一化
        Vec3.cross(u, dir, reference).normalize();
        // 如果向量u的长度平方小于0.1，则将向右向量作为参考向量，并将给定向量和参考向量叉乘，得到向量u，并归一化
        if (u.lengthSqr() < 0.1) {
            reference = Vec3.RIGHT;
            Vec3.cross(u, dir, reference).normalize();
        }
        // 将给定向量和向量u叉乘，得到向量w，并归一化
        Vec3.cross(w, dir, u).normalize();
        // 返回向量u和向量w
        return { u, w };
    }
}


/**
 * 获取任意垂直向量
 * @param input 输入向量（会自动标准化）
 * @returns 与输入向量垂直的单位向量
 */
export const getPerpendicularVector = (input: Vec3): Vec3 => {
    const v = input.clone().normalize();
    const temp = tempV3;

    // 方法1：尝试与标准基向量叉乘
    if (!(Math.abs(v.y) > 0.9 || Math.abs(v.z) > 0.9)) { // 避免与X轴过于接近
        Vec3.cross(temp, v, Vec3.UNIT_X);
    } else if (!(Math.abs(v.x) > 0.9 || Math.abs(v.z) > 0.9)) { // 避免与Y轴过于接近
        Vec3.cross(temp, v, Vec3.UNIT_Y);
    } else {
        Vec3.cross(temp, v, Vec3.UNIT_Z);
    }

    return temp.normalize();
}

/**
 * 注意该方法未开方 
 * @param v1 
 * @param v2 
 * @returns 
 */
export const distanceSquared = (v1: Vec3, v2: Vec3) => {
    Vec3.subtract(tempV3, v1, v2);
    return tempV3.x * tempV3.x + tempV3.y * tempV3.y + tempV3.z * tempV3.z;
}  /**
* 判断一个点是否在摄像机视口范围内
* @param worldPos 世界坐标系中的点（Vec3）
* @param camera 目标摄像机
*/
export const isPointInCameraView = (worldPos: Vec3, camera: Camera): boolean => {
    // 将世界坐标转换为屏幕坐标
    const screenPos = camera.worldToScreen(worldPos);

    // 获取摄像机视口参数（归一化比例）
    const viewport: Rect = camera.rect;
    // 获取屏幕实际分辨率（使用设计分辨率适配不同设备）
    const screenSize = screen.windowSize;


    // 计算视口实际像素范围（关键修正点）
    const viewportX = viewport.x * screenSize.width;
    const viewportY = viewport.y * screenSize.height; // 直接使用 viewport.y，无需翻转坐标系
    const viewportWidth = viewport.width * screenSize.width;
    const viewportHeight = viewport.height * screenSize.height;

    // 判断屏幕坐标是否在视口范围内
    const isInViewport = (
        screenPos.x >= viewportX &&
        screenPos.x <= viewportX + viewportWidth &&
        screenPos.y >= viewportY && // 坐标系原点在左下角，直接比较
        screenPos.y <= viewportY + viewportHeight
    );

    // 深度检测（如果是2D项目，可跳过此检查）
    // const isInDepth = worldPos.z >= camera.near && worldPos.z <= camera.far;

    return isInViewport;
}

// LCG 伪随机数生成器种子（全局变量）
let _lcgSeed: number = Date.now();
/**
 * Xorshift 伪随机数生成器（高性能，均匀分布）
 * 生成 [0, 1) 范围内的均匀分布随机数
 * @param seed 种子值（可选，传入后会重置种子）
 * @returns [0, 1) 范围内的随机数
 */
export const lcgRandom = (seed?: number): number => {
    if (seed !== undefined) {
        _lcgSeed = seed >>> 0;
    }
    _lcgSeed ^= _lcgSeed << 13;
    _lcgSeed ^= _lcgSeed >>> 17;
    _lcgSeed ^= _lcgSeed << 5;
    return (_lcgSeed >>> 0) / 4294967296;
};
/**
 * 在 BoxCollider 范围内生成随机点（忽略 y 轴）
 * 使用 Xorshift 伪随机算法生成均匀分布的点
 * 支持节点的旋转变换
 * @param collider 目标 BoxCollider
 * @param yValue y 轴固定值（默认为 0）
 * @param seed 可选种子值（用于复现随机结果）
 * @returns 随机位置点（世界坐标系）
 */
/**
 * 围绕中心点生成圆形均匀分布的位置
 * @param center 中心坐标 A
 * @param count 总数 C（圆上均匀分布的点数）
 * @param index 第几个位置 I（0 <= I < C）
 * @param radius 半径 R
 * @param axis 围绕的轴（默认 Vec3.UNIT_Y，即 XZ 平面圆形分布）
 * @returns 第 I 个点的位置
 */
export const getCirclePosition = (center: Vec3, count: number, index: number, radius: number, axis: Vec3 = Vec3.UP): Vec3 => {
    const angle = (2 * Math.PI / count) * index;
    const pw = getPerpendicularVectors(axis.clone());
    // pos = center + (u * cos(angle) + w * sin(angle)) * radius
    const u = Vec3.multiplyScalar(tempV3, pw.u, Math.cos(angle));
    const w = Vec3.multiplyScalar(tempV3_2, pw.w, Math.sin(angle));
    Vec3.add(u, u, w).multiplyScalar(radius);
    const pos = PoolManager.instance.V3;
    pos.set(u.x, u.y, u.z);
    pos.add(center);
    return pos;
};

export const getRandomPointInCollider = (collider: BoxCollider, yValue: number = 0, seed?: number): Vec3 => {
    const size = collider.size;
    const node = collider.node;

    // 在本地坐标系中生成随机偏移量（使用 tempV3）
    tempV3.set(
        (lcgRandom(seed) - 0.5) * size.x,
        0,
        (lcgRandom() - 0.5) * size.z
    );

    // 将本地偏移量转换到世界坐标系（应用旋转和缩放，使用 tempV3_2）
    Vec3.transformMat4(tempV3_2, tempV3, node.worldMatrix);
    tempV3_2.y = yValue;
    return tempV3_2;
};

