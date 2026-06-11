import { Vec2 } from "cc";
import { Agent } from "./Agent";
import { Obstacle, RVOMath, Vector2, AgentTreeNode, ObstacleTreeNode, FloatPair } from "./Common";

/**
 * 模拟器类，用于管理动态避障系统中的代理、障碍物，并执行模拟运行
 */
export class Simulator {
    /**
     * 下一个可用的代理 ID
     */
    private agentId: number = 0;
    /**
     * 存储所有代理 ID 的列表
     */
    private agentIdLst: number[] = [];
    /**
     * 代理 ID 到代理对象的映射
     */
    aid2agent: { [key: string]: Agent } = Object.create(null);

    /**
     * 存储所有障碍物的列表
     */
    obstacles: Obstacle[] = [];
    /**
     * 用于构建和查询代理与障碍物的 k-d 树
     */
    kdTree: KdTree = new KdTree();

    /**
     * 默认代理对象，用于创建新代理时提供默认值
     */
    defaultAgent: Agent;
    /**
     * 模拟的全局时间
     */
    time: number = 0.0;

    /**
     * 模拟器的单例实例
     */
    private static _inst: Simulator;
    /**
     * 获取模拟器的单例实例
     * @returns 模拟器的单例实例
     */
    static get instance(): Simulator {
        if (!Simulator._inst) {
            Simulator._inst = new Simulator();
        }
        return Simulator._inst;
    }

    /**
     * 根据索引获取代理对象
     * @param idx 代理在 agentIdLst 中的索引
     * @returns 对应的代理对象
     */
    getAgent(idx: number) {
        return this.aid2agent[this.agentIdLst[idx]];
    }

    /**
     * 根据代理 ID 获取代理对象
     * @param aid 代理的 ID
     * @returns 对应的代理对象
     */
    getAgentByAid(aid: number) {
        return this.aid2agent[aid];
    }

    /**
     * 获取模拟的全局时间
     * @returns 模拟的全局时间
     */
    getGlobalTime() {
        return this.time;
    };

    /**
     * 获取当前代理的数量
     * @returns 当前代理的数量
     */
    getNumAgents() {
        // console.log("getNumAgents ::", this.agentIdLst.length, this.agentIdLst)
        return this.agentIdLst.length;
    };

    /**
     * 根据索引获取代理的 ID
     * @param idx 代理在 agentIdLst 中的索引
     * @returns 对应的代理 ID
     */
    getAgentAidByIdx(idx: number) {
        return this.agentIdLst[idx]
    }

    /**
     * 设置指定代理的首选速度
     * @param aid 代理的 ID
     * @param velocity 首选速度向量
     */
    setAgentPrefVelocity(aid: number, velocity: Vector2 | Vec2) {
        this.aid2agent[aid].prefVelocity_.copy(velocity);
    }

    /**
     * 获取指定代理的位置
     * @param aid 代理的 ID
     * @returns 代理的位置向量，如果代理不存在则返回 null
     */
    getAgentPosition(aid: number) {
        if (this.aid2agent[aid]) {//为什么移除了 还会进入这个aid的检测
            return this.aid2agent[aid].position_;
        }
        return null
    }

    /**
     * 获取指定代理的首选速度
     * @param aid 代理的 ID
     * @returns 代理的首选速度向量
     */
    getAgentPrefVelocity(aid: number) {
        return this.aid2agent[aid].prefVelocity_;
    }

    /**
     * 获取指定代理的速度
     * @param aid 代理的 ID
     * @returns 代理的速度向量
     */
    getAgentVelocity(aid: number) {
        return this.aid2agent[aid].velocity_;
    }

    /**
     * 获取指定代理的半径
     * @param aid 代理的 ID
     * @returns 代理的半径
     */
    getAgentRadius(aid: number) {
        return this.aid2agent[aid].radius_;
    }

    /**
     * 获取指定代理的 ORCA 线
     * @param aid 代理的 ID
     * @returns 代理的 ORCA 线数组
     */
    getAgentOrcaLines(aid: number) {
        return this.aid2agent[aid].orcaLines_;
    }

