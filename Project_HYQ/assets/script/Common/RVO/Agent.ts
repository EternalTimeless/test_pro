import { KeyValuePair, Line, Obstacle, RVOMath, Vector2 } from "./Common";
import { Simulator } from "./Simulator";

/**
 * 表示一个动态避障的代理类，用于处理代理的邻居计算、速度计算和位置更新等操作。
 */
export class Agent {
    /**
     * 存储代理的邻居代理列表，每个元素是一个包含距离平方和邻居代理的键值对。
     */
    agentNeighbors_: KeyValuePair<number, Agent>[] = [];
    /**
     * 存储代理的邻居障碍物列表，每个元素是一个包含距离平方和邻居障碍物的键值对。
     */
    obstaclNeighbors_: KeyValuePair<number, Obstacle>[] = [];
    /**
     * 存储代理的 ORCA 线列表，用于计算新的速度。
     */
    orcaLines_: Line[] = [];
    /**
     * 代理的当前位置向量。
     */
    position_: Vector2 = new Vector2(0, 0);
    /**
     * 代理的首选速度向量。
     */
    prefVelocity_: Vector2 = new Vector2(0, 0);
    /**
     * 代理的当前速度向量。
     */
    velocity_: Vector2 = new Vector2(0, 0);
    /**
     * 代理的唯一标识符。
     */
    id: number = 0;
    /**
     * 代理允许的最大邻居数量。
     */
    maxNeighbors_: number = 0;
    /**
     * 代理的最大速度。
     */
    maxSpeed_: number = 0.0;
    /**
     * 私有属性，代理搜索邻居的最大距离。
     */
    private _neighborDist: number = 0.0;
    /**
     * 获取代理搜索邻居的最大距离。
     */
    public get neighborDist(): number {
        return this._neighborDist;
    }
    /**
     * 设置代理搜索邻居的最大距离。
     * @param value 新的搜索邻居的最大距离。
     */
    public set neighborDist(value: number) {
        this._neighborDist = value;
    }
    /**
     * 代理的半径。
     */
    radius_: number = 0.0;
    /**
     * 代理与其他代理保持避障的时间范围。
     */
    timeHorizon: number = 0.0;
    /**
     * 代理与障碍物保持避障的时间范围。
     */
    timeHorizonObst: number = 0.0;
    /**
     * 代理计算得到的新速度向量。
     */
    newVelocity_: Vector2 = new Vector2(0, 0);
    /**
     * 代理的质量，用于速度计算。
     */
    mass: number = 1;

    /**
     * 代理的标签，可以用来区分所属，或后续做不同的检测处理
     */
    tag: string = '';

    /**
     * 计算代理的邻居（包括障碍物邻居和代理邻居）。
     * @param sim 模拟器实例，用于访问 KD 树来计算邻居。
     */
    computeNeighbors(sim: Simulator) {
        // 清空障碍物邻居列表
        this.obstaclNeighbors_.length = 0;
        // 计算搜索障碍物邻居的范围平方
        let rangeSq = (this.timeHorizonObst * this.maxSpeed_ + this.radius_) ** 2;
        // 使用 KD 树计算障碍物邻居
        sim.kdTree.computeObstacleNeighbors(this, rangeSq);

        // 清空代理邻居列表
        this.agentNeighbors_.length = 0;

        // 如果允许有邻居代理，则计算代理邻居
        if (this.maxNeighbors_ > 0) {
            rangeSq = this.neighborDist ** 2;
            // 使用 KD 树计算代理邻居，并更新搜索范围平方
            rangeSq = sim.kdTree.computeAgentNeighbors(this, rangeSq);
        }
    }

    /**
     * 记录碰撞到的代理ID列表
     */
    collisionAgentIds: number[] = [];
    /**
     * 记录碰撞到的障碍物ID列表
     */
    collisionObstacleIds: number[] = [];

