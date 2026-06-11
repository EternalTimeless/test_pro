import { instantiate, Node, Prefab } from "cc";

/**对象池 */
export default class PoolByLaya {
    public static _CLSID = 0;
    public static POOLSIGN = "__InPool";
    private static _poolDic: { [sign: string]: Node[] } = {};

    /**
     * 获取指定标识的对象池
     * @param sign 对象池标识
     * @returns 对象池数组
     */
    private static getPoolBySign(sign: string) {
        return PoolByLaya._poolDic[sign] || (PoolByLaya._poolDic[sign] = []);
    }

    /**
     * 清空指定标识的对象池
     * @param sign 对象池标识
     */
    static clearBySign(sign: string) {
        if (PoolByLaya._poolDic[sign]) {
            PoolByLaya._poolDic[sign].forEach(node => {
                node.destroy();
            });
            PoolByLaya._poolDic[sign].length = 0;
        }
    }

    /**
     * 回收对象到对象池（内部方法）
     * @param sign 对象池标识
     * @param item 要回收的对象
     */
    private static recover(sign: string, item: Node) {
        if (item) item.removeFromParent();
        if (item[PoolByLaya.POOLSIGN])
            return;
        item[PoolByLaya.POOLSIGN] = true;
        PoolByLaya.getPoolBySign(sign).push(item);
    }

    /**
     * 资源管理器专用的回收方法
     * @param instance 要回收的实例
     */
    static recoverForResMgr(instance: Node) {
        if (instance) {
            PoolByLaya.recover(instance.name, instance);
        }
    }

    /**
     * 通过类名回收对象
     * @param instance 要回收的对象实例
     */
    static recoverByClass(instance: Node) {
        if (instance) {
            var className = instance["name"];
            if (className)
                PoolByLaya.recover(className, instance);
        }
    }

    /**
     * 从对象池获取对象，如果对象池为空则创建新对象
     * @param sign 对象池标识
     * @param prefab 预制体
     * @returns 对象实例
     */
    static getItemByPrefab(sign: string, prefab: Prefab): Node {
        if (!PoolByLaya._poolDic[sign]) {
            rst = instantiate(prefab);
            rst[PoolByLaya.POOLSIGN] = false;
            return rst;
        }
        var pool = PoolByLaya.getPoolBySign(sign);
        if (pool.length) {
            var rst = pool.pop();
            rst[PoolByLaya.POOLSIGN] = false;
        }
        else {
            rst = instantiate(prefab);
            rst[PoolByLaya.POOLSIGN] = false;
        }
        return rst;
    }

    /**
     * 从对象池获取对象，如果对象池为空则通过创建函数创建新对象
     * @param sign 对象池标识
     * @param createFun 创建函数
     * @param caller 创建函数的this指向
     * @returns 对象实例
     */
    static getItemByCreateFun(sign: string, createFun: Function, caller = null): Node {
        var pool = PoolByLaya.getPoolBySign(sign);
        var rst = pool.length ? pool.pop() : createFun.call(caller);
        rst[PoolByLaya.POOLSIGN] = false;
        return rst;
    }

    /**
     * 从对象池获取对象
     * @param sign 对象池标识
     * @returns 对象实例，如果对象池为空则返回null
     */
    static getItem(sign: string): Node {
        var pool = PoolByLaya.getPoolBySign(sign);
        var rst = pool.length ? pool.pop() : null;
        if (rst) {
            rst[PoolByLaya.POOLSIGN] = false;
        }
        return rst;
    }
}




