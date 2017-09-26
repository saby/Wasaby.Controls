import IEvent = require("../interfaces/IEvent");
import ITextBoxOptions = require("./Options");

class TextBox {
    public onInformationIconActivated: IEvent<void>;
    public onInformationIconMouseEnter: IEvent<void>;
    public onTextChange: IEvent<void>;

    constructor(options: ITextBoxOptions){

    }

}

export = TextBox;