    /**
     * 搜索代理的最佳新速度。
     * @param dt 时间步长，用于处理碰撞时的计算。
     */
    computeNewVelocity(dt: number) {
        // 清空碰撞代理和障碍物ID列表
        this.collisionAgentIds.length = 0;
        this.collisionObstacleIds.length = 0;

        // 清空 ORCA 线列表
        this.orcaLines_.length = 0;
        let orcaLines = this.orcaLines_;

        // 计算与障碍物避障时间范围的倒数
        const invTimeHorizonObst = 1.0 / this.timeHorizonObst;

        // 计算与其他代理避障时间范围的倒数
        const invTimeHorizon = 1.0 / this.timeHorizon;

        /**
         * 创建障碍物的 ORCA 线。
         */
        for (let i = 0; i < this.obstaclNeighbors_.length; ++i) {
            let obstacle1 = this.obstaclNeighbors_[i].value;
            let obstacle2 = obstacle1.next;

            // 计算障碍物顶点相对于代理的位置向量
            let relativePosition1 = obstacle1.point.minus(this.position_);
            let relativePosition2 = obstacle2.point.minus(this.position_);

            /**
             * 检查障碍物的速度障碍物是否已经被之前构造的障碍物 ORCA 线处理过。
             */
            let alreadyCovered = false;

            const orcaLinesLength = orcaLines.length; // 缓存数组长度
            for (let j = 0; j < orcaLinesLength; ++j) {
                const line = orcaLines[j];
                const relPos1Scaled = relativePosition1.scale(invTimeHorizonObst).minus(line.point);
                const relPos2Scaled = relativePosition2.scale(invTimeHorizonObst).minus(line.point);

                const det1 = RVOMath.det(relPos1Scaled, line.direction) - invTimeHorizonObst * this.radius_;
                if (det1 < -RVOMath.RVO_EPSILON) {
                    continue; // 提前跳过不必要的计算
                }

                const det2 = RVOMath.det(relPos2Scaled, line.direction) - invTimeHorizonObst * this.radius_;
                if (det2 >= -RVOMath.RVO_EPSILON) {
                    alreadyCovered = true;
                    break;
                }
                // if (RVOMath.det(relativePosition1.scale(invTimeHorizonObst).minus(orcaLines[j].point), orcaLines[j].direction) - invTimeHorizonObst * this.radius_ >= -RVOMath.RVO_EPSILON
                //     && RVOMath.det(relativePosition2.scale(invTimeHorizonObst).minus(orcaLines[j].point), orcaLines[j].direction) - invTimeHorizonObst * this.radius_ >= -RVOMath.RVO_EPSILON) {

                //     alreadyCovered = true;
                //     break;
                // }
            }

            if (alreadyCovered) {
                continue;
            }

            /**
             * 尚未处理，检查是否发生碰撞。
             */
            let distSq1 = RVOMath.absSq(relativePosition1);
            let distSq2 = RVOMath.absSq(relativePosition2);

            let radiusSq = RVOMath.sqr(this.radius_);

            // 计算障碍物线段的向量
            let obstacleVector = obstacle2.point.minus(obstacle1.point);
            // 计算投影系数
            let s = relativePosition1.scale(-1).multiply(obstacleVector) / RVOMath.absSq(obstacleVector);
            // 计算点到线段的距离平方
            let distSqLine = RVOMath.absSq(relativePosition1.scale(-1).minus(obstacleVector.scale(s)));

            let line = new Line();
            if (s < 0 && distSq1 <= radiusSq) {
                /**
                 * 与左顶点发生碰撞。如果不是凸顶点则忽略。
                 */
                if (obstacle1.convex) {
                    line.point = new Vector2(0, 0);
                    line.direction = RVOMath.normalize(new Vector2(-relativePosition1.y, relativePosition1.x));
                    orcaLines.push(line);
                    this.collisionObstacleIds.push(obstacle1.id);
                }
                continue;
            }
            else if (s > 1 && distSq2 <= radiusSq) {
                /**
                 * 与右顶点发生碰撞。如果不是凸顶点或会被相邻障碍物处理则忽略。
                 */
                if (obstacle2.convex && RVOMath.det(relativePosition2, obstacle2.direction) >= 0) {
                    line.point = new Vector2(0, 0);
                    line.direction = RVOMath.normalize(new Vector2(-relativePosition2.y, relativePosition2.x));
                    orcaLines.push(line);
                    this.collisionObstacleIds.push(obstacle1.id);
                }
                continue;
            }
            else if (s >= 0 && s <= 1 && distSqLine <= radiusSq) {
                /**
                 * 与障碍物线段发生碰撞。
                 */
                line.point = new Vector2(0, 0);
                line.direction = obstacle1.direction.scale(-1);
                orcaLines.push(line);
                this.collisionObstacleIds.push(obstacle1.id);
                continue;
            }

            /**
             * 没有碰撞。计算速度障碍物的边界线。
             */
            let leftLegDirection: Vector2, rightLegDirection: Vector2;

            if (s < 0 && distSqLine <= radiusSq) {
                /**
                 * 障碍物倾斜观察，左顶点定义速度障碍物。
                 */
                if (!obstacle1.convex) {
                    /**
                     * 忽略障碍物。
                     */
                    continue;
                }

                obstacle2 = obstacle1;

                let leg1 = Math.sqrt(distSq1 - radiusSq);
                leftLegDirection = (new Vector2(relativePosition1.x * leg1 - relativePosition1.y * this.radius_, relativePosition1.x * this.radius_ + relativePosition1.y * leg1)).scale(1 / distSq1);
                rightLegDirection = (new Vector2(relativePosition1.x * leg1 + relativePosition1.y * this.radius_, -relativePosition1.x * this.radius_ + relativePosition1.y * leg1)).scale(1 / distSq1);
            }
            else if (s > 1 && distSqLine <= radiusSq) {
                /**
                 * 障碍物倾斜观察，右顶点定义速度障碍物。
                 */
                if (!obstacle2.convex) {
                    /**
                     * 忽略障碍物。
                     */
                    continue;
                }

                obstacle1 = obstacle2;

                let leg2 = Math.sqrt(distSq2 - radiusSq);
                leftLegDirection = (new Vector2(relativePosition2.x * leg2 - relativePosition2.y * this.radius_, relativePosition2.x * this.radius_ + relativePosition2.y * leg2)).scale(1 / distSq2);
                rightLegDirection = (new Vector2(relativePosition2.x * leg2 + relativePosition2.y * this.radius_, -relativePosition2.x * this.radius_ + relativePosition2.y * leg2)).scale(1 / distSq2);
            }
            else {
                /**
                 * 正常情况。
                 */
                if (obstacle1.convex) {
                    let leg1 = Math.sqrt(distSq1 - radiusSq);
                    leftLegDirection = (new Vector2(relativePosition1.x * leg1 - relativePosition1.y * this.radius_, relativePosition1.x * this.radius_ + relativePosition1.y * leg1)).scale(1 / distSq1);
                }
                else {
                    /**
                     * 左顶点非凸，左边界线延伸截断线。
                     */
                    leftLegDirection = obstacle1.direction.scale(-1);
                }

                if (obstacle2.convex) {
                    let leg2 = Math.sqrt(distSq2 - radiusSq);
                    rightLegDirection = (new Vector2(relativePosition2.x * leg2 + relativePosition2.y * this.radius_, -relativePosition2.x * this.radius_ + relativePosition2.y * leg2)).scale(1 / distSq2);
                }
                else {
                    /**
                     * 右顶点非凸，右边界线延伸截断线。
                     */
                    rightLegDirection = obstacle1.direction;
                }
            }

            /**
             * 凸顶点的边界线不能指向相邻边，否则取相邻边的截断线。
             * 如果速度投影到“外来”边界线，则不添加约束。
             */
            let leftNeighbor = obstacle1.previous;

            let isLeftLegForeign = false;
            let isRightLegForeign = false;

            if (obstacle1.convex && RVOMath.det(leftLegDirection, leftNeighbor.direction.scale(-1)) >= 0.0) {
                /**
                 * 左边界线指向障碍物。
                 */
                leftLegDirection = leftNeighbor.direction.scale(-1);
                isLeftLegForeign = true;
            }

            if (obstacle2.convex && RVOMath.det(rightLegDirection, obstacle2.direction) <= 0.0) {
                /**
                 * 右边界线指向障碍物。
                 */
                rightLegDirection = obstacle2.direction;
                isRightLegForeign = true;
            }

            /**
             * 计算截断线的中心。
             */
            let leftCutoff = obstacle1.point.minus(this.position_).scale(invTimeHorizonObst);
            let rightCutoff = obstacle2.point.minus(this.position_).scale(invTimeHorizonObst);
            let cutoffVec = rightCutoff.minus(leftCutoff);

            /**
             * 将当前速度投影到速度障碍物上。
             */
            /**
             * 检查当前速度是否投影到截断圆上。
             */
            let t = (obstacle1 == obstacle2) ? 0.5 : this.velocity_.minus(leftCutoff).multiply(cutoffVec) / RVOMath.absSq(cutoffVec);
            let tLeft = this.velocity_.minus(leftCutoff).multiply(leftLegDirection);
            let tRight = this.velocity_.minus(rightCutoff).multiply(rightLegDirection);

            if ((t < 0.0 && tLeft < 0.0) || (obstacle1 == obstacle2 && tLeft < 0.0 && tRight < 0.0)) {
                /**
                 * 投影到左截断圆上。
                 */
                let unitW = RVOMath.normalize(this.velocity_.minus(leftCutoff));

                line.direction = new Vector2(unitW.y, -unitW.x);
                line.point = leftCutoff.plus(unitW.scale(this.radius_ * invTimeHorizonObst));
                orcaLines.push(line);
                continue;
            }
            else if (t > 1.0 && tRight < 0.0) {
                /**
                 * 投影到右截断圆上。
                 */
                let unitW = RVOMath.normalize(this.velocity_.minus(rightCutoff));

                line.direction = new Vector2(unitW.y, -unitW.x);
                line.point = rightCutoff.plus(unitW.scale(this.radius_ * invTimeHorizonObst));
                orcaLines.push(line);
                continue;
            }

            /**
             * 将当前速度投影到左边界线、右边界线或截断线上，取最近的一个。
             */
            let distSqCutoff = ((t < 0.0 || t > 1.0 || obstacle1 == obstacle2) ? Infinity : RVOMath.absSq(this.velocity_.minus(cutoffVec.scale(t).plus(leftCutoff))));
            let distSqLeft = ((tLeft < 0.0) ? Infinity : RVOMath.absSq(this.velocity_.minus(leftLegDirection.scale(tLeft).plus(leftCutoff))));
            let distSqRight = ((tRight < 0.0) ? Infinity : RVOMath.absSq(this.velocity_.minus(rightLegDirection.scale(tRight).plus(rightCutoff))));

            if (distSqCutoff <= distSqLeft && distSqCutoff <= distSqRight) {
                /**
                 * 投影到截断线上。
                 */
                line.direction = obstacle1.direction.scale(-1);
                let aux = new Vector2(-line.direction.y, line.direction.x);
                line.point = aux.scale(this.radius_ * invTimeHorizonObst).plus(leftCutoff);
                orcaLines.push(line);
                continue;
            }
            else if (distSqLeft <= distSqRight) {
                /**
                 * 投影到左边界线上。
                 */
                if (isLeftLegForeign) {
                    continue;
                }

                line.direction = leftLegDirection;
                let aux = new Vector2(-line.direction.y, line.direction.x);
                line.point = aux.scale(this.radius_ * invTimeHorizonObst).plus(leftCutoff);
                orcaLines.push(line);
                continue;
            }
            else {
                /**
                 * 投影到右边界线上。
                 */
                if (isRightLegForeign) {
                    continue;
                }

                line.direction = rightLegDirection.scale(-1);
                let aux = new Vector2(-line.direction.y, line.direction.x);
                line.point = aux.scale(this.radius_ * invTimeHorizonObst).plus(rightCutoff);
                orcaLines.push(line);
                continue;
            }
        }

        // 记录障碍物 ORCA 线的数量
        let numObstLines = orcaLines.length;

        /**
         * 创建代理的 ORCA 线。
         */
        for (let i = 0; i < this.agentNeighbors_.length; ++i) {
            let other = this.agentNeighbors_[i].value;

            // 计算其他代理相对于当前代理的位置向量
            let relativePosition = other.position_.minus(this.position_);

            // 计算质量比
            let massRatio = (other.mass / (this.mass + other.mass));
            let neighborMassRatio = (this.mass / (this.mass + other.mass));

            // 计算优化后的速度
            let velocityOpt = (massRatio >= 0.5 ? (this.velocity_.minus(this.velocity_.scale(massRatio)).scale(2)) : this.prefVelocity_.plus(this.velocity_.minus(this.prefVelocity_).scale(massRatio * 2)));
            let neighborVelocityOpt = (neighborMassRatio >= 0.5 ? other.velocity_.scale(2).scale(1 - neighborMassRatio) : (other.prefVelocity_.plus(other.velocity_.minus(other.prefVelocity_).scale(2 * neighborMassRatio))));

            // 计算相对速度
            let relativeVelocity = velocityOpt.minus(neighborVelocityOpt);
            // 计算相对位置的平方
            let distSq = RVOMath.absSq(relativePosition);
            // 计算两个代理的组合半径
            let combinedRadius = this.radius_ + other.radius_;
            // 计算组合半径的平方
            let combinedRadiusSq = RVOMath.sqr(combinedRadius);

            let line = new Line();
            let u: Vector2;

            if (distSq > combinedRadiusSq) {
                /**
                 * 没有碰撞。
                 */
                // 计算从截断中心到相对速度的向量
                let w = relativeVelocity.minus(relativePosition.scale(invTimeHorizon));
                // 计算向量 w 的长度平方
                let wLengthSq = RVOMath.absSq(w);

                // 计算向量 w 与相对位置的点积
                let dotProduct1 = w.multiply(relativePosition);

                if (dotProduct1 < 0.0 && RVOMath.sqr(dotProduct1) > combinedRadiusSq * wLengthSq) {
                    /**
                     * 投影到截断圆上。
                     */
                    let wLength = Math.sqrt(wLengthSq);
                    let unitW = w.scale(1 / wLength);

                    line.direction = new Vector2(unitW.y, -unitW.x);
                    u = unitW.scale(combinedRadius * invTimeHorizon - wLength);
                }
                else {
                    /**
                     * 投影到边界线上。
                     */
                    let leg = Math.sqrt(distSq - combinedRadiusSq);

                    if (RVOMath.det(relativePosition, w) > 0.0) {
                        /**
                         * 投影到左边界线上。
                         */
                        let aux = new Vector2(relativePosition.x * leg - relativePosition.y * combinedRadius, relativePosition.x * combinedRadius + relativePosition.y * leg);
                        line.direction = aux.scale(1 / distSq);
                    }
                    else {
                        /**
                         * 投影到右边界线上。
                         */
                        let aux = new Vector2(relativePosition.x * leg + relativePosition.y * combinedRadius, -relativePosition.x * combinedRadius + relativePosition.y * leg);
                        line.direction = aux.scale(-1 / distSq);
                    }

                    // 计算相对速度与边界线的点积
                    let dotProduct2 = relativeVelocity.multiply(line.direction);
                    u = line.direction.scale(dotProduct2).minus(relativeVelocity);
                }
            }
            else {
                /**
                 * 发生碰撞。投影到时间步长的截断圆上。
                 */
                let invTimeStep = 1.0 / dt;

                // 计算从截断中心到相对速度的向量
                let w = relativeVelocity.minus(relativePosition.scale(invTimeStep));

                let wLength = RVOMath.abs(w);
                let unitW = w.scale(1 / wLength);

                line.direction = new Vector2(unitW.y, -unitW.x);
                u = unitW.scale(combinedRadius * invTimeStep - wLength);

                this.collisionAgentIds.push(other.id);
            }

            // 设置 ORCA 线的点
            line.point = velocityOpt.plus(u.scale(massRatio));
            // 将 ORCA 线添加到列表中
            orcaLines.push(line);
        }

        // 执行线性规划 2，尝试找到满足所有约束的最优速度
        let lineFail = this.linearProgram2(orcaLines, this.maxSpeed_, this.prefVelocity_, false, this.newVelocity_);

        if (lineFail < orcaLines.length) {
            // 如果线性规划 2 失败，执行线性规划 3 进行进一步优化
            this.linearProgram3(orcaLines, numObstLines, lineFail, this.maxSpeed_, this.newVelocity_);
        }

        // 外部可以在run之后，检查是否发生碰撞
        // if (this.collisionAgentIds.length > 0 || this.collisionObstacleIds.length > 0) {
        //     console.log(this.id, this.collisionAgentIds, this.collisionObstacleIds)
        // }
    }

