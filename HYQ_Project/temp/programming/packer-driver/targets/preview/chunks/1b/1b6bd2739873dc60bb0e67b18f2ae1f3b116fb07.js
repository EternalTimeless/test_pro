System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3", "__unresolved_4", "__unresolved_5"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, v3, LayerEnum, PropEnum, LayerManager, UnityUpComponent, BagBase, JumpManager, _dec, _class, _class2, _crd, ccclass, property, BuyWayBase;

  function _reportPossibleCrUseOfLayerEnum(extras) {
    _reporterNs.report("LayerEnum", "../../../Base/EnumList", _context.meta, extras);
  }

  function _reportPossibleCrUseOfPropEnum(extras) {
    _reporterNs.report("PropEnum", "../../../Base/EnumList", _context.meta, extras);
  }

  function _reportPossibleCrUseOfLayerManager(extras) {
    _reporterNs.report("LayerManager", "../../../Base/LayerManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfUnityUpComponent(extras) {
    _reporterNs.report("UnityUpComponent", "../../../Base/UnityUpComponent", _context.meta, extras);
  }

  function _reportPossibleCrUseOfBagBase(extras) {
    _reporterNs.report("BagBase", "../../Bag/Base/BagBase", _context.meta, extras);
  }

  function _reportPossibleCrUseOfShopping(extras) {
    _reporterNs.report("Shopping", "../Shopping", _context.meta, extras);
  }

  function _reportPossibleCrUseOfJumpManager(extras) {
    _reporterNs.report("JumpManager", "../../Jump/JumpManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfShopping_Super(extras) {
    _reporterNs.report("Shopping_Super", "../Shopping_Super", _context.meta, extras);
  }

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      v3 = _cc.v3;
    }, function (_unresolved_2) {
      LayerEnum = _unresolved_2.LayerEnum;
      PropEnum = _unresolved_2.PropEnum;
    }, function (_unresolved_3) {
      LayerManager = _unresolved_3.default;
    }, function (_unresolved_4) {
      UnityUpComponent = _unresolved_4.UnityUpComponent;
    }, function (_unresolved_5) {
      BagBase = _unresolved_5.BagBase;
    }, function (_unresolved_6) {
      JumpManager = _unresolved_6.JumpManager;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "9ae1fEKpI5GyIHzB4XhsvC9", "BuyWayBase", undefined);

      __checkObsolete__(['_decorator', 'Collider', 'ITriggerEvent', 'Vec3', 'v3', 'Node', 'Collider2D', 'Contact2DType', 'IPhysics2DContact']);

      ({
        ccclass,
        property
      } = _decorator); // CCClass(BagList);

      _export("BuyWayBase", BuyWayBase = (_dec = ccclass('BuyWayBase'), _dec(_class = (_class2 = class BuyWayBase extends (_crd && UnityUpComponent === void 0 ? (_reportPossibleCrUseOfUnityUpComponent({
        error: Error()
      }), UnityUpComponent) : UnityUpComponent) {
        constructor() {
          super(...arguments);

          /**
           * 购买列表
           */
          this.shopingList = [];
          this.nBagArr = [];
          this._bagArr = [];

          /**
           * 多道具购买列表
           */
          this.shoppingSuperList = [];
        }

        onLoad() {
          var children = this.node.children;

          for (var i = 0; i < children.length; i++) {
            var cNode = children[i];
            var bag = cNode.getComponent(_crd && BagBase === void 0 ? (_reportPossibleCrUseOfBagBase({
              error: Error()
            }), BagBase) : BagBase);

            if (bag) {
              this._bagArr[bag.placeId] = bag;
            }
          }

          this.refreshBagLocation();
        }

        _update(dt) {
          this.Shop();
          this.ShopSuper();
          this.bagUp();
          this.refreshBagLocation();
        }

        Shop() {
          var _this = this;

          var _loop = function _loop() {
            var shopping = _this.shopingList[i]; // if (PlayerManager.gold > 0) {

            if (shopping.isUse) {
              // PlayerManager.addGold(-1);
              // 判断是否还有足够的道具
              var layer = (_crd && LayerManager === void 0 ? (_reportPossibleCrUseOfLayerManager({
                error: Error()
              }), LayerManager) : LayerManager).instance.getLayer((_crd && LayerEnum === void 0 ? (_reportPossibleCrUseOfLayerEnum({
                error: Error()
              }), LayerEnum) : LayerEnum).Layer_2_sky);

              var bag = _this.getBag(shopping.propId);

              if (bag && bag.propCount) {
                var count = BuyWayBase.loopCount;

                if (count > bag.propCount) {
                  count = bag.propCount;
                }

                if (count > shopping.preGold) {
                  count = shopping.preGold;
                }

                if (shopping.propId == (_crd && PropEnum === void 0 ? (_reportPossibleCrUseOfPropEnum({
                  error: Error()
                }), PropEnum) : PropEnum).gold) {// AudioManager.inst.playOneShot(SoundEnum.Sound_TakeGold);
                } else {// AudioManager.inst.playOneShot(SoundEnum.Sound_CreateGold);
                }

                var _loop2 = function _loop2() {
                  var prop = bag.prop;
                  var node = prop.node;
                  var wPos = node.worldPosition;
                  layer.addChild(node);
                  node.setWorldPosition(wPos);
                  shopping.moneyPay(1);
                  var bagPos = shopping.jumpNode.worldPosition; // prop.rotVector = this.rotVector;

                  (_crd && JumpManager === void 0 ? (_reportPossibleCrUseOfJumpManager({
                    error: Error()
                  }), JumpManager) : JumpManager).instance.jumpScatter(node, bagPos, 0.5, Math.random() * 0.4 + 0.6, Math.random() * 360).setScatterRadius(0.75) // 小范围扩散，既明显又不会飞太远
                  .setRandomness(1) // 提高随机程度让轨迹更混乱
                  .onComplete(() => {
                    shopping.moneyAccount(1);
                    prop.remove();
                  });
                };

                for (var _i = 0; _i < count; _i++) {
                  _loop2();
                }
              }
            } // }

          };

          for (var i = 0; i < this.shopingList.length; i++) {
            _loop();
          }
        }
        /**
        * 处理多道具商店购买逻辑
        * 遍历 shoppingSuperList 中的每个 Shopping_Super
        * 每个 Shopping_Super 包含多个道具，需要分别处理
        */


        ShopSuper() {
          var _this2 = this;

          var _loop3 = function _loop3() {
            var shoppingSuper = _this2.shoppingSuperList[i]; // 检查商店是否可用

            if (!shoppingSuper.isUse) return 1; // continue
            // 遍历该商店的所有道具

            var items = shoppingSuper.allItems;

            var _loop4 = function _loop4() {
              var item = items[j]; // 检查该道具是否还有剩余

              if (item.prePaid <= 0) return 0; // continue
              // 获取对应背包

              var bag = _this2.getBag(item.propId);

              if (!bag || !bag.propCount) return 0; // continue

              var count = BuyWayBase.loopCount;

              if (count > bag.propCount) {
                count = bag.propCount;
              }

              if (count > item.prePaid) {
                count = item.prePaid;
              } // AudioManager.inst.playOneShot(SoundEnum.Sound_Gold);


              var _loop5 = function _loop5() {
                // 执行购买逻辑
                var prop = bag.prop;
                var node = prop.node;
                var wPos = node.worldPosition;
                var layer = (_crd && LayerManager === void 0 ? (_reportPossibleCrUseOfLayerManager({
                  error: Error()
                }), LayerManager) : LayerManager).instance.getLayer((_crd && LayerEnum === void 0 ? (_reportPossibleCrUseOfLayerEnum({
                  error: Error()
                }), LayerEnum) : LayerEnum).Layer_2_sky);
                layer.addChild(node);
                node.setWorldPosition(wPos);
                shoppingSuper.moneyPay(1, item.propId);
                var bagPos = shoppingSuper.node.worldPosition;
                (_crd && JumpManager === void 0 ? (_reportPossibleCrUseOfJumpManager({
                  error: Error()
                }), JumpManager) : JumpManager).instance.jumpScatter(node, bagPos, 2, Math.random() * 0.4 + 0.6, Math.random() * 360).setScatterRadius(0.75).setRandomness(1).onComplete(() => {
                  shoppingSuper.moneyAccount(1, item.propId);
                  prop.remove();
                });
              };

              for (var _i2 = 0; _i2 < count; _i2++) {
                _loop5();
              }
            },
                _ret;

            for (var j = 0; j < items.length; j++) {
              _ret = _loop4();
              if (_ret === 0) continue;
            }
          };

          for (var i = 0; i < this.shoppingSuperList.length; i++) {
            if (_loop3()) continue;
          }
        }

        bagUp() {
          var _this3 = this;

          var _loop6 = function _loop6() {
            var bag = _this3.nBagArr[i];

            if (bag.takeId != (_crd && PropEnum === void 0 ? (_reportPossibleCrUseOfPropEnum({
              error: Error()
            }), PropEnum) : PropEnum).null) {
              if (bag.isTake) {
                var fBag = _this3.getBag(bag.takeId);

                if (fBag) {
                  var count = BuyWayBase.loopCount;

                  if (count > bag.propCount) {
                    count = bag.propCount;
                  } // AudioManager.inst.playOneShot(SoundEnum.Sound_PlaceGold);


                  var _loop7 = function _loop7() {
                    var prop = bag.prop;
                    var node1 = prop.node;
                    var wPos = node1.worldPosition;
                    var layer = (_crd && LayerManager === void 0 ? (_reportPossibleCrUseOfLayerManager({
                      error: Error()
                    }), LayerManager) : LayerManager).instance.getLayer((_crd && LayerEnum === void 0 ? (_reportPossibleCrUseOfLayerEnum({
                      error: Error()
                    }), LayerEnum) : LayerEnum).Layer_2_sky);
                    layer.addChild(node1);
                    node1.setWorldPosition(wPos);
                    var endPos = v3(fBag.placePropPos);
                    var c = fBag.NODECOUNT;
                    (_crd && JumpManager === void 0 ? (_reportPossibleCrUseOfJumpManager({
                      error: Error()
                    }), JumpManager) : JumpManager).instance.jumpScatter(node1, endPos, 0.5, Math.random() * 0.4 + 0.6, Math.random() * 360).setScatterRadius(0.75).setRandomness(1).onComplete(() => {
                      fBag.addProp = prop;
                    }).setEndPosPre(node => {
                      var endOldPos = endPos;
                      var bag1 = fBag;
                      var count = c;
                      var endNewPos = bag1.getPropPlaceWordPos(count);
                      endNewPos.subtract(endOldPos);
                      endNewPos.add(node.worldPosition);
                      node.setWorldPosition(endNewPos);
                    }, _this3);
                  };

                  for (var _i3 = 0; _i3 < count; _i3++) {
                    _loop7();
                  }
                }
              }
            }

            if (bag.placeId != (_crd && PropEnum === void 0 ? (_reportPossibleCrUseOfPropEnum({
              error: Error()
            }), PropEnum) : PropEnum).null) {
              var _fBag = _this3.getBag(bag.placeId);

              if (_fBag) {
                if (_fBag.isPropCount) {
                  if (bag.isPlace) {
                    var _count = BuyWayBase.loopCount;

                    if (_count > _fBag.propCount) {
                      _count = _fBag.propCount;
                    } // AudioManager.inst.playOneShot(SoundEnum.Sound_CreateGold);


                    var _loop8 = function _loop8() {
                      var prop = _fBag.prop;
                      var node2 = prop.node;
                      var wPos = node2.worldPosition;
                      var layer = (_crd && LayerManager === void 0 ? (_reportPossibleCrUseOfLayerManager({
                        error: Error()
                      }), LayerManager) : LayerManager).instance.getLayer((_crd && LayerEnum === void 0 ? (_reportPossibleCrUseOfLayerEnum({
                        error: Error()
                      }), LayerEnum) : LayerEnum).Layer_2_sky);
                      layer.addChild(node2);
                      node2.setWorldPosition(wPos);
                      (_crd && JumpManager === void 0 ? (_reportPossibleCrUseOfJumpManager({
                        error: Error()
                      }), JumpManager) : JumpManager).instance.jumpScatter(node2, bag.placePropPos, 0.5, Math.random() * 0.4 + 0.6, Math.random() * 360).setScatterRadius(0.75).setRandomness(1).onComplete(() => {
                        bag.addProp = prop;
                      });
                    };

                    for (var _i4 = 0; _i4 < _count; _i4++) {
                      _loop8();
                    }
                  }
                }
              }
            }
          };

          for (var i = 0; i < this.nBagArr.length; i++) {
            _loop6();
          }
        }

        getBag(propId) {
          return this._bagArr[propId];
        }

        refreshBagLocation() {
          var index = 0;

          for (var i = 0; i < this._bagArr.length; i++) {
            var bag = this._bagArr[i];

            if (bag && bag.propCount) {
              // bag.node.setSiblingIndex(index);
              bag.node.z = index * -0.251;
              index++;
            }
          }
        }

      }, _class2.loopCount = 10, _class2)) || _class)); //-1.634  7


      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=1b6bd2739873dc60bb0e67b18f2ae1f3b116fb07.js.map