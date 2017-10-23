/**
 * Created by kraynovdo on 22.09.2017.
 */
import PopupManager = require("./PopupManager");
import BodyStrategy = require("./resources/BodyStrategy");
import StackStrategy = require("./resources/StackStrategy");
class OpenDialogAction {
    constructor(cfg) {};
    execute() {
        let strategy;
        if (cfg.mode == 'StackPanel') {
            strategy = new StackStrategy({opener: this});
        }
        else {
            strategy = new BodyStrategy();
        }
        PopupManager.show(cfg.dialogOptions, this, strategy);
    }
}