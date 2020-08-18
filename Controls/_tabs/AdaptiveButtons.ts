import {Control, IControlOptions, TemplateFunction} from 'UI/Base';
import {CrudWrapper} from 'Controls/dataSource';
import * as cInstance from 'Core/core-instance';
import {RecordSet} from 'Types/collection';
import {Model} from 'Types/entity';
import {SbisService} from 'Types/source';
import {IItems} from 'Controls/interface';
import {IAdaptiveTabs, IAdaptiveTabsOptions} from './interface/IAdaptiveTabs';
import {UnregisterUtil, RegisterUtil} from 'Controls/event';
import {getFontWidth} from 'Controls/Utils/getFontWidth';

import TabButtonsTpl = require('wml!Controls/_tabs/FlexButtons/FlexButtons');
import ItemTemplate = require('wml!Controls/_tabs/Buttons/ItemTemplate');

export default class AdaptiveButtons extends Control<IAdaptiveTabsOptions> implements IAdaptiveTabs, IItems {

    readonly '[Controls/_tabs/interface/ITabsButtons]': boolean = true;
    readonly '[Controls/_interface/IItems]': boolean = true;

    protected _template: TemplateFunction = TabButtonsTpl;
    protected _defaultItemTemplate: TemplateFunction = ItemTemplate;
    private _itemsOrder: number[];
    private _lastRightOrder: number;
    private _items: RecordSet;
    private _crudWrapper: CrudWrapper;
    protected _lastIndex: number = 0;
    protected _displayProperty: string = 'title';
    protected _containerWidth: number;
    protected _originalSource: RecordSet;
    protected _align: string;
    protected _margin: number;
    protected _minWidth: number;
    protected _widthOfMore: number;
    protected _paddingOfMore: number;

    protected _getIndexOfLastTab(items: RecordSet, displayProperty: string, containerWidth: number = 200): Promise<number> {
        // находим индекс последней уместившейся вкладки с учетом текста, отступов и разделителей.
        let width = 0;
        let indexLast = 0;
        return this._getWidthOfElements(items, displayProperty).then((res) => {
            const arrWidth = res;
            if (this._align === 'right') {
                arrWidth.reverse();
            }
            // здесь учесть еще... из утилиты
            while (width < containerWidth && indexLast !== items.getRawData().length) {
                width += arrWidth[indexLast];
                indexLast++;
            }
            indexLast -= 2;

            if (indexLast === arrWidth.length - 1) {
                return indexLast;
            }

            const currentWidth = arrWidth.reduce((sum, current) => {
                return sum + current;
            }, 0);

            const minWidth = this._minWidth + this._margin;
            if (indexLast === arrWidth.length - 2) {
                const width = currentWidth - arrWidth[arrWidth.length - 1] + minWidth;
                if (width < containerWidth) {
                    indexLast++;
                    return indexLast;
                } else {
                    indexLast = this.getLastIndex(indexLast, arrWidth, currentWidth, containerWidth);
                }
            }

            if (indexLast < arrWidth.length - 2) {
                indexLast = this.getLastIndex(indexLast, arrWidth, currentWidth, containerWidth);
            }
            return indexLast;
        });
    }

    private getLastIndex(lastIndex: number, arrWidth: number[], currentWidth: number, containerWidth: number): number {
        let i = arrWidth.length - 1;
        let indexLast = lastIndex;
        let width = currentWidth;
        while (i !== lastIndex) {
            width = width - arrWidth[i];
            i--;
        }
        width = width + this._widthOfMore + this._minWidth + this._margin + this._paddingOfMore;
        indexLast++;
        while (width > containerWidth) {
            indexLast--;
            width = width - arrWidth[lastIndex];
        }
        return indexLast;
    }

    protected _getWidthOfElement(item: string): Promise<number> {
        // ширина элемента

        return getFontWidth(item, 'l').then((res) => {
            const width = res + 2 * this._margin;
            return width;
        });
    }
    protected _getWidthOfMore(title: string = 'Еще```'): Promise<number> {
        return getFontWidth(title, 'm').then((res) => {
            this._widthOfMore = res;
            return res;
        });
    }

