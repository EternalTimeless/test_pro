import { _decorator, Component, Line, Node, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('BulletLine')
export class BulletLine extends Component {
    private _startPos: Vec3 = new Vec3();
    private _endPos: Vec3 = new Vec3();
    private _line: Line = null;
    onLoad() {
        this._line = this.getComponent(Line);
    }
    initData(startPos: Vec3, endPos: Vec3) {
        this._startPos = startPos;
        this._endPos = endPos;
    }
    refreshLine(startPos: Vec3, endPos: Vec3) {
        this._startPos = startPos;
        this._endPos = endPos;
        this._line.positions = [this._startPos, this._endPos];
    }
    protected update(dt: number): void {
    }
}


