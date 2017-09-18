import ITextBoxBaseOptions = require("../TextBoxBase/Options");
interface Options extends ITextBoxBaseOptions{
    maxLength: number,
    inputRegExp: string,
    placeholder: string,
    selectOnClick: boolean,
    informationIconColor: boolean,
    textTransform: 'uppercase' | 'lowercase' | 'none',
    trim: boolean
}

export = Options