    /**
     * 插入一个邻居代理到邻居列表中，如果距离在搜索范围内。
     * @param agent 要插入的邻居代理。
     * @param rangeSq 搜索范围的平方。
     * @returns 更新后的搜索范围平方。
     */
    insertAgentNeighbor(agent: Agent, rangeSq: number) {
        if (this != agent) {
            // 计算当前代理与邻居代理的距离平方
            let distSq = RVOMath.absSq(this.position_.minus(agent.position_));

            if (distSq < rangeSq) {
                if (this.agentNeighbors_.length < this.maxNeighbors_) {
                    // 如果邻居列表未满，直接添加邻居代理
                    this.agentNeighbors_.push(new KeyValuePair(distSq, agent));
                }
                let i = this.agentNeighbors_.length - 1;
                // 对邻居列表进行排序
                while (i != 0 && distSq < this.agentNeighbors_[i - 1].key) {
                    this.agentNeighbors_[i] = this.agentNeighbors_[i - 1];
                    --i;
                }
                this.agentNeighbors_[i] = new KeyValuePair<number, Agent>(distSq, agent);

                if (this.agentNeighbors_.length == this.maxNeighbors_) {
                    // 如果邻居列表已满，更新搜索范围平方
                    rangeSq = this.agentNeighbors_[this.agentNeighbors_.length - 1].key;
                }
            }
        }
        return rangeSq;
    }

