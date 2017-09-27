/**
 * Created by kraynovdo on 19.09.2017.
 */
//синглтон
import PopupItemOptions = require("./resources/IPopupItemOptions");
class PopupManager {
    private constructor(){

    }
    private ModalOverlayPosition;
    private popupItems : Array<PopupItem>;
    public show(options: PopupItemOptions)
}
let singlePopupManager = new PopupManager();
export = singlePopupManager;