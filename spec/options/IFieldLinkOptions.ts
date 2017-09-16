import ITextBoxOptions = require("./ITextBoxOptions");
import ISource = require("../interfaces/ISource");
import IItem = require("../interfaces/IItem");
import ISourceOptions = require("./common/ISourceOptions");
import IItemsOptions = require("./common/IItemsOptions");
import ISelectableOptions = require("./common/ISelecteableOptions");

interface Dictionaries{

}

interface IFieldLinkOptions
    extends ITextBoxOptions,
            IItemsOptions,
            ISourceOptions,
            ISelectableOptions{
    autoShow: true,
    chooserMode: 'dialog' | 'floatArea',
    dictionaries: Array<Dictionaries>,
    idProperty: string,
    keyboardLayoutRevert,
    list,//конфиг списка в автодополнении. прямо контент
    listFilter,
    loadItemsStrategy: 'append' | 'merge',
    multiSelect: boolean,
    pickerClassName: string,
    pickerConfig: {},
    searchDelay: number,
    searchParam: string,
    selectMode: 'dialog' | 'floatArea',
    //selectedItem: IItem, может быть это было нужно по отдельности?
    //selectedItems: Array<any>,
    selectedKeys: Array<number>;
    showAllConfig: {},
    showEmptyList: boolean,
    sorting,
    startCharacter: number,
    textValue: string,
    useSelectorAction
}
export = IFieldLinkOptions;