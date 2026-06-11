# PBASDK 可玩广告SDK

## 快速开始
只适用于江娱

### 1. 初始化SDK

在游戏开始前调用初始化方法：

```typescript
/**
 * 初始化SDK
 * @param material 素材名称，打包好后自动注入
 * @param maxStage 最大关卡数，例如: 1，没有关卡的游戏可以传 1
 */
PBASDK.Init(SuperPackageJY.Instance.materialName, 1);
```

### 2. 基本使用流程

```typescript
// 游戏开始
PBASDK.GameStart()

// 触摸开始
PBASDK.TouchStart()

// 触摸结束
PBASDK.TouchEnd()

// 重试按钮点击时候调用
PBASDK.RePlay()

// 游戏结束
PBASDK.GameEnd(true) // true表示成功，false表示失败

// 下载
SuperPackageJY.Instance.Download()

// 下载
SuperPackageJY.Instance.AutoDownload()

// TCE下载，在常规版本中不起作用，TCE版本中会跳转
SuperPackageJY.Instance.DownloadTCE()
```