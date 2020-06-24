import {Control, TemplateFunction, IControlOptions} from 'UI/Base';
import FontLoadUtil = require('Controls/Utils/FontLoadUtil');
import getWidthUtil = require('Controls/Utils/getWidth');
import {ItemsUtil} from 'Controls/list';
import BreadCrumbsUtil from './Utils';
// @ts-ignore
import * as template from 'wml!Controls/_breadcrumbs/MultilinePath/MultilinePath';
import {IBreadCrumbsOptions} from './interface/IBreadCrumbs';
import {Record, Model} from 'Types/entity';
import {SyntheticEvent} from 'Vdom/Vdom';

class MultilinePath extends Control<IBreadCrumbsOptions> {

    protected _template: TemplateFunction = template;
    protected _visibleItemsFirst: Record[] = [];
    protected _visibleItemsSecond: Record[] = [];
    protected _width: number = 0;
    protected ARROW_WIDTH: number = 0;
    protected BREAD_CRUMB_MIN_WIDTH: number = 0;
    protected DOTS_WIDTH: number = 0;
    protected _indexEdge: number = 0;
    protected _items: Record[];

    protected _afterMount(options: IBreadCrumbsOptions, contexts?: object, receivedState?: void): void {
        if (this._options.items && this._options.items.length > 0) {
            this._items = this._options.items;
            this._width = this._container.clientWidth;
            FontLoadUtil.waitForFontLoad('controls-BreadCrumbsView__crumbMeasurer').then(() => {
                this._initializeConstants(options.theme);
                this._calculateBreadCrumbsToDraw(this._options.items, this._width);
                this._forceUpdate();
            });
        }
    }

    protected _beforeUpdate(newOptions: IBreadCrumbsOptions): void {
        // Если тема изменилась - изменились размеры
        if (this._options.theme !== newOptions.theme) {
            this._initializeConstants(newOptions.theme);
        }
        if (this._options.items !== newOptions.items || this._width !== this._container.clientWidth
            || this._options.theme !== newOptions.theme) {
            this._items = newOptions.items;
            this._calculateBreadCrumbsToDraw(newOptions.items, this._width);
        }
    }

    private _initializeConstants(theme: string): void {
        this.ARROW_WIDTH = getWidthUtil.getWidth('<span class="controls-BreadCrumbsView__arrow controls-BreadCrumbsView__arrow_theme-' + theme + ' icon-size icon-DayForwardBsLine"></span>');
        const dotsWidth = getWidthUtil.getWidth('<div class="controls-BreadCrumbsView__title  controls-BreadCrumbsView__title_theme-' + theme + ' controls-BreadCrumbsView__crumb_theme-' + theme + '">...</div>');
        this.DOTS_WIDTH = this.ARROW_WIDTH + dotsWidth;
        this.BREAD_CRUMB_MIN_WIDTH = getWidthUtil.getWidth('<div class="controls-BreadCrumbsView__crumb_withOverflow_theme-' + theme + ' controls-BreadCrumbsView__crumb_theme-' + theme + '"></div>');
    }

