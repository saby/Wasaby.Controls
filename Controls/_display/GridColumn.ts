import { mixin } from 'Types/util';
import {
    OptionsToPropertyMixin,
    DestroyableMixin,
    InstantiableMixin,
    IInstantiable
} from 'Types/entity';
import GridCollectionItem from './GridCollectionItem';
import { TemplateFunction } from 'UI/Base';
import { register } from 'Types/di';

export interface IColumnConfig {
    template: TemplateFunction|string;
    width?: string;
}

export interface IOptions<T> {
    owner: GridCollectionItem<T>;
    column: IColumnConfig;
}

export default class GridColumn<T> extends mixin<
    DestroyableMixin,
    OptionsToPropertyMixin,
    InstantiableMixin
>(
    DestroyableMixin,
    OptionsToPropertyMixin,
    InstantiableMixin
) implements IInstantiable {
    readonly '[Types/_entity/IInstantiable]': boolean;
    getInstanceId: () => string;

    protected _$owner: GridCollectionItem<T>;
    protected _$column: IColumnConfig;

    constructor(options?: IOptions<T>) {
        super();
        OptionsToPropertyMixin.call(this, options);
    }

    getCellClasses(templateHighlightOnHover: boolean): string {
        // GridViewModel -> getItemColumnCellClasses
        let classes = 'controls-Grid__row-cell controls-Grid__row-cell_theme-default js-controls-SwipeControl__actionsContainer';

        // if !checkBoxCell
        classes += ' controls-Grid__cell_fit';

        if (this._$owner.isEditing()) {
            classes += ' controls-Grid__row-cell-background-editing_theme-default';
        } else {
            classes += ' controls-Grid__row-cell-background-hover_theme-default';
        }
        if (this._$owner.isActive() && templateHighlightOnHover !== false) {
            classes += ' controls-GridView__item_active_theme-default';
        }
        if (this._$owner.isDragged()) {
            classes += ' controls-ListView__item_dragging';
        }

        classes += ' controls-Grid__cell_default';

        // getPaddingCellClasses
        // row separators
        // if checkBoxCell
        // if isSelected
        // if getLastColumnIndex

        return classes;
    }

    getCellStyles(): string {
        // There's a lot
        return undefined;
    }

    getTemplate(): TemplateFunction|string {
        return this._$column.template;
    }

    getContents(): T {
        return this._$owner.getContents();
    }
}

Object.assign(GridColumn.prototype, {
    '[Controls/_display/GridColumn]': true,
    _moduleName: 'Controls/display:GridColumn',
    _instancePrefix: 'grid-column-',
    _$owner: null,
    _$column: null
});

register('Controls/display:GridColumn', GridColumn, {instantiate: false});
