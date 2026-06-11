import { _decorator, IVec3Like, Vec3, v3, math } from 'cc';

let tempVec: Vec3 = v3()
let tempVec2: Vec3 = v3()
let tempVec3: Vec3 = v3()
let up = v3()

/**
 * 通用数学库
 */
export class MathUtil {

    /**
     * Rodrigues' Rotation Formula
     * 使 v 绕 u 轴旋转 maxAngleDelta （弧度）
     * @param out 
     * @param v 
     * @param u 
     * @param maxAngleDelta 
     */
    static rotateAround(out: Vec3, v: Vec3, u: Vec3, maxAngleDelta: number) {

        //out = v*cos + uxv*sin  + (u*v)*u*(1- cos);
        const cos = Math.cos(maxAngleDelta);
        const sin = Math.sin(maxAngleDelta);

        // v * cos 
        Vec3.multiplyScalar(tempVec, v, cos);

        // u x v 
        Vec3.cross(tempVec2, u, v);

        // v*cos + uxv*sin
        Vec3.scaleAndAdd(tempVec3, tempVec, tempVec2, sin);

        const dot = Vec3.dot(u, v);

        // + (u*v)*u*(1-cos)
        Vec3.scaleAndAdd(out, tempVec3, u, dot * (1.0 - cos));

    }

    /**
     * 将 from 向 to 旋转 maxAngleDelta 弧度
     * @param out 
     * @param from 
     * @param to 
     * @param maxAngleDelta 
     */
    static rotateToward(out: Vec3, from: Vec3, to: Vec3, maxAngleDelta: number) {
        Vec3.cross(up, from, to);
        this.rotateAround(out, from, up, maxAngleDelta);
    }

    /**
     * 求两个向量间的夹角（带符号）
     * @param from 
     * @param to 
     * @param axis 
     * @returns 
     */
    static signAngle(from: Vec3, to: Vec3, axis: Vec3): number {
        const angle = Vec3.angle(from, to);
        Vec3.cross(tempVec, from, to);
        const sign = Math.sign(axis.x * tempVec.x + axis.y * tempVec.y + axis.z * tempVec.z);
        return angle * sign;
    }

