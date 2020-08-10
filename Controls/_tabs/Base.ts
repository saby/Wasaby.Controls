import {Control, IControlOptions, TemplateFunction} from 'UI/Base';
import {ITabsButtons, ITabsButtonsOptions} from './interface/ITabsButtons';
import {RecordSet} from 'Types/collection';

export default class Base extends Control<ITabsButtonsOptions> {

    protected _getIndexOfLastTab(items: RecordSet, displayProperty: string, containerWidth: number): number {
        // находим индекс последней уместившейся вкладки с учетом текста, отступов и разделителей.
        let width = 0;
        let indexLast = 0;
        const arrWidth = this._getWidthOfElements(items, displayProperty);
        while (width < containerWidth && indexLast !== items._$rawData.length) {
            width += arrWidth[indexLast];
            indexLast++;
        }
        indexLast--;
        return indexLast;
    }

    protected _getWidthOfElement(item: string): number {
        // ширина элемента
        return 20;
    }

    protected _getWidthOfElements(items: RecordSet, displayProperty: string): number[] {
        // получаем массив ширин элементов
        let width = 0;
        const arrWidth = [];
        items.forEach((item) => {
            const widthOfEl = this._getWidthOfElement(item[displayProperty]);
            arrWidth.push(widthOfEl);
            width += widthOfEl;
        });
        return arrWidth;
    }
}
