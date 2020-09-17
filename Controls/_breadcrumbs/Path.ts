import {Control, TemplateFunction, IControlOptions} from 'UI/Base';
import BreadCrumbsUtil from './Utils';
import {tmplNotify} from 'Controls/eventUtils';
import template = require('wml!Controls/_breadcrumbs/Path/Path');
import {IBreadCrumbsOptions} from './interface/IBreadCrumbs';
import {loadFontWidthConstants, getFontWidth} from 'Controls/Utils/getFontWidth';
import {Record, Model} from 'Types/entity';
import {Logger} from 'UI/Utils';
import {ItemsUtil} from 'Controls/list';

//TODO удалить, когда появится возможность находить значение ширины иконок и отступов.
const ARROW_WIDTH = 16;
const BREAD_CRUMB_MIN_WIDTH = ARROW_WIDTH + 28;
const PADDING_RIGHT = 2;

interface IReceivedState {
    items: Record[];
}
/**
 * Хлебные крошки.
 *
 * @remark
 * Полезные ссылки:
 * * <a href="/materials/Controls-demo/app/Controls-demo%2FBreadCrumbs%2FScenarios">демо-пример</a>
 * * <a href="https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/content-managment/bread-crumbs/">руководство разработчика</a>
 * * <a href="https://github.com/saby/wasaby-controls/blob/rc-20.4000/Controls-default-theme/aliases/_breadcrumbs.less">переменные тем оформления</a>
 * @class Controls/_breadcrumbs/Path
 * @extends Core/Control
 * @mixes Controls/interface/IBreadCrumbs
 * @mixes Controls/_interface/IFontColorStyle
 * @mixes Controls/_interface/IFontSize
 * @control
 * @public
 * @author Авраменко А.С.
 * @demo Controls-demo/BreadCrumbs/BreadCrumbsPG
 * @see Controls/_breadcrumbs/HeadingPath
 */

/*
 * Breadcrumbs.
 * <a href="/materials/Controls-demo/app/Controls-demo%2FBreadCrumbs%2FScenarios">Demo</a>.
 *
 * @class Controls/_breadcrumbs/Path
 * @extends Core/Control
 * @mixes Controls/interface/IBreadCrumbs
 * @mixes Controls/_interface/IFontColorStyle
 * @mixes Controls/_interface/IFontSize
 * @control
 * @private
 * @author Авраменко А.С.
 * @demo Controls-demo/BreadCrumbs/BreadCrumbsPG
 */

class BreadCrumbs extends Control<IBreadCrumbsOptions> {
    protected _template: TemplateFunction = template;
    protected _visibleItems =  [];
    protected _viewUpdated: boolean = false;
    protected _notifyHandler = tmplNotify;
    protected _width: number = 0;
    protected _dotsWidth: number = 0;
    protected _indexEdge: number = 0;
    protected _items: Record[] = [];

    protected _beforeMount(options?: IBreadCrumbsOptions, contexts?: object, receivedState?: IReceivedState): Promise<IReceivedState> | void {
        if (!options.containerWidth) {
            Logger.error('Path: option containerWidth is undefined', this);
            loadFontWidthConstants().then(() => {
                return;
            });
        } else if (receivedState) {
            this._dotsWidth = this._getDotsWidth(options.fontSize);
            this._prepareData(options, options.containerWidth);
        } else {
            return new Promise((resolve) => {
                loadFontWidthConstants().then((getTextWidth: Function) => {
                    if (options.items && options.items.length > 0) {
                        this._dotsWidth = this._getDotsWidth(options.fontSize, getTextWidth);
                        this._prepareData(options, options.containerWidth, getTextWidth);
                    }
                    resolve({
                            items: this._items
                        }
                    );
                });
            });
        }
    }
    protected _beforeUpdate(newOptions: IBreadCrumbsOptions): void {
        this._redrawIfNeed(this._options.items, newOptions.items);
    }

    private _redrawIfNeed(currentItems, newItems): void {
        if (BreadCrumbsUtil.shouldRedraw(currentItems, newItems)) {
            this._visibleItems = BreadCrumbsUtil.drawBreadCrumbsItems(newItems);
            this._viewUpdated = true;
        }
    }

