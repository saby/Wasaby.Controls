import { Model } from 'Types/entity';
import GridCell, {IOptions as IGridCellOptions} from './GridCell';
import GridDataRow from './GridDataRow';

export interface IOptions<T> extends IGridCellOptions<T> {
}

export default class GridDataCell<T, TOwner extends GridDataRow<T>> extends GridCell<T, TOwner> {

    // region Аспект "Маркер"
    shouldDisplayMarker(marker: boolean, markerPosition: 'left' | 'right' = 'left'): boolean {
        if (markerPosition === 'right') {
            return marker !== false && this._$owner.isMarked() && this.isLastColumn();
        } else {
            return marker !== false && this._$owner.isMarked() &&
                this._$owner.getMultiSelectVisibility() === 'hidden' && this.isFirstColumn();
        }
    }
    // region

    // region Аспект "Тег"

    /**
     * Возвращает флаг, что надо или не надо показывать тег
     * @param tagStyle
     */
    shouldDisplayTag(tagStyle?: string): boolean {
        return !!this.getTagStyle(tagStyle);
    }

    /**
     * Возвращает tagStyle для текущей колонки
     * @param tagStyle параметр, переданный напрямую в шаблон прикладниками
     */
    getTagStyle(tagStyle?: string): string {
        if (tagStyle) {
            return tagStyle;
        }
        const contents: Model = this._$owner.getContents() as undefined as Model;
        return this._$column.tagStyleProperty &&
            contents.get(this._$column.tagStyleProperty);
    }

    /**
     * Возвращает CSS класс для передачи в шаблон tag
     * @param theme
     */
    getTagClasses(theme: string): string {
        return `controls-Grid__cell_tag_theme-${theme}`;
    }

    // endregion
}

Object.assign(GridDataCell.prototype, {
    '[Controls/_display/GridDataCell]': true,
    _moduleName: 'Controls/display:GridDataCell',
    _instancePrefix: 'grid-data-cell-'
});