    protected _getWidthOfElements(items: RecordSet, displayProperty: string): Promise<number[]> {
        const arrItems = items.getRawData();
        const promises = [];
        for (let i = 0; i < arrItems.length; i++) {
            promises.push(this._getWidthOfElement(arrItems[i][displayProperty]));
        }
        return Promise.all(promises).then((res) => {
            return res;
        });
    }

    private _deleteHiddenItems(items: RecordSet): void {
        this._getWidthOfMore();
        this._getIndexOfLastTab(items, this._displayProperty, this._containerWidth).then((res) => {
            this._lastIndex = res;
            const oldRawData = items.getRawData();
            if (this._align === 'right') {
                oldRawData.reverse();
            }
            const rawData = oldRawData.slice(0, this._lastIndex + 1);
            if (this._align === 'right') {
                rawData.reverse();
            }
            this._items.setRawData(rawData);
        });
    }

    protected _beforeMount(options: IAdaptiveTabsOptions,
                           context: object,
                           receivedState: IReceivedState): void | Promise<IReceivedState> {
        // для теста
        this._displayProperty = options.displayProperty;
        this._containerWidth = options.containerWidth;
        this._align = options.align ? options.align : 'right';
        this._margin = 13;
        this._minWidth = 26;
        this._paddingOfMore = 6;

        // TODO https://online.sbis.ru/opendoc.html?guid=527e3f4b-b5cd-407f-a474-be33391873d5
        if (receivedState && !AdaptiveButtons._checkHasFunction(receivedState)) {
            this._prepareState(receivedState);
        } else if (options.items) {
            const itemsData = this._prepareItems(options.items);
            this._prepareState(itemsData);

            // заполняем items

        } else if (options.source) {
            return this._initItems(options.source).then((result: IReceivedState) => {
                this._prepareState(result);
                return result;
            });
        }
    }

    protected _afterMount(options?: IAdaptiveTabsOptions, contexts?: any): void {
        RegisterUtil(this, 'controlResize', this._onResize.bind(this));
    }

    protected _beforeUpdate(newOptions: IAdaptiveTabsOptions): void {
        if (newOptions.source && newOptions.source !== this._options.source) {
            this._initItems(newOptions.source).then((result) => {
                this._prepareState(result);
            });
        }
        if (newOptions.items && newOptions.items !== this._options.items) {
            const itemsData = this._prepareItems(newOptions.items);
            this._prepareState(itemsData);
        }
    }

    protected _beforeUnmount(): void {
        UnregisterUtil(this, 'controlResize');
    }

    private _onResize(): void {
        if (this._containerWidth !== this._container.clientWidth) {
            this._containerWidth = this._container.clientWidth;
            const items = this._originalSource.clone();
            this._deleteHiddenItems(items);
        }
    }
    protected _onItemClick(event: Event, key: string): void {
        this._notify('selectedKeyChanged', [key]);
    }

    protected _prepareItemClass(item: Model, index: number): string {
        const order: number = this._itemsOrder[index];
        const options: IAdaptiveTabsOptions = this._options;
        const classes: string[] = ['controls-Tabs__item controls-Tabs__item_theme_' + options.theme];

        const itemAlign: string = item.get('align');
        const align: string = this._align;

        const isLastItem: boolean = order === this._lastRightOrder;

        classes.push(`controls-Tabs__item_align_${align} ` +
            `controls-Tabs__item_align_${align}_theme_${options.theme}`);
        if (this._align === 'left' && index === 0) {
            classes.push('controls-Tabs__item_extreme_first controls-Tabs__item_extreme_first_theme_' + options.theme);
        } else if (this._align === 'right' && index === this._lastIndex) {
            classes.push('controls-Tabs__item_extreme_last controls-Tabs__item_extreme_last_theme_' + options.theme);
        } else {
            classes.push('controls-Tabs__item_default controls-Tabs__item_default_theme_' + options.theme);
        }

        const itemType: string = item.get('type');
        if (itemType) {
            classes.push('controls-Tabs__item_type_' + itemType +
                ' controls-Tabs__item_type_' + itemType + '_theme_' + options.theme);
        }

        // TODO: по поручению опишут как и что должно сжиматься.
        // Пока сжимаем только те вкладки, которые прикладники явно пометили
        // https://online.sbis.ru/opendoc.html?guid=cf3f0514-ac78-46cd-9d6a-beb17de3aed8
        if (item.get('isMainTab')) {
            classes.push('controls-Tabs__item_canShrink');
        } else {
            classes.push('controls-Tabs__item_notShrink');
        }

        if (index === this._lastIndex && this._options.align === 'left') {
            classes.push('controls-Tabs__item_shrinkMinWidth');
        }
        if (index === 0 && this._options.align === 'right') {
            classes.push('controls-Tabs__item_shrinkMinWidth');
        }
        return classes.join(' ');
    }

