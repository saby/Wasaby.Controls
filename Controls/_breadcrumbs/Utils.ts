import {ItemsUtil} from 'Controls/list';
import {Record} from 'Types/entity';
import {getFontWidth} from "../Utils/getFontWidth";
import {IMultilinePathOptions} from "./MultilinePath";
import {IBreadCrumbsOptions} from "./interface/IBreadCrumbs";

const ARROW_WIDTH = 16;
const BREAD_CRUMB_MIN_WIDTH = ARROW_WIDTH + 28;
const PADDING_RIGHT = 2;

export default {
    shouldRedraw(currentItems: Record[], newItems: Record[]): boolean {
        return currentItems !== newItems;
    },
    getItemData(index: number, items: Record[], arrow: boolean = false, withOverflow: boolean = false): object {
        const currentItem = items[index];
        const count = items.length;
        return {
            getPropValue: ItemsUtil.getPropertyValue,
            item: currentItem,
            hasArrow: count > 1 && index !== 0 || arrow,
            withOverflow
        };
    },
    drawBreadCrumbsItems(items: Record[], arrow: boolean = false): any[] {
        return items.map((item, index, items) => {
            return this.getItemData(index, items, arrow);
        });
    },
    canShrink(itemWidth: number, currentWidth: number, availableWidth: number): boolean {
        return itemWidth > BREAD_CRUMB_MIN_WIDTH && currentWidth - itemWidth + BREAD_CRUMB_MIN_WIDTH < availableWidth;
    },
    getTextWidth(text: string, size: string  = 'xs'): number {
        return getFontWidth(text, size);
    },
    getItemsWidth(items: Record[], options: IMultilinePathOptions, getTextWidth: Function = this.getTextWidth): number[] {
        const itemsWidth = [];
        items.forEach((item, index) => {
            const itemTitleWidth = getTextWidth(ItemsUtil.getPropertyValue(item, options.displayProperty), options.fontSize);
            const itemWidth = index !== 0 ? itemTitleWidth + ARROW_WIDTH : itemTitleWidth;
            itemsWidth.push(itemWidth + PADDING_RIGHT);
        });
        return itemsWidth;
    },
    getDotsWidth(fontSize: string, getTextWidth: Function = this.getTextWidth): number {
        const dotsWidth = getTextWidth('...', fontSize) + PADDING_RIGHT;
        return ARROW_WIDTH + dotsWidth;
    },
    calculateItemsWithShrinkingLast(items: Record[], options: IMultilinePathOptions, width: number, getTextWidth: Function = this.getTextWidth): {visibleItems: Record[], indexEdge: number} {
        // придумать, чтобы два раза не проходился в крошках в две строки
        const itemsWidth = this.getItemsWidth(items, options, getTextWidth);
        let indexEdge = 0;
        let visibleItems;
        let firstContainerItems = [];
        if (items.length <= 2) {
            // Если крошек меньше двух, располагаем их в первом контейнере
            firstContainerItems = items.map((item, index, items) => {
                const hasArrow = index !== 0;
                const withOverflow = itemsWidth[index] - (hasArrow ? ARROW_WIDTH : 0) > BREAD_CRUMB_MIN_WIDTH;
                return this.getItemData(index, items, false, withOverflow);
            });
            return {
                visibleItems: firstContainerItems,
                indexEdge: items.length - 1
            };
        } else {
            // Если крошки занимают меньше доступной ширины, начинам расчеты
            let firstContainerWidth = 0;
            // заполняем в первый контейнер то, что помещается. Запоминаем индекс последней крошки
            while (firstContainerWidth < width) {
                firstContainerWidth += itemsWidth[indexEdge];
                indexEdge++;
            }
            indexEdge -= 1;
            for (let i = 0; i < indexEdge; i++) {
                firstContainerItems.push(items[i]);
            }
            // позволяем сокращаться последней папке в первом контейнере
            if (firstContainerWidth - itemsWidth[indexEdge] + BREAD_CRUMB_MIN_WIDTH <= width) {
                firstContainerItems.push(items[indexEdge]);
                indexEdge++;
            }
            visibleItems = this.drawBreadCrumbsItems(firstContainerItems);
            visibleItems[visibleItems.length - 1].withOverflow = true;
            return {
                visibleItems,
                indexEdge
            };
        }
    },
    calculateItemsWithDots(items: Record[], options: IBreadCrumbsOptions, indexEdge: number, width: number, dotsWidth: number, getTextWidth: Function = this.getTextWidth): Record[] {
        let secondContainerWidth = 0;
        let shrinkItemIndex;
        const itemsWidth = this.getItemsWidth(items, options, getTextWidth);
        for (let i = indexEdge; i < items.length; i++) {
            secondContainerWidth += itemsWidth[i];
        }
        secondContainerWidth -= itemsWidth[items.length - 2];
        secondContainerWidth += BREAD_CRUMB_MIN_WIDTH;
        // если второй контейнер по ширине больше, чем доступная ширина, начинаем расчеты
        if (secondContainerWidth > width) {
            // предпоследняя не уместилась - сразу вычитаем ее ширину
            secondContainerWidth -= BREAD_CRUMB_MIN_WIDTH;
            // Сначала пробуем замылить предпоследнюю крошку
            const secondContainerItems = [];
            // если замылить не получилось - показываем точки
            secondContainerWidth += dotsWidth;
            let index;
            // предпоследняя не поместилась - начинаем с пред-предпоследней
            for (index = items.length - 3; index >= indexEdge; index--) {
                if (secondContainerWidth <= width) {
                    break;
                } else if (this.canShrink(itemsWidth[index], secondContainerWidth, width)) {
                    shrinkItemIndex = index;
                    secondContainerWidth -= itemsWidth[index] - BREAD_CRUMB_MIN_WIDTH;
                    break;
                } else {
                    secondContainerWidth -= itemsWidth[index];
                }
            }
            // заполняем крошками, которые влезли, второй контейнер (не считая последней)
            for (let j = indexEdge; j <= index; j++) {
                secondContainerItems.push(this.getItemData(j, items, true, j === shrinkItemIndex));
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
            secondContainerItems.push(this.getItemData(items.length - 1, items, true, false));

            return secondContainerItems;

        } else {
            // если все остальные крошки поместились - пушим по второй контейнер
            const secondContainerItems = [];
            for (let j = indexEdge; j < items.length; j++) {
                secondContainerItems.push(this.getItemData(j, items, true, j === items.length - 2));
            }
            return secondContainerItems;
        }
    }



};
