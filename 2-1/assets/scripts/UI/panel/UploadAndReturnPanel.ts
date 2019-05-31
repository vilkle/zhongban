import { BaseUI } from "../BaseUI";
import { UIManager } from "../../Manager/UIManager";
import GamePanel from "./GamePanel";
import SubmissionPanel from "./SubmissionPanel";
import {ListenerType} from "../../Data/ListenerType"
import {ListenerManager} from "../../Manager/ListenerManager"
import {AudioManager} from "../../Manager/AudioManager"


const { ccclass, property } = cc._decorator;

@ccclass
export default class UploadAndReturnPanel extends BaseUI {

    protected static className = "UploadAndReturnPanel";

    start() {

    }

    onFanHui() {
        UIManager.getInstance().closeUI(GamePanel);
        UIManager.getInstance().closeUI(UploadAndReturnPanel);
        ListenerManager.getInstance().trigger(ListenerType.OnEditStateSwitching, {state: 0})
        AudioManager.getInstance().stopAll();
    }

    onTiJiao() {
        //UIManager.getInstance().showUI(SubmissionPanel);
    }
}
