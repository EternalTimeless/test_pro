System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3", "__unresolved_4", "__unresolved_5", "__unresolved_6", "__unresolved_7", "__unresolved_8", "__unresolved_9", "__unresolved_10", "__unresolved_11", "__unresolved_12"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, CCFloat, CCInteger, tween, Vec3, PoolManager, EventType, MonsterType, PoolEnum, PrefabsEnum, MonsterBattleTaerget, PrefabsManager, MoveModEnum, Player, EventManager, UnityUpComponent, GameOverPanel, JumpManager, FlashRedManager, CameraMove, _dec, _dec2, _dec3, _dec4, _dec5, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _dec6, _dec7, _class4, _class5, _descriptor5, _dec8, _dec9, _dec10, _dec11, _dec12, _dec13, _dec14, _dec15, _dec16, _dec17, _dec18, _dec19, _dec20, _class7, _class8, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _descriptor11, _descriptor12, _descriptor13, _descriptor14, _descriptor15, _descriptor16, _descriptor17, _class9, _crd, ccclass, property, tempV3, MonsterCreateInfo, MonsterCreateQueue, MonsterCreate;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfPoolManager(extras) {
    _reporterNs.report("PoolManager", "../../Base/PoolManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfEventType(extras) {
    _reporterNs.report("EventType", "../../Base/EnumList", _context.meta, extras);
  }

  function _reportPossibleCrUseOfMonsterType(extras) {
    _reporterNs.report("MonsterType", "../../Base/EnumList", _context.meta, extras);
  }

  function _reportPossibleCrUseOfPoolEnum(extras) {
    _reporterNs.report("PoolEnum", "../../Base/EnumList", _context.meta, extras);
  }

  function _reportPossibleCrUseOfPrefabsEnum(extras) {
    _reporterNs.report("PrefabsEnum", "../../Base/EnumList", _context.meta, extras);
  }

  function _reportPossibleCrUseOfMonsterBattleTaerget(extras) {
    _reporterNs.report("MonsterBattleTaerget", "./MonsterBattleTaerget", _context.meta, extras);
  }

  function _reportPossibleCrUseOfPrefabsManager(extras) {
    _reporterNs.report("PrefabsManager", "../../Base/PrefabsManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfMoveModEnum(extras) {
    _reporterNs.report("MoveModEnum", "../../Base/MoveRot/MoveDrive", _context.meta, extras);
  }

  function _reportPossibleCrUseOfPlayer(extras) {
    _reporterNs.report("Player", "../Player/Player", _context.meta, extras);
  }

  function _reportPossibleCrUseOfEventManager(extras) {
    _reporterNs.report("EventManager", "../../Base/EventManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfUnityUpComponent(extras) {
    _reporterNs.report("UnityUpComponent", "../../Base/UnityUpComponent", _context.meta, extras);
  }

  function _reportPossibleCrUseOfGameOverPanel(extras) {
    _reporterNs.report("GameOverPanel", "../UI/GameOver/GameOverPanel", _context.meta, extras);
  }

  function _reportPossibleCrUseOfJumpManager(extras) {
    _reporterNs.report("JumpManager", "../Jump/JumpManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfFlashRedManager(extras) {
    _reporterNs.report("FlashRedManager", "../Battle/Base/FlashRedManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfCameraMove(extras) {
    _reporterNs.report("CameraMove", "../../Base/CameraMove", _context.meta, extras);
  }

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      CCFloat = _cc.CCFloat;
      CCInteger = _cc.CCInteger;
      tween = _cc.tween;
      Vec3 = _cc.Vec3;
    }, function (_unresolved_2) {
      PoolManager = _unresolved_2.default;
    }, function (_unresolved_3) {
      EventType = _unresolved_3.EventType;
      MonsterType = _unresolved_3.MonsterType;
      PoolEnum = _unresolved_3.PoolEnum;
      PrefabsEnum = _unresolved_3.PrefabsEnum;
    }, function (_unresolved_4) {
      MonsterBattleTaerget = _unresolved_4.MonsterBattleTaerget;
    }, function (_unresolved_5) {
      PrefabsManager = _unresolved_5.PrefabsManager;
    }, function (_unresolved_6) {
      MoveModEnum = _unresolved_6.MoveModEnum;
    }, function (_unresolved_7) {
      Player = _unresolved_7.Player;
    }, function (_unresolved_8) {
      EventManager = _unresolved_8.default;
    }, function (_unresolved_9) {
      UnityUpComponent = _unresolved_9.UnityUpComponent;
    }, function (_unresolved_10) {
      GameOverPanel = _unresolved_10.GameOverPanel;
    }, function (_unresolved_11) {
      JumpManager = _unresolved_11.JumpManager;
    }, function (_unresolved_12) {
      FlashRedManager = _unresolved_12.FlashRedManager;
    }, function (_unresolved_13) {
      CameraMove = _unresolved_13.CameraMove;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "1f73f/6fgtCdZIelyOdUt06", "MonsterCreate", undefined);

      __checkObsolete__(['_decorator', 'CCFloat', 'CCInteger', 'Component', 'Node', 'Pool', 'tween', 'Vec3']);

      ({
        ccclass,
        property
      } = _decorator);
      tempV3 = new Vec3();
      MonsterCreateInfo = (_dec = ccclass("MonsterCreateInfo"), _dec2 = property(CCInteger), _dec3 = property({
        type: _crd && MonsterType === void 0 ? (_reportPossibleCrUseOfMonsterType({
          error: Error()
        }), MonsterType) : MonsterType
      }), _dec4 = property(CCInteger), _dec5 = property(CCInteger), _dec(_class = (_class2 = class MonsterCreateInfo {
        constructor() {
          _initializerDefineProperty(this, "loopMax", _descriptor, this);

          _initializerDefineProperty(this, "monsterType", _descriptor2, this);

          _initializerDefineProperty(this, "monsterCountMax", _descriptor3, this);

          _initializerDefineProperty(this, "brotherExcludeZ", _descriptor4, this);

          this.curMonsterCount = 0;
          this.curLoopCount = 0;
        }

        init() {
          this.curLoopCount = 0;
          this.curMonsterCount = 0;
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "loopMax", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 1;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "monsterType", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return (_crd && MonsterType === void 0 ? (_reportPossibleCrUseOfMonsterType({
            error: Error()
          }), MonsterType) : MonsterType).ZombieBaby_0;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "monsterCountMax", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 50;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "brotherExcludeZ", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0;
        }
      })), _class2)) || _class);
      MonsterCreateQueue = (_dec6 = ccclass("MonsterCreateQueue"), _dec7 = property(MonsterCreateInfo), _dec6(_class4 = (_class5 = class MonsterCreateQueue {
        constructor() {
          this.curIndex = 0;

          _initializerDefineProperty(this, "monsterCreateInfoList", _descriptor5, this);
        }

      }, (_descriptor5 = _applyDecoratedDescriptor(_class5.prototype, "monsterCreateInfoList", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return [];
        }
      })), _class5)) || _class4);

      _export("MonsterCreate", MonsterCreate = (_dec8 = ccclass('MonsterCreate'), _dec9 = property({
        type: CCInteger,
        tooltip: '场景中最大怪物数量'
      }), _dec10 = property({
        type: CCInteger,
        tooltip: '补充阶段每帧最大生成数，防止大量死怪时瞬间补怪掉帧'
      }), _dec11 = property(MonsterCreateQueue), _dec12 = property({
        tooltip: 'ZombieBrother前后Z轴排斥范围，该范围内不能生成ZombieBaby'
      }), _dec13 = property({
        tooltip: '怪物X轴分布半宽，实际列间距=disX*2/rowCount'
      }), _dec14 = property({
        tooltip: '怪物X轴分布半宽，实际列间距=disX*2/rowCount'
      }), _dec15 = property(CCFloat), _dec16 = property({
        tooltip: '怪物中路X轴限制半宽，防止进入左右石板区域'
      }), _dec17 = property({
        tooltip: '左右石板区域Z轴起点，怪物只在该区间内限制中路'
      }), _dec18 = property({
        tooltip: '左右石板区域Z轴终点，怪物只在该区间内限制中路'
      }), _dec19 = property({
        tooltip: '每行生成的怪物数量'
      }), _dec20 = property({
        tooltip: '怪物Z轴每层间距'
      }), _dec8(_class7 = (_class8 = (_class9 = class MonsterCreate extends (_crd && UnityUpComponent === void 0 ? (_reportPossibleCrUseOfUnityUpComponent({
        error: Error()
      }), UnityUpComponent) : UnityUpComponent) {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "monsterCount", _descriptor6, this);

          _initializerDefineProperty(this, "maxSpawnPerFrame", _descriptor7, this);

          _initializerDefineProperty(this, "monsterCreateQueue", _descriptor8, this);

          _initializerDefineProperty(this, "brotherExcludeZ", _descriptor9, this);

          _initializerDefineProperty(this, "disX", _descriptor10, this);

          _initializerDefineProperty(this, "disX2", _descriptor11, this);

          _initializerDefineProperty(this, "monsterSpeed", _descriptor12, this);

          _initializerDefineProperty(this, "middleLaneHalfX", _descriptor13, this);

          _initializerDefineProperty(this, "sideSlabLimitMinZ", _descriptor14, this);

          _initializerDefineProperty(this, "sideSlabLimitMaxZ", _descriptor15, this);

          /** 每列间距，由 disX*2/rowCount 计算得出 */
          this.offX = 0;

          _initializerDefineProperty(this, "rowCount", _descriptor16, this);

          this._rowCount = 0;

          _initializerDefineProperty(this, "layerGapZ", _descriptor17, this);

          this._monsterList = [];
          this.posIndex = 0;

          /** 自上次生成ZombieBrother以来已生成的ZombieBaby数量 */
          // private _babyCountSinceLastBrother: number = 0;

          /** 下一个ZombieBaby的Z轴生成位置 */
          this._nextSpawnZ = 0;
          this._monsterBossCount = 0;
          this.bossDieCount = 0;
          this.stage_0 = 26.5;
          this.stage_1 = 15;
          this._hasInitialFilled = false;
          this.monsterMatIns = [0, 0, 0];
        }

        start() {
          this.offX = this.disX * 2 / this.rowCount;
          (_crd && EventManager === void 0 ? (_reportPossibleCrUseOfEventManager({
            error: Error()
          }), EventManager) : EventManager).instance.on((_crd && EventType === void 0 ? (_reportPossibleCrUseOfEventType({
            error: Error()
          }), EventType) : EventType).PLAYER_RESURRECTION, this.TimeFlowsBackWard, this);
          (_crd && EventManager === void 0 ? (_reportPossibleCrUseOfEventManager({
            error: Error()
          }), EventManager) : EventManager).instance.on((_crd && EventType === void 0 ? (_reportPossibleCrUseOfEventType({
            error: Error()
          }), EventType) : EventType).MONSTER_SKILL_XRD, this.skillXRMonster, this); // this.scheduleOnce(() => {
          //     this.skillXRMonster(2, 2, 2);
          // }, 2);
        }

        _update(deltaTime) {
          // if (this.isFlowIN) {
          //     return;
          // }
          if (!this._hasInitialFilled && this._monsterList.length >= this.monsterCount) {
            this._hasInitialFilled = true;
          }

          if (this._monsterList.length < this.monsterCount) {
            var quest = this.monsterCreateQueue.monsterCreateInfoList[this.monsterCreateQueue.curIndex];
            var monsterCount = quest.monsterCountMax - quest.curMonsterCount;
            var count = this.monsterCount - monsterCount + this._monsterList.length;

            if (count >= 0) {
              count = monsterCount;
            } else {
              count = this.monsterCount - this._monsterList.length;
            }

            var maxPerFrame = this._hasInitialFilled ? this.maxSpawnPerFrame : 51;

            if (count > maxPerFrame) {
              count = maxPerFrame;
            }

            for (var i = 0; i < count; i++) {
              if (quest.monsterType == (_crd && MonsterType === void 0 ? (_reportPossibleCrUseOfMonsterType({
                error: Error()
              }), MonsterType) : MonsterType).ZombieBrother) {
                this.spawnBrother();
              } else {
                this.spawnBaby();
              }
            }

            quest.curMonsterCount += count;

            if (quest.curMonsterCount == quest.monsterCountMax) {
              quest.curLoopCount++;
              this._nextSpawnZ += quest.brotherExcludeZ;

              if (quest.loopMax != -1 && quest.curLoopCount == quest.loopMax) {
                this.monsterCreateQueue.curIndex++;
                this.monsterCreateQueue.curIndex = this.monsterCreateQueue.curIndex % this.monsterCreateQueue.monsterCreateInfoList.length;
              }

              quest.init();
            }
          }

          for (var _i = this._monsterList.length - 1; _i >= 0; _i--) {
            var monster = this._monsterList[_i];

            if (monster.isDie) {
              // swap-and-pop替代splice，iOS优化
              if (monster.monsterType == (_crd && MonsterType === void 0 ? (_reportPossibleCrUseOfMonsterType({
                error: Error()
              }), MonsterType) : MonsterType).ZombieBrother) {
                this.bossDieCount++;

                if (this.bossDieCount == 2) {
                  this.scheduleOnce(() => {
                    (_crd && GameOverPanel === void 0 ? (_reportPossibleCrUseOfGameOverPanel({
                      error: Error()
                    }), GameOverPanel) : GameOverPanel).instance.show(true);
                  }, 1);
                }
              }

              this._monsterList[_i] = this._monsterList[this._monsterList.length - 1];

              this._monsterList.pop();
            } else if (monster.move.isPos) {
              var mz = monster.node.worldPositionZ;

              if (mz <= this.stage_0 && mz > this.stage_1) {
                var mx = monster.node.worldPositionX;
                var x = this.shouldLimitMonsterXAtZ(mz) || this.shouldLimitMonsterXAtZ(this.stage_1) ? this.clampMonsterX(mx) : mx;
                tempV3.x = x;
                tempV3.y = 0;
                tempV3.z = this.stage_1;
                monster.move.pos = tempV3;
                monster.initX = x;
              } else if (mz >= this.stage_1) {
                if (!monster.attackTarget || !monster.attackTarget.active) {
                  monster.move.moveMod = (_crd && MoveModEnum === void 0 ? (_reportPossibleCrUseOfMoveModEnum({
                    error: Error()
                  }), MoveModEnum) : MoveModEnum).targetMove;
                  monster.attackTarget = (_crd && Player === void 0 ? (_reportPossibleCrUseOfPlayer({
                    error: Error()
                  }), Player) : Player).instance.attackTarget.node;
                  monster.move.target = monster.attackTarget; // if (monster.monsterType == MonsterType.ZombieBaby_0) {
                  //     EventManager.instance.emit(EventType.Monster_Attack_Player_ADD, monster);
                  // }
                }
              }
            }

            this.limitMonsterToMiddleLane(monster);
          }

          if (MonsterCreate.isStartMove) {
            this._nextSpawnZ -= deltaTime * this.monsterSpeed;
          }
        }
        /** 生成ZombieBrother，放在排斥区域的中间 */


        spawnBrother() {
          var monster = this.getMonster((_crd && MonsterType === void 0 ? (_reportPossibleCrUseOfMonsterType({
            error: Error()
          }), MonsterType) : MonsterType).ZombieBrother);

          this._monsterList.push(monster);

          this.node.addChild(monster.node); // const layer = Math.floor(this._babyCountSinceLastBrother / this.rowCount);
          // const l = this.brotherInterval / this.rowCount;
          // let z = this._finallyBoss ? this._finallyBoss.z + this.brotherExcludeZ * 2 + this.layerGapZ * layer : this.layerCount * (this.layerGapZ * l + this.brotherExcludeZ) + this.brotherExcludeZ + this.layerGapZ * layer;

          this._nextSpawnZ += this.brotherExcludeZ;
          var z = this._nextSpawnZ;
          this._nextSpawnZ += this.brotherExcludeZ;
          monster.init(this._monsterBossCount * 2 + 1);
          monster.move.moveMod = (_crd && MoveModEnum === void 0 ? (_reportPossibleCrUseOfMoveModEnum({
            error: Error()
          }), MoveModEnum) : MoveModEnum).PosMove;
          monster.node.setPosition(this.clampMonsterX(0), 0, z);
          tempV3.set(monster.node.worldPosition);
          tempV3.z = this.stage_0;
          monster.move.pos = tempV3;
          monster.initX = 0; // this._brotherZPositions.push(z);

          this._monsterBossCount++;
        }
        /** 生成ZombieBaby，自动避开ZombieBrother的排斥区域 */


        spawnBaby() {
          var type = Math.random() < 0.5 ? (_crd && MonsterType === void 0 ? (_reportPossibleCrUseOfMonsterType({
            error: Error()
          }), MonsterType) : MonsterType).ZombieBaby_0 : (_crd && MonsterType === void 0 ? (_reportPossibleCrUseOfMonsterType({
            error: Error()
          }), MonsterType) : MonsterType).ZombieBaby_1;
          var monsterIns = this.monsterMatIns[type];
          var monster = this.getMonster(type);

          this._monsterList.push(monster);

          this.node.addChild(monster.node);

          if (!monsterIns) {
            this.monsterMatIns[type] = 1;
            monster.flashDie(0.01);
          } // const layer = Math.floor(this._babyCountSinceLastBrother / this.rowCount);
          // const l = this.brotherInterval / this.rowCount;
          // let z = this._finallyBoss ? this._finallyBoss.z + this.brotherExcludeZ + this.layerGapZ * layer : this.layerCount * (this.layerGapZ * l + this.brotherExcludeZ) + this.layerGapZ * layer;
          // 安全检查：确保不在排斥区域内
          // let needCheck = true;
          // while (needCheck) {
          //     needCheck = false;
          //     for (const brotherZ of this._brotherZPositions) {
          //         if (z >= brotherZ - this.brotherExcludeZ && z <= brotherZ + this.brotherExcludeZ) {
          //             z = brotherZ + this.brotherExcludeZ + 0.1;
          //             this._nextSpawnZ = z;
          //             this._babiesAtCurrentZ = 0;
          //             needCheck = true;
          //             break;
          //         }
          //     }
          // }


          var z = this._nextSpawnZ + (Math.random() - 0.5) * this.layerGapZ;
          var rawX = (Math.random() - 0.5) * this.offX + (this.posIndex - (this.rowCount - 1) / 2) * this.offX;
          var x = this.shouldLimitMonsterXAtZ(z) ? this.clampMonsterX(rawX) : rawX;
          this.posIndex = (this.posIndex + 1) % this.rowCount;
          monster.move.moveMod = (_crd && MoveModEnum === void 0 ? (_reportPossibleCrUseOfMoveModEnum({
            error: Error()
          }), MoveModEnum) : MoveModEnum).PosMove;
          monster.node.setPosition(x, 0, z);
          tempV3.set(monster.node.worldPosition);
          tempV3.z = this.stage_0;
          monster.move.pos = tempV3;
          monster.initX = x;
          this._rowCount++;

          if (this._rowCount == this.rowCount) {
            this._nextSpawnZ += this.layerGapZ;
            this._rowCount = 0;
          }
        }

        shouldLimitMonsterXAtZ(z) {
          return z >= this.sideSlabLimitMinZ && z <= this.sideSlabLimitMaxZ;
        }

        clampMonsterX(x) {
          if (x > this.middleLaneHalfX) {
            return this.middleLaneHalfX;
          }

          if (x < -this.middleLaneHalfX) {
            return -this.middleLaneHalfX;
          }

          return x;
        }

        limitMonsterToMiddleLane(monster) {
          if (!this.shouldLimitMonsterXAtZ(monster.node.worldPositionZ)) {
            return;
          }

          var x = this.clampMonsterX(monster.node.x);

          if (monster.node.x != x) {
            monster.node.x = x;
          }

          if (monster.move) {
            monster.move.pos.x = this.clampMonsterX(monster.move.pos.x);
          }
        }

        getMonster(type) {
          if (type === void 0) {
            type = (_crd && MonsterType === void 0 ? (_reportPossibleCrUseOfMonsterType({
              error: Error()
            }), MonsterType) : MonsterType).ZombieBaby_0;
          }

          var monster = (_crd && PoolManager === void 0 ? (_reportPossibleCrUseOfPoolManager({
            error: Error()
          }), PoolManager) : PoolManager).instance.getPool((_crd && PoolEnum === void 0 ? (_reportPossibleCrUseOfPoolEnum({
            error: Error()
          }), PoolEnum) : PoolEnum).monster + type);

          if (!monster) {
            var node = (_crd && PrefabsManager === void 0 ? (_reportPossibleCrUseOfPrefabsManager({
              error: Error()
            }), PrefabsManager) : PrefabsManager).instance.GetPrefabsIns((_crd && PrefabsEnum === void 0 ? (_reportPossibleCrUseOfPrefabsEnum({
              error: Error()
            }), PrefabsEnum) : PrefabsEnum).monster, type);
            monster = node.getComponent(_crd && MonsterBattleTaerget === void 0 ? (_reportPossibleCrUseOfMonsterBattleTaerget({
              error: Error()
            }), MonsterBattleTaerget) : MonsterBattleTaerget);
          }

          monster.node.active = true;
          monster.init(1);
          monster.attackTarget = null;
          return monster;
        } // private isFlowIN = false;


        TimeFlowsBackWard() {
          var _this = this;

          var _loop = function _loop() {
            var monster = _this._monsterList[i];
            monster.move.autoMove = false;

            if (monster.attackTarget) {
              var z = -26.3 + Math.abs(-26.3 - monster.node.z) + 10 + Math.random() * 5;
              var resetX = _this.shouldLimitMonsterXAtZ(-26.3) ? _this.clampMonsterX(monster.initX) : monster.initX;
              tween(monster.node).to(0.05, {
                x: resetX,
                z: -26.3
              }).to(0.35, {
                z: z
              }).call(() => {
                monster.move.autoMove = true;
                monster.move.moveMod = (_crd && MoveModEnum === void 0 ? (_reportPossibleCrUseOfMoveModEnum({
                  error: Error()
                }), MoveModEnum) : MoveModEnum).PosMove;
                tempV3.set(monster.node.worldPosition);
                tempV3.z = _this.stage_1;
                monster.attackTarget = null;
                monster.move.pos = tempV3;
              }).start();
            } else {
              tween(monster.node).to(0.4, {
                z: monster.node.z + 15
              }).call(() => {
                monster.move.autoMove = true;
              }).start();
            }
          };

          // this.isFlowIN = true;
          for (var i = 0; i < this._monsterList.length; i++) {
            _loop();
          } // this.scheduleOnce(() => {
          //     this.isFlowIN = false;
          // }, 0.4);

        }

        skillXRMonster(x, r, delay) {
          var _this2 = this;

          if (delay === void 0) {
            delay = 0;
          }

          var monsterList = this._monsterList;

          var _loop2 = function _loop2() {
            var monster = monsterList[i];
            if (monster.monsterType === (_crd && MonsterType === void 0 ? (_reportPossibleCrUseOfMonsterType({
              error: Error()
            }), MonsterType) : MonsterType).ZombieBrother) return 0; // continue

            if (monster.node.worldPositionZ < _this2.stage_1) return 0; // continue

            var mx = monster.node.worldPositionX;
            var offx = mx - (x - r / 3);
            var absX = Math.abs(offx);
            var fx = offx / absX;

            if (absX <= r) {
              // === 命中：击飞 ===
              var pos = monster.node.worldPosition;
              var endPos = (_crd && PoolManager === void 0 ? (_reportPossibleCrUseOfPoolManager({
                error: Error()
              }), PoolManager) : PoolManager).instance.V3;
              console.log("fx2", fx);
              var px = fx * Math.random() * 20 + fx * 4;
              var skillEndX = px + fx * 8;
              endPos.x = _this2.shouldLimitMonsterXAtZ(pos.z) ? _this2.clampMonsterX(skillEndX) : skillEndX;
              endPos.z = pos.z;
              var cPos = (_crd && PoolManager === void 0 ? (_reportPossibleCrUseOfPoolManager({
                error: Error()
              }), PoolManager) : PoolManager).instance.V3;
              cPos.x = (pos.x + endPos.x) * 0.5;
              cPos.z = pos.z;
              endPos.y = -35 - Math.random() * 30;
              cPos.y = pos.y + 10 + Math.random() * 3; // === 爽感：冲击缩放（PoolManager池化，零GC） ===
              // const sclX = monster.node.scale.x;
              // const sclY = monster.node.scale.y;
              // const sclZ = monster.node.scale.z;
              // const sclTarget = PoolManager.instance.V3;
              // sclTarget.set(sclX * 1.6, sclY * 1.6, sclZ * 1.6);
              // const sclOrig = PoolManager.instance.V3;
              // sclOrig.set(sclX, sclY, sclZ);
              // tween(monster.node)
              //     .to(0.03, { scale: sclTarget }, { easing: 'quadOut' })
              //     .to(0.07, { scale: sclOrig }, { easing: 'quadIn' })
              //     .call(() => {
              //         PoolManager.instance.V3 = sclTarget;
              //         PoolManager.instance.V3 = sclOrig;
              //     })
              //     .start();
              // === 爽感：地面冲击波特效 ===
              // const dustPos = PoolManager.instance.V3;
              // dustPos.set(pos);
              // dustPos.y = 0;
              // EffectManager.instance.addShowEffect(dustPos, EffectEnum.Monsterhit, 3);
              // PoolManager.instance.V3 = dustPos;
              // // === 爽感：原hit保持（模型上方） ===
              // const effectPos = PoolManager.instance.V3;
              // effectPos.set(pos);
              // effectPos.y += 3;
              // EffectManager.instance.addShowEffect(effectPos, EffectEnum.Monsterhit, 2.5);
              // PoolManager.instance.V3 = effectPos;
              // === 爽感：飞行中旋转 ===

              var spinDir = fx;
              var spinAmount = spinDir * (15 + Math.random() * 165);
              var rotV3 = (_crd && PoolManager === void 0 ? (_reportPossibleCrUseOfPoolManager({
                error: Error()
              }), PoolManager) : PoolManager).instance.V3;
              rotV3.set(0, 0, spinAmount);
              tween(monster.fbx.node).to(0.7 + Math.random() * 0.5, {
                eulerAngles: rotV3
              }, {
                easing: 'sineIn'
              }).call(() => {
                (_crd && PoolManager === void 0 ? (_reportPossibleCrUseOfPoolManager({
                  error: Error()
                }), PoolManager) : PoolManager).instance.V3 = rotV3;
              }).start();
              var time = Math.random() * 0.2;
              (_crd && JumpManager === void 0 ? (_reportPossibleCrUseOfJumpManager({
                error: Error()
              }), JumpManager) : JumpManager).instance.jumpBezierByPoints(monster.node, 0.3 + Math.random() * 0.3, cPos, endPos).onComplete(() => {
                (_crd && PoolManager === void 0 ? (_reportPossibleCrUseOfPoolManager({
                  error: Error()
                }), PoolManager) : PoolManager).instance.V3 = endPos;
                (_crd && PoolManager === void 0 ? (_reportPossibleCrUseOfPoolManager({
                  error: Error()
                }), PoolManager) : PoolManager).instance.V3 = cPos;

                _this2.scheduleOnce(() => {
                  monster.node.eulerAngles = Vec3.ZERO;
                  monster.node.active = false;
                  monster.isDieD = true;
                  (_crd && FlashRedManager === void 0 ? (_reportPossibleCrUseOfFlashRedManager({
                    error: Error()
                  }), FlashRedManager) : FlashRedManager).instance.stopFlashRed(monster.node);
                  (_crd && PoolManager === void 0 ? (_reportPossibleCrUseOfPoolManager({
                    error: Error()
                  }), PoolManager) : PoolManager).instance.setPool((_crd && PoolEnum === void 0 ? (_reportPossibleCrUseOfPoolEnum({
                    error: Error()
                  }), PoolEnum) : PoolEnum).monster + monster.monsterType, monster);
                }, 0.05 + Math.random() * 0.2);
              }).setDelay(time);
              monster.isDieD = false;
              monster.skipDieFlash = true;

              _this2.scheduleOnce(() => {
                monster.Hit(200);
              }, time);

              monsterList.splice(i, 1);
            } // else if (absX <= r * 3.5 && monster.node.worldPositionZ > this.stage_0) {
            //     // === 范围边缘：横向推移（PoolManager池化，零GC） ===
            //     let px = fx * Math.random() * 4 + fx * 2;
            //     const bx = px + mx;
            //     if (bx > this.disX) {
            //         px = this.disX - mx;
            //     } else if (bx < -this.disX) {
            //         px = -this.disX - mx;
            //     }
            //     const targetX = monster.node.x + px;
            //     const dur = 0.35 + Math.random() * 0.15;
            //     const sclX = monster.node.scale.x;
            //     const sclY = monster.node.scale.y;
            //     const sclZ = monster.node.scale.z;
            //     const sclTarget = PoolManager.instance.V3;
            //     sclTarget.set(sclX * 1.3, sclY * 1.3, sclZ * 1.3);
            //     const sclOrig = PoolManager.instance.V3;
            //     sclOrig.set(sclX, sclY, sclZ);
            //     tween(monster.node)
            //         .to(0.03, { scale: sclTarget }, { easing: 'quadOut' })
            //         .to(0.07, { scale: sclOrig }, { easing: 'quadIn' })
            //         .call(() => {
            //             PoolManager.instance.V3 = sclTarget;
            //             PoolManager.instance.V3 = sclOrig;
            //         })
            //         .start();
            //     tween(monster.node)
            //         .to(dur, { x: targetX }, { easing: 'circOut' })
            //         .start();
            // }

          },
              _ret;

          for (var i = monsterList.length - 1; i >= 0; i--) {
            _ret = _loop2();
            if (_ret === 0) continue;
          } // === 爽感：根据命中数触发摄像机震动 ===


          (_crd && CameraMove === void 0 ? (_reportPossibleCrUseOfCameraMove({
            error: Error()
          }), CameraMove) : CameraMove).instance.Shake2(10);
        }

      }, _class9.isStartMove = false, _class9), (_descriptor6 = _applyDecoratedDescriptor(_class8.prototype, "monsterCount", [_dec9], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 500;
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class8.prototype, "maxSpawnPerFrame", [_dec10], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 5;
        }
      }), _descriptor8 = _applyDecoratedDescriptor(_class8.prototype, "monsterCreateQueue", [_dec11], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return new MonsterCreateQueue();
        }
      }), _descriptor9 = _applyDecoratedDescriptor(_class8.prototype, "brotherExcludeZ", [_dec12], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 2;
        }
      }), _descriptor10 = _applyDecoratedDescriptor(_class8.prototype, "disX", [_dec13], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 2.5;
        }
      }), _descriptor11 = _applyDecoratedDescriptor(_class8.prototype, "disX2", [_dec14], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 3;
        }
      }), _descriptor12 = _applyDecoratedDescriptor(_class8.prototype, "monsterSpeed", [_dec15], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 2;
        }
      }), _descriptor13 = _applyDecoratedDescriptor(_class8.prototype, "middleLaneHalfX", [_dec16], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 2;
        }
      }), _descriptor14 = _applyDecoratedDescriptor(_class8.prototype, "sideSlabLimitMinZ", [_dec17], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 22;
        }
      }), _descriptor15 = _applyDecoratedDescriptor(_class8.prototype, "sideSlabLimitMaxZ", [_dec18], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 200;
        }
      }), _descriptor16 = _applyDecoratedDescriptor(_class8.prototype, "rowCount", [_dec19], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 8;
        }
      }), _descriptor17 = _applyDecoratedDescriptor(_class8.prototype, "layerGapZ", [_dec20], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0.8;
        }
      })), _class8)) || _class7));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=9d658389d626f0de13238159a14cae93ca9ec13e.js.map