    // 修改insertObstacleNeighbor方法，修复重复添加问题
    insertObstacleNeighbor(obstacle: Obstacle, rangeSq: number) {
        let nextObstacle = obstacle.next;

        // 计算点到障碍物线段的距离平方
        let distSq = RVOMath.distSqPointLineSegment(obstacle.point, nextObstacle.point, this.position_);

        if (distSq < rangeSq) {
            // 检查是否已存在该障碍物
            let alreadyExists = false;
            for (let i = 0; i < this.obstaclNeighbors_.length; i++) {
                if (this.obstaclNeighbors_[i].value === obstacle) {
                    alreadyExists = true;
                    // 如果已存在但距离更近，更新距离
                    if (distSq < this.obstaclNeighbors_[i].key) {
                        this.obstaclNeighbors_[i].key = distSq;
                        // 重新排序
                        let j = i;
                        while (j > 0 && distSq < this.obstaclNeighbors_[j - 1].key) {
                            let temp = this.obstaclNeighbors_[j];
                            this.obstaclNeighbors_[j] = this.obstaclNeighbors_[j - 1];
                            this.obstaclNeighbors_[j - 1] = temp;
                            j--;
                        }
                    }
                    break;
                }
            }
            
            // 如果不存在，则添加新项
            if (!alreadyExists) {
                // 将邻居障碍物添加到列表中
                let newNeighbor = new KeyValuePair<number, Obstacle>(distSq, obstacle);
                
                // 找到正确的插入位置
                let insertIndex = this.obstaclNeighbors_.length;
                for (let i = 0; i < this.obstaclNeighbors_.length; i++) {
                    if (distSq < this.obstaclNeighbors_[i].key) {
                        insertIndex = i;
                        break;
                    }
                }
                
                // 在正确位置插入
                this.obstaclNeighbors_.splice(insertIndex, 0, newNeighbor);
            }
        }
    }

