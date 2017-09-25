import TextBox = require("TextBox/TextBox");
import ITextBoxOptions = require("../../TextBox/Options");
import IItemsOptions = require("../../interfaces/options/IItemsOptions");

interface IFieldLinkViewOptions
    extends ITextBoxOptions,
            IItemsOptions {

}

class FieldLinkView {
    constructor(options: IFieldLinkViewOptions){

    }

}

export = FieldLinkView;