import { ccenum, v3, Vec3 } from "cc";
import Singleton from "./Singleton";

export default class PoolManager extends Singleton {


    public static get instance() {
        return this.getInstance<PoolManager>();
    }

    private _pool: { [key: string]: any[] };


    private constructor() {
        super();
        this._pool = {};
    }
    /**
     * 获取缓存对象
     * @param key key=PoolEnum+当前Pool类型枚举     举例道具Key：PoolEnum.prop+PropEnum.gold
     * 
     * @returns 
     */
    public getPool<T>(key: string): T {
        let arr = this._pool[key];
        if (!arr) {
            this._pool[key] = arr = [];
            return null;
        }
        if (arr.length) {
            return arr.pop();
        }
        return null;
    }
    /**
     * 将对象添加的缓存池
     * @param key key=PoolEnum+当前Pool类型枚举     举例道具Key：PoolEnum.prop+PropEnum.gold
     * @param node 添加的对象
     */
    public setPool(key: string, node: any) {
        let arr = this._pool[key];
        if (!arr) {
            arr = this._pool[key] = [];
        }
        arr.push(node);
    }

    private _ve3C: number = 0;
    public get V3() {
        const v = this.getPool<Vec3>('V3');
        this._ve3C--;
        // console.log("get" + this._ve3C);
        if (!v) {
            return v3(Vec3.ZERO);
        }
        return v.set(Vec3.ZERO);
    }
    public set V3(v: Vec3) {
        this._ve3C++;
        // console.log("set" + this._ve3C);
        this.setPool('V3', v);
    }
}
