/**
 * Created by kraynovdo on 22.09.2017.
 */
import DialogManager = require("./DialogManager");
import StackManager = require("./StackManager");
class OpenDialogAction {
    constructor(cfg) {};
    execute() {
        if (this._options.type == 'dialog') {
            let myDialogManager = new DialogManager();
            myDialogManager.showDialog()
        }
        else {
            let myStackManager = new StackManager();
            myStackManager.showStackArea()
        }
    }
}