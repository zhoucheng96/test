// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export class btnitems extends cc.Component {

    @property(cc.Label)
    showLabel: cc.Label = null;

    // LIFE-CYCLE CALLBACKS:
    clickCall: (showNum: cc.Node) => boolean;
    turnEnd: (showNum: cc.Node, show: boolean) => void;
    showdata = null;


    onLoad() {

    }

    start() {

    }

    initData(showData: number, clickCall: (showNum: cc.Node) => boolean, turnEnd: (showNum: cc.Node, show: boolean) => void) {
        this.showLabel.string = showData + '';
        this.showLabel.node.active = false;
        this.node.scaleX = 1;
        this.showdata = showData;
        this.clickCall = clickCall;
        this.turnEnd = turnEnd;
    }

    // 关闭显示
    rewardClose() {
        this.node.active = false;
    }

    btnClick() {
        // 先传递信息判断是否翻拍
        let show = this.clickCall(this.node);
        //　点击　翻拍效果　然后显示
        if (show) {
            this.aniTurn(true)
        }
    }

    aniTurn(show: boolean) {
        this.node.scaleX = 1;
        this.showLabel.node.active = !show;
        cc.tween(this.node)
            .to(0.25, { scaleX: 0 })
            .call(() => {
                this.showLabel.node.active = show;
            })
            .to(0.25, { scaleX: 1 })
            .call(() => {
                this.turnEnd(this.node, show);
            })
            .start()
    }

    getData() {
        return this.showdata
    }

    // update (dt) {}
}
