System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3", "__unresolved_4", "__unresolved_5", "__unresolved_6", "__unresolved_7", "__unresolved_8", "__unresolved_9", "__unresolved_10", "__unresolved_11", "__unresolved_12", "__unresolved_13", "__unresolved_14"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, CCFloat, CCInteger, Node, Quat, tween, Vec3, MoveDrive, Role, getCirclePosition, ArmsTypeEnum, BulletEnum, EventType, PoolEnum, PrefabsEnum, RoleEnum, SoundEnum, PoolManager, EventManager, PrefabsManager, TweenTool, GameOverPanel, UnityUpComponent, AudioManager, BulletManager, FlashRedManager, BulletBatchRenderer, _dec, _dec2, _dec3, _dec4, _dec5, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _class3, _crd, ccclass, property, PlayerFBXAnimName, Player;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfMoveDrive(extras) {
    _reporterNs.report("MoveDrive", "../../Base/MoveRot/MoveDrive", _context.meta, extras);
  }

  function _reportPossibleCrUseOfRole(extras) {
    _reporterNs.report("Role", "./Role", _context.meta, extras);
  }

  function _reportPossibleCrUseOfgetCirclePosition(extras) {
    _reporterNs.report("getCirclePosition", "../../Tool/Index", _context.meta, extras);
  }

  function _reportPossibleCrUseOfArmsTypeEnum(extras) {
    _reporterNs.report("ArmsTypeEnum", "../../Base/EnumList", _context.meta, extras);
  }

  function _reportPossibleCrUseOfBulletEnum(extras) {
    _reporterNs.report("BulletEnum", "../../Base/EnumList", _context.meta, extras);
  }

  function _reportPossibleCrUseOfEventType(extras) {
    _reporterNs.report("EventType", "../../Base/EnumList", _context.meta, extras);
  }

  function _reportPossibleCrUseOfPoolEnum(extras) {
    _reporterNs.report("PoolEnum", "../../Base/EnumList", _context.meta, extras);
  }

  function _reportPossibleCrUseOfPrefabsEnum(extras) {
    _reporterNs.report("PrefabsEnum", "../../Base/EnumList", _context.meta, extras);
  }

  function _reportPossibleCrUseOfRoleEnum(extras) {
    _reporterNs.report("RoleEnum", "../../Base/EnumList", _context.meta, extras);
  }

  function _reportPossibleCrUseOfSoundEnum(extras) {
    _reporterNs.report("SoundEnum", "../../Base/EnumList", _context.meta, extras);
  }

  function _reportPossibleCrUseOfPoolManager(extras) {
    _reporterNs.report("PoolManager", "../../Base/PoolManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfEventManager(extras) {
    _reporterNs.report("EventManager", "../../Base/EventManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfPrefabsManager(extras) {
    _reporterNs.report("PrefabsManager", "../../Base/PrefabsManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfTweenTool(extras) {
    _reporterNs.report("TweenTool", "../../Tool/TweenTool", _context.meta, extras);
  }

  function _reportPossibleCrUseOfGameOverPanel(extras) {
    _reporterNs.report("GameOverPanel", "../UI/GameOver/GameOverPanel", _context.meta, extras);
  }

  function _reportPossibleCrUseOfUnityUpComponent(extras) {
    _reporterNs.report("UnityUpComponent", "../../Base/UnityUpComponent", _context.meta, extras);
  }

  function _reportPossibleCrUseOfAudioManager(extras) {
    _reporterNs.report("AudioManager", "../../Base/AudioManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfBulletManager(extras) {
    _reporterNs.report("BulletManager", "../Battle/BulletManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfFlashRedManager(extras) {
    _reporterNs.report("FlashRedManager", "../Battle/Base/FlashRedManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfBulletBatchRenderer(extras) {
    _reporterNs.report("BulletBatchRenderer", "../Battle/BulletBatchRenderer", _context.meta, extras);
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
      Node = _cc.Node;
      Quat = _cc.Quat;
      tween = _cc.tween;
      Vec3 = _cc.Vec3;
    }, function (_unresolved_2) {
      MoveDrive = _unresolved_2.MoveDrive;
    }, function (_unresolved_3) {
      Role = _unresolved_3.Role;
    }, function (_unresolved_4) {
      getCirclePosition = _unresolved_4.getCirclePosition;
    }, function (_unresolved_5) {
      ArmsTypeEnum = _unresolved_5.ArmsTypeEnum;
      BulletEnum = _unresolved_5.BulletEnum;
      EventType = _unresolved_5.EventType;
      PoolEnum = _unresolved_5.PoolEnum;
      PrefabsEnum = _unresolved_5.PrefabsEnum;
      RoleEnum = _unresolved_5.RoleEnum;
      SoundEnum = _unresolved_5.SoundEnum;
    }, function (_unresolved_6) {
      PoolManager = _unresolved_6.default;
    }, function (_unresolved_7) {
      EventManager = _unresolved_7.default;
    }, function (_unresolved_8) {
      PrefabsManager = _unresolved_8.PrefabsManager;
    }, function (_unresolved_9) {
      TweenTool = _unresolved_9.default;
    }, function (_unresolved_10) {
      GameOverPanel = _unresolved_10.GameOverPanel;
    }, function (_unresolved_11) {
      UnityUpComponent = _unresolved_11.UnityUpComponent;
    }, function (_unresolved_12) {
      AudioManager = _unresolved_12.default;
    }, function (_unresolved_13) {
      BulletManager = _unresolved_13.default;
    }, function (_unresolved_14) {
      FlashRedManager = _unresolved_14.FlashRedManager;
    }, function (_unresolved_15) {
      BulletBatchRenderer = _unresolved_15.BulletBatchRenderer;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "b41f7vy1r5GDYGyMwUkQXm3", "Player", undefined);

      __checkObsolete__(['_decorator', 'CCFloat', 'CCInteger', 'Component', 'Node', 'Quat', 'tween', 'Vec3']);

      ({
        ccclass,
        property
      } = _decorator);

      PlayerFBXAnimName = /*#__PURE__*/function (PlayerFBXAnimName) {
        PlayerFBXAnimName[PlayerFBXAnimName["idle"] = 0] = "idle";
        PlayerFBXAnimName[PlayerFBXAnimName["attack"] = 1] = "attack";
        PlayerFBXAnimName[PlayerFBXAnimName["run_attack"] = 2] = "run_attack";
        PlayerFBXAnimName[PlayerFBXAnimName["die"] = 3] = "die";
        PlayerFBXAnimName[PlayerFBXAnimName["run"] = 4] = "run";
        return PlayerFBXAnimName;
      }(PlayerFBXAnimName || {});

      _export("Player", Player = (_dec = ccclass('Player'), _dec2 = property(_crd && Role === void 0 ? (_reportPossibleCrUseOfRole({
        error: Error()
      }), Role) : Role), _dec3 = property(CCFloat), _dec4 = property({
        type: CCInteger,
        displayName: '+1人数上限',
        tooltip: '玩家通过 +1 最多增加到的角色数量。达到后继续吃 +1 只回收道具，不再增加角色。'
      }), _dec5 = property(Node), _dec(_class = (_class2 = (_class3 = class Player extends (_crd && UnityUpComponent === void 0 ? (_reportPossibleCrUseOfUnityUpComponent({
        error: Error()
      }), UnityUpComponent) : UnityUpComponent) {
        constructor(...args) {
          super(...args);
          this.LayerCount = 8;
          this.roleType = (_crd && RoleEnum === void 0 ? (_reportPossibleCrUseOfRoleEnum({
            error: Error()
          }), RoleEnum) : RoleEnum).underling;

          _initializerDefineProperty(this, "roleList", _descriptor, this);

          this.move = void 0;

          _initializerDefineProperty(this, "attackSpeed", _descriptor2, this);

          this.isDie = false;
          this.curCount = 1;

          _initializerDefineProperty(this, "maxRoleCount", _descriptor3, this);

          this.maxShootingRoleCount = 30;
          this.shootRoleStartIndex = 0;
          this.isLock = false;

          // public MoveX: number = 8;
          _initializerDefineProperty(this, "shootList", _descriptor4, this);

          this.shootIndex = 1;
          this.attackIn = false;
          this._attackTime = 0;
          this.roleR = 0.8;
          this.selectIndex = 0;
        }

        start() {
          Player.instance = this;
          this.move = this.node.getComponent(_crd && MoveDrive === void 0 ? (_reportPossibleCrUseOfMoveDrive({
            error: Error()
          }), MoveDrive) : MoveDrive);
          (_crd && EventManager === void 0 ? (_reportPossibleCrUseOfEventManager({
            error: Error()
          }), EventManager) : EventManager).instance.on((_crd && EventType === void 0 ? (_reportPossibleCrUseOfEventType({
            error: Error()
          }), EventType) : EventType).PLAYER_HIT, this.hit, this);
          (_crd && EventManager === void 0 ? (_reportPossibleCrUseOfEventManager({
            error: Error()
          }), EventManager) : EventManager).instance.on((_crd && EventType === void 0 ? (_reportPossibleCrUseOfEventType({
            error: Error()
          }), EventType) : EventType).PLAYER_HIT_2, this.hit_2, this);
        }

        _update(dt) {
          // const rx = RockerManager.instance.rockerDirection.x;
          // const x = this.node.x;
          // if (x < this.MoveX && rx < 0 || x > -this.MoveX && rx > 0) {
          //     this.move.moveEvent(dt);
          // } else {
          //     this.move.isMove = false;
          // }
          if (this.isLock) {
            this.roleAttack(dt);
          }

          this.roleMove();
        }

        roleAttack(dt) {
          if (this._attackTime <= 0) {
            // this.attackIn = true;
            const attackTime = 1 / this.attackSpeed;
            this._attackTime = attackTime; // const layer = Math.round(this.roleList.length / this.LayerCount) * 2 + 1;
            // for (let i = 0; i < layer; i++) {
            //     this.attackEvent(i);
            // }

            const shootCount = Math.min(this.roleList.length, this.maxShootingRoleCount);

            for (let i = 0; i < shootCount; i++) {
              const role = this.roleList[(this.shootRoleStartIndex + i) % this.roleList.length];

              if (!role.attackIN) {
                role.attackEvent(0, role.visualBulletCount, 1, this.node.worldPosition.x); // const animIndex = isMove ? PlayerFBXAnimName.run_attack : PlayerFBXAnimName.attack;
                // const animState = role.fbxManager.setAnimation(animIndex, false);
                // const endTime = animState.duration;
                // const animScale = endTime / attackTime;
                // animState.speed = animScale;
              }
            }

            if (this.roleList.length > 0) {
              this.shootRoleStartIndex = (this.shootRoleStartIndex + shootCount) % this.roleList.length;
            } // this.scheduleOnce(() => {
            //     this.attackIn = false;
            // }, attackTime)

          } else {
            this._attackTime -= dt;
          }
        }

        upArms(armwType) {
          switch (armwType) {
            case (_crd && ArmsTypeEnum === void 0 ? (_reportPossibleCrUseOfArmsTypeEnum({
              error: Error()
            }), ArmsTypeEnum) : ArmsTypeEnum).bq:
              (_crd && Role === void 0 ? (_reportPossibleCrUseOfRole({
                error: Error()
              }), Role) : Role).power = 2;
              this.attackSpeed = 4;
              (_crd && Role === void 0 ? (_reportPossibleCrUseOfRole({
                error: Error()
              }), Role) : Role).bulletType = (_crd && BulletEnum === void 0 ? (_reportPossibleCrUseOfBulletEnum({
                error: Error()
              }), BulletEnum) : BulletEnum).arrow_1;
              break;

            case (_crd && ArmsTypeEnum === void 0 ? (_reportPossibleCrUseOfArmsTypeEnum({
              error: Error()
            }), ArmsTypeEnum) : ArmsTypeEnum).jq:
              // Role.power = 3;
              (_crd && Role === void 0 ? (_reportPossibleCrUseOfRole({
                error: Error()
              }), Role) : Role).bulletType = (_crd && BulletEnum === void 0 ? (_reportPossibleCrUseOfBulletEnum({
                error: Error()
              }), BulletEnum) : BulletEnum).arrow_2;
              this.attackSpeed = 6;
              break;

            case (_crd && ArmsTypeEnum === void 0 ? (_reportPossibleCrUseOfArmsTypeEnum({
              error: Error()
            }), ArmsTypeEnum) : ArmsTypeEnum).jtl:
              (_crd && Role === void 0 ? (_reportPossibleCrUseOfRole({
                error: Error()
              }), Role) : Role).power = 0.5;
              this.attackSpeed = 10;
              (_crd && Role === void 0 ? (_reportPossibleCrUseOfRole({
                error: Error()
              }), Role) : Role).bulletType = (_crd && BulletEnum === void 0 ? (_reportPossibleCrUseOfBulletEnum({
                error: Error()
              }), BulletEnum) : BulletEnum).arrow_3;
              const newRoleType = (_crd && RoleEnum === void 0 ? (_reportPossibleCrUseOfRoleEnum({
                error: Error()
              }), RoleEnum) : RoleEnum).dazhuang;
              this.roleType = newRoleType;
              const count = this.roleList.length;
              (_crd && TweenTool === void 0 ? (_reportPossibleCrUseOfTweenTool({
                error: Error()
              }), TweenTool) : TweenTool).scaleShake(this.node);
              this.roleR = 1;
              (_crd && Role === void 0 ? (_reportPossibleCrUseOfRole({
                error: Error()
              }), Role) : Role).soundType = (_crd && SoundEnum === void 0 ? (_reportPossibleCrUseOfSoundEnum({
                error: Error()
              }), SoundEnum) : SoundEnum).Sound_FireGun;

              for (let i = 0; i < count; i++) {
                const role = this.roleList[i];
                const newRole = this.getRoleByType(newRoleType);
                this.roleList[i] = newRole;
                this.node.addChild(newRole.node);
                newRole.node.setPosition(role.node.position);
                role.node.active = false;
              }

              this.upPos();
              break;

            case (_crd && ArmsTypeEnum === void 0 ? (_reportPossibleCrUseOfArmsTypeEnum({
              error: Error()
            }), ArmsTypeEnum) : ArmsTypeEnum).jtl2:
              {
                (_crd && Role === void 0 ? (_reportPossibleCrUseOfRole({
                  error: Error()
                }), Role) : Role).power = 0.3;
                (_crd && Role === void 0 ? (_reportPossibleCrUseOfRole({
                  error: Error()
                }), Role) : Role).bulletType = (_crd && BulletEnum === void 0 ? (_reportPossibleCrUseOfBulletEnum({
                  error: Error()
                }), BulletEnum) : BulletEnum).arrow_4;
                this.attackSpeed = 20;
                const newRoleType = (_crd && RoleEnum === void 0 ? (_reportPossibleCrUseOfRoleEnum({
                  error: Error()
                }), RoleEnum) : RoleEnum).dazhuangPlus;
                this.roleType = newRoleType;
                const count = this.roleList.length;
                (_crd && TweenTool === void 0 ? (_reportPossibleCrUseOfTweenTool({
                  error: Error()
                }), TweenTool) : TweenTool).scaleShake(this.node);
                this.roleR = 1;
                (_crd && Role === void 0 ? (_reportPossibleCrUseOfRole({
                  error: Error()
                }), Role) : Role).soundType = (_crd && SoundEnum === void 0 ? (_reportPossibleCrUseOfSoundEnum({
                  error: Error()
                }), SoundEnum) : SoundEnum).Sound_FireGun;

                for (let i = 0; i < count; i++) {
                  const role = this.roleList[i];
                  const newRole = this.getRoleByType(newRoleType);
                  this.roleList[i] = newRole;
                  this.node.addChild(newRole.node);
                  newRole.node.setPosition(role.node.position);
                  role.node.active = false;
                }

                this.upPos();
                break;
              }

            case (_crd && ArmsTypeEnum === void 0 ? (_reportPossibleCrUseOfArmsTypeEnum({
              error: Error()
            }), ArmsTypeEnum) : ArmsTypeEnum).tk:
              (_crd && GameOverPanel === void 0 ? (_reportPossibleCrUseOfGameOverPanel({
                error: Error()
              }), GameOverPanel) : GameOverPanel).instance.show(true);
              break;

            case (_crd && ArmsTypeEnum === void 0 ? (_reportPossibleCrUseOfArmsTypeEnum({
              error: Error()
            }), ArmsTypeEnum) : ArmsTypeEnum).jj:
              (_crd && GameOverPanel === void 0 ? (_reportPossibleCrUseOfGameOverPanel({
                error: Error()
              }), GameOverPanel) : GameOverPanel).instance.show(true);
              break;
          }
        } //7.003 2.329


        roleMove() {
          const isMove = this.move.isMove;

          if (this.isLock) {
            for (let i = 0; i < this.roleList.length; i++) {
              const role = this.roleList[i];

              if (isMove) {
                role.fbxManager.setAnimation(PlayerFBXAnimName.run_attack, true);
              } else {
                role.fbxManager.setAnimation(PlayerFBXAnimName.attack, true);
              }
            }
          } else {
            for (let i = 0; i < this.roleList.length; i++) {
              const role = this.roleList[i];

              if (isMove) {
                role.fbxManager.setAnimation(PlayerFBXAnimName.run, true);
              } else {
                role.fbxManager.setAnimation(PlayerFBXAnimName.idle, true);
              }
            }
          }
        }

        addRole(role) {
          if (this.roleList.length >= this.maxRoleCount) {
            return false;
          }

          role.attackIN = true;
          this.roleList.push(role);
          this.curCount++;
          return true;
        }
        /**
         * 上移边界计算方法
         * 该方法用于计算角色列表中攻击状态角色的最远x坐标位置，并据此设置移动值
         */


        upMoveBoundary() {
          // 初始化最大x坐标值为0
          let x = 0; // 遍历角色列表

          for (let i = 0; i < this.roleList.length; i++) {
            // 获取当前角色
            const role = this.roleList[i]; // 如果角色处于攻击状态，则跳过该角色

            if (role.attackIN) {
              continue;
            } // 计算角色x坐标的绝对值


            const rx = Math.abs(role.node.x); // 更新最大x坐标值

            if (rx > x) {
              x = rx;
            }
          } // 在控制台输出边界值


          console.log("Boundary:" + x); // 设置移动对象的x轴移动值为8减去最大x坐标值

          this.move.MoveX = 7.8 - x;
        }

        getNextPos(index = -1, local = false) {
          if (index == -1) {
            index = this.roleList.length - 1;
          } // 列表第一个不算，用 index-1 作为有效索引
          // 第 n 层数量 = LayerCount * 2^n，前 n 层总数 = LayerCount * (2^n - 1)
          // layer = floor(log2(effectiveIndex / LayerCount + 1))


          const effectiveIndex = index - 1;
          const layer = Math.floor(Math.log2(effectiveIndex / this.LayerCount + 1));
          const layerCount = this.LayerCount << layer;
          const indexInLayer = effectiveIndex - this.LayerCount * ((1 << layer) - 1);

          if (local) {
            const pos = (_crd && getCirclePosition === void 0 ? (_reportPossibleCrUseOfgetCirclePosition({
              error: Error()
            }), getCirclePosition) : getCirclePosition)(Vec3.ZERO, layerCount, indexInLayer, (layer + 1) * this.roleR);
            return pos;
          } else {
            const pos = (_crd && getCirclePosition === void 0 ? (_reportPossibleCrUseOfgetCirclePosition({
              error: Error()
            }), getCirclePosition) : getCirclePosition)(this.node.worldPosition, layerCount, indexInLayer, (layer + 1) * this.roleR);
            return pos;
          }
        }

        get length() {
          return this.roleList.length;
        }

        get attackTarget() {
          this.selectIndex = (this.selectIndex + 1) % this.roleList.length;
          const role = this.roleList[this.selectIndex];
          return role;
        }

        upPos() {
          if (this.isDie) {
            return;
          }

          this.isDie = this.roleList.length == 0;

          if (this.isDie) {
            // this.TimeFlowsBackWard();
            (_crd && EventManager === void 0 ? (_reportPossibleCrUseOfEventManager({
              error: Error()
            }), EventManager) : EventManager).instance.on((_crd && EventType === void 0 ? (_reportPossibleCrUseOfEventType({
              error: Error()
            }), EventType) : EventType).PLAYER_RESURRECTION, this.TimeFlowsBackWard, this, true);
            (_crd && EventManager === void 0 ? (_reportPossibleCrUseOfEventManager({
              error: Error()
            }), EventManager) : EventManager).instance.emit((_crd && EventType === void 0 ? (_reportPossibleCrUseOfEventType({
              error: Error()
            }), EventType) : EventType).PLAYER_DIE);
            (_crd && GameOverPanel === void 0 ? (_reportPossibleCrUseOfGameOverPanel({
              error: Error()
            }), GameOverPanel) : GameOverPanel).instance.show(false);
          }

          for (let i = this.roleList.length - 1; i >= 0; i--) {
            const role = this.roleList[i];

            if (!role.node.active) {
              this.roleList.splice(i, 1);
              (_crd && PoolManager === void 0 ? (_reportPossibleCrUseOfPoolManager({
                error: Error()
              }), PoolManager) : PoolManager).instance.setPool((_crd && PoolEnum === void 0 ? (_reportPossibleCrUseOfPoolEnum({
                error: Error()
              }), PoolEnum) : PoolEnum).role + role.type, role);
            }
          }

          for (let i = 0; i < this.roleList.length; i++) {
            const role = this.roleList[i];

            if (!i) {
              tween(role.node).to(0.2, {
                position: Vec3.ZERO
              }).start();
            } else {
              const pos = this.getNextPos(i, true);
              tween(role.node).to(0.2, {
                position: pos
              }).call(() => {
                (_crd && PoolManager === void 0 ? (_reportPossibleCrUseOfPoolManager({
                  error: Error()
                }), PoolManager) : PoolManager).instance.V3 = pos;
              }).start();
            }
          }

          this.upMoveBoundary();
        }

        hit(pos, count = 4) {
          if (this.isDie) {
            return;
          }

          const list = this.roleList;
          const total = list.length;
          const len = count < total ? count : total; // 预分配距离数组，避免临时对象

          const dists = [];

          for (let i = 0; i < total; i++) {
            const rp = list[i].node.worldPosition;
            const dx = rp.x - pos.x;
            const dz = rp.z - pos.z;
            dists[i] = dx * dx + dz * dz;
          } // 选择法找最近的 len 个索引


          const picked = [];
          const used = [];

          for (let n = 0; n < len; n++) {
            let minIdx = -1;
            let minDist = 0;

            for (let i = 0; i < total; i++) {
              if (used[i]) continue;

              if (minIdx < 0 || dists[i] < minDist) {
                minIdx = i;
                minDist = dists[i];
              }
            }

            picked[n] = minIdx;
            used[minIdx] = true;
          } // 从后往前删除，保证索引不错位


          for (let i = 0; i < len; i++) {
            const role = list[picked[i]];
            role.hp -= 3;
            this.roleDie(role); // role.node.active = false;
            // PoolManager.instance.setPool(PoolEnum.role + this.roleType, role);
          }

          picked.sort(function (a, b) {
            return b - a;
          });

          for (let i = 0; i < len; i++) {
            list.splice(picked[i], 1);
          }

          this.upPos();
        }

        hit_2(role, power) {
          role.hp -= power;

          if (role.hp <= 0) {
            const index = this.roleList.indexOf(role);

            if (index != -1) {
              this.roleList.splice(index, 1);
              this.roleDie(role);
              this.upPos();
            }
          } else {
            (_crd && FlashRedManager === void 0 ? (_reportPossibleCrUseOfFlashRedManager({
              error: Error()
            }), FlashRedManager) : FlashRedManager).instance.flashRed(role.node, role.meshRedDataList);
          }
        }

        TimeFlowsBackWard() {
          this._attackTime = 0.5;
          this.shootRoleStartIndex = 0;

          for (let i = 0; i < this.curCount; i++) {
            const role = this.role;
            this.roleList.push(role);
            this.node.addChild(role.node);
            role.attackIN = false;

            if (i == 0) {
              role.node.setPosition(Vec3.ZERO);
            } else {
              const pos = this.getNextPos(i, true);
              role.node.setPosition(pos);
              (_crd && PoolManager === void 0 ? (_reportPossibleCrUseOfPoolManager({
                error: Error()
              }), PoolManager) : PoolManager).instance.V3 = pos;
            }

            role.node.setScale(Vec3.ZERO);
            tween(role.node).to(0.2, {
              scale: Vec3.ONE
            }, {
              easing: "backOut"
            }).start();
            role.fbxManager.setAnimation(PlayerFBXAnimName.idle, true);
          }

          this.selectIndex = 0;
          this.attackIn = false;
          this.scheduleOnce(() => {
            this.isDie = false;
          }, 2);
        }

        roleDie(role) {
          const endTime = role.fbxManager.setAnimation(PlayerFBXAnimName.die, false).duration;
          role.die(endTime);
          this.scheduleOnce(() => {
            role.node.active = false;
            (_crd && PoolManager === void 0 ? (_reportPossibleCrUseOfPoolManager({
              error: Error()
            }), PoolManager) : PoolManager).instance.setPool((_crd && PoolEnum === void 0 ? (_reportPossibleCrUseOfPoolEnum({
              error: Error()
            }), PoolEnum) : PoolEnum).role + role.type, role);
          }, endTime);
        }

        get role() {
          const role = this.getRoleByType(this.roleType);
          role.hp = 2;
          role.node.active = true;
          return role;
        }

        getRoleByType(roleType) {
          let role = (_crd && PoolManager === void 0 ? (_reportPossibleCrUseOfPoolManager({
            error: Error()
          }), PoolManager) : PoolManager).instance.getPool((_crd && PoolEnum === void 0 ? (_reportPossibleCrUseOfPoolEnum({
            error: Error()
          }), PoolEnum) : PoolEnum).role + roleType);

          if (!role) {
            const node = (_crd && PrefabsManager === void 0 ? (_reportPossibleCrUseOfPrefabsManager({
              error: Error()
            }), PrefabsManager) : PrefabsManager).instance.GetPrefabsIns((_crd && PrefabsEnum === void 0 ? (_reportPossibleCrUseOfPrefabsEnum({
              error: Error()
            }), PrefabsEnum) : PrefabsEnum).hero, roleType);
            role = node.getComponent(_crd && Role === void 0 ? (_reportPossibleCrUseOfRole({
              error: Error()
            }), Role) : Role);
          }

          role.hp = 2;
          role.node.active = true;
          return role;
        }

        attackEvent(index) {
          (_crd && AudioManager === void 0 ? (_reportPossibleCrUseOfAudioManager({
            error: Error()
          }), AudioManager) : AudioManager).inst.playOneShot((_crd && Role === void 0 ? (_reportPossibleCrUseOfRole({
            error: Error()
          }), Role) : Role).soundType, 0.3, 0.08); // console.log("攻击", index);

          const pos = this.shootList[index].worldPosition;
          const bullet = (_crd && BulletManager === void 0 ? (_reportPossibleCrUseOfBulletManager({
            error: Error()
          }), BulletManager) : BulletManager).instance.shootBullet3D((_crd && Role === void 0 ? (_reportPossibleCrUseOfRole({
            error: Error()
          }), Role) : Role).bulletType, Quat.IDENTITY, (_crd && Role === void 0 ? (_reportPossibleCrUseOfRole({
            error: Error()
          }), Role) : Role).power, (_crd && Role === void 0 ? (_reportPossibleCrUseOfRole({
            error: Error()
          }), Role) : Role).repelPower);
          (_crd && Role === void 0 ? (_reportPossibleCrUseOfRole({
            error: Error()
          }), Role) : Role).bulletLayer.addChild(bullet.node);
          bullet.node.setWorldPosition(pos);
          (_crd && Role === void 0 ? (_reportPossibleCrUseOfRole({
            error: Error()
          }), Role) : Role).aimBulletToCurrentTarget(bullet, this.node.worldPosition.x);
          (_crd && BulletBatchRenderer === void 0 ? (_reportPossibleCrUseOfBulletBatchRenderer({
            error: Error()
          }), BulletBatchRenderer) : BulletBatchRenderer).getOrCreate((_crd && Role === void 0 ? (_reportPossibleCrUseOfRole({
            error: Error()
          }), Role) : Role).bulletLayer).registerBullet(bullet); // this.effect?.play();
        } // private _soundTime: number = 0;
        // // private soundInterval: number = 0.2;
        // private attackSound(dt: number) {
        //     if (this._soundTime <= 0) {
        //         this._soundTime = 1 / (this.attackSpeed * (this.roleList.length));
        //     }
        // }


      }, _class3.instance = void 0, _class3), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "roleList", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return [];
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "attackSpeed", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 2;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "maxRoleCount", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 55;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "shootList", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return [];
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=120cba8f856407335ad8a04347cd4d36bf752a1e.js.map