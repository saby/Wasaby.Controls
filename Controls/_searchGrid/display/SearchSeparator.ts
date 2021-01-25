import { register } from "Types/di";
import { IItemTemplateParams } from 'Controls/_display/grid/mixins/Row';
import { OptionsToPropertyMixin } from 'Types/entity';
import Collection from "../../_display/grid/Collection";

export default class SearchSeparator extends OptionsToPropertyMixin {
    readonly '[Controls/_display/IEditableCollectionItem]': boolean = false;
    readonly '[Controls/_itemActions/interface/IItemActionsItem]': boolean = false;

    readonly Markable: boolean = false;
    readonly SelectableItem: boolean = false;

    protected _$owner: Collection;

    getContents(): string {
        return 'search-separator';
    }

    getTemplate(): string {
        return 'Controls/searchGrid:SearchSeparatorTemplate';
    }

    isEditing(): boolean {
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

    getItemClasses(params: IItemTemplateParams = { theme: 'default' }): string {
        let classes = `controls-TreeGrid__row__searchSeparator_theme-${params.theme} `;
        classes += `controls-Grid__cell_spacingFirstCol_${this._$owner.getLeftPadding()}_theme-${params.theme} `
        classes += 'js-controls-ListView__notEditable'
        return classes;
    }

    getItemStyles(): string {
        return 'grid-column: 1 / ' + (this._$owner.getColumnsConfig().length + 1);
    }
}

Object.assign(SearchSeparator.prototype, {
    '[Controls/_display/SearchSeparator]': true,
    _moduleName: 'Controls/display:SearchSeparator',
    _$owner: undefined,
    _instancePrefix: 'search-separator-item-'
});

register('Controls/display:SearchSeparator', SearchSeparator, {instantiate: false});
