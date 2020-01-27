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

    getTemplate(): TemplateFunction|string {
        return this._$column.template;
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
