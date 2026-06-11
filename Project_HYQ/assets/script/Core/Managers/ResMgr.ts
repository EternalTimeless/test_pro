import { Asset, AssetManager, assetManager, Prefab, SpriteFrame, Node, instantiate, resources } from "cc";
import { logMgr } from "./LogMgr";
import { Parser } from "../Utils/Parser";
import { bundleMgr } from "./BundleMgr";
import PoolByLaya from "../../Common/PoolByLaya";

/** 
 * 资源管理器
 * 提供资源加载、释放功能。
 */
class ResMgr {
    /** 私有构造函数，确保外部无法直接通过new创建实例 */
    private constructor() { }

    /** 单例实例 */
    public static readonly instance: ResMgr = new ResMgr();

    /**
     * 加载预制体实例（带对象池）
     * @param url 预制体路径
     * @returns 返回预制体实例
     */
    public async getPrefabByPool(url: string) {
        // 先加载预制体资源
        // 先加载预制体资源
        const prefab = await this.loadRes<Prefab>(url);
        if (!prefab) {
            logMgr.err(`预制体资源加载失败：${url}`);
            return null;
        }

        // 从对象池获取或创建实例
        const instance = PoolByLaya.getItemByPrefab(prefab.name, prefab);
        if (!instance) {
            logMgr.err(`预制体实例创建失败：${url}`);
            return null;
        }
        return instance;
    }
    /**
     * 通过预制体创建对象池实例
     * @param prefab 预制体
     * @returns 实例
     */
    public createByPrefab(prefab: Prefab) {
        return PoolByLaya.getItemByPrefab(prefab.name, prefab);
    }
    /**
     * 回收实例到对象池
     * @param instance 实例
     */
    public recoverByPool(instance: Node) {
        if (instance) {
            PoolByLaya.recoverForResMgr(instance);
        }
    }

    /**
     * 加载资源
     * @param resPath 资源路径
     * @param onProgress 进度回调函数
     * @param onComplete 完成回调函数
     * @returns Promise<T> 加载完成后的Promise
     */
    public async loadRes<T extends Asset>(
        resPath: string,
        onProgress?: (completedCount: number, totalCount: number, item: any) => void,
        onComplete?: (err: Error | null, asset: T) => void
    ): Promise<T> {
        try {
            const { bundleName, path } = Parser.path(resPath);
            const bundle = await bundleMgr.getBundle(bundleName);
            return await this.loadAsset<T>(bundle, path, onProgress, onComplete);
        } catch (error) {
            logMgr.err(`加载资源失败: ${resPath}`, error.message);
            throw error;
        }
    }

    /**
     * 加载目录下的所有资源
     * @param resPath 资源路径
     * @param onProgress 进度回调函数
     * @param onComplete 完成回调函数
     * @returns Promise<Array<Asset>> 加载完成后的Promise
     */
    public async loadResDir(
        resPath: string,
        onProgress?: (completedCount: number, totalCount: number, item: any) => void,
        onComplete?: (err: Error | null, assets: Array<Asset>) => void
    ): Promise<Array<Asset>> {
        try {
            const { bundleName, path } = Parser.path(resPath);
            const bundle = await bundleMgr.getBundle(bundleName);
            return await this.loadAssetDir(bundle, path, onProgress, onComplete);
        } catch (error) {
            logMgr.err(`加载目录失败: ${resPath}`, error.message);
            throw error;
        }
    }

    /**
     * 释放指定分包单个资源
     * @param resPath 资源路径
     */
    public releaseRes(resPath: string): void {
        const { bundleName, path } = Parser.path(resPath);
        const bundle = assetManager.getBundle(bundleName);
        if (bundle) {
            bundle.release(path);
        } else {
            logMgr.err(`分包 ${bundleName} 未找到，无法释放资源 ${path}。`);
        }
    }

    /**
     * 释放指定分包全部资源
     * @param bundleName 分包名称
     */
    public releaseBundle(bundleName: string): void {
        const bundle = assetManager.getBundle(bundleName);
        if (bundle) {
            bundle.releaseAll();
            assetManager.removeBundle(bundle);
        } else {
            logMgr.err(`分包 ${bundleName} 未找到，无法移除。`);
        }
    }

    /** 移除所有分包 */
    public releaseAll(): void {
        assetManager.releaseAll();
    }

    /**
     * 加载单个资源的辅助方法
     * @param bundle 资源所在的分包
     * @param path 资源路径
     * @param onProgress 进度回调函数
     * @param onComplete 完成回调函数
     * @returns Promise<T> 加载完成后的Promise
     */
    private loadAsset<T extends Asset>(
        bundle: AssetManager.Bundle,
        path: string,
        onProgress?: (completedCount: number, totalCount: number, item: any) => void,
        onComplete?: (err: Error | null, asset: T) => void
    ): Promise<T> {
        return new Promise<T>((resolve, reject) => {
            bundle.load(
                path,
                (completedCount, totalCount, item) => onProgress?.(completedCount, totalCount, item),
                (err, asset) => {
                    onComplete?.(err, asset as T);
                    if (err) {
                        logMgr.err(`从分包加载资源 ${path} 失败`, err.message);
                        reject(err);
                    } else {
                        resolve(asset as T);
                    }
                }
            );
        });
    }

    /**
     * 加载目录下所有资源的辅助方法
     * @param bundle 资源所在的分包
     * @param path 目录路径
     * @param onProgress 进度回调函数
     * @param onComplete 完成回调函数
     * @returns Promise<Array<Asset>> 加载完成后的Promise
     */
    private loadAssetDir(
        bundle: AssetManager.Bundle,
        path: string,
        onProgress?: (completedCount: number, totalCount: number, item: any) => void,
        onComplete?: (err: Error | null, assets: Array<Asset>) => void
    ): Promise<Array<Asset>> {
        return new Promise<Array<Asset>>((resolve, reject) => {
            bundle.loadDir(
                path,
                (completedCount, totalCount, item) => onProgress?.(completedCount, totalCount, item),
                (err, assets) => {
                    onComplete?.(err, assets);
                    if (err) {
                        logMgr.err(`从分包加载目录 ${path} 失败`, err.message);
                        reject(err);
                    } else {
                        resolve(assets);
                    }
                }
            );
        });
    }
}

/** 资源管理器实例 */
export const resMgr = ResMgr.instance;
