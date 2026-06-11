import { RVOMath, Obstacle, Vector2 } from "./Common";
import { Simulator } from "./Simulator";
import { Agent } from "./Agent";

/**
 * 表示一个包含两个浮点数的配对类，用于比较操作。
 */
class FloatPair {
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
class AgentTreeNode {
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
class ObstacleTreeNode {
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

/**
 * 实现用于基于 RVO（Reciprocal Velocity Obstacles）算法的 k-D 树类。
 * 该类用于高效地构建和查询代理和障碍物的邻居信息。
 */
export class KdTree {
    /**
     * 代理 k-D 树叶节点的最大大小。
     */
    MAX_LEAF_SIZE = 10;
    /**
     * 代理数组
     */
    agents: Agent[] = null;
    /**
     * 代理 k-D 树节点数组
     */
    agentTree: AgentTreeNode[] = [];
    /**
     * 障碍物 k-D 树的根节点
     */
    obstacleTree: ObstacleTreeNode = null;

    /**
     * 构建代理的 k-D 树。
     * 如果代理数组未初始化或长度不等于指定的代理数量，则重新初始化代理数组和代理树。
     * 如果代理数组不为空，则递归构建代理树。
     * @param agentNum - 代理的数量
     */
    buildAgentTree(agentNum: number) {
        if (!this.agents || this.agents.length != agentNum) {
            // 初始化代理数组
            this.agents = new Array<Agent>(agentNum);
            for(let i = 0; i < this.agents.length; i++) {
                this.agents[i] = Simulator.instance.getAgent(i);
            }
            
            // 初始化代理树数组
            this.agentTree = new Array<AgentTreeNode>(2 * this.agents.length);
            for (let i = 0; i < this.agentTree.length; i++) {
                this.agentTree[i] = new AgentTreeNode();
            }
        }
        
        if (this.agents.length != 0) {
            // 递归构建代理树
            this.buildAgentTreeRecursive(0, this.agents.length, 0);
        }
    }
    
    /**
     * 构建障碍物的 k-D 树。
     * 初始化障碍物树的根节点，并递归构建障碍物树。
     */
    buildObstacleTree() {
        this.obstacleTree = new ObstacleTreeNode();
        let obstacles = new Array<Obstacle>(Simulator.instance.obstacles.length);
        for(let i = 0; i < obstacles.length; i++) {
            obstacles[i] = Simulator.instance.obstacles[i];
        }
        this.obstacleTree = this.buildObstacleTreeRecursive(obstacles);
    }
    
    /**
     * 计算指定代理的邻居代理，并返回更新后的搜索范围平方。
     * @param agent - 要计算邻居的代理
     * @param rangeSq - 搜索范围的平方
     * @returns 更新后的搜索范围平方
     */
    computeAgentNeighbors(agent: Agent, rangeSq: number) {
        return this.queryAgentTreeRecursive(agent, rangeSq, 0);
    }
    
    /**
     * 计算指定代理的邻居障碍物。
     * @param agent - 要计算邻居的代理
     * @param rangeSq - 搜索范围的平方
     */
    computeObstacleNeighbors(agent: Agent, rangeSq: number) {
        this.queryObstacleTreeRecursive(agent, rangeSq, this.obstacleTree);
    }
    
    /**
     * 查询两个点之间是否可见，考虑给定的半径。
     * @param q1 - 第一个点
     * @param q2 - 第二个点
     * @param radius - 半径
     * @returns 如果两点之间可见，则返回 true；否则返回 false。
     */
    queryVisibility (q1: Vector2, q2: Vector2, radius: number) {
        return this.queryVisibilityRecursive(q1, q2, radius, this.obstacleTree);
    }
    
    /**
     * 递归构建代理的 k-D 树。
     * @param begin - 代理数组的起始索引
     * @param end - 代理数组的结束索引
     * @param node - 当前节点的索引
     */
    buildAgentTreeRecursive(begin: number, end: number, node: number) {
        // 设置当前节点的起始和结束索引
        this.agentTree[node].begin = begin;
        this.agentTree[node].end = end;
        // 初始化当前节点的边界框
        this.agentTree[node].minX = this.agentTree[node].maxX = this.agents[begin].position_.x;
        this.agentTree[node].minY = this.agentTree[node].maxY = this.agents[begin].position_.y;
        
        // 更新当前节点的边界框
        for (let i = begin + 1; i < end; ++i) {
            this.agentTree[node].maxX = Math.max(this.agentTree[node].maxX, this.agents[i].position_.x);
            this.agentTree[node].minX = Math.min(this.agentTree[node].minX, this.agents[i].position_.x);
            this.agentTree[node].maxY = Math.max(this.agentTree[node].maxY, this.agents[i].position_.y);
            this.agentTree[node].minY = Math.min(this.agentTree[node].minY, this.agents[i].position_.y);
        }
        
        if (end - begin > this.MAX_LEAF_SIZE) {
            // 非叶节点，需要分割
            // 判断是否按垂直方向分割
            let isVertical = (this.agentTree[node].maxX - this.agentTree[node].minX) > (this.agentTree[node].maxY - this.agentTree[node].minY);
            // 计算分割值
            let splitValue = 0.5 * (isVertical ? this.agentTree[node].maxX + this.agentTree[node].minX : this.agentTree[node].maxY + this.agentTree[node].minY);
            
            let left = begin;
            let right = end;
            
            // 分区操作
            while (left < right) {
                while (left < right && (isVertical ? this.agents[left].position_.x : this.agents[left].position_.y) < splitValue) {
                    ++left;
                }

                while (right > left && (isVertical ? this.agents[right - 1].position_.x : this.agents[right - 1].position_.y) >= splitValue) {
                    --right;
                }

                if (left < right) {
                    let tmp = this.agents[left];
                    this.agents[left] = this.agents[right - 1];
                    this.agents[right - 1] = tmp;
                    ++left;
                    --right;
                }
            }
            
            let leftSize = left - begin;
            if (leftSize == 0) {
                ++leftSize;
                ++left;
                ++right;
            }
            
            // 设置当前节点的左右子节点索引
            this.agentTree[node].left = node + 1;
            this.agentTree[node].right = node + 2 * leftSize;

            // 递归构建左右子树
            this.buildAgentTreeRecursive(begin, left, this.agentTree[node].left);
            this.buildAgentTreeRecursive(left, end, this.agentTree[node].right);
        }
    }

    /**
     * 递归构建障碍物的 k-D 树。
     * @param obstacles - 障碍物数组
     * @returns 障碍物树的根节点
     */
    buildObstacleTreeRecursive(obstacles: Obstacle[]) {
        if (obstacles.length == 0) {
            return null;
        } 
        else {
            let node = new ObstacleTreeNode();
            let optimalSplit = 0;
            let minLeft = obstacles.length;
            let minRight = minLeft;
            
            // 寻找最优分割障碍物
            for (let i = 0; i < obstacles.length; ++i) {
                let leftSize = 0;
                let rightSize = 0;
                
                let obstacleI1 = obstacles[i];
                let obstacleI2 = obstacleI1.next;
                
                for (let j = 0; j < obstacles.length; j++) {
                    if (i == j) {
                        continue;
                    }
                    
                    let obstacleJ1 = obstacles[j];
                    let obstacleJ2 = obstacleJ1.next;
                    
                    // 判断障碍物 j 的两个端点相对于障碍物 i 的位置
                    let j1LeftOfI = RVOMath.leftOf(obstacleI1.point, obstacleI2.point, obstacleJ1.point);
                    let j2LeftOfI = RVOMath.leftOf(obstacleI1.point, obstacleI2.point, obstacleJ2.point);
                    
                    if (j1LeftOfI >= -RVOMath.RVO_EPSILON && j2LeftOfI >= -RVOMath.RVO_EPSILON) {
                        ++leftSize;
                    }
                    else if (j1LeftOfI <= RVOMath.RVO_EPSILON && j2LeftOfI <= RVOMath.RVO_EPSILON) {
                        ++rightSize;
                    }
                    else {
                        ++leftSize;
                        ++rightSize;
                    }
                    
                    let fp1 = new FloatPair(Math.max(leftSize, rightSize), Math.min(leftSize, rightSize));
                    let fp2 = new FloatPair(Math.max(minLeft, minRight), Math.min(minLeft, minRight));
                    
                    if (fp1.bigEqualThan(fp2)) {
                        break;
                    }
                }
                
                let fp1 = new FloatPair(Math.max(leftSize, rightSize), Math.min(leftSize, rightSize));
                let fp2 = new FloatPair(Math.max(minLeft, minRight), Math.min(minLeft, minRight));
                
                if (fp1.lessThan(fp2)) {
                    minLeft = leftSize;
                    minRight = rightSize;
                    optimalSplit = i;
                }
            }
            
            {
                /* 构建分割节点。 */
                let leftObstacles: Obstacle[] = [];
                for (let n = 0; n < minLeft; ++n) leftObstacles.push(null);
                
                let rightObstacles: Obstacle[] = [];
                for (let n = 0; n < minRight; ++n) rightObstacles.push(null);

                let leftCounter = 0;
                let rightCounter = 0;
                let i = optimalSplit;

                let obstacleI1 = obstacles[i];
                let obstacleI2 = obstacleI1.next;

                // 划分障碍物到左右子树
                for (let j = 0; j < obstacles.length; ++j) {
                    if (i == j) {
                        continue;
                    }

                    let obstacleJ1 = obstacles[j];
                    let obstacleJ2 = obstacleJ1.next;

                    let j1LeftOfI = RVOMath.leftOf(obstacleI1.point, obstacleI2.point, obstacleJ1.point);
                    let j2LeftOfI = RVOMath.leftOf(obstacleI1.point, obstacleI2.point, obstacleJ2.point);

                    if (j1LeftOfI >= -RVOMath.RVO_EPSILON && j2LeftOfI >= -RVOMath.RVO_EPSILON) {
                        leftObstacles[leftCounter++] = obstacles[j];
                    }
                    else if (j1LeftOfI <= RVOMath.RVO_EPSILON && j2LeftOfI <= RVOMath.RVO_EPSILON) {
                        rightObstacles[rightCounter++] = obstacles[j];
                    }
                    else {
                        /* 分割障碍物 j。 */
                        let t = RVOMath.det(obstacleI2.point.minus(obstacleI1.point), obstacleJ1.point.minus(obstacleI1.point)) / 
                            RVOMath.det(obstacleI2.point.minus(obstacleI1.point), obstacleJ1.point.minus(obstacleJ2.point));

                        let splitpoint = obstacleJ1.point.plus( (obstacleJ2.point.minus(obstacleJ1.point)).scale(t) );

                        let newObstacle = new Obstacle();
                        newObstacle.point = splitpoint;
                        newObstacle.previous = obstacleJ1;
                        newObstacle.next = obstacleJ2;
                        newObstacle.convex = true;
                        newObstacle.direction = obstacleJ1.direction;

                        Simulator.instance.obstacles.push(newObstacle);

                        obstacleJ1.next = newObstacle;
                        obstacleJ2.previous = newObstacle;

                        if (j1LeftOfI > 0.0) {
                            leftObstacles[leftCounter++] = obstacleJ1;
                            rightObstacles[rightCounter++] = newObstacle;
                        }
                        else {
                            rightObstacles[rightCounter++] = obstacleJ1;
                            leftObstacles[leftCounter++] = newObstacle;
                        }
                    }
                }

                node.obstacle = obstacleI1;
                // 递归构建左右子树
                node.left = this.buildObstacleTreeRecursive(leftObstacles);
                node.right = this.buildObstacleTreeRecursive(rightObstacles);
                return node;
            }
        }
    }

    /**
     * 递归查询代理的邻居代理，并返回更新后的搜索范围平方。
     * @param agent - 要查询邻居的代理
     * @param rangeSq - 搜索范围的平方
     * @param node - 当前节点的索引
     * @returns 更新后的搜索范围平方
     */
    queryAgentTreeRecursive(agent: Agent, rangeSq: number, node: number) {
        if (this.agentTree[node].end - this.agentTree[node].begin <= this.MAX_LEAF_SIZE) {
            // 叶节点，遍历所有代理并插入邻居
            for (let i = this.agentTree[node].begin; i < this.agentTree[node].end; ++i) {
                rangeSq = agent.insertAgentNeighbor(this.agents[i], rangeSq);
            }
        }
        else {
            // 计算左右子树到代理的距离平方
            let distSqLeft = RVOMath.sqr(Math.max(0, this.agentTree[this.agentTree[node].left].minX - agent.position_.x)) + 
                RVOMath.sqr(Math.max(0, agent.position_.x - this.agentTree[this.agentTree[node].left].maxX)) + 
                RVOMath.sqr(Math.max(0, this.agentTree[this.agentTree[node].left].minY - agent.position_.y)) + 
                RVOMath.sqr(Math.max(0, agent.position_.y - this.agentTree[this.agentTree[node].left].maxY));

            let distSqRight = RVOMath.sqr(Math.max(0, this.agentTree[this.agentTree[node].right].minX - agent.position_.x)) +
                RVOMath.sqr(Math.max(0, agent.position_.x - this.agentTree[this.agentTree[node].right].maxX)) +
                RVOMath.sqr(Math.max(0, this.agentTree[this.agentTree[node].right].minY - agent.position_.y)) +
                RVOMath.sqr(Math.max(0, agent.position_.y - this.agentTree[this.agentTree[node].right].maxY));

            if (distSqLeft < distSqRight) {
                if (distSqLeft < rangeSq) {
                    // 递归查询左子树
                    rangeSq = this.queryAgentTreeRecursive(agent, rangeSq, this.agentTree[node].left);

                    if (distSqRight < rangeSq) {
                        // 递归查询右子树
                        rangeSq = this.queryAgentTreeRecursive(agent, rangeSq, this.agentTree[node].right);
                    }
                }
            }
            else {
                if (distSqRight < rangeSq) {
                    // 递归查询右子树
                    rangeSq = this.queryAgentTreeRecursive(agent, rangeSq, this.agentTree[node].right);

                    if (distSqLeft < rangeSq) {
                        // 递归查询左子树
                        rangeSq = this.queryAgentTreeRecursive(agent, rangeSq, this.agentTree[node].left);
                    }
                }
            }

        }
        return rangeSq;
    }

    /**
     * 递归查询代理的邻居障碍物，并返回更新后的搜索范围平方。
     * @param agent - 要查询邻居的代理
     * @param rangeSq - 搜索范围的平方
     * @param node - 当前障碍物树节点
     * @returns 更新后的搜索范围平方
     */
    queryObstacleTreeRecursive(agent: Agent, rangeSq: number, node: ObstacleTreeNode) {
        if (node == null) {
            return rangeSq;
        }
        else {
            let obstacle1 = node.obstacle;
            let obstacle2 = obstacle1.next;

            // 判断代理相对于障碍物的位置
            let agentLeftOfLine = RVOMath.leftOf(obstacle1.point, obstacle2.point, agent.position_);

            // 递归查询左或右子树
            rangeSq = this.queryObstacleTreeRecursive(agent, rangeSq, (agentLeftOfLine >= 0 ? node.left : node.right));

            // 计算代理到障碍物所在直线的距离平方
            let distSqLine = RVOMath.sqr(agentLeftOfLine) / RVOMath.absSq(obstacle2.point.minus(obstacle1.point));

            if (distSqLine < rangeSq)
            {
                if (agentLeftOfLine < 0)
                {
                    /*
                     * 仅当代理在障碍物右侧（且能看到障碍物）时，尝试插入该障碍物为邻居。
                     */
                    agent.insertObstacleNeighbor(node.obstacle, rangeSq);
                }

                /* 尝试查询另一侧的子树。 */
                this.queryObstacleTreeRecursive(agent, rangeSq, (agentLeftOfLine >= 0 ? node.right : node.left));
            }
            return rangeSq;
        }
    }

    /**
     * 递归查询两个点之间是否可见，考虑给定的半径。
     * @param q1 - 第一个点
     * @param q2 - 第二个点
     * @param radius - 半径
     * @param node - 当前障碍物树节点
     * @returns 如果两点之间可见，则返回 true；否则返回 false。
     */
    queryVisibilityRecursive(q1: Vector2, q2: Vector2, radius: number, node: ObstacleTreeNode) {
        if (node == null) {
            return true;
        }
        else {
            let obstacle1 = node.obstacle;
            let obstacle2 = obstacle1.next;

            // 判断 q1 和 q2 相对于障碍物的位置
            let q1LeftOfI = RVOMath.leftOf(obstacle1.point, obstacle2.point, q1);
            let q2LeftOfI = RVOMath.leftOf(obstacle1.point, obstacle2.point, q2);
            let invLengthI = 1.0 / RVOMath.absSq(obstacle2.point.minus(obstacle1.point));

            if (q1LeftOfI >= 0 && q2LeftOfI >= 0)
            {
                return this.queryVisibilityRecursive(q1, q2, radius, node.left) && ((RVOMath.sqr(q1LeftOfI) * invLengthI >= RVOMath.sqr(radius) && RVOMath.sqr(q2LeftOfI) * invLengthI >= RVOMath.sqr(radius)) || this.queryVisibilityRecursive(q1, q2, radius, node.right));
            }
            else if (q1LeftOfI <= 0 && q2LeftOfI <= 0)
            {
                return this.queryVisibilityRecursive(q1, q2, radius, node.right) && ((RVOMath.sqr(q1LeftOfI) * invLengthI >= RVOMath.sqr(radius) && RVOMath.sqr(q2LeftOfI) * invLengthI >= RVOMath.sqr(radius)) || this.queryVisibilityRecursive(q1, q2, radius, node.left));
            }
            else if (q1LeftOfI >= 0 && q2LeftOfI <= 0)
            {
                /* 从左到右可以穿过障碍物看到。 */
                return this.queryVisibilityRecursive(q1, q2, radius, node.left) && this.queryVisibilityRecursive(q1, q2, radius, node.right);
            }
            else
            {
                let point1LeftOfQ = RVOMath.leftOf(q1, q2, obstacle1.point);
                let point2LeftOfQ = RVOMath.leftOf(q1, q2, obstacle2.point);
                let invLengthQ = 1.0 / RVOMath.absSq(q2.minus(q1));

                return (point1LeftOfQ * point2LeftOfQ >= 0 && RVOMath.sqr(point1LeftOfQ) * invLengthQ > RVOMath.sqr(radius) && RVOMath.sqr(point2LeftOfQ) * invLengthQ > RVOMath.sqr(radius) && this.queryVisibilityRecursive(q1, q2, radius, node.left) && this.queryVisibilityRecursive(q1, q2, radius, node.right));
            }
        }
    }
}        