    protected _prepareItemSelectedClass(item: Model): string {
        const classes = [];
        const options = this._options;
        const style = AdaptiveButtons._prepareStyle(options.style);
        if (item.get(options.keyProperty) === options.selectedKey) {
            classes.push(`controls-Tabs_style_${style}__item_state_selected ` +
                `controls-Tabs_style_${style}__item_state_selected_theme_${options.theme}`);
            classes.push('controls-Tabs__item_state_selected ' +
                `controls-Tabs__item_state_selected_theme_${options.theme}`);
        } else {
            classes.push('controls-Tabs__item_state_default controls-Tabs__item_state_default_theme_' + options.theme);
        }
        return classes.join(' ');
    }

    protected _prepareItemOrder(index: number): string {
        const order = this._itemsOrder[index];
        return '-ms-flex-order:' + order + '; order:' + order;
    }

    protected _getTemplate(template: TemplateFunction, item: Model, itemTemplateProperty: string): TemplateFunction {
        if (itemTemplateProperty) {
            const templatePropertyByItem = item.get(itemTemplateProperty);
            if (templatePropertyByItem) {
                return templatePropertyByItem;
            }
        }
        return template;
    }

    private _prepareItems(items: RecordSet): IReceivedState {
        let leftOrder: number = 1;
        let rightOrder: number = 30;
        const itemsOrder: number[] = [];

        items.each((item: Model) => {
            if (item.get('align') === 'left') {
                itemsOrder.push(leftOrder++);
            } else {
                itemsOrder.push(rightOrder++);
            }
        });

        // save last right order
        rightOrder--;
        this._lastRightOrder = rightOrder;

        return {
            items,
            itemsOrder,
            lastRightOrder: rightOrder
        };
    }

    private _initItems(source: SbisService): Promise<IReceivedState> {
        this._crudWrapper = new CrudWrapper({
            source
        });
        return this._crudWrapper.query({}).then((items: RecordSet) => {
            return this._prepareItems(items);
        });
    }

    private _prepareState(data: IReceivedState): void {
        this._items = data.items;
        this._originalSource = data.items.clone();
        this._deleteHiddenItems(this._items);
        this._itemsOrder = data.itemsOrder;
        this._lastRightOrder = data.lastRightOrder;
    }

    static _theme: string[] = ['Controls/tabs'];

    static _prepareStyle(style: string): string {
        if (style === 'default') {
            // 'Tabs/Buttons: Используются устаревшие стили. Используйте style = primary вместо style = default'
            return 'primary';
        } else if (style === 'additional') {
            // Tabs/Buttons: Используются устаревшие стили. Используйте style = secondary вместо style = additional'
            return 'secondary';
        } else {
            return style;
        }
    }

    static _checkHasFunction(receivedState: IReceivedState): boolean {
        // Функции, передаваемые с сервера на клиент в receivedState, не могут корректно десериализоваться.
        // Поэтому, если есть функции в receivedState, заново делаем запрос за данными.
        // Ошибку выводит ядро
        if (receivedState?.items?.getCount) {
            const count = receivedState.items.getCount();
            for (let i = 0; i < count; i++) {
                const item = receivedState.items.at(i);
                const value = cInstance.instanceOfModule(item, 'Types/entity:Record') ? item.getRawData() : item;
                for (const key in value) {
                    // При рекваере шаблона, он возвращает массив, в 0 индексе которого лежит объект с функцией
                    if (typeof value[key] === 'function' ||
                        value[key] instanceof Array && typeof value[key][0].func === 'function') {
                        return true;
                    }
                }
            }
        }

        return false;
    }

    static getDefaultOptions(): IAdaptiveTabsOptions {
        return {
            style: 'primary',
            displayProperty: 'title'
        };
    }
}