    /** 是否开启被困抖动调整 */
    static isOpenTrapperd: boolean = false;
    static recordNum: number = 10;//记录次数

    historyPoses: Vector2[] = [];
    trappedTimer: number = 5;//受困时间后再判断是否受困
    isTrappe: boolean = false;//是否受困
    waitTimer: number = 100;//开始场景等待时间再判断是否受困

    // 是否抖动
    isShake(recordNum: number) {
        if (this.historyPoses.length < recordNum) {
            return false;
        }
        let isXAdd = false;
        let isYAdd = false;
        let isXReduce = false;
        let isYReduce = false;;

        for (let i = 1; i < this.historyPoses.length; i++) {
            let pos2 = this.historyPoses[i];
            let pos1 = this.historyPoses[i - 1];
            if (!isXAdd) {
                isXAdd = pos2.x > pos1.x;
            }
            if (!isXReduce) {
                isXReduce = pos2.x < pos1.x;
            }
            if (!isYAdd) {
                isYAdd = pos2.y > pos1.y;
            }
            if (!isYReduce) {
                isYReduce = pos2.y < pos1.y;
            }
        }

        if (isXAdd && isYAdd && isXReduce && isYReduce) {
            // console.log(this.id,'抖动');
            return true;
        } else {
            return false;
        }
    }