    /**
     * 计算圆弧上的均分点位
     * @param center 圆心位置
     * @param radius 半径
     * @param count 点位数量
     * @returns 均分点位的数组
     */
    static getCirclePoints(center: Vec3, radius: number, count: number): Vec3[] {
        const points: Vec3[] = [];
        const angleStep = (2 * Math.PI) / count; // 计算每个点之间的角度

        for (let i = 0; i < count; i++) {
            const angle = i * angleStep;
            // 使用三角函数计算x和y坐标
            const x = center.x + radius * Math.cos(angle);
            const z = center.z + radius * Math.sin(angle);
            points.push(new Vec3(x, center.y, z));
        }

        return points;
    }
    /**
     * 计算等边三角形扩散点位
     * @param startPos 起始点位置
     * @param direction 方向向量
     * @param rows 行数
     * @param sideLength 边长
     * @returns 点位数组，第一个点为起始点
     */
    static getTriangleSpreadPoints(startPos: Vec3, direction: Vec3, rows: number, sideLength: number): Vec3[] {
        const points: Vec3[] = [];

        // 首先添加起始点作为第一行的点
        points.push(startPos.clone());

        // 计算垂直于方向向量的单位向量
        const perpendicular = new Vec3(-direction.y, direction.x, 0);
        Vec3.normalize(perpendicular, perpendicular);

        // 计算等边三角形的高
        const height = sideLength * Math.sqrt(3) / 2;

        // 计算每行的偏移量
        const rowOffset = new Vec3();
        Vec3.multiplyScalar(rowOffset, direction, height);

        // 计算每行第一个点的偏移量
        const firstPointOffset = new Vec3();
        Vec3.multiplyScalar(firstPointOffset, perpendicular, -sideLength / 2);

        // 计算同行点之间的偏移量
        const pointOffset = new Vec3();
        Vec3.multiplyScalar(pointOffset, perpendicular, sideLength);

        // 从第二行开始遍历
        for (let row = 1; row < rows; row++) {
            // 计算当前行的起始点
            const rowStart = new Vec3();
            Vec3.multiplyScalar(rowStart, rowOffset, row);
            Vec3.add(rowStart, startPos, rowStart);
            Vec3.add(rowStart, rowStart, firstPointOffset);

            // 计算当前行的点数
            const pointsInRow = row + 1;

            // 遍历当前行的每个点
            for (let i = 0; i < pointsInRow; i++) {
                const point = new Vec3();
                Vec3.multiplyScalar(point, pointOffset, i);
                Vec3.add(point, rowStart, point);
                points.push(point);
            }
        }

        return points;
    }
    /**
     * 计算等边三角形扩散数组中指定索引对应的行数
     * @param index 数组索引
     * @returns 行数（从1开始）
     */
    static getTriangleSpreadRow(index: number): number {
        // 使用二次方程求解
        // 1 + 2 + 3 + ... + (row-1) < index <= 1 + 2 + 3 + ... + row
        // 即：(row-1)*row/2 < index <= row*(row+1)/2
        // 解方程：row^2 + row - 2*index >= 0
        // 使用求根公式：(-1 + sqrt(1 + 8*index))/2
        if (index < 0) return 0;

        // 使用向上取整确保得到正确的行数
        return Math.ceil((-1 + Math.sqrt(1 + 8 * index)) / 2);
    }
    /**
     * 计算等边三角形扩散数组中指定索引在当前行中的位置
     * @param index 数组索引
     * @returns 在当前行中的位置（从0开始）
     */
    static getTriangleSpreadPositionInRow(index: number): number {
        const row = this.getTriangleSpreadRow(index);
        if (row <= 0) return 0;

        // 计算当前行之前的所有点数之和
        const previousPoints = (row - 1) * row / 2;
        // 计算在当前行中的位置
        return index - previousPoints;
    }
    /**
     * 在垂直于direction的半圆区域内获取更均匀分布的随机点
     * 使用分区域采样确保点的分布更加均匀
     * 
     * @param center 圆心位置
     * @param direction 方向向量（已归一化）
     * @param pointCount 需要的点数量
     * @param radius 半圆半径
     * @param minDistanceFactor 最小距离系数，控制点之间的最小距离(0-1)
     * @param D3 是否是3d坐标
     * @returns 半圆区域内均匀分布的随机点位数组
     */
    static getUniformRandomPointsInSemicircle(
        center: Vec3,
        direction: Vec3,
        pointCount: number,
        radius: number,
        minDistanceFactor: number = 0.15, // 控制点之间的最小距离
        D3: boolean = false
    ): Vec3[] {
        // 确保方向向量已归一化
        const normalizedDir = direction.clone().normalize();

        // 创建结果数组
        const points: Vec3[] = [];

        // 计算垂直于direction的向量
        const perpendicular = D3 ? v3(-normalizedDir.z, 0, normalizedDir.x) : v3(-normalizedDir.y, normalizedDir.x, 0);

        // 计算点之间的最小距离
        const minDistance = radius * minDistanceFactor;

        // 最大尝试次数，防止无限循环
        const maxAttempts = 30;

        for (let i = 0; i < pointCount; i++) {
            let validPoint = false;
            let attempts = 0;
            let randomPoint: Vec3;

            while (!validPoint && attempts < maxAttempts) {
                // 随机距离 (使用平方根确保均匀分布)
                const randomDistance = radius * Math.sqrt(Math.random());

                // 随机角度 (-90度到90度)
                const randomAngle = (Math.random() - 0.5) * Math.PI;

                // 计算旋转后的方向向量
                const cosAngle = Math.cos(randomAngle);
                const sinAngle = Math.sin(randomAngle);

                const rotatedDir = v3(
                    normalizedDir.x * cosAngle + perpendicular.x * sinAngle,
                    normalizedDir.y * cosAngle + perpendicular.y * sinAngle,
                    normalizedDir.z * cosAngle + perpendicular.z * sinAngle,
                ).normalize();

                // 计算随机点位置
                randomPoint = D3 ? v3(
                    center.x + rotatedDir.x * randomDistance,
                    center.y,
                    center.z + rotatedDir.z * randomDistance,
                ) : v3(
                    center.x + rotatedDir.x * randomDistance,
                    center.y + rotatedDir.y * randomDistance,
                    center.z,
                );

                // 检查这个点是否与已有点距离足够远
                validPoint = true;
                for (const existingPoint of points) {
                    let distanceSquared = 0;
                    const dx = existingPoint.x - randomPoint.x;
                    const dy = existingPoint.y - randomPoint.y;
                    const dz = existingPoint.z - randomPoint.z;
                    if (D3) {
                        distanceSquared = dx * dx + dy * dy + dz * dz;
                    } else {
                        distanceSquared = dx * dx + dz * dz;
                    }

                    if (distanceSquared < minDistance * minDistance) {
                        validPoint = false;
                        break;
                    }
                }

                attempts++;
            }

            // 如果找到有效点，添加到数组
            // 如果尝试次数达到上限，也添加最后一个生成的点（避免无法生成所需数量）
            if (validPoint || attempts >= maxAttempts) {
                points.push(randomPoint);
            }
        }

        return points;
    }