    /**
     * 添加动态避障管理对象
     * @param position 初始位置
     * @param radius  检测半径
     * @param maxSpeed  最大速度
     * @param velocity 初始线速度(向量)
     * @param mass 转向质量
     * @returns 新添加代理的 ID
     */
    addAgent(position: Vector2 | Vec2, radius: number = null, maxSpeed: number = null, tag: string = null,
        velocity: Vector2 = null, mass: number = null) {
        if (!this.defaultAgent) {
            throw new Error("no default agent");
        }

        if (this.defaultAgent.neighborDist < radius) {
            console.warn("addAgent neighborDist < radius?, neighborDist will be set to radius");
            this.defaultAgent.neighborDist = radius;
        }

        let agent = new Agent();

        agent.position_.copy(position);
        agent.maxNeighbors_ = this.defaultAgent.maxNeighbors_;
        agent.maxSpeed_ = maxSpeed || this.defaultAgent.maxSpeed_;
        agent.neighborDist = this.defaultAgent.neighborDist;
        agent.radius_ = radius || this.defaultAgent.radius_;
        agent.timeHorizon = this.defaultAgent.timeHorizon;
        agent.timeHorizonObst = this.defaultAgent.timeHorizonObst;
        agent.velocity_.copy(velocity || this.defaultAgent.velocity_);
        agent.tag = tag;

        agent.id = this.agentId++;

        if (mass && mass >= 0) {
            agent.mass = mass
        }
        this.aid2agent[agent.id] = agent;
        this.agentIdLst.push(agent.id);

        return agent.id;
    }

    /**
     * 移除指定 ID 的代理
     * @param aid 要移除的代理的 ID
     */
    removeAgent(aid: number) {
        if (this.hasAgent(aid)) {
            let idx = this.agentIdLst.indexOf(aid);
            if (idx >= 0) {
                // this.agentIdLst.splice(idx, 1) //用高效伪移除
                this.agentIdLst[idx] = this.agentIdLst[this.agentIdLst.length - 1];
                this.agentIdLst.length--;
            }
            delete this.aid2agent[aid];
        }
    }

    /**
     * 检查指定 ID 的代理是否存在
     * @param aid 代理的 ID
     * @returns 如果代理存在则返回 true，否则返回 false
     */
    hasAgent(aid: number) {
        return !!this.aid2agent[aid];
    }

    /**
     * 设置指定代理的质量
     * @param agentNo 代理的 ID
     * @param mass 代理的质量
     */
    setAgentMass(agentNo: number, mass: number) {
        this.aid2agent[agentNo].mass = mass;
    }

    /**
     * 获取指定代理的质量
     * @param agentNo 代理的 ID
     * @returns 代理的质量
     */
    getAgentMass(agentNo: number) {
        return this.aid2agent[agentNo].mass;
    }

    /**
     * 设置指定代理的半径
     * @param agentNo 代理的 ID
     * @param radius 代理的半径
     */
    setAgentRadius(agentNo: number, radius: number) {
        this.aid2agent[agentNo].radius_ = radius;
    }

    /**
     * 设置默认代理的参数
     * @param neighborDist 在寻找周围邻居的搜索距离，这个值设置过大，会让小球在很远距离时做出避障行为
     * @param maxNeighbors 寻找周围邻居的最大数目，这个值设置越大，最终计算的速度越精确，但会增大计算量
     * @param timeHorizon 代表计算动态的物体时的时间窗口
     * @param timeHorizonObst 代表计算静态的物体时的时间窗口，比如在RTS游戏中，小兵向城墙移动时，没必要做出避障，这个值需要 设置得很小
     * @param radius 代表计算ORCA时的小球的半径，这个值不一定与小球实际显示的半径一样，偏小有利于小球移动顺畅
     * @param maxSpeed 小球最大速度值
     * @param velocity 小球初始速度向量
     */
    setAgentDefaults(neighborDist: number, maxNeighbors: number, timeHorizon: number, timeHorizonObst: number, radius: number, maxSpeed: number, velocity: Vector2) {
        if (!this.defaultAgent) {
            this.defaultAgent = new Agent();
        }

        if (neighborDist < radius) {
            console.warn("neighborDist < radius?, neighborDist will be set to radius");
            neighborDist = radius;
        }

        this.defaultAgent.maxNeighbors_ = maxNeighbors;
        this.defaultAgent.maxSpeed_ = maxSpeed;
        this.defaultAgent.neighborDist = neighborDist;
        this.defaultAgent.radius_ = radius;
        this.defaultAgent.timeHorizon = timeHorizon;
        this.defaultAgent.timeHorizonObst = timeHorizonObst;
        this.defaultAgent.velocity_ = velocity;
    }

