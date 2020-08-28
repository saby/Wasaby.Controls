import {Logger} from 'UI/Utils';

/**
 * Слой совместимости с ListViewModel для элемента коллекции
 * @private
 * @author Авраменко А.С.
 */

export interface IItemCompatibilityListViewModel {
    calcCursorClasses(clickable: boolean, cursor: string): string;
    item: {};
    theme: string;
    style: string;
    hoverBackgroundStyle: string;
    isDragging: boolean;
    hasMultiSelect: boolean;
    multiSelectClassList: string;
    key: string|number;
    isAdd: boolean;
    spacingClassList: string;
    itemActionsPosition: string;
    isStickedMasterItem: boolean;
    itemPadding: {};
    rowSeparatorSize: string;
}

export class ItemCompatibilityListViewModel implements IItemCompatibilityListViewModel {
    get item(): {} {
        return this.getContents();
    }

    get key() {
        return this.getContents().getKey(); // todo
    }

    get isStickedMasterItem() {
        return false; // todo
    }
}
