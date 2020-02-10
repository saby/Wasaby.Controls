import {Control, TemplateFunction} from 'UI/Base';
import {IRenderOptions} from 'Controls/listRender';
import {IMenuOptions} from 'Controls/_menu/interface/IMenuControl';
import {Tree, SelectionController} from 'Controls/display';
import * as itemTemplate from 'wml!Controls/_menu/Render/itemTemplate';
import * as multiSelectTpl from 'wml!Controls/_menu/Render/multiSelectTpl';
import ViewTemplate = require('wml!Controls/_menu/Render/Render');
import {Model} from 'Types/entity';
import {SyntheticEvent} from 'Vdom/Vdom';
import {factory} from 'Types/chain';
import {ActualApi} from 'Controls/buttons';
import {ItemsUtil} from 'Controls/list';

interface IMenuRenderOptions extends IMenuOptions, IRenderOptions {
}

class MenuRender extends Control<IMenuRenderOptions> {
    protected _template: TemplateFunction = ViewTemplate;
    protected _multiSelectTpl: TemplateFunction = multiSelectTpl;
    protected _iconSpacing: string;

    protected _beforeMount(options: IMenuRenderOptions): void {
        this.setListModelOptions(options);
        this._iconSpacing = this.getIconSpacing(options);
    }

    protected _beforeUpdate(newOptions: IMenuRenderOptions): void {
        if (newOptions.listModel !== this._options.listModel) {
            this.setListModelOptions(newOptions);
        }
    }

    protected _isEmptyItem(itemData): boolean {
        return this._options.emptyText && itemData.getContents().getId() === this._options.emptyKey;
    }

    // FIXME
    protected _getItemData(item): object {
        return {
            item: item.getContents(),
            treeItem: item,
            iconSpacing: this._iconSpacing,
            iconSize: this._options.iconSize,
            multiSelect: this._options.multiSelect,
            multiSelectTpl,
            getPropValue: ItemsUtil.getPropertyValue,
            isEmptyItem: this._isEmptyItem(item),
            isSelected: item.isSelected.bind(item),
            isNode: item.isNode.bind(item),
            isSwiped: item.isSwiped.bind(item),
            isRoot: item.isRoot.bind(item),
            hasPinned: item.getContents().has('pinned')
        };
    }

    protected _proxyEvent(e: SyntheticEvent<MouseEvent>, eventName: string, item: Model, sourceEvent: SyntheticEvent<MouseEvent>): void {
        e.stopPropagation();
        this._notify(eventName, [item, sourceEvent]);
    }

    protected _getClassList(treeItem): string {
        const item = treeItem.getContents();
        let classes = treeItem.getContentClasses();
        classes += ' controls-Menu__row_state_' + (item.get('readOnly')  ? 'readOnly' : 'default') + '_theme-' + this._options.theme;
        if (treeItem.isHovered() && !item.get('readOnly')) {
            classes += ' controls-Menu__row_hovered_theme-' + this._options.theme;
        }
        if (this._isEmptyItem(treeItem) && !this._options.multiSelect) {
            classes += ' controls-Menu__emptyItem_theme-' + this._options.theme;
        } else {
            classes += ' controls-Menu__defaultItem_theme-' + this._options.theme;
        }
        if (item.get('pinned') === true && !treeItem.isRoot()) {
            classes += ' controls-Menu__row_pinned';
        }
        if (this._options.listModel.getLast() !== treeItem) {
            classes += ' controls-Menu__row-separator_theme-' + this._options.theme;
        }
        return classes;
    }

    private setListModelOptions(options: IMenuRenderOptions) {
        options.listModel.setItemsSpacings({
            top: 'null',
            left: this.getLeftSpacing(options),
            right: this.getRightSpacing(options)
        });
        if (options.emptyText) {
            this.addEmptyItem(options.listModel, options);
        }
    }

    private addEmptyItem(listModel: Tree, options: IMenuRenderOptions): void {
        let data = {};
        data[options.keyProperty] = options.emptyKey;
        data[options.displayProperty] = options.emptyText;
        listModel.getCollection().prepend([new Model({
            keyProperty: options.keyProperty,
            rawData: data
        })]);
        if (options.selectedKeys.includes(options.emptyKey)) {
            SelectionController.selectItem(listModel, options.emptyKey, true);
        }
    }

    private getLeftSpacing(options: IMenuRenderOptions): string {
        let leftSpacing = 'l';
        if (options.leftSpacing) {
            leftSpacing = options.leftSpacing;
        } else if (options.multiSelect) {
            leftSpacing = 'null';
        }
        return leftSpacing;
    }

    private getRightSpacing(options: IMenuRenderOptions): string {
        let rightSpacing = 'l';
        if (!options.rightSpacing) {
            factory(options.listModel.getCollection()).each((item) => {
                if (item.get(options.nodeProperty)) {
                    rightSpacing = 'menu-expander';
                }
            });
        } else {
            rightSpacing = options.rightSpacing;
        }
        return rightSpacing;
    }

    private getIconSpacing(options: IMenuRenderOptions): string {
        const items = options.listModel.getCollection();
        const parentProperty = options.parentProperty;
        let iconSpacing = '', icon;

        factory(items).each((item) => {
            icon = item.get('icon');
            if (icon && (!parentProperty || item.get(parentProperty) === options.root)) {
                iconSpacing = ActualApi.iconSize(options.iconSize, icon);
            }
        });
        return iconSpacing;
    }

    static _theme: string[] = ['Controls/menu', 'Controls/Classes'];

    static getDefaultOptions(): object {
        return {
            itemTemplate
        };
    }
}

export default MenuRender;
