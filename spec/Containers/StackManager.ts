/**
 * Created by kraynovdo on 19.09.2017.
 */
//синглтон
import PopupManager = require("./PopupManager");
class StackManager {
    private constructor(){

    }
    public show() {
    }
}
let singleStackManager = new StackManager();
export = singleStackManager;