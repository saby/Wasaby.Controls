/**
 * Created by kraynovdo on 21.09.2017.
 */
import ITemplate = require("./ITemplate");
class DialogTemplate {
    private topArea: ITemplate;
    private contentArea: ITemplate;
    constructor(options) {
        this.topArea = options.topArea;
        this.contentArea = options.contentArea;
    }
}