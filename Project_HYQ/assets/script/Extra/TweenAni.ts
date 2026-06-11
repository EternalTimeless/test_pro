import { Color, math, Node, sp, Sprite, Tween, tween, TweenSystem, UIOpacity, Vec3 } from "cc";

export default class TweenAni {

    public static beatAni(node: Node, s: number, off: number = 0.15) {
        let v2 = new Vec3(s, s);
        let v3 = new Vec3(s + off, s + off, 0);
        tween(node).to(0.1, { scale: v3 }).to(0.1, { scale: v2 }).start();
    }

    public static beatAni2(node: Node, ss: number, es: number) {
        let ess = es;
        if (es < 0) {
            ess = -es;
        }
        let sv3 = new Vec3(ss, ss, 0);
        node.setScale(sv3);
        let ev3 = new Vec3(ess, es, 0);
        tween(node).to(0.1, { scale: ev3 }, { easing: "backInOut" }).start();
    }

    public static aplAni(node: UIOpacity, num: number) {
        tween(node).to(0.2, { opacity: num }).start();
    }

    public static move(node: Node, endPos: Vec3, time: number, call: Function) {
        tween(node).to(time, { position: endPos }).call(() => { call }).start();
    }

    public static scale(node: Node, startScale: Vec3, endScale: Vec3, intervalTime: number, repeatTime: number = 1, call: Function = null) {
        node.setScale(startScale);
        tween(node)
            .to(intervalTime, { scale: endScale })
            .to(intervalTime, { scale: startScale })
            .union()
            .repeat(repeatTime).call(() => { call }).start();
    }

    public static jumpMove(node: Node, endPos: Vec3, time: number, callback: Function, jumpHeight: number = 100) {
        const startPos = node.position.clone(); // 起点
        const destPos = endPos; // 终点
        const middlePos = new Vec3((startPos.x + endPos.x) / 2, TweenAni.max(startPos.y, endPos.y) + jumpHeight, 0); // 中间点（抛物线顶点）

        // 二次贝塞尔曲线公式
        const twoBezier = (t: number, p1: Vec3, cp: Vec3, p2: Vec3) => {
            const x = (1 - t) ** 2 * p1.x + 2 * t * (1 - t) * cp.x + t ** 2 * p2.x;
            const y = (1 - t) ** 2 * p1.y + 2 * t * (1 - t) * cp.y + t ** 2 * p2.y;
            return new Vec3(x, y, 0);
        };

        tween(node.position)
            .to(time, destPos, {
                onUpdate: (target: Vec3, ratio: number) => {
                    node.setPosition(twoBezier(ratio, startPos, middlePos, destPos));
                }
            })
            .call(() => { callback })
            .start();
    }

    public static spFlashColor(sp: Sprite | sp.Skeleton, intervalTime: number, repeatTime: number = 1, flashColor: Color = new Color(255, 0, 0, 255)) {
        if (!sp || !sp.node || intervalTime <= 0 || repeatTime <= 0) {
            return;
        }
        sp.color.set(255, 255, 255, 255);
        Tween.stopAllByTarget(sp);
        tween(sp)
            .set({ color: flashColor })
            .delay(intervalTime)
            .set({ color: Color.WHITE })
            .delay(intervalTime)
            .union()
            .repeat(repeatTime)
            .start();

    }

    public static min(a: number, b: number) {
        return a < b ? a : b;
    }

    public static max(a: number, b: number) {
        return a > b ? a : b;
    }
}