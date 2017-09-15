import ITextBoxBaseOptions = require("./ITextBoxBaseOptions");
interface ITextBoxOptions extends ITextBoxBaseOptions{
    maxLength: number,
    inputRegExp: string,
    placeholder: string,
    selectOnClick: boolean,
    informationIconColor: boolean,
    textTransform: 'uppercase' | 'lowercase', 'none',
    trim: boolean
}

export = ITextBoxOptions