    /**
     * 运行模拟，更新代理的状态
     * @param dt 时间步长
     */
    run(dt: number) {
        this.kdTree.buildAgentTree(this.getNumAgents());
        let agentNum = this.agentIdLst.length;
        for (let i = 0; i < agentNum; i++) {
            this.aid2agent[this.agentIdLst[i]].computeNeighbors(this);
            this.aid2agent[this.agentIdLst[i]].computeNewVelocity(dt);
        }
        for (let i = 0; i < agentNum; i++) {
            this.aid2agent[this.agentIdLst[i]].update(dt);
        }

        this.time += dt;
    }

    /**
     * 添加障碍物
     * @param vertices 障碍物的顶点数组 这里的数组必须按逆时针方向排序，否则会出现问题
     * (RVO系统默认，逆时针方向的障碍物不可以进入，顺时针方向则可以出去，避免有卡入障碍的出不来；如果开始就顺时针，会变成一个只能进入不能出的陷阱)
     * @param tag 障碍物的标签
     * @returns 障碍物的编号，如果顶点数小于 2 则返回 -1
     */
    addObstacle(vertices: Vector2[], tag: string = null) {
        if (vertices.length < 2) {
            return -1;
        }

        let obstacleNo = this.obstacles.length;

        for (let i = 0; i < vertices.length; ++i) {
            let obstacle = new Obstacle();
            obstacle.tag = tag;
            obstacle.point = vertices[i];
            if (i != 0) {
                obstacle.previous = this.obstacles[this.obstacles.length - 1];
                obstacle.previous.next = obstacle;
            }
            if (i == vertices.length - 1) {
                obstacle.next = this.obstacles[obstacleNo];
                obstacle.next.previous = obstacle;
            }
            obstacle.direction = RVOMath.normalize(vertices[(i == vertices.length - 1 ? 0 : i + 1)].minus(vertices[i]));

            if (vertices.length == 2) {
                obstacle.convex = true;
            }
            else {
                obstacle.convex = (RVOMath.leftOf(vertices[(i == 0 ? vertices.length - 1 : i - 1)], vertices[i], vertices[(i == vertices.length - 1 ? 0 : i + 1)]) >= 0);
            }

            this.obstacles.push(obstacle);
        }

        return obstacleNo;
    }

    /**
     * 移除指定的障碍物及其前后相连的所有障碍物
     * @param obstacle 障碍物
     * @param needProcess 是否需要重建障碍物的 k-d 树，默认为 true
     */
    removeObstacle(obstacle: Obstacle, needProcess = true) {
        if (this.obstacles.length == 0) {
            console.warn("obstacles is null")
            return;
        }
        if (!obstacle) {
            console.warn("removeObstacle obstacle is null")
            return;
        }
        let obstacleNo = this.obstacles.indexOf(obstacle);
        if (obstacleNo == -1) {
            console.warn("removeObstacle obstacle not in obstacles")
            return;
        }
        if (obstacle) {
            // 存储需要移除的障碍物 ID
            const removedIds = new Set<number>();

            // 递归移除当前障碍物及其前后障碍物
            this.recursiveRemoveObstacles(obstacle, removedIds);

            // 从数组中移除标记的障碍物
            this.obstacles = this.obstacles.filter(obs => !removedIds.has(obs.id));

            // 重建障碍物的 k-d 树
            needProcess && this.processObstacles();
        }
        else {
            console.warn("removeObstacle obstacle is null:" + obstacleNo)
        }
    }

    /**
     * 递归移除障碍物及其前后相连的障碍物
     * @param obstacle 当前要移除的障碍物
     * @param removedIds 存储已移除障碍物 ID 的集合
     */
    private recursiveRemoveObstacles(obstacle: Obstacle, removedIds: Set<number>) {
        if (!obstacle || removedIds.has(obstacle.id)) {
            return;
        }

        // 标记当前障碍物为已移除
        removedIds.add(obstacle.id);

        // 处理障碍物的前后引用
        if (obstacle.previous) {
            obstacle.previous.next = obstacle.next;
        }
        if (obstacle.next) {
            obstacle.next.previous = obstacle.previous;
        }

        // 递归移除前一个障碍物
        this.recursiveRemoveObstacles(obstacle.previous, removedIds);
        // 递归移除后一个障碍物
        this.recursiveRemoveObstacles(obstacle.next, removedIds);
    }

