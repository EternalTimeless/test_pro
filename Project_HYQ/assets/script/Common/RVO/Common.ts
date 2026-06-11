import { Vec2 } from "cc";

/**
 * 自定义的二维向量类，封装了常见的向量操作方法。
 */
export class Vector2 {
    /**
     * 向量的 x 分量，初始值为 0。
     */
    x = 0;
    /**
     * 向量的 y 分量，初始值为 0。
     */
    y = 0;

    /**
     * 构造一个新的二维向量实例。
     * @param x - 向量的 x 分量。
     * @param y - 向量的 y 分量。
     */
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    /**
     * 将当前向量与另一个向量相加，返回一个新的向量。
     * @param vector - 要相加的向量。
     * @returns 相加后的新向量。
     */
    plus(vector: Vector2) {
        return new Vector2(this.x + vector.x, this.y + vector.y);
    }

    /**
     * 将当前向量减去另一个向量，返回一个新的向量。
     * @param vector - 要减去的向量。
     * @returns 相减后的新向量。
     */
    minus(vector: Vector2) {
        return new Vector2(this.x - vector.x, this.y - vector.y);
    }

    /**
     * 计算当前向量与另一个向量的点积。
     * @param vector - 用于计算点积的向量。
     * @returns 两个向量的点积结果。
     */
    multiply(vector: Vector2) {
        return this.x * vector.x + this.y * vector.y;
    }

    /**
     * 将当前向量乘以一个标量，返回一个新的向量。
     * @param k - 要乘的标量。
     * @returns 缩放后的新向量。
     */
    scale(k: number) {
        return new Vector2(this.x * k, this.y * k);
    }

    /**
     * 将当前向量的值设置为另一个向量（Vector2 或 Vec2）的值。
     * @param v - 要复制值的向量。
     * @returns 当前向量实例，便于链式调用。
     */
    copy(v: Vector2 | Vec2) {
        this.x = v.x;
        this.y = v.y;
        return this;
    }

    /**
     * 创建当前向量的一个副本。
     * @returns 一个新的向量，其值与当前向量相同。
     */
    clone() {
        return new Vector2(this.x, this.y);
    }

    /**
     * 从一个向量中减去另一个向量，并更新该向量的值。
     * @param out - 要进行减法操作的向量。
     * @param other - 要减去的向量。
     * @returns 经过减法操作后的向量。
     */
    substract(out: Vector2, other: Vector2) {
        out.x -= other.x;
        out.y -= other.y;
        return out;
    }

    /**
     * 计算当前向量长度的平方。
     * @returns 向量长度的平方。
     */
    lengthSqr() {
        return this.x ** 2 + this.y ** 2;
    }
}

/**
 * 表示障碍物的类，包含障碍物的相关属性。
 */
export class Obstacle {
    /**
     * 指向下一个障碍物的引用，用于构建障碍物链。
     */
    next: Obstacle;
    /**
     * 指向前一个障碍物的引用，用于构建障碍物链。
     */
    previous: Obstacle;
    /**
     * 障碍物的方向向量。
     */
    direction: Vector2;
    /**
     * 障碍物上的一个点，用于表示障碍物的位置。
     */
    point: Vector2;
    /**
     * 障碍物的唯一标识符。
     */
    id: number;
    /**
     * 表示障碍物是否为凸多边形的标志。
     */
    convex: boolean;

    /**
     * 代理的标签，可以用来区分所属，或后续做不同的检测处理
     */
    tag: string = '';

    private static _id = 0;
    constructor() {
        this.id = Obstacle._id++;
    }
}

/**
 * 表示一条直线的类，通过一个点和一个方向向量定义。
 */
export class Line {
    /**
     * 直线上的一个点。
     */
    point: Vector2;
    /**
     * 直线的方向向量。
     */
    direction: Vector2;
}

/**
 * 表示键值对的泛型类，用于存储一对键和值。
 * @template K - 键的类型。
 * @template V - 值的类型。
 */
export class KeyValuePair<K, V> {
    /**
     * 键值对中的键。
     */
    key: K;
    /**
     * 键值对中的值。
     */
    value: V;
    /**
     * 构造一个新的键值对实例。
     * @param key - 键值对中的键。
     * @param value - 键值对中的值。
     */
    constructor(key: K, value: V) {
        this.key = key;
        this.value = value;
    }
}

// 增强RVOMath类中的数值稳定性
export class RVOMath {
    /**
     * 用于数值比较的极小值，避免浮点数误差。
     */
    static RVO_EPSILON = 0.00001;

    /**
     * 计算向量的平方长度。
     * @param v - 输入的向量。
     * @returns 向量的平方长度。
     */
    static absSq(v: Vector2) {
        return v.multiply(v);
    };

    /**
     * 将向量归一化，使其长度为 1。
     * @param v - 输入的向量。
     * @returns 归一化后的向量。
     */
    static normalize(v: Vector2) {
        let len = RVOMath.abs(v);
        if (len < RVOMath.RVO_EPSILON) {
            return new Vector2(0, 0);
        }
        return v.scale(1 / len);
    };

