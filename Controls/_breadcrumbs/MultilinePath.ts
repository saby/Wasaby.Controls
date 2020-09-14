import {Control, TemplateFunction, IControlOptions} from 'UI/Base';
import {ItemsUtil} from 'Controls/list';
import BreadCrumbsUtil from './Utils';
import {
    IFontColorStyle,
    IFontSize
} from 'Controls/interface';
// @ts-ignore
import * as template from 'wml!Controls/_breadcrumbs/MultilinePath/MultilinePath';
import {IBreadCrumbsOptions} from './interface/IBreadCrumbs';
import {Record, Model} from 'Types/entity';
import {SyntheticEvent} from 'Vdom/Vdom';
import {loadFontWidthConstants, getFontWidth} from 'Controls/Utils/getFontWidth';
import {Logger} from 'UI/Utils';

const ARROW_WIDTH = 16;
const BREAD_CRUMB_MIN_WIDTH = ARROW_WIDTH + 28;
const PADDING_RIGHT = 2;

/*
 * Хлебные крошки в две строки
 * @class Controls/_breadcrumbs/MultilinePath
 * @extends Core/Control
 * @mixes Controls/interface/IBreadCrumbs
 * @implements Controls/_interface/IFontSize
 * @control
 * @public
 * @author Бондарь А.В.
 * @demo Controls-demo/BreadCrumbs/Multiline/Index
 */

export interface IMultilinePathOptions extends IBreadCrumbsOptions {
    containerWidth: number;
}

class MultilinePath extends Control<IMultilinePathOptions> implements IFontSize {
    readonly '[Controls/_interface/IFontSize]': boolean;
    protected _template: TemplateFunction = template;
    protected _visibleItemsFirst: Record[] = [];
    protected _visibleItemsSecond: Record[] = [];
    protected _width: number = 0;
    protected DOTS_WIDTH: number = 0;
    protected _indexEdge: number = 0;
    protected _items: Record[] = [];
    protected _getTextWidth: Function;

    protected _beforeMount(options?: IMultilinePathOptions, contexts?: object, receivedState?: void): Promise<void> | void {
        if (!options.containerWidth) {
            Logger.error('Option containerWidth is undefined');
        }
        return new Promise((resolve) => {
            loadFontWidthConstants().then((getTextWidth: Function) => {
                this._getTextWidth = getTextWidth;
                if (this._options.items && this._options.items.length > 0) {
                    this._items = this._options.items;
                    this._width = options.containerWidth;
                    this._initializeConstants(options.fontSize);
                    this._calculateBreadCrumbsToDraw(this._options.items, options);
                }
                resolve();
            });
        });
    }

    protected _beforeUpdate(newOptions: IMultilinePathOptions): void {
        if (this._options.fontSize !== newOptions.fontSize) {
            this._initializeConstants(newOptions.fontSize);
        }
        if (this._options.items !== newOptions.items || this._width !== newOptions.containerWidth
            || this._options.fontSize !== newOptions.fontSize) {
            this._items = newOptions.items;
            this._width = newOptions.containerWidth;
            this._calculateBreadCrumbsToDraw(newOptions.items, this._options);
        }
    }

    private _initializeConstants(fontSize: string): void {
        const dotsWidth = this._getTextWidth('...', fontSize) + PADDING_RIGHT;
        this.DOTS_WIDTH = ARROW_WIDTH + dotsWidth;
    }