    /**
     * 处理障碍物，构建障碍物的 k-d 树
     */
    processObstacles() {
        this.kdTree.buildObstacleTree();
    };

    /**
     * 查询两点之间的可见性
     * @param point1 第一个点
     * @param point2 第二个点
     * @param radius 半径
     * @returns 如果两点之间可见则返回 true，否则返回 false
     */
    queryVisibility(point1: Vector2, point2: Vector2, radius: number) {
        return this.kdTree.queryVisibility(point1, point2, radius);
    };

    /**
     * 获取所有障碍物
     * @returns 障碍物数组
     */
    getObstacles() {
        return this.obstacles;
    }

    /**
     * 清除模拟器中的所有数据
     */
    clear() {
        this.agentIdLst.length = 0;
        this.agentId = 0;
        this.aid2agent = Object.create(null);
        this.defaultAgent = null;
        this.kdTree = new KdTree();
        this.obstacles.length = 0;
    }

    /**
     * 获取指定id的agent周围指定距离range范围内的所有其他agent，必须在kdTree已构建完成过后（即本模拟器的run执行后）才能正确调用
     * 该方法会返回一个数组，包含所有在指定范围内的agent对象。如果没有找到任何agent，则返回一个空数组。
     * @param aid 指定agent的ID
     * @param range 搜索范围
     * @returns 范围内的其他agent数组
     */
    getNeighborAgentsByRange(aid: number, range: number): Agent[] {
        // 检查 kdTree 是否构建完成
        if (!this.kdTree || this.kdTree.agentTree.length === 0) {
            console.warn('kdTree 尚未构建完成，无法获取邻居代理。');
            return [];
        }

        const targetAgent = this.getAgentByAid(aid);
        if (!targetAgent) {
            return [];
        }

        // 计算搜索范围的平方
        const rangeSq = range * range;
        // 临时存储原有的邻居代理列表
        const originalNeighbors = [...targetAgent.agentNeighbors_];
        // 清空目标代理的邻居代理列表
        targetAgent.agentNeighbors_.length = 0;

        // 利用 kdTree 计算邻居代理
        this.kdTree.computeAgentNeighbors(targetAgent, rangeSq);

        // 提取计算得到的邻居代理
        const neighborAgents = targetAgent.agentNeighbors_.map((pair) => pair.value);

        // 恢复原有的邻居代理列表
        targetAgent.agentNeighbors_ = originalNeighbors;

        return neighborAgents;
    }

    /**
     * 获取指定id的agent周围指定距离range范围内的所有其他agent，必须在kdTree已构建完成过后（即本模拟器的run执行后）才能正确调用
     * 该方法会返回一个数组，包含所有在指定范围内的agent对象。如果没有找到任何agent，则返回一个空数组。
     * @param aid 指定agent的ID
     * @param range 搜索范围
     * @param sameTag 是否只搜索相同tag的agent true:只搜索相同tag的agent， false:只搜索不同tag的agent
     * @returns 范围内的其他agent数组
     */
    getNeighborAgentsByRangeAndCheckTag(aid: number, range: number, sameTag: boolean = false) {
        // 检查 kdTree 是否构建完成
        if (!this.kdTree || this.kdTree.agentTree.length === 0) {
            console.warn('kdTree 尚未构建完成，无法获取邻居代理。');
            return [];
        }

        const targetAgent = this.getAgentByAid(aid);
        if (!targetAgent) {
            return [];
        }

        // 计算搜索范围的平方
        const rangeSq = range * range;
        // 临时存储原有的邻居代理列表
        const originalNeighbors = [...targetAgent.agentNeighbors_];
        // 清空目标代理的邻居代理列表
        targetAgent.agentNeighbors_.length = 0;

        // 利用 kdTree 计算邻居代理
        this.kdTree.computeAgentNeighbors(targetAgent, rangeSq);

        // 提取计算得到的邻居代理并根据标签条件筛选
        const neighborAgents = targetAgent.agentNeighbors_
            .map((pair) => pair.value)
            .filter((agent) => {
                if (sameTag) {
                    return agent.tag === targetAgent.tag;
                } else {
                    return agent.tag !== targetAgent.tag;
                }
            });

        // 恢复原有的邻居代理列表
        targetAgent.agentNeighbors_ = originalNeighbors;

        return neighborAgents;
    }

