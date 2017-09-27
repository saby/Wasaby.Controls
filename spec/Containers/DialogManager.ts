/**
 * Created by kraynovdo on 22.09.2017.
 */
//синглтон
import PopupManager = require("./PopupManager");
DialogManager = {
    show() {
        PopupManager.show()
    }
};
export = DialogManager