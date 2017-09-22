/**
 * Created by kraynovdo on 22.09.2017.
 */
import PopupManager = require("./PopupManager");
class DialogManager {
    public showDialog() {
        let myPopupManager = new PopupManager();
        myPopupManager.showPopup()
    }
}
export = DialogManager