import { _decorator, Collider, Component, Label, Node, Sprite, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

enum PropBrandVisualKind {
    Model,
    Sprite,
    Label,
}

type PropBrandVisualRecord = {
    node: Node;
    offset: Vec3;
    kind: PropBrandVisualKind;
};

@ccclass('PropBrand')
export class PropBrand extends Component {

    @property(Label)
    public lab: Label;

    public count: number = 0;

    @property(Collider)
    public collide: Collider;;

    private visualActive: boolean = true;
    private visualRecords: PropBrandVisualRecord[] = [];

    public setVisualActive(active: boolean): void {
        if (this.visualActive === active) {
            return;
        }
        this.visualActive = active;
        if (this.visualRecords.length > 0) {
            for (let i = 0; i < this.visualRecords.length; i++) {
                this.visualRecords[i].node.active = active;
            }
            return;
        }
        for (let i = 0; i < this.node.children.length; i++) {
            this.node.children[i].active = active;
        }
    }

    public bindVisualGroups(modelGroup: Node, spriteGroup: Node, labelGroup: Node): void {
        if (this.visualRecords.length <= 0) {
            const children = this.node.children.concat();
            for (let i = 0; i < children.length; i++) {
                const child = children[i];
                const kind = this.getVisualKind(child);
                this.visualRecords.push({
                    node: child,
                    offset: new Vec3(child.position.x, child.position.y, child.position.z),
                    kind,
                });
            }
        }

        for (let i = 0; i < this.visualRecords.length; i++) {
            const record = this.visualRecords[i];
            const group = this.getVisualGroup(record.kind, modelGroup, spriteGroup, labelGroup);
            if (record.node.parent !== group) {
                record.node.setParent(group);
            }
        }
        this.setVisualActive(this.node.active);
        this.updateVisualTransform();
    }

    public updateVisualTransform(): void {
        for (let i = 0; i < this.visualRecords.length; i++) {
            const record = this.visualRecords[i];
            record.node.setPosition(
                this.node.position.x + record.offset.x,
                this.node.position.y + record.offset.y,
                this.node.position.z + record.offset.z
            );
        }
    }

    private getVisualKind(node: Node): PropBrandVisualKind {
        if (node.getComponent(Label)) {
            return PropBrandVisualKind.Label;
        }
        if (node.getComponent(Sprite)) {
            return PropBrandVisualKind.Sprite;
        }
        return PropBrandVisualKind.Model;
    }

    private getVisualGroup(kind: PropBrandVisualKind, modelGroup: Node, spriteGroup: Node, labelGroup: Node): Node {
        switch (kind) {
            case PropBrandVisualKind.Sprite:
                return spriteGroup;
            case PropBrandVisualKind.Label:
                return labelGroup;
            default:
                return modelGroup;
        }
    }

    init(num: number = 1) {
        this.count = num;
        this.lab.string = `+${num}`;
    }
}


