import ITextBoxOptions = require("./ITextBoxOptions");
import ISource = require("../interfaces/ISource");
import IItem = require("../interfaces/IItem");
import IItemsViewOptions = require("./IItemsViewOptions");

interface Dictionaries{

}

interface IFieldLinkOptions extends ITextBoxOptions, IItemsViewOptions {
    autoShow: true,
    chooserMode: 'dialog' | 'floatArea',
    dataSource: ISource,
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
    selectedItem: IItem,
    selectedItems: Array<any>,
    selectedKey: number,
    selectedKeys: Array<number>;
    showAllConfig: {},
    showEmptyList: boolean,
    sorting,
    startCharacter: number,
    textValue: string,
    useSelectorAction
}
export = IFieldLinkOptions;