    /** 传入agentId和一个agent数组，将agent数组按与agentId的距离平方排序，由近到远 */
    sortAgentArrByAgentId(agentId: number, agentArr: Agent[]) {
        // 获取目标代理
        const targetAgent = this.getAgentByAid(agentId);
        if (!targetAgent) {
            return agentArr;
        }

        // 定义计算距离平方的函数
        const getDistanceSquared = (a: Agent, b: Agent) => {
            const dx = a.position_.x - b.position_.x;
            const dy = a.position_.y - b.position_.y;
            return dx * dx + dy * dy;
        };

        // 按距离平方排序
        agentArr.sort((a, b) => {
            const distA = getDistanceSquared(targetAgent, a);
            const distB = getDistanceSquared(targetAgent, b);
            return distA - distB;
        });

        return agentArr;
    }

    /** 传入一个指定坐标点、指定range和指定的tag，返回该坐标点周围range范围内，和指定tag相同/不同的agent */
    getNeighborAgentsByPosAndRangeAndCheckTag(pos: Vector2 | Vec2, range: number, sameTag: boolean = false, tagToCheck: string = null) {
        // 检查 kdTree 是否构建完成
        if (!this.kdTree || this.kdTree.agentTree.length === 0) {
            console.warn('kdTree 尚未构建完成，无法获取邻居代理。');
            return [];
        }

        // 计算搜索范围的平方
        const rangeSq = range * range;
        const neighborAgents: Agent[] = [];

        // 模拟一个虚拟代理用于查询
        const dummyAgent = new Agent();
        dummyAgent.position_.x = pos.x;
        dummyAgent.position_.y = pos.y;

        // 递归查询 k-d 树
        this.queryAgentTreeForNeighbors(dummyAgent, rangeSq, 0, neighborAgents, sameTag, tagToCheck);

        return neighborAgents;
    }

