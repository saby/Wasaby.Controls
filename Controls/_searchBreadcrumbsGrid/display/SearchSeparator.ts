import { GridRow, TColspanCallbackResult } from 'Controls/gridNew';
import { register } from 'Types/di';
import SearchGridCollection from './SearchGridCollection';
import { IColumn } from 'Controls/_grid/interface/IColumn';
import { TemplateFunction } from 'UI/Base';

export default class SearchSeparator extends GridRow<string> {
    readonly '[Controls/_display/IEditableCollectionItem]': boolean = false;
    readonly '[Controls/_itemActions/interface/IItemActionsItem]': boolean = false;

    readonly Markable: boolean = false;

    protected _$owner: SearchGridCollection;

    getContents(): string {
        return 'search-separator';
    }

    getUid(): string {
        return 'search-separator';
    }

    isEditing(): boolean {
        return false;
    }

    isActive(): boolean {
        return false;
    }

    isMarked(): boolean {
        return false;
    }

    isSelected(): boolean {
        return false;
    }

    isSwiped(): boolean {
        return false;
    }

    getLevel(): number {
        return 0;
    }

    isVisibleCheckbox(): boolean {
        return false;
    }

    getTemplate(itemTemplateProperty: string, userTemplate: TemplateFunction|string): TemplateFunction | string {
        // В старой поисковой модели в menu сепаратор отрисовывают с помощью itemTemplate,
        // у себы мы рисуем сепаратор с помощью своего темплейта
        if (this._$owner['[Controls/_display/Search]']) {
            const templateFromProperty = itemTemplateProperty ? this.getContents().get(itemTemplateProperty) : '';
            return templateFromProperty || userTemplate || this.getDefaultTemplate();
        } else {
            return this.getDefaultTemplate();
        }
    }

    protected _getColspan(column: IColumn, columnIndex: number): TColspanCallbackResult {
        return 'end';
    }
}

Object.assign(SearchSeparator.prototype, {
    '[Controls/_searchBreadcrumbsGrid/SearchSeparator]': true,
    _moduleName: 'Controls/searchBreadcrumbsGrid:SearchSeparator',
    _instancePrefix: 'search-separator-item-',
    _cellModule: 'Controls/searchBreadcrumbsGrid:SearchSeparatorCell'
});

register('Controls/searchBreadcrumbsGrid:SearchSeparator', SearchSeparator, {instantiate: false});
