import { BaseUI, UIClass } from "../BaseUI";
import { ConstValue } from "../../Data/ConstValue";
import TeacherPanel from "./TeacherPanel";
import GamePanel from "./GamePanel";
import { UIManager } from "../../Manager/UIManager";
import { UIHelp } from "../../Utils/UIHelp";
import { NetWork } from "../../Http/NetWork";

const { ccclass, property } = cc._decorator;

@ccclass
export class LoadingUI extends BaseUI {

    protected static className = "LoadingUI";

    @property(cc.ProgressBar)
    private progressBar: cc.ProgressBar = null;
    @property(cc.Label)
    private progressLabel: cc.Label = null;
    @property(cc.Node)
    private dragonNode: cc.Node = null;

    onLoad() {
        NetWork.getInstance().GetRequest();
        let onProgress = (completedCount: number, totalCount: number, item: any) => {
            this.progressBar.progress = completedCount / totalCount;
            let value = Math.round(completedCount / totalCount * 100);
            if (ConstValue.IS_EDITIONS) {
                courseware.page.sendToParent('loading', value);
            }
            this.progressLabel.string = value.toString() + '%';
            let posX = completedCount / totalCount * 609 - 304;
            this.dragonNode.x = posX;
        };
        if (ConstValue.IS_EDITIONS) {
            courseware.page.sendToParent('load start');
        }
        let openPanel: UIClass<BaseUI> = ConstValue.IS_TEACHER ? TeacherPanel : GamePanel;
        UIManager.getInstance().openUI(openPanel, 0, () => {

            if (ConstValue.IS_EDITIONS) {
                courseware.page.sendToParent('load end');
                courseware.page.sendToParent('start');
            }
            this.node.active = false;
        }, onProgress);
    }
}