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
    calcCursorClasses(clickable: boolean, cursor: string): string {
        const cursorStyle = cursor || (clickable === false ? 'default' : 'pointer');
        if (typeof clickable !== 'undefined') {
            Logger.error('Controls/list:ItemTemplate', 'Option "clickable" is deprecated and will be removed in 20.7000. Use option "cursor" with value "default".');
        }
        return ` controls-ListView__itemV controls-ListView__itemV_cursor-${cursorStyle}`;
    }

    get item(): {} {
        return this.getContents();
    }

    get theme() {
        return 'default'; // todo
    }

    get style() {
        return 'default'; // todo
    }

    get hoverBackgroundStyle() {
        return this.style; // todo
    }

    get isDragging() {
        return false; // todo
    }

    get hasMultiSelect() {
        return false; // todo
    }

    get multiSelectClassList() {
        return ''; // todo
    }

    get key() {
        return this.getContents().getKey(); // todo
    }

    get isAdd() {
        return false; // todo
    }

    get itemPadding() {
        return this.getItemPadding(); // todo
    }

    get rowSeparatorSize() {
        return ''; // todo
    }

    private getItemPadding(itemPadding: {} = {}): {} {
        const normalizeValue = (side) => (itemPadding[side] || 'default').toLowerCase();
        return {
            left: normalizeValue('left'),
            right: normalizeValue('right'),
            top: normalizeValue('top'),
            bottom: normalizeValue('bottom'),
        };
    }

    get spacingClassList() {
        const theme = this.theme;
        let classList = '';
        const itemPadding = this.getItemPadding(this.itemPadding);
        const style = this.style === 'masterClassic' || !this.style ? 'default' : this.style;

        classList += ` controls-ListView__itemContent controls-ListView__itemContent_${style}_theme-${theme}`;
        classList += ` controls-ListView__item_${style}-topPadding_${itemPadding.top}_theme-${theme}`;
        classList += ` controls-ListView__item_${style}-bottomPadding_${itemPadding.bottom}_theme-${theme}`;
        classList += ` controls-ListView__item-rightPadding_${itemPadding.right}_theme-${theme}`;

        if (this.isSelected() !== 'hidden') { // todo fix it!
            classList += ' controls-ListView__itemContent_withCheckboxes' + `_theme-${cfg.theme}`;
        } else {
            classList += ' controls-ListView__item-leftPadding_' + (itemPadding.left || 'default').toLowerCase() + `_theme-${cfg.theme}`;
        }

        if (this.rowSeparatorSize) {
            classList += ` controls-ListView__rowSeparator_size-${cfg.rowSeparatorSize}_theme-${cfg.theme}`;
        }

        return classList;
    }

    get itemActionsPosition() {
        return 'inside'; // todo
    }

    get isStickedMasterItem() {
        return false; // todo
    }
}
