import { _decorator, Collider, Component, Label, labelAssembler, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('PropBrand')
export class PropBrand extends Component {

    @property(Label)
    public lab: Label;

    public count: number = 0;

    @property(Collider)
    public collide: Collider;;



    init(num: number = 1) {
        this.count = num;
        this.lab.string = `+${num}`;
    }
}