    private _calculateBreadCrumbsToDraw(items, containerWidth: number): void {
        this._visibleItemsFirst = [];
        this._visibleItemsSecond = [];
        const itemsWidth = this._getItemsWidth(items, this._options.displayProperty);
        const currentContainerWidth = itemsWidth.reduce((accumulator, currentValue) => accumulator + currentValue);
        let shrinkItemIndex;
        let firstContainerItems = [];

        if (items.length <= 2) {
            firstContainerItems = items.map((item, index, items) => {
                const hasArrow = index !== 0;
                const withOverflow = itemsWidth[index] - (hasArrow ? this.ARROW_WIDTH : 0) > this.BREAD_CRUMB_MIN_WIDTH;
                return BreadCrumbsUtil.getItemData(index, items, false, withOverflow);
            });
            this._visibleItemsFirst = firstContainerItems;
        } else {
            if (currentContainerWidth > containerWidth) {
                let firstContainerWidth = 0;
                let secondContainerWidth = 0;
                while (firstContainerWidth < containerWidth) {
                    firstContainerWidth += itemsWidth[this._indexEdge];
                    this._indexEdge++;
                }
                this._indexEdge -= 1;
                for (let i = 0; i < this._indexEdge; i++) {
                    firstContainerItems.push(items[i]);
                }
                this._visibleItemsFirst = BreadCrumbsUtil.drawBreadCrumbsItems(firstContainerItems);
                for (let i = this._indexEdge; i < items.length; i++) {
                    secondContainerWidth += itemsWidth[i];
                }

                if (secondContainerWidth > containerWidth) {
                    // Замыливаем предпоследнюю крошку
                    const secondContainerItems = [];
                    if (this._canShrink(itemsWidth[items.length - 2], secondContainerWidth, containerWidth)) {
                        for (let j = this._indexEdge; j < items.length; j++) {
                            secondContainerItems.push(BreadCrumbsUtil.getItemData(j, items, true, j === items.length - 2));
                        }
                        this._visibleItemsSecond = secondContainerItems;
                    } else {
                        // если замылить не получилось - показываем точки
                        secondContainerWidth += this.DOTS_WIDTH;
                        let index;
                        for (index = items.length - 2; index > this._indexEdge; index--) {
                            if (secondContainerWidth <= containerWidth) {
                                break;
                            } else if (this._canShrink(itemsWidth[index], secondContainerWidth, containerWidth)) {
                                shrinkItemIndex = index;
                                secondContainerWidth -= itemsWidth[index] - this.BREAD_CRUMB_MIN_WIDTH;
                                break;
                            } else {
                                secondContainerWidth -= itemsWidth[index];
                            }
                        }

                        // Если осталось всего 2 крошки, но места все равно не хватает, то пытаемся обрезать первый элемент.
                        if (index === this._indexEdge && secondContainerWidth > containerWidth && itemsWidth[this._indexEdge] > this.BREAD_CRUMB_MIN_WIDTH) {
                            shrinkItemIndex = this._indexEdge;
                            secondContainerWidth -= itemsWidth[this._indexEdge] - this.BREAD_CRUMB_MIN_WIDTH;
                        }

                        for (let j = this._indexEdge; j <= index; j++) {
                            secondContainerItems.push(BreadCrumbsUtil.getItemData(j, items, true, j === shrinkItemIndex));
                        }
                        // this._visibleItemsSecond = secondContainerItems;

                        let dotsItem = {};
                        dotsItem[this._options.displayProperty] = '...';

                        secondContainerItems.push({
                            getPropValue: ItemsUtil.getPropertyValue,
                            item: dotsItem,
                            isDots: true,
                            hasArrow: true
                        });
                        // добавляем последнюю папку
                        secondContainerItems.push(BreadCrumbsUtil.getItemData(items.length - 1, items, true, false));

                        this._visibleItemsSecond = secondContainerItems;
                    }
                } else {
                    // если все остальные крошки поместились - пушим по второй контейнер
                    const secondContainerItems = [];
                    for (let i = this._indexEdge; i < items.length; i++) {
                        secondContainerItems.push(items[i]);
                    }
                    this._visibleItemsSecond = BreadCrumbsUtil.drawBreadCrumbsItems(secondContainerItems, true);
                }

            } else {
                this._visibleItemsFirst = BreadCrumbsUtil.drawBreadCrumbsItems(items);
            }
        }
        this._indexEdge = 0;
    }

    private _getItemsWidth(items: Record[], displayProperty: string): number[] {
        const itemsWidth = [];
        items.forEach((item, index) => {
            const itemTitleWidth = getWidthUtil.getWidth('<div class="controls-BreadCrumbsView__title  controls-BreadCrumbsView__title_theme-' + this._options.theme + ' controls-BreadCrumbsView__crumb_theme-' + this._options.theme + '">' + ItemsUtil.getPropertyValue(item, displayProperty) + '</div>');
            const itemWidth = index !== 0 ? itemTitleWidth + this.ARROW_WIDTH : itemTitleWidth;
            itemsWidth.push(itemWidth);
        });
        return itemsWidth;
    }

    private _canShrink(itemWidth: number, currentWidth: number, availableWidth: number): boolean {
        return itemWidth > this.BREAD_CRUMB_MIN_WIDTH && currentWidth - itemWidth + this.BREAD_CRUMB_MIN_WIDTH < availableWidth;
    }

    private _onResize(): void {
        if (this._width !== this._container.clientWidth) {
            this._width = this._container.clientWidth;
            this._calculateBreadCrumbsToDraw(this._items, this._width);
        }
    }

    private _itemClickHandler(e: SyntheticEvent<MouseEvent> , item: Model): void {
        e.stopPropagation();
        this._notify('itemClick', [item]);
    }

    static getDefaultOptions() {
        return {
            displayProperty: 'title'
        };
    }

    static _styles: string[] = ['Controls/Utils/FontLoadUtil'];
}

export default MultilinePath;