    /**
     * 根据计算得到的新速度更新代理的位置和速度。
     * @param dt 时间步长，用于计算位置的变化。
     */
    update(dt: number) {
        // 检查 prefVelocity_ 是否为零向量
        if (this.prefVelocity_.x === 0 && this.prefVelocity_.y === 0) {
            // 若为零向量，立即停止移动，避免微量滑行
            this.velocity_.x = 0;
            this.velocity_.y = 0;
            this.newVelocity_.x = 0;
            this.newVelocity_.y = 0;
        } else {
            const neighborCount = this.agentNeighbors_.length + this.obstaclNeighbors_.length;
            // 修改后：添加速度插值（阻尼系数0.3-0.6）
            let blendFactor = 0.2; // 可配置参数
            // if (neighborCount >= 3) {
            //     blendFactor = 0.6;
            // }

            this.velocity_ = this.velocity_
                .scale(1 - blendFactor)
                .plus(this.newVelocity_.scale(blendFactor));
        }

        if (Agent.isOpenTrapperd) {
            if (this.waitTimer > 0) {
                this.waitTimer--;
                this.position_.copy(this.position_.plus(this.velocity_.scale(dt)));
                return;
            }
            let pos = this.position_.plus(this.velocity_.scale(dt));
            // 记录不够时，直接返回，不调整位置
            this.historyPoses.push(pos);
            if (this.historyPoses.length <= Agent.recordNum) {
                return;
            } else {
                // 保持最近的5帧的pos
                this.historyPoses.splice(0, 1);
            };
            // 如果受困，等待trappedTimer再判断
            if (this.isTrappe) {
                // console.log('trapped');
                this.trappedTimer--;
                if (this.trappedTimer <= 0) {
                    this.isTrappe = false;
                    this.trappedTimer = 5;
                }
            } else {
                // 如果没有受困，先判断是否抖动
                this.isTrappe = this.isShake(Agent.recordNum);
            }
            if (this.isTrappe) {
                // console.log('受困，不移动');
                return;
            } else {
                // console.log('移动');
                this.position_.copy(this.position_.plus(this.velocity_.scale(dt)));
            }

        }
        else {
            // 更新当前位置为原位置加上速度乘以时间步长
            this.position_.copy(this.position_.plus(this.velocity_.scale(dt)));
        }
    };

