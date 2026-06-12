import { ccenum, instantiate, math, Prefab } from "cc";
import { BulletEnum, PoolEnum, PrefabsEnum } from "db://assets/Script/Base/EnumList";
import PoolManager from "db://assets/Script/Base/PoolManager";
import { PrefabsManager } from "db://assets/Script/Base/PrefabsManager";
import Singleton from "db://assets/Script/Base/Singleton";
import BulletBattle3D from "./Battle3D/Bullet/BulletBattle3D";
import BulletBattle2D from "./Battle2D/Bullet/BulletBattle2D";




export default class BulletManager extends Singleton {

    public static get instance() {
        return this.getInstance<BulletManager>();
    }
    /**
     * 
     * @param bulletEnum 子弹类型
     * @param angle 角度
     * @param damage 伤害
     * @param repelPower 击退力度
     * @returns 
     */
    public shootBullet(bulletEnum: BulletEnum, angle: number, damage: number, repelPower: number) {

        let bullet = PoolManager.instance.getPool<BulletBattle2D>(PoolEnum.bullet + bulletEnum);
        if (!bullet) {
            let pre = PrefabsManager.instance.GetPrefabsIns(PrefabsEnum.bullet, bulletEnum);
            let node = instantiate(pre);
            bullet = node.getComponent(BulletBattle2D);
        }
        bullet.setBulletInfo(angle, damage, repelPower);
        bullet.node.active = true;
        return bullet;
    }

    /**
     * 
     * @param bulletEnum 子弹类型
     * @param rot 角度
     * @param damage 伤害
     * @param repelPower 击退力度
     * @returns 
    */
    public shootBullet3D(bulletEnum: BulletEnum, rot: math.Quat, damage: number, repelPower: number) {

        let bullet = PoolManager.instance.getPool<BulletBattle3D>(PoolEnum.bullet + bulletEnum);
        if (!bullet) {
            let pre = PrefabsManager.instance.GetPrefabsIns(PrefabsEnum.bullet, bulletEnum);
            let node = instantiate(pre);
            bullet = node.getComponent(BulletBattle3D);
        }
        bullet.setBulletInfo(rot, damage, repelPower);
        bullet.node.active = true;
        return bullet;
    }




}