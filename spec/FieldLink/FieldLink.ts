import IFieldLinkOptions = require("../options/IFieldLinkOptions");
import FieldLinkView = require("./FieldLinkView");


class FieldLink{
    constructor(options: IFieldLinkOptions){
        //либо получаем на вход готовый массив, либо вычитываем его
        let items = options.items || options.dataSource.query(options.selectedKey);
        let fieldLinkView = new FieldLinkView({
            text: options.text,
            trim: options.trim,
            maxLength: options.maxLength,
            inputRegExp: options.inputRegExp,
            placeholder: options.placeholder,
            selectOnClick: options.selectOnClick,
            informationIconColor: options.informationIconColor,
            textTransform: options.textTransform,
            focusOnActivatedOnMobiles: options.focusOnActivatedOnMobiles,
            items: items
        })
    }
}

export = FieldLink;