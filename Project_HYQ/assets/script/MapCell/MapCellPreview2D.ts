import { _decorator, Canvas, Component, instantiate, Label, Node, Quat, UITransform, v3, Vec3 } from 'cc';
import { MapCellPreview } from './MapCellPreview';
const { ccclass, property } = _decorator;

@ccclass('MapCellPreview2D')
export class MapCellPreview2D extends MapCellPreview {
    @property({ displayName: '重建地图', visible: false, override: true })
    public set tagCreateMapCell(value: boolean) { }
    @property({ displayName: '清空预览', visible: false, override: true })
    public set tagClearPoints(value: boolean) { }
    @property({ displayName: '创建预览', visible: false, override: true })
    public set tagPreviewMap(value: boolean) { }
    @property({ displayName: '流场实时预览', tooltip: "需要先创建预览", visible: false, override: true })
    tagViewFlow: boolean = false;

    get plane() {
        const planeNormal = new Vec3(0, 0, 1);
        const planePoint = new Vec3(0, 0, 0);
        return [planeNormal, planePoint];
    }

    protected rotateArrow(arrow: Node, direction: Vec3) {
        if (!direction || direction.length() == 0) return;

        const dir = v3(direction.x, direction.y, 0);
        const reference = new Vec3(0, 1, 0);

        const target = new Vec3();
        Vec3.normalize(target, dir);

        const rotation = new Quat();
        Quat.rotationTo(rotation, reference, target);

        arrow.setRotation(rotation);
    }
}