    private _calculateBreadCrumbsToDraw(items: Record[], options: IMultilinePathOptions): void {
        const containerWidth = options.containerWidth;
        this._visibleItemsFirst = [];
        this._visibleItemsSecond = [];
        const itemsWidth = this._getItemsWidth(items, options);
        let shrinkItemIndex;
        let firstContainerItems = [];

        if (items.length <= 2) {
            // Если крошек меньше двух, располагаем их в первом контейнере
            firstContainerItems = items.map((item, index, items) => {
                const hasArrow = index !== 0;
                const withOverflow = itemsWidth[index] - (hasArrow ? ARROW_WIDTH : 0) > BREAD_CRUMB_MIN_WIDTH;
                return BreadCrumbsUtil.getItemData(index, items, false, withOverflow);
            });
            this._visibleItemsFirst = firstContainerItems;
        } else {
            // Если крошки занимают меньше доступной ширины, начинам расчеты
            let firstContainerWidth = 0;
            let secondContainerWidth = 0;
            // заполняем в первый контейнер то, что помещается. Запоминаем индекс последней крошки
            while (firstContainerWidth < containerWidth) {
                firstContainerWidth += itemsWidth[this._indexEdge];
                this._indexEdge++;
            }
            this._indexEdge -= 1;
            for (let i = 0; i < this._indexEdge; i++) {
                firstContainerItems.push(items[i]);
            }
            // позволяем сокращаться последней папке в первом контейнере
            if (firstContainerWidth - itemsWidth[this._indexEdge] + BREAD_CRUMB_MIN_WIDTH <= containerWidth) {
                firstContainerItems.push(items[this._indexEdge]);
                this._indexEdge++;
            }
            this._visibleItemsFirst = BreadCrumbsUtil.drawBreadCrumbsItems(firstContainerItems);
            this._visibleItemsFirst[this._visibleItemsFirst.length - 1].withOverflow = true;
            // рассчитываем ширину второго контейнера, заполненного оставшимися крошками
            for (let i = this._indexEdge; i < items.length; i++) {
                secondContainerWidth += itemsWidth[i];
            }
            secondContainerWidth -= itemsWidth[items.length - 2];
            secondContainerWidth += BREAD_CRUMB_MIN_WIDTH;
            // если второй контейнер по ширине больше, чем доступная ширина, начинаем расчеты
            if (secondContainerWidth > containerWidth) {
                // предпоследняя не уместилась - сразу вычитаем ее ширину
                secondContainerWidth -= BREAD_CRUMB_MIN_WIDTH;
                // Сначала пробуем замылить предпоследнюю крошку
                const secondContainerItems = [];
                // если замылить не получилось - показываем точки
                secondContainerWidth += this.DOTS_WIDTH;
                let index;
                // предпоследняя не поместилась - начинаем с пред-предпоследней
                for (index = items.length - 3; index >= this._indexEdge; index--) {
                    if (secondContainerWidth <= containerWidth) {
                        break;
                    } else if (this._canShrink(itemsWidth[index], secondContainerWidth, containerWidth)) {
                        shrinkItemIndex = index;
                        secondContainerWidth -= itemsWidth[index] - BREAD_CRUMB_MIN_WIDTH;
                        break;
                    } else {
                        secondContainerWidth -= itemsWidth[index];
                    }
                }
                // заполняем крошками, которые влезли, второй контейнер (не считая последней)
                for (let j = this._indexEdge; j <= index; j++) {
                    secondContainerItems.push(BreadCrumbsUtil.getItemData(j, items, true, j === shrinkItemIndex));
                }
                // добавляем точки
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

            } else {
                // если все остальные крошки поместились - пушим по второй контейнер
                const secondContainerItems = [];
                for (let j = this._indexEdge; j < items.length; j++) {
                    secondContainerItems.push(BreadCrumbsUtil.getItemData(j, items, true, j === items.length - 2));
                }
                this._visibleItemsSecond = secondContainerItems;
            }
        }
        this._indexEdge = 0;
    }

    private _getItemsWidth(items: Record[], options: IMultilinePathOptions): number[] {
        const itemsWidth = [];
        items.forEach((item, index) => {
            const itemTitleWidth = this._getTextWidth(ItemsUtil.getPropertyValue(item, options.displayProperty), options.fontSize);
            const itemWidth = index !== 0 ? itemTitleWidth + ARROW_WIDTH : itemTitleWidth;
            itemsWidth.push(itemWidth + PADDING_RIGHT);
        });
        return itemsWidth;
    }

    private _canShrink(itemWidth: number, currentWidth: number, availableWidth: number): boolean {
        return itemWidth > BREAD_CRUMB_MIN_WIDTH && currentWidth - itemWidth + BREAD_CRUMB_MIN_WIDTH < availableWidth;
    }

    private _itemClickHandler(e: SyntheticEvent<MouseEvent>, item: Model): void {
        e.stopPropagation();
        this._notify('itemClick', [item]);
    }

    static getDefaultOptions() {
        return {
            displayProperty: 'title',
            fontSize: 'xs'
        };
    }

    static _styles: string[] = ['Controls/_breadcrumbs/resources/FontLoadUtil'];
}

export default MultilinePath;