    protected _afterUpdate(): void {
        if (this._viewUpdated) {
            this._viewUpdated = false;
        }
    }
    private _getDotsWidth(fontSize: string, getTextWidth: Function = this._getTextWidth): number {
        const dotsWidth = getTextWidth('...', fontSize) + PADDING_RIGHT;
        return ARROW_WIDTH + dotsWidth;
    }
    private _prepareData(options: IBreadCrumbsOptions, width: number, getTextWidth: Function = this._getTextWidth): void {
        if (options.items && options.items.length > 0) {
            this._items = options.items;
            this._width = width;
            this._calculateBreadCrumbsToDraw(options.items, options, getTextWidth);
        }
    }
    private _getTextWidth(text: string, size: string  = 'xs'): number {
        return getFontWidth(text, size);
    }
    private _calculateBreadCrumbsToDraw(items: Record[], options: IBreadCrumbsOptions, getTextWidth: Function = this._getTextWidth): void {
        this._visibleItems = [];
        const itemsWidth = this._getItemsWidth(items, options, getTextWidth);
        let shrinkItemIndex;
        let containerItems = [];
        let containerWidth = 0;

        if (items.length <= 2) {
            // Если крошек меньше двух, располагаем их в контейнере
            containerItems = items.map((item, index, items) => {
                const hasArrow = index !== 0;
                const withOverflow = itemsWidth[index] - (hasArrow ? ARROW_WIDTH : 0) > BREAD_CRUMB_MIN_WIDTH;
                return BreadCrumbsUtil.getItemData(index, items, false, withOverflow);
            });
            this._visibleItems = containerItems;
        } else {
            // рассчитываем ширину контейнера, заполненного крошками
            for (let i = 0; i < items.length; i++) {
                containerWidth += itemsWidth[i];
            }
            containerWidth -= itemsWidth[items.length - 2];
            containerWidth += BREAD_CRUMB_MIN_WIDTH;
            // если второй контейнер по ширине больше, чем доступная ширина, начинаем расчеты
            if (containerWidth > this._width) {
                // предпоследняя не уместилась - сразу вычитаем ее ширину
                containerWidth -= BREAD_CRUMB_MIN_WIDTH;
                // Сначала пробуем замылить предпоследнюю крошку
                const secondContainerItems = [];
                // если замылить не получилось - показываем точки
                containerWidth += this._dotsWidth;
                let index;
                // предпоследняя не поместилась - начинаем с пред-предпоследней
                for (index = items.length - 3; index >= 0; index--) {
                    if (containerWidth <= this._width) {
                        break;
                    } else if (this._canShrink(itemsWidth[index], containerWidth, this._width)) {
                        shrinkItemIndex = index;
                        containerWidth -= itemsWidth[index] - BREAD_CRUMB_MIN_WIDTH;
                        break;
                    } else {
                        containerWidth -= itemsWidth[index];
                    }
                }
                // заполняем крошками, которые влезли, второй контейнер (не считая последней)
                for (let j = this._indexEdge; j <= index; j++) {
                    secondContainerItems.push(BreadCrumbsUtil.getItemData(j, items, true, j === shrinkItemIndex));
                }
                // добавляем точки
                let dotsItem = {};
                dotsItem[options.displayProperty] = '...';

                secondContainerItems.push({
                    getPropValue: ItemsUtil.getPropertyValue,
                    item: dotsItem,
                    isDots: true,
                    hasArrow: true
                });
                // добавляем последнюю папку
                secondContainerItems.push(BreadCrumbsUtil.getItemData(items.length - 1, items, true, false));

                this._visibleItems = secondContainerItems;

            } else {
                // если все остальные крошки поместились - пушим по второй контейнер
                const secondContainerItems = [];
                for (let j = this._indexEdge; j < items.length; j++) {
                    secondContainerItems.push(BreadCrumbsUtil.getItemData(j, items, true, j === items.length - 2));
                }
                this._visibleItems = secondContainerItems;
            }
        }
        this._visibleItems[0].hasArrow = false;
        this._indexEdge = 0;
    }

    private _getItemsWidth(items: Record[], options: IBreadCrumbsOptions, getTextWidth: Function = this._getTextWidth): number[] {
        const itemsWidth = [];
        items.forEach((item, index) => {
            const itemTitleWidth = getTextWidth(ItemsUtil.getPropertyValue(item, options.displayProperty), options.fontSize);
            const itemWidth = index !== 0 ? itemTitleWidth + ARROW_WIDTH : itemTitleWidth;
            itemsWidth.push(itemWidth + PADDING_RIGHT);
        });
        return itemsWidth;
    }
    private _canShrink(itemWidth: number, currentWidth: number, availableWidth: number): boolean {
        return itemWidth > BREAD_CRUMB_MIN_WIDTH && currentWidth - itemWidth + BREAD_CRUMB_MIN_WIDTH < availableWidth;
    }

    private _itemClickHandler(e, item): void {
        e.stopPropagation();
        this._notify('itemClick', [item]);
        if (this._options.breadCrumbsItemClickCallback) {
            this._options.breadCrumbsItemClickCallback(e, item);
        }
    }
    static getDefaultOptions() {
        return {
            displayProperty: 'title',
            fontSize: 'xs'
        };
    }
}

export default BreadCrumbs;
