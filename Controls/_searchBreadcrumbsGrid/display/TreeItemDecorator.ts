import BreadcrumbsItem from './BreadcrumbsItem';
import SearchGridDataRow from './SearchGridDataRow';
import SearchGridCollection from './SearchGridCollection';
import {register} from 'Types/di';
import { Model } from 'Types/entity';

export interface IOptions<T extends Model> {
    source: SearchGridDataRow<T>;
    parent?: SearchGridDataRow<T> | BreadcrumbsItem<T>;
    multiSelectVisibility: string;
}

/**
 * Tree item which is just a decorator for another one
 * @class Controls/_display/TreeItemDecorator
 * @extends Controls/_display/SearchGridDataRow
 * @author Мальцев А.А.
 * @private
 */
export default class TreeItemDecorator<T extends Model> extends SearchGridDataRow<T> {
    protected _$source: SearchGridDataRow<T>;

    constructor(options?: IOptions<T>) {
        super({
            contents: options?.source?.contents,
            multiSelectVisibility: options?.multiSelectVisibility
        });
        this._$source = options?.source;
        this._$parent = options?.parent;

        // Декоратор нужен, чтобы задать правильный parent для item-a, при этом не испортив оригинальный item
        // Прокидываем все методы из оригинального item-a в decorator, за исключением методов, связанных с parent
        const notRewriteProperties = ['getLevel', 'getParent'];
        for (const property in this._$source) {
            if (typeof this._$source[property] === 'function' && !notRewriteProperties.includes(property)) {
                this[property] = this._$source[property].bind(this._$source);
            }
        }
    }

    getSource(): SearchGridDataRow<T> {
        return this._$source;
    }
}

Object.assign(TreeItemDecorator.prototype, {
    '[Controls/_display/TreeItemDecorator]': true,
    _moduleName: 'Controls/display:TreeItemDecorator',
    _$source: undefined
});

register('Controls/display:TreeItemDecorator', TreeItemDecorator, {instantiate: false});