    /**
     * 计算点到线段的平方距离。
     * @param vector1 - 线段的起点。
     * @param vector2 - 线段的终点。
     * @param vector3 - 要计算距离的点。
     * @returns 点到线段的平方距离。
     */
    static distSqPointLineSegment(vector1: Vector2, vector2: Vector2, vector3: Vector2) {
        let aux1 = vector3.minus(vector1);
        let aux2 = vector2.minus(vector1);

        let r = aux1.multiply(aux2) / RVOMath.absSq(aux2);

        if (r < -RVOMath.RVO_EPSILON) {
            return RVOMath.absSq(aux1);
        }
        else if (r > 1.0 + RVOMath.RVO_EPSILON) {
            return RVOMath.absSq(vector3.minus(vector2));
        }
        else {
            return RVOMath.absSq(vector3.minus(vector1.plus(aux2.scale(r))));
        }
    };

    /**
     * 计算一个数的平方。
     * @param p - 输入的数。
     * @returns 输入数的平方。
     */
    static sqr(p: number) {
        return p * p;
    };

    /**
     * 计算两个向量的行列式。
     * @param v1 - 第一个向量。
     * @param v2 - 第二个向量。
     * @returns 两个向量的行列式值。
     */
    static det(v1: Vector2, v2: Vector2) {
        return v1.x * v2.y - v1.y * v2.x;
    };

    /**
     * 计算向量的长度。
     * @param v - 输入的向量。
     * @returns 向量的长度。
     */
    static abs(v: Vector2) {
        return Math.sqrt(RVOMath.absSq(v));
    };

    /**
     * 判断点 c 是否在由点 a 和点 b 构成的直线的左侧。
     * @param a - 直线上的第一个点。
     * @param b - 直线上的第二个点。
     * @param c - 要判断的点。
     * @returns 如果点 c 在直线左侧，则返回正值；如果在直线上，则返回 0；如果在直线右侧，则返回负值。
     */
    static leftOf(a: Vector2, b: Vector2, c: Vector2) {
        return RVOMath.det(a.minus(c), b.minus(a));
    };
}
/**
 * 表示一个包含两个浮点数的配对类，用于比较操作。
 */
export class FloatPair {
    /**
     * 第一个浮点数
     */
    a: number;
    /**
     * 第二个浮点数
     */
    b: number;
    /**
     * 构造一个新的 FloatPair 实例。
     * @param a - 第一个浮点数
     * @param b - 第二个浮点数
     */
    constructor(a: number, b: number) {
        this.a = a;
        this.b = b;
    }

    /**
     * 检查当前 FloatPair 是否小于另一个 FloatPair。
     * @param rhs - 要比较的另一个 FloatPair
     * @returns 如果当前 FloatPair 小于另一个，则返回 true；否则返回 false。
     */
    lessThan(rhs: FloatPair) {
        return this.a < rhs.a || !(rhs.a < this.a) && this.b < rhs.b;
    }

    /**
     * 检查当前 FloatPair 是否小于或等于另一个 FloatPair。
     * @param rhs - 要比较的另一个 FloatPair
     * @returns 如果当前 FloatPair 小于或等于另一个，则返回 true；否则返回 false。
     */
    lessEqualThan(rhs: FloatPair) {
        return (this.a == rhs.a && this.b == rhs.b) || this.lessThan(rhs);
    }

    /**
     * 检查当前 FloatPair 是否大于另一个 FloatPair。
     * @param rhs - 要比较的另一个 FloatPair
     * @returns 如果当前 FloatPair 大于另一个，则返回 true；否则返回 false。
     */
    bigThan(rhs: FloatPair) {
        return !this.lessEqualThan(rhs);
    }

    /**
     * 检查当前 FloatPair 是否大于或等于另一个 FloatPair。
     * @param rhs - 要比较的另一个 FloatPair
     * @returns 如果当前 FloatPair 大于或等于另一个，则返回 true；否则返回 false。
     */
    bigEqualThan(rhs: FloatPair) {
        return !this.lessThan(rhs);
    }
}

/**
 * 表示代理 k-D 树中的一个节点。
 */
export class AgentTreeNode {
    /**
     * 代理数组的起始索引
     */
    begin: number;
    /**
     * 代理数组的结束索引
     */
    end: number;
    /**
     * 左子节点的索引
     */
    left: number;
    /**
     * 右子节点的索引
     */
    right: number;
    /**
     * 该节点所包含代理的最大 x 坐标
     */
    maxX: number;
    /**
     * 该节点所包含代理的最大 y 坐标
     */
    maxY: number;
    /**
     * 该节点所包含代理的最小 x 坐标
     */
    minX: number;
    /**
     * 该节点所包含代理的最小 y 坐标
     */
    minY: number;
}

/**
 * 表示障碍物 k-D 树中的一个节点。
 */
export class ObstacleTreeNode {
    /**
     * 该节点所关联的障碍物
     */
    obstacle: Obstacle;
    /**
     * 左子节点
     */
    left: ObstacleTreeNode;
    /**
     * 右子节点
     */
    right: ObstacleTreeNode;
}