    /**
     * 解决一维线性规划问题，找到满足约束条件的最优速度。
     * @param lines ORCA 线列表。
     * @param lineNo 当前要处理的 ORCA 线的编号。
     * @param radius 最大速度的半径。
     * @param optVelocity 优化速度向量。
     * @param directionOpt 是否优化方向。
     * @param result 存储最优速度的向量。
     * @returns 如果找到满足约束条件的解返回 true，否则返回 false。
     */
    linearProgram1(lines: Line[], lineNo: number, radius: number, optVelocity: Vector2, directionOpt: boolean, result: Vector2) {
        // 计算 ORCA 线的点与方向的点积
        let dotProduct = lines[lineNo].point.multiply(lines[lineNo].direction);
        // 计算判别式
        let discriminant = RVOMath.sqr(dotProduct) + RVOMath.sqr(radius) - RVOMath.absSq(lines[lineNo].point);

        if (discriminant < -RVOMath.RVO_EPSILON) {
            /**
             * 最大速度圆完全使当前 ORCA 线无效。
             */
            return false;
        }

        // 计算判别式的平方根
        let sqrtDiscriminant = (discriminant <= 0.0) ? 0.0 : Math.sqrt(discriminant);
        // 计算左边界
        let tLeft = -dotProduct - sqrtDiscriminant;
        // 计算右边界
        let tRight = -dotProduct + sqrtDiscriminant;

        for (let i = 0; i < lineNo; ++i) {
            // 计算两条 ORCA 线方向的行列式
            let denominator = RVOMath.det(lines[lineNo].direction, lines[i].direction);
            // 计算分子
            let numerator = RVOMath.det(lines[i].direction, lines[lineNo].point.minus(lines[i].point));

            if (Math.abs(denominator) <= RVOMath.RVO_EPSILON) {
                /**
                 * 当前 ORCA 线和第 i 条 ORCA 线（几乎）平行。
                 */
                if (numerator < 0.0) {
                    return false;
                }
                else {
                    continue;
                }
            }

            // 计算交点参数
            let t = numerator / denominator;

            if (denominator >= 0.0) {
                /**
                 * 第 i 条 ORCA 线在右侧限制当前 ORCA 线。
                 */
                tRight = Math.min(tRight, t);
            }
            else {
                /**
                 * 第 i 条 ORCA 线在左侧限制当前 ORCA 线。
                 */
                tLeft = Math.max(tLeft, t);
            }

            if (tLeft > tRight) {
                return false;
            }
        }

        if (directionOpt) {
            if (optVelocity.multiply(lines[lineNo].direction) > 0.0) {
                // 取右边界
                result.copy(lines[lineNo].point.plus(lines[lineNo].direction.scale(tRight)));
            }
            else {
                // 取左边界
                result.copy(lines[lineNo].point.plus(lines[lineNo].direction.scale(tLeft)));
            }
        }
        else {
            // 优化最近点
            let t = lines[lineNo].direction.multiply(optVelocity.minus(lines[lineNo].point));
            if (t < tLeft) {
                result.copy(lines[lineNo].point.plus(lines[lineNo].direction.scale(tLeft)));
            }
            else if (t > tRight) {
                result.copy(lines[lineNo].point.plus(lines[lineNo].direction.scale(tRight)));
            }
            else {
                result.copy(lines[lineNo].point.plus(lines[lineNo].direction.scale(t)));
            }
        }

        return true;
    }