    /**
     * 生成圆形区域内均匀分布且满足最小间距的点位
     * @param center 中心点（世界坐标）
     * @param count 生成点数
     * @param radius 区域半径
     * @param minDistance 点间最小间距
     * @param maxAttempts 单点最大尝试次数（默认100）
     * @param D3 是否是3d坐标
     * @returns 生成的点位数组（世界坐标）
     */
    static generatePointsInCircle(
        center: Vec3,
        count: number,
        radius: number,
        minDistance: number,
        maxAttempts: number = 100,
        D3: boolean = false
    ): Vec3[] {
        // 参数校验
        if (count <= 0) return [];
        if (minDistance < 0) minDistance = 0;
        if (radius <= 0) return [center.clone()];
        if (2 * radius < minDistance * (count + 1)) {
            throw new Error("区域太小无法容纳指定数量的点");
        }

        const points: Vec3[] = [];
        const minSq = minDistance * minDistance;

        // 计算扇形区域数量（根据点数动态调整）
        const sectorCount = Math.ceil(Math.sqrt(count * 2));
        const angleStep = (2 * Math.PI) / sectorCount;

        // 计算每个扇形区域应该生成的点数
        const pointsPerSector = Math.ceil(count / sectorCount);

        // 为每个扇形区域生成点
        for (let sector = 0; sector < sectorCount && points.length < count; sector++) {
            const sectorStartAngle = sector * angleStep;
            const sectorEndAngle = (sector + 1) * angleStep;

            // 在扇形区域内生成点
            for (let i = 0; i < pointsPerSector && points.length < count; i++) {
                let attempts = 0;
                let validPoint = false;

                while (!validPoint && attempts < maxAttempts) {
                    // 在扇形区域内随机生成角度
                    const angle = sectorStartAngle + (sectorEndAngle - sectorStartAngle) * Math.random();

                    // 使用平方根分布确保半径分布更均匀
                    const r = radius * Math.sqrt(Math.random());

                    // 添加随机抖动
                    const jitter = minDistance * 0.3;
                    const rJitter = (Math.random() - 0.5) * jitter;
                    const angleJitter = (Math.random() - 0.5) * (angleStep * 0.3);

                    // 计算最终位置
                    const finalAngle = angle + angleJitter;
                    const finalRadius = Math.max(0, Math.min(radius, r + rJitter));
                    const candidate = D3 ? v3(
                        center.x + finalRadius * Math.cos(finalAngle),
                        center.y,
                        center.z + finalRadius * Math.sin(finalAngle)
                    ) : v3(
                        center.x + finalRadius * Math.cos(finalAngle),
                        center.y + finalRadius * Math.sin(finalAngle),
                        center.z,
                    );

                    // 检查与现有点的间距
                    validPoint = true;
                    for (const p of points) {
                        let distanceSquared = 0;
                        const dx = p.x - candidate.x;
                        const dy = p.y - candidate.y;
                        const dz = p.z - candidate.z;
                        if (D3) {
                            distanceSquared = dx * dx + dy * dy + dz * dz;
                        } else {
                            distanceSquared = dx * dx + dz * dz;
                        }
                        if (distanceSquared < minSq) {
                            validPoint = false;
                            break;
                        }
                    }
                    if (validPoint) {
                        points.push(candidate);
                    }

                    attempts++;
                }
            }
        }
        if (points.length < count) {
            console.warn(`无法生成全部点位，成功生成 ${points.length}/${count}`);
        }
        return points;
    }
    /**
     * 在目标点周围随机生成一个位置，确保与目标点保持最小距离
     * @param targetPosition 目标位置
     * @param radius 最大半径
     * @param minDistance 最小距离阈值
     * @param maxAttempts 最大尝试次数
     * @param D3 是否是3d坐标
     * @returns 随机位置
     */
    static getRandomPositionAroundTarget(targetPosition: Vec3, radius: number = 20, minDistance: number = 5, maxAttempts: number = 10, D3: boolean = true): Vec3 {
        let attempts = 0;
        let position: Vec3;

        do {
            // 随机角度 (0-2π)
            const randomAngle = Math.random() * Math.PI * 2;

            // 随机半径 (minDistance-radius)，使用平方根使分布更均匀
            const randomRadius = minDistance + (radius - minDistance) * Math.sqrt(Math.random());

            // 计算偏移量
            const offsetX = randomRadius * Math.cos(randomAngle);
            const offsetY = randomRadius * Math.sin(randomAngle);
            if (D3) {
                // 创建新的位置向量
                position = v3(
                    targetPosition.x + offsetX,
                    targetPosition.y,
                    targetPosition.z + offsetY,
                );
            } else {

                // 创建新的位置向量
                position = v3(
                    targetPosition.x + offsetX,
                    targetPosition.y + offsetY,
                    targetPosition.z,
                );
            }

            attempts++;
        } while (attempts < maxAttempts);
        return position;
    }
    /**在ZX平面矩形范围内生成随机点
     * @param center 中心点
     * @param direction 方向向量（会被归一化）
     * @param XSize 宽度（垂直于方向向量的边）X轴方向
     * @param ZSize 高度（平行于方向向量的边）Z轴方向
     */
    static getRandomPointInRect(center: Vec3, direction: Vec3, XSize: number, ZSize: number): Vec3 {
        // 归一化方向向量
        const dir = v3(direction.x, 0, direction.z).normalize();

        // 计算垂直于方向向量的向量（逆时针旋转90度）
        const perpDir = v3(-dir.z, 0, dir.x);

        // 计算矩形的半宽和半高
        const halfXSize = XSize / 2;
        const halfZSize = ZSize / 2;

        // 在矩形范围内随机生成点
        const x = Math.random() * 2 - 1; // -1 到 1
        const z = Math.random() * 2 - 1; // -1 到 1

        // 计算最终位置
        const pos = v3(
            center.x + dir.x * (x * halfXSize) + perpDir.x * (z * halfZSize),
            center.y,
            center.z + dir.z * (x * halfXSize) + perpDir.z * (z * halfZSize)
        );
        return pos;
    }

    /**
     * 在xz矩形区域内生成多个近似均匀分布的点位
     * @param center 中心点
     * @param direction 方向向量（会被归一化）
     * @param width 宽度（垂直于方向向量的边） X轴方向
     * @param height 高度（平行于方向向量的边）Z轴方向
     * @param count 需要生成的点位数量
     * @returns 生成的点位数组
     */
    static getRandomPointsInRect(center: Vec3, direction: Vec3, width: number, height: number, count: number): Vec3[] {
        // 归一化方向向量
        const dir = v3(direction.x, 0, direction.z).normalize();
        // 计算垂直于方向向量的向量（逆时针旋转90度）
        const perpDir = v3(-dir.z, 0, dir.x);

        // 计算矩形的半宽和半高
        const halfWidth = width / 2;
        const halfHeight = height / 2;

        // 计算网格数量，确保网格数量接近实际需要的点数
        const aspectRatio = width / height;
        const gridCols = Math.ceil(Math.sqrt(count * aspectRatio));
        const gridRows = Math.ceil(count / gridCols);
        const points: Vec3[] = [];

        // 计算网格大小
        const gridWidth = width / gridCols;
        const gridHeight = height / gridRows;

        // 在网格中生成点
        for (let i = 0; i < gridCols; i++) {
            for (let j = 0; j < gridRows && points.length < count; j++) {
                // 计算网格中心点
                const gridCenterX = -halfWidth + (i + 0.5) * gridWidth;
                const gridCenterZ = -halfHeight + (j + 0.5) * gridHeight;

                // 添加随机扰动（网格大小的40%）
                const jitterX = (Math.random() - 0.5) * gridWidth * 0.4;
                const jitterZ = (Math.random() - 0.5) * gridHeight * 0.4;

                // 计算最终位置
                const pos = v3(
                    center.x + dir.x * (gridCenterZ + jitterZ) + perpDir.x * (gridCenterX + jitterX),
                    center.y,
                    center.z + dir.z * (gridCenterZ + jitterZ) + perpDir.z * (gridCenterX + jitterX)
                );

                points.push(pos);
            }
        }

        // 如果生成的点数超过需求，随机删除多余的点
        while (points.length > count) {
            const randomIndex = Math.floor(Math.random() * points.length);
            points.splice(randomIndex, 1);
        }

        return points;
    }


    /**
     * 优化Vec3精度，减少小数位数以提升性能
     * @param vec 要优化的向量
     * @param precision 保留的小数位数，默认2位
     * @returns 优化后的向量
     */
    static optimizeVec3Precision(vec: Vec3, precision: number = 2): Vec3 {
        const factor = Math.pow(10, precision);
        return v3(
            Math.round(vec.x * factor) / factor,
            Math.round(vec.y * factor) / factor,
            Math.round(vec.z * factor) / factor
        );
    }

    /**
     * 批量优化Vec3数组的精度
     * @param vectors Vec3数组
     * @param precision 保留的小数位数，默认2位
     */
    static optimizeVec3ArrayPrecision(vectors: Vec3[], precision: number = 2): void {
        const factor = Math.pow(10, precision);
        for (const vec of vectors) {
            vec.x = Math.round(vec.x * factor) / factor;
            vec.y = Math.round(vec.y * factor) / factor;
            vec.z = Math.round(vec.z * factor) / factor;
        }
    }

    /**
     * 绕 Y 轴在水平面内偏转方向，与 Hero.rotateDirectionY、Bullet 的 yaw 约定一致：yaw = atan2(x, z)（前向为 +Z）。
     */
    static rotateDirectionY(direction: Readonly<Vec3>, angleDegrees: number, out: Vec3 = v3()): Vec3 {
        const angleRad = angleDegrees * Math.PI / 180;
        const xzLenSqr = direction.x * direction.x + direction.z * direction.z;
        if (xzLenSqr < 1e-16) {
            out.set(direction);
            return out;
        }
        const xzLen = Math.sqrt(xzLenSqr);
        const yawRad = Math.atan2(direction.x, direction.z) + angleRad;
        out.x = xzLen * Math.sin(yawRad);
        out.y = direction.y;
        out.z = xzLen * Math.cos(yawRad);
        return out;
    }

    /**
     * 在水平面内生成 count 个互不“重叠”的随机朝向角（度）：
     * 任意两角在圆上的最短弧长 ≥ minSeparationDeg。实现为按步长划分离散槽位后无放回随机并整体随机旋转，保证可分布。
     * @param count 方向个数，超过 floor(360/minSeparationDeg) 时会被截断
     * @param minSeparationDeg 最小圆心角（度），默认 5
     */
    static randomDistinctHorizonYawAnglesDeg(count: number, minSeparationDeg: number = 5): number[] {
        const maxSlots = Math.floor(360 / minSeparationDeg);
        const n = Math.min(count, maxSlots);
        const pool: number[] = [];
        for (let i = 0; i < maxSlots; i++) {
            pool.push(i * minSeparationDeg);
        }
        for (let i = pool.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            const t = pool[i]!;
            pool[i] = pool[j]!;
            pool[j] = t;
        }
        const offset = Math.random() * 360;
        const out: number[] = [];
        for (let k = 0; k < n; k++) {
            out.push((pool[k]! + offset) % 360);
        }
        return out;
    }
}

