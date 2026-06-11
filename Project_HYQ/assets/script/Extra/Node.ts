
import * as cc from 'cc';
/**获取node正前方 */
export function getForward (node: cc.Node) {
    return cc.math.Vec3.transformQuat(new cc.math.Vec3(), cc.math.Vec3.UNIT_Z, node.worldRotation);
}