    /**
     * 解决二维线性规划问题，找到满足所有 ORCA 线约束的最优速度。
     * @param lines ORCA 线列表。
     * @param radius 最大速度的半径。
     * @param optVelocity 优化速度向量。
     * @param directionOpt 是否优化方向。
     * @param result 存储最优速度的向量。
     * @returns 第一个不满足约束条件的 ORCA 线的编号，如果所有线都满足则返回线的数量。
     */
    linearProgram2(lines: Line[], radius: number, optVelocity: Vector2, directionOpt: boolean, result: Vector2) {
        // directionOpt 第一次为 false，第二次为 true，主要用于 linearProgram1 中
        if (directionOpt) {
            /**
             * 优化方向。此时优化速度是单位向量。
             */
            result.copy(optVelocity.scale(radius));
        }
        else if (RVOMath.absSq(optVelocity) > RVOMath.sqr(radius) + RVOMath.RVO_EPSILON) {
            /**
             * 优化最近点且在圆外。
             */
            result.copy(RVOMath.normalize(optVelocity).scale(radius));
        }
        else {
            /**
             * 优化最近点且在圆内。
             */
            result.copy(optVelocity);
        }

        for (let i = 0; i < lines.length; ++i) {
            if (RVOMath.det(lines[i].direction, lines[i].point.minus(result)) > 0.0) {
                /**
                 * 结果不满足第 i 条约束条件。计算新的最优结果。
                 */
                let tempResult = result.clone();
                if (!this.linearProgram1(lines, i, radius, optVelocity, directionOpt, result)) {
                    result.copy(tempResult);
                    return i;
                }
            }
        }

        return lines.length;
    }

    /**
     * 解决三维线性规划问题，处理不满足二维线性规划的情况。
     * @param lines ORCA 线列表。
     * @param numObstLines 障碍物 ORCA 线的数量。
     * @param beginLine 开始处理的 ORCA 线的编号。
     * @param radius 最大速度的半径。
     * @param result 存储最优速度的向量。
     */
    linearProgram3(lines: Line[], numObstLines: number, beginLine: number, radius: number, result: Vector2) {
        let distance = 0.0;
        // 遍历所有剩余 ORCA 线
        for (let i = beginLine; i < lines.length; ++i) {
            // 每一条 ORCA 线都需要精确的做出处理，distance 为最大违规的速度
            if (RVOMath.det(lines[i].direction, lines[i].point.minus(result)) > distance) {
                /**
                 * 结果不满足第 i 条 ORCA 线的约束条件。
                 */
                let projLines = [];
                // 1. 静态阻挡的 ORCA 线直接加到 projLines 中
                for (let ii = 0; ii < numObstLines; ++ii) {
                    projLines.push(lines[ii]);
                }
                // 2. 动态阻挡的 ORCA 线需要重新计算 line，从第一个非静态阻挡到当前的 ORCA 线
                for (let j = numObstLines; j < i; ++j) {
                    let line = new Line();

                    // 计算两条 ORCA 线方向的行列式
                    let determinant = RVOMath.det(lines[i].direction, lines[j].direction);

                    if (Math.abs(determinant) <= RVOMath.RVO_EPSILON) {
                        /**
                         * 第 i 条和第 j 条 ORCA 线平行。
                         */
                        if (lines[i].direction.multiply(lines[j].direction) > 0.0) {
                            /**
                             * 第 i 条和第 j 条 ORCA 线方向相同。
                             */
                            continue;
                        }
                        else {
                            /**
                             * 第 i 条和第 j 条 ORCA 线方向相反。
                             */
                            line.point = lines[i].point.plus(lines[j].point).scale(0.5);
                        }
                    }
                    else {
                        line.point = lines[i].point.plus(lines[i].direction.scale(RVOMath.det(lines[j].direction, lines[i].point.minus(lines[j].point)) / determinant));
                    }

                    line.direction = RVOMath.normalize(lines[j].direction.minus(lines[i].direction));
                    projLines.push(line);
                }

                let tempResult = result.clone();
                if (this.linearProgram2(projLines, radius, new Vector2(-lines[i].direction.y, lines[i].direction.x), true, result) < projLines.length) {
                    /**
                     * 原则上这不应该发生。结果根据定义已经在这个线性规划的可行区域内。
                     * 如果失败，是由于浮点误差，保留当前结果。
                     */
                    result.copy(tempResult);
                }

                distance = RVOMath.det(lines[i].direction, lines[i].point.minus(result));
            }
        }
    }
}