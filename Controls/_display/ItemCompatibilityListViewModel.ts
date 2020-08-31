/**
 * Слой совместимости с ListViewModel для элемента коллекции
 * @private
 * @author Авраменко А.С.
 */

export interface IItemCompatibilityListViewModel {
    calcCursorClasses(clickable: boolean, cursor: string): string;
    item: {};
    key: string|number;
    isStickedMasterItem: boolean;
}

export class ItemCompatibilityListViewModel implements IItemCompatibilityListViewModel {
    get item(): {} {
        return this.getContents();
    }

    get key() {
        return this.getContents().getKey();
    }

    get isStickedMasterItem() {
        return false; // todo
    }
}