    /**
     * 递归查询代理的 k-d 树以获取邻居代理
     * @param dummyAgent 虚拟代理，代表查询位置
     * @param rangeSq 搜索范围的平方
     * @param node 当前节点的索引
     * @param neighborAgents 存储邻居代理的数组
     * @param sameTag 是否只搜索相同 tag 的 agent
     * @param tagToCheck 用于比较的标签
     */
    private queryAgentTreeForNeighbors(dummyAgent: Agent, rangeSq: number, node: number, neighborAgents: Agent[], sameTag: boolean, tagToCheck: string) {
        const kdTree = this.kdTree;
        if (kdTree.agentTree[node].end - kdTree.agentTree[node].begin <= kdTree.MAX_LEAF_SIZE) {
            // 叶节点，遍历所有代理并检查是否符合条件
            for (let i = kdTree.agentTree[node].begin; i < kdTree.agentTree[node].end; ++i) {
                const agent = kdTree.agents[i];
                const dx = agent.position_.x - dummyAgent.position_.x;
                const dy = agent.position_.y - dummyAgent.position_.y;
                const distSq = dx * dx + dy * dy;

                if (distSq <= rangeSq) {
                    if (tagToCheck === null || (sameTag && agent.tag === tagToCheck) || (!sameTag && agent.tag !== tagToCheck)) {
                        neighborAgents.push(agent);
                    }
                }
            }
        } else {
            // 计算左右子树到虚拟代理的距离平方
            const distSqLeft = RVOMath.sqr(Math.max(0, kdTree.agentTree[kdTree.agentTree[node].left].minX - dummyAgent.position_.x)) +
                RVOMath.sqr(Math.max(0, dummyAgent.position_.x - kdTree.agentTree[kdTree.agentTree[node].left].maxX)) +
                RVOMath.sqr(Math.max(0, kdTree.agentTree[kdTree.agentTree[node].left].minY - dummyAgent.position_.y)) +
                RVOMath.sqr(Math.max(0, dummyAgent.position_.y - kdTree.agentTree[kdTree.agentTree[node].left].maxY));

            const distSqRight = RVOMath.sqr(Math.max(0, kdTree.agentTree[kdTree.agentTree[node].right].minX - dummyAgent.position_.x)) +
                RVOMath.sqr(Math.max(0, dummyAgent.position_.x - kdTree.agentTree[kdTree.agentTree[node].right].maxX)) +
                RVOMath.sqr(Math.max(0, kdTree.agentTree[kdTree.agentTree[node].right].minY - dummyAgent.position_.y)) +
                RVOMath.sqr(Math.max(0, dummyAgent.position_.y - kdTree.agentTree[kdTree.agentTree[node].right].maxY));

            if (distSqLeft < distSqRight) {
                if (distSqLeft < rangeSq) {
                    // 递归查询左子树
                    this.queryAgentTreeForNeighbors(dummyAgent, rangeSq, kdTree.agentTree[node].left, neighborAgents, sameTag, tagToCheck);

                    if (distSqRight < rangeSq) {
                        // 递归查询右子树
                        this.queryAgentTreeForNeighbors(dummyAgent, rangeSq, kdTree.agentTree[node].right, neighborAgents, sameTag, tagToCheck);
                    }
                }
            } else {
                if (distSqRight < rangeSq) {
                    // 递归查询右子树
                    this.queryAgentTreeForNeighbors(dummyAgent, rangeSq, kdTree.agentTree[node].right, neighborAgents, sameTag, tagToCheck);

                    if (distSqLeft < rangeSq) {
                        // 递归查询左子树
                        this.queryAgentTreeForNeighbors(dummyAgent, rangeSq, kdTree.agentTree[node].left, neighborAgents, sameTag, tagToCheck);
                    }
                }
            }
        }
    }
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
            for (let i = 0; i < this.agents.length; i++) {
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
        for (let i = 0; i < obstacles.length; i++) {
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
    queryVisibility(q1: Vector2, q2: Vector2, radius: number) {
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

                        let splitpoint = obstacleJ1.point.plus((obstacleJ2.point.minus(obstacleJ1.point)).scale(t));

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

            if (distSqLine < rangeSq) {
                if (agentLeftOfLine < 0) {
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

            if (q1LeftOfI >= 0 && q2LeftOfI >= 0) {
                return this.queryVisibilityRecursive(q1, q2, radius, node.left) && ((RVOMath.sqr(q1LeftOfI) * invLengthI >= RVOMath.sqr(radius) && RVOMath.sqr(q2LeftOfI) * invLengthI >= RVOMath.sqr(radius)) || this.queryVisibilityRecursive(q1, q2, radius, node.right));
            }
            else if (q1LeftOfI <= 0 && q2LeftOfI <= 0) {
                return this.queryVisibilityRecursive(q1, q2, radius, node.right) && ((RVOMath.sqr(q1LeftOfI) * invLengthI >= RVOMath.sqr(radius) && RVOMath.sqr(q2LeftOfI) * invLengthI >= RVOMath.sqr(radius)) || this.queryVisibilityRecursive(q1, q2, radius, node.left));
            }
            else if (q1LeftOfI >= 0 && q2LeftOfI <= 0) {
                /* 从左到右可以穿过障碍物看到。 */
                return this.queryVisibilityRecursive(q1, q2, radius, node.left) && this.queryVisibilityRecursive(q1, q2, radius, node.right);
            }
            else {
                let point1LeftOfQ = RVOMath.leftOf(q1, q2, obstacle1.point);
                let point2LeftOfQ = RVOMath.leftOf(q1, q2, obstacle2.point);
                let invLengthQ = 1.0 / RVOMath.absSq(q2.minus(q1));

                return (point1LeftOfQ * point2LeftOfQ >= 0 && RVOMath.sqr(point1LeftOfQ) * invLengthQ > RVOMath.sqr(radius) && RVOMath.sqr(point2LeftOfQ) * invLengthQ > RVOMath.sqr(radius) && this.queryVisibilityRecursive(q1, q2, radius, node.left) && this.queryVisibilityRecursive(q1, q2, radius, node.right));
            }
        }
    }
}