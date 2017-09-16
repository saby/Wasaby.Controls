import TextBox = require("TextBox/TextBox");
import ITextBoxOptions = require("../options/ITextBoxOptions");
import IItemsOptions = require("../options/common/IItemsOptions");

interface IFieldLinkViewOptions
    extends ITextBoxOptions,
            IItemsOptions {

}

class FieldLinkView {
    constructor(options: IFieldLinkViewOptions){

    }

}

export = FieldLinkView;