// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { btnitems } from './btnitems';
const { ccclass, property } = cc._decorator;

@ccclass
export class NewClass extends cc.Component {

    @property(cc.Node)
    NodeGroup: cc.Node = null;
    @property(cc.Label)
    rewardLabel: cc.Label = null;

    @property(cc.Node)
    btnNode: cc.Node = null;
    btnNodePool: cc.NodePool;




    btnNodeList: cc.Node[] = [];
    // LIFE-CYCLE CALLBACKS:

    //当前第一个显示牌
    showpai0: cc.Node = null;
    //当前第二个显示牌
    showpai1: cc.Node = null;
    // 当前有牌在转动
    turnIng: boolean = null;
    onLoad() {
        this.btnNodePool = new cc.NodePool();

        this.btnNodePool.put(this.btnNode);
    }

    onEnable() {
        this.btnRefresh()
    }

    btnRefresh() {

        // 初始化对象池
        for (let node of this.btnNodeList) {
            this.btnNodePool.put(node);
        }

        // 清空节点数组
        this.btnNodeList = [];

        // 传入数据生成节点
        this.initData([1, 2, 3, 4, 5, 6, 7, 8].concat([1, 2, 3, 4, 5, 6, 7, 8]));

        this.rewardLabel.string = '获得奖励：'
    }

    initData(data: number[]) {
        this.NodeGroup.getComponent(cc.Layout).enabled = true;
        // 洗牌：数据打乱
        let tempDataList = this.xipai(data);

        // 生成节点
        for (let i = 0, len = tempDataList.length; i < len; i++) {
            let node = this.btnNodePool.get();
            if (!node) node = cc.instantiate(this.btnNode);
            node.active = true;
            node.parent = this.NodeGroup;
            node.setSiblingIndex(i);
            this.btnNodeList.push(node);
            node.getComponent(btnitems).initData(tempDataList[i], this.clickCall.bind(this), this.turnEnd.bind(this));
        }
        this.scheduleOnce(() => {

            this.NodeGroup.getComponent(cc.Layout).enabled = false;
        })
    }

    clickCall(showNodesc: cc.Node): boolean {
        // console.error('点击后', showNodesc.getComponent(btnitems).getData());
        
        if (this.turnIng) {
            // console.error('当前有牌在转动，不让转其他牌');
            return false;
        }

        this.turnIng = true;
        return true
    }

    turnFalseIndex = 0;
    turnEnd(showNodesc: cc.Node, show: boolean) {
        // 转完之后，如果是关闭显示 就不用其他操作了
        if (!show) {
            this.turnFalseIndex++;
            if (this.turnFalseIndex == 2) {
                this.showpai0 = null;
                this.showpai1 = null;
                this.turnIng = false;
                this.turnFalseIndex = 0;
            }
            return
        }


        // 当第一张牌没有时，赋值给第一张牌
        if (this.showpai0 == null) {
            this.showpai0 = showNodesc;
        } else if (this.showpai1 == null) {
            // 如果第一张牌有 第二张牌没有，赋值给第二张牌并进行比较
            this.showpai1 = showNodesc;

            if (this.showpai0.getComponent(btnitems).getData() == this.showpai1.getComponent(btnitems).getData()) {
                //如果俩张牌相等
                this.showReward(this.showpai0);

                // 关闭俩个牌的显示
                this.showpai0.getComponent(btnitems).rewardClose();
                this.showpai0 = null;
                this.showpai1.getComponent(btnitems).rewardClose();
                this.showpai1 = null;


                // 关闭显示后判断是否需要重启
                let refresh = true;
                for (let node of this.btnNodeList) {
                    if (node.active) refresh = false;
                }
                if (refresh) this.btnRefresh()
            } else {
                // 如果俩张牌不相等
                this.showpai0.getComponent(btnitems).aniTurn(false);
                this.showpai1.getComponent(btnitems).aniTurn(false);
                return;
            }
        }
        // console.error('转动完后', showNodesc)

        this.turnIng = false;
    }
    showReward(showNodesc: cc.Node) {
        // console.error('翻到相同的了', showNodesc.getComponent(btnitems).getData())
        this.rewardLabel.string += (showNodesc.getComponent(btnitems).getData() + ',')

    }
    xipai(dataList: number[]) {
        let tempData: number[] = [];
        let indexList: number[] = [];
        for (let i = 0, len = dataList.length; i < len; i++) {
            indexList.push(i);
        }
        for (let i = 0, len = dataList.length; i < len; i++) {
            // 随机找下标位置
            let index = Math.floor(Math.random() * indexList.length)
            // 下标对应的元素数组下标
            let data = indexList[index];

            // 临时数组添加该元素
            tempData.push(dataList[data]);
            // 下标数组删除该下标
            indexList.splice(index, 1);
        }

        if (tempData.length != dataList.length) {
            console.error('洗牌错误！！！！！！！')
        }
        return tempData
    }

    // update (dt) {}
}
