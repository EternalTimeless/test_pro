# Tweener 缓动效果实战示例与应用场景

## 📊 缓动效果可视化对比图

![Tweener缓动效果对比图](./tweener-cheat-sheet.png)

*所有缓动效果的曲线对比 - 基于 Robert Penner 的原始缓动方程*

---

## 📑 目录速查

### 常用推荐（新手必看）
- [🌟 **Expo 系列**](#6-expo-系列--默认值) - **默认推荐，90%场景适用** | 快速响应、UI元素出现、按钮反馈
- [🎯 **Back 系列**](#8-back-系列--回弹效果) - **回弹效果，最受欢迎** | 按钮点击、图标弹出、卡片展示
- [⚽ **Bounce 系列**](#9-bounce-系列--弹跳效果) - **弹跳落地** | 物品掉落、添加到购物车、俏皮动画

### 按力度选择
- [📏 **Linear（线性）**](#1-linear线性) - 匀速运动 | 进度条、旋转加载、传送带
- [🌊 **Sine 系列**](#2-sine-系列) - 最柔和 | 温和的UI过渡、模态框、菜单展开
- [📈 **Cubic 系列**](#3-cubic-系列) - 中等力度 | 常规UI动画、滑动导航、Tab切换
- [⚡ **Quart 系列**](#4-quart-系列) - 较强力度 | 强调的UI元素、搜索栏展开、重要通知
- [💥 **Quint 系列**](#5-quint-系列) - 极强力度 | 戏剧性效果、Boss登场、场景切换

### 特殊效果
- [🎪 **Elastic 系列**](#10-elastic-系列--弹性震荡) - 弹性震荡 | 特殊事件、成就解锁、点赞动画、错误摇晃
- [⭕ **Circ 系列**](#7-circ-系列) - 圆形曲线 | Material波纹、圆形菜单、环形进度

### 快速决策
```
需要快速响应？      → Expo (easeOutExpo)
需要有趣的效果？    → Back (easeOutBack)
模拟物体掉落？      → Bounce (easeOutBounce)
特殊事件强调？      → Elastic (easeOutElastic)
温和柔软的过渡？    → Sine (easeInOutSine)
```

---

## 1. Linear（线性）

### 特点
匀速运动，没有加速或减速

### 代码示例
```typescript
// 进度条填充 - 需要恒定速度
tween.to(progressBar, { width: 100 }, 2.0, { ease: "linear" });

// 传送带移动 - 匀速运动
tween.to(conveyor, { x: -500 }, 5.0, { ease: "linear", repeat: -1 });

// 加载旋转图标 - 持续旋转
tween.to(loadingIcon, { rotation: 360 }, 1.0, { ease: "linear", repeat: -1 });
```

### 最佳使用场景
- ✅ 进度条加载
- ✅ 旋转加载动画
- ✅ 恒定速度的移动（如传送带、滚动字幕）
- ✅ 时间相关的动画（倒计时）
- ❌ 不适合：UI元素的出现/消失（太机械）

---

## 2. Sine 系列

### 2.1 easeInSine - 慢慢加速

```typescript
// 淡入对话框 - 温和的开始
tween.to(dialog, { alpha: 1 }, 0.4, { ease: "easeInSine" });

// 卡片飞入效果 - 从慢到快
tween.to(card, { y: 0 }, 0.6, { ease: "easeInSine" });
```

**适用场景：** 元素需要温和出现，不惊扰用户

### 2.2 easeOutSine - 慢慢减速

```typescript
// 下拉刷新释放 - 平滑停止
tween.to(refreshIndicator, { y: 0 }, 0.5, { ease: "easeOutSine" });

// 菜单展开 - 柔和停止
tween.to(menu, { height: 300 }, 0.4, { ease: "easeOutSine" });
```

**适用场景：** 元素需要平稳到达终点，给人安全感

### 2.3 easeInOutSine - 先加速后减速

```typescript
// 模态框出现 - 平滑进出
tween.to(modal, { scale: 1 }, 0.5, { ease: "easeInOutSine" });

// 页面切换 - 柔和过渡
tween.to(page, { x: -screenWidth }, 0.6, { ease: "easeInOutSine" });
```

**适用场景：** 最常用的柔和动画，适合大多数UI过渡

### 2.4 easeOutInSine - 先减速后加速

```typescript
// 特殊的缩放效果 - 中间有停顿感
tween.to(element, { scale: 2 }, 0.8, { ease: "easeOutInSine" });
```

**适用场景：** 需要中间暂停效果的动画（较少使用）

---

## 3. Cubic 系列

### 3.1 easeInCubic - 明显加速

```typescript
// 按钮按下反馈 - 快速响应
tween.to(button, { scale: 0.95 }, 0.2, { ease: "easeInCubic" });

// 元素下坠效果
tween.to(item, { y: 600 }, 0.5, { ease: "easeInCubic" });
```

**适用场景：** 需要快速响应的交互，增强力度感

### 3.2 easeOutCubic - 明显减速

```typescript
// 抽屉滑出 - 有力的停止
tween.to(drawer, { x: 0 }, 0.4, { ease: "easeOutCubic" });

// 通知弹出 - 快速出现后减速
tween.to(notification, { y: 20 }, 0.4, { ease: "easeOutCubic" });
```

**适用场景：** UI元素快速出现但平稳停止

### 3.3 easeInOutCubic - 强烈的加减速

```typescript
// 滑动导航 - 有力度的切换
tween.to(slider, { x: -800 }, 0.5, { ease: "easeInOutCubic" });

// Tab切换 - 明确的过渡
tween.to(tabContent, { alpha: 1, x: 0 }, 0.4, { ease: "easeInOutCubic" });
```

**适用场景：** 比Sine更有力度的常规UI动画，适合需要明确反馈的操作

### 3.4 easeOutInCubic

```typescript
// 中间强调效果
tween.to(highlight, { scale: 1.5 }, 0.6, { ease: "easeOutInCubic" });
```

**适用场景：** 中间有明显变化的动画

---

## 4. Quart 系列

### 4.1 easeInQuart - 非常明显的加速

```typescript
// 快速掉落效果
tween.to(fallingObject, { y: 800 }, 0.6, { ease: "easeInQuart" });

// 快速缩小消失
tween.to(element, { scale: 0 }, 0.3, { ease: "easeInQuart" });
```

**适用场景：** 删除动画、物体掉落

### 4.2 easeOutQuart - 非常明显的减速

```typescript
// 搜索栏展开 - 快速展开
tween.to(searchBar, { width: 400 }, 0.4, { ease: "easeOutQuart" });

// 重要通知弹出 - 有冲击力
tween.to(alert, { y: 100, alpha: 1 }, 0.5, { ease: "easeOutQuart" });
```

**适用场景：** 需要强调的UI元素出现，引起注意

### 4.3 easeInOutQuart - 强烈的动画

```typescript
// 全屏切换 - 强有力的过渡
tween.to(fullscreenPanel, { scale: 1 }, 0.6, { ease: "easeInOutQuart" });

// 重要状态变化
tween.to(statusIndicator, { x: 200 }, 0.5, { ease: "easeInOutQuart" });
```

**适用场景：** 重要的视图切换，需要强调变化

---

## 5. Quint 系列

### 5.1 easeInQuint - 极强加速

```typescript
// 火箭发射效果
tween.to(rocket, { y: -1000 }, 1.0, { ease: "easeInQuint" });

// 快速消失 - 戏剧性退出
tween.to(element, { x: 1000, alpha: 0 }, 0.5, { ease: "easeInQuint" });
```

**适用场景：** 戏剧性的离开效果，爆炸、发射动画

### 5.2 easeOutQuint - 极强减速

```typescript
// 英雄页面进入 - 震撼登场
tween.to(heroSection, { scale: 1, alpha: 1 }, 0.8, { ease: "easeOutQuint" });

// Boss出场动画
tween.to(boss, { y: 300 }, 1.0, { ease: "easeOutQuint" });
```

**适用场景：** 震撼的入场效果，Boss登场，重要内容展示

### 5.3 easeInOutQuint - 戏剧性过渡

```typescript
// 场景切换 - 史诗级过渡
tween.to(scene, { x: -screenWidth }, 1.0, { ease: "easeInOutQuint" });

// 重大事件动画
tween.to(achievement, { scale: 3, rotation: 360 }, 1.2, { ease: "easeInOutQuint" });
```

**适用场景：** 游戏中的重大事件，成就解锁，关键场景切换

---

## 6. Expo 系列 ⭐ (默认值)

### 6.1 easeInExpo - 指数级加速

```typescript
// 爆炸前的收缩
tween.to(bomb, { scale: 0.1 }, 0.3, { ease: "easeInExpo" });

// 快速飞出屏幕
tween.to(item, { x: 2000 }, 0.4, { ease: "easeInExpo" });
```

**适用场景：** 快速消失的动画，爆炸效果

### 6.2 easeOutExpo - 指数级减速 (默认)

```typescript
// 侧边栏滑入 - 快速响应
tween.to(sidebar, { x: 0 }, 0.5, { ease: "easeOutExpo" });

// Toast通知 - 快速出现
tween.to(toast, { y: 20, alpha: 1 }, 0.4, { ease: "easeOutExpo" });

// 按钮点击反馈
tween.to(button, { scale: 1.05 }, 0.3, { ease: "easeOutExpo" });
```

**适用场景：** 最常用的缓动！适合90%的UI出现动画，快速响应

### 6.3 easeInOutExpo - 快速的进出

```typescript
// 快速页面跳转
tween.to(page, { x: -screenWidth }, 0.4, { ease: "easeInOutExpo" });

// 快速模态框
tween.to(quickModal, { scale: 1 }, 0.35, { ease: "easeInOutExpo" });
```

**适用场景：** 需要快速、干脆的动画，现代化UI设计

---

## 7. Circ 系列

### 7.1 easeInCirc - 圆形加速

```typescript
// 圆形扩散动画开始
tween.to(circle, { scale: 0 }, 0.4, { ease: "easeInCirc" });

// 聚焦效果
tween.to(focusRing, { radius: 0 }, 0.5, { ease: "easeInCirc" });
```

**适用场景：** 圆形相关的动画，聚焦效果

### 7.2 easeOutCirc - 圆形减速

```typescript
// 波纹扩散效果
tween.to(ripple, { scale: 3, alpha: 0 }, 0.6, { ease: "easeOutCirc" });

// Material Design 点击波纹
tween.to(clickRipple, { scale: 2 }, 0.5, { ease: "easeOutCirc" });
```

**适用场景：** Material Design风格的波纹效果，水波扩散

### 7.3 easeInOutCirc - 圆形组合

```typescript
// 圆形菜单展开
tween.to(circularMenu, { rotation: 360, scale: 1 }, 0.6, { ease: "easeInOutCirc" });

// 环形进度动画
tween.to(circleProgress, { angle: 360 }, 1.0, { ease: "easeInOutCirc" });
```

**适用场景：** 圆形UI元素的动画，环形菜单

---

## 8. Back 系列 🎯 (回弹效果)

### 8.1 easeInBack - 先后退再前进

```typescript
// 弹弓效果 - 蓄力后发射
tween.to(projectile, { x: 500 }, 0.5, { ease: "easeInBack" });

// 卡片飞出前的准备
tween.to(card, { x: -screenWidth }, 0.4, { ease: "easeInBack" });
```

**适用场景：** 需要蓄力感的动画，弹弓、投掷效果

### 8.2 easeOutBack - 冲过终点再回弹 ⭐⭐⭐

```typescript
// 按钮点击 - 有趣的反馈
tween.to(button, { scale: 1 }, 0.4, { ease: "easeOutBack" });

// 图标弹出 - 活泼的动画
tween.to(icon, { y: 0, alpha: 1 }, 0.5, { ease: "easeOutBack" });

// 卡片进入 - 有弹性
tween.to(card, { x: 0, y: 0 }, 0.6, { ease: "easeOutBack" });

// 成功提示
tween.to(successIcon, { scale: 1 }, 0.5, { ease: "easeOutBack" });
```

**适用场景：** 最受欢迎的趣味动画！按钮点击、图标弹出、卡片展示、添加物品

### 8.3 easeInOutBack - 两端回弹

```typescript
// 摇摆动画 - 注意力吸引
tween.to(notification, { x: 0 }, 0.6, { ease: "easeInOutBack" });

// 强调动画
tween.to(highlight, { scale: 1.2 }, 0.5, { ease: "easeInOutBack" });
```

**适用场景：** 需要强调的元素，吸引注意力

---

## 9. Bounce 系列 ⚽ (弹跳效果)

### 9.1 easeInBounce - 开始弹跳

```typescript
// 球被弹起
tween.to(ball, { y: -300 }, 0.6, { ease: "easeInBounce" });
```

**适用场景：** 物体被弹起的动画

### 9.2 easeOutBounce - 落地弹跳 ⭐⭐

```typescript
// 物品掉落 - 真实的物理效果
tween.to(droppedItem, { y: groundY }, 0.8, { ease: "easeOutBounce" });

// 添加到购物车 - 弹跳落入
tween.to(cartItem, { y: cartY }, 0.6, { ease: "easeOutBounce" });

// 对话框弹出 - 俏皮效果
tween.to(dialog, { scale: 1 }, 0.7, { ease: "easeOutBounce" });

// 奖励掉落
tween.to(reward, { y: 400 }, 0.8, { ease: "easeOutBounce" });
```

**适用场景：** 物体掉落、添加物品、俏皮的UI动画、游戏奖励

### 9.3 easeInOutBounce - 两端弹跳

```typescript
// 弹跳球效果
tween.to(bouncingBall, { y: targetY }, 1.0, { ease: "easeInOutBounce" });

// 有趣的位置切换
tween.to(element, { x: newX }, 0.8, { ease: "easeInOutBounce" });
```

**适用场景：** 持续弹跳的动画，游戏中的弹跳元素

---

## 10. Elastic 系列 🎪 (弹性震荡)

### 10.1 easeInElastic - 开始震荡

```typescript
// 被拉伸后释放
tween.to(slingshot, { x: 500 }, 0.8, { ease: "easeInElastic" });
```

**适用场景：** 弹簧收缩效果

### 10.2 easeOutElastic - 结束震荡 ⭐⭐

```typescript
// 弹簧弹出效果 - 夸张的注意力吸引
tween.to(popup, { scale: 1 }, 0.8, { ease: "easeOutElastic" });

// 特殊奖励出现 - 兴奋感
tween.to(specialReward, { y: 0 }, 1.0, { ease: "easeOutElastic" });

// 点赞动画 - 有趣的反馈
tween.to(likeIcon, { scale: 1.5 }, 0.6, { ease: "easeOutElastic" });

// 错误摇晃提示
tween.to(errorInput, { x: 0 }, 0.6, { ease: "easeOutElastic" });
```

**适用场景：** 特殊事件、成就解锁、点赞收藏、错误提示（配合摇晃）

### 10.3 easeInOutElastic - 两端震荡

```typescript
// 极度夸张的动画
tween.to(crazyElement, { rotation: 360 }, 1.0, { ease: "easeInOutElastic" });

// 游戏中的特殊效果
tween.to(powerUp, { scale: 2 }, 1.2, { ease: "easeInOutElastic" });
```

**适用场景：** 游戏中的夸张效果，卡通风格动画

---

## 🎯 快速选择指南

### 常规 UI 动画（推荐）
```typescript
easeOutExpo      // 90%的情况用这个！快速、干脆
easeOutCubic     // 需要更柔和一点
easeInOutSine    // 需要非常柔和
```

### 有趣的 UI 动画
```typescript
easeOutBack      // 最受欢迎！轻微回弹
easeOutBounce    // 俏皮的弹跳
easeOutElastic   // 夸张的注意力吸引
```

### 快速响应（点击、悬停）
```typescript
easeOutExpo      // 快速响应
easeOutCubic     // 稍慢但有力
```

### 戏剧性效果
```typescript
easeOutQuint     // 震撼登场
easeInQuint      // 快速离场
easeOutElastic   // 特殊事件
```

### 物理模拟
```typescript
easeOutBounce    // 掉落弹跳
easeInQuad       // 自由落体
linear           // 匀速运动
```

---

## 💡 组合使用技巧

### 进入 + 离开
```typescript
// 元素进入 - 使用 easeOut 系列
tween.to(element, { x: 0, alpha: 1 }, 0.5, { ease: "easeOutBack" });

// 元素离开 - 使用 easeIn 系列
tween.to(element, { x: -100, alpha: 0 }, 0.3, { ease: "easeInCubic" });
```

### 连续动画
```typescript
// 第一步：快速出现
tween.to(element, { scale: 1 }, 0.4, { ease: "easeOutExpo" })
     .then(() => {
         // 第二步：轻微弹跳强调
         tween.to(element, { scale: 1.1 }, 0.2, { ease: "easeOutBack" })
              .then(() => {
                  // 第三步：恢复
                  tween.to(element, { scale: 1 }, 0.2, { ease: "easeInCubic" });
              });
     });
```

### 不同属性用不同缓动
```typescript
// 位置使用 Back，透明度使用 Expo
tween.to(element, { 
    x: 0,        // easeOutBack 用于位置
    alpha: 1     // easeOutExpo 用于透明度
}, 0.5, { ease: "easeOutBack" });

// 或者分开控制
tween.to(element, { x: 0 }, 0.5, { ease: "easeOutBack" });
tween.to(element, { alpha: 1 }, 0.3, { ease: "easeOutExpo" });
```

---

## ⚠️ 使用注意事项

### 不要过度使用
- ❌ 不要在所有地方都用 Elastic 或 Bounce
- ✅ 保留这些效果给特殊的、需要强调的元素
- ✅ 大部分情况用 easeOutExpo 或 easeOutCubic

### 时长匹配
```typescript
// Back/Bounce/Elastic 需要更长的时间
easeOutBack      // 0.4 - 0.6秒
easeOutBounce    // 0.6 - 0.8秒
easeOutElastic   // 0.8 - 1.0秒

// Expo/Cubic 可以更快
easeOutExpo      // 0.3 - 0.5秒
easeOutCubic     // 0.3 - 0.4秒
```

### 性能考虑
```typescript
// 大量元素同时动画 - 使用简单的缓动
tween.to(manyElements, { x: 100 }, 0.3, { ease: "easeOutCubic" });

// 而不是
// tween.to(manyElements, { x: 100 }, 0.8, { ease: "easeOutElastic" }); // ❌
```

---

## 📱 响应式建议

### 移动设备
- 动画更快（0.2 - 0.4秒）
- 使用简单的缓动（Expo、Cubic）
- 避免过度复杂的效果

### 桌面设备
- 可以使用更长的时间（0.4 - 0.6秒）
- 可以使用更复杂的效果（Back、Bounce）
- 悬停效果可以更精细

---

## 🎨 总结

| 场景 | 首选 | 备选 | 避免 |
|------|------|------|------|
| 通用UI动画 | easeOutExpo | easeOutCubic | Elastic |
| 按钮点击 | easeOutBack | easeOutExpo | Linear |
| 对话框 | easeOutExpo | easeInOutSine | easeInQuint |
| 通知提示 | easeOutCubic | easeOutExpo | Bounce |
| 删除动画 | easeInCubic | easeInQuart | easeOutElastic |
| 添加物品 | easeOutBounce | easeOutBack | Linear |
| 特殊事件 | easeOutElastic | easeOutBounce | Linear |
| 页面切换 | easeInOutCubic | easeInOutExpo | easeOutBounce |
| 物体掉落 | easeOutBounce | easeInQuad | Linear |
| 进度条 | Linear | easeOutSine | Back/Bounce |

---

记住：**好的动画是感觉不到的，差的动画让人厌烦。** 

从 `easeOutExpo` 开始，根据需要调整！ 🚀
