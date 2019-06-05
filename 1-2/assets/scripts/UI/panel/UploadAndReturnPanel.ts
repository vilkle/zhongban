import { BaseUI } from "../BaseUI";
import { UIManager } from "../../Manager/UIManager";
import GamePanel from "./GamePanel";
import SubmissionPanel from "./SubmissionPanel";
import {ListenerManager} from "../../Manager/ListenerManager"
import {ListenerType} from "../../Data/ListenerType"
import { OverTips } from "../Item/OverTips";
import { AudioManager } from "../../Manager/AudioManager";


const { ccclass, property } = cc._decorator;

@ccclass
export default class UploadAndReturnPanel extends BaseUI {

    protected static className = "UploadAndReturnPanel";

    start() {

    }

    onFanHui() {
        AudioManager.getInstance().stopAll();
        UIManager.getInstance().closeUI(OverTips);
        UIManager.getInstance().closeUI(GamePanel);
        UIManager.getInstance().closeUI(UploadAndReturnPanel);
        ListenerManager.getInstance().trigger(ListenerType.OnEditStateSwitching, {state: 0})
    }

    onTiJiao() {
        UIManager.getInstance().openUI(SubmissionPanel, 201);
    }
}
