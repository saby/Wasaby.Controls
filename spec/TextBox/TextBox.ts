import IEvent = require("../interfaces/IEvent");
import ITextBoxOptions = require("../options/ITextBoxOptions");

class TextBox  {
    public onInformationIconActivated: IEvent<void>;
    public onInformationIconMouseEnter: IEvent<void>;
    public onTextChange: IEvent<void>;

    constructor(options: ITextBoxOptions){

    }

}

export = TextBox;