import {Control, TemplateFunction, IControlOptions} from 'UI/Base';
import FontLoadUtil = require('Controls/Utils/FontLoadUtil');
import getWidthUtil = require('Controls/Utils/getWidth');
import {ItemsUtil} from 'Controls/list';
import BreadCrumbsUtil from './Utils';
// @ts-ignore
import * as template from 'wml!Controls/_breadcrumbs/TwoLevel/TwoLevel';
import {SyntheticEvent} from 'Vdom/Vdom';


class TwoLevelCrumbs extends Control<IControlOptions> {

    protected _template: TemplateFunction = template;
    protected _visibleItems = [];
    protected _visibleFirstItems = [];
    protected _oldWidth: number = 0;
    protected _viewUpdated: boolean = false;
    protected ARROW_WIDTH: number = 0;
// доделать
    protected BREAD_CRUMB_MIN_WIDTH: number = 30;
    protected DOTS_WIDTH: number = 0;
    protected measure: any;
    protected _indexEdge: number = 0;

    protected _afterMount(options, contexts?: object, receivedState?: void): void {
        this._initializeConstants(options.theme);
        if (this._options.items && this._options.items.length > 0) {
            this._oldWidth = this._container.clientWidth;
            FontLoadUtil.waitForFontLoad('controls-BreadCrumbsView__crumbMeasurer').then(() => {
                this._calculateBreadCrumbsToDraw(this._options.items, this._oldWidth);
                this._forceUpdate();
            });
        }
    }
    protected _beforeUpdate(newOptions): void {
        // Если тема изменилась - изменились размеры
        if (this._options.theme !== newOptions.theme) {
            this._initializeConstants(newOptions.theme);
        }
    }

    private _initializeConstants(theme: string): void {
        this.ARROW_WIDTH = getWidthUtil('<span class="controls-BreadCrumbsView__arrow controls-BreadCrumbsView__arrow_theme-' + theme + ' icon-size icon-DayForwardBsLine"></span>');
        const dotsWidth = getWidthUtil('<div class="controls-BreadCrumbsView__title  controls-BreadCrumbsView__title_theme-' + theme + '">...</div>');
        this.DOTS_WIDTH = this.ARROW_WIDTH + dotsWidth;
    }

    private _calculateBreadCrumbsToDraw(items, containerWidth: number): void {
        const itemsWidth = this._getItemsWidth(items, this._options.displayProperty);
        const currentContainerWidth = itemsWidth.reduce((accumulator, currentValue) => accumulator + currentValue);

        if (currentContainerWidth > containerWidth) {
            // грусна - придумать как посчитать
            let firstContainerWidth = 0;
            let secondContainerWidth = 0;
            while (firstContainerWidth < containerWidth) {
                firstContainerWidth += itemsWidth[this._indexEdge];
                this._indexEdge++;
            }
            // обработать ситуацию, когда первая крошка не поместилась в контейнер - тогда индекс будет -1
            this._indexEdge -= 1;
            for (let i = 0; i < this._indexEdge; i++) {
                this._visibleFirstItems.push(BreadCrumbsUtil.getItemData(i, items));
            }
            for (let i = this._indexEdge; i < items.length; i++) {
                secondContainerWidth += itemsWidth[i];
            }

            if (secondContainerWidth > containerWidth) {
                // грусна - придумать как посчитать второй контейнер с крошками
            } else {
                // если все остальные крошки поместились - огонь - пушим по второй контейнер
                for (let i = this._indexEdge; i < items.length; i++) {
                    this._visibleFirstItems.push(BreadCrumbsUtil.getItemData(i, items));
                }
            }

        } else {
            BreadCrumbsUtil.drawBreadCrumbs(this, items);
        }
    }

    private _getItemsWidth(items, displayProperty): number[] {
        const itemsWidth = [];
        items.forEach((item, index) => {
            const itemTitleWidth = getWidthUtil('<div class="controls-BreadCrumbsView__title  controls-BreadCrumbsView__title_theme-' + this._options.theme + '">' + ItemsUtil.getPropertyValue(item, displayProperty) + '</div>');
            const itemWidth = index !== 0 ? itemTitleWidth + this.ARROW_WIDTH : itemTitleWidth;
            itemsWidth.push(itemWidth);
        });
        return itemsWidth;
    }

    static getDefaultOptions() {
    }

    static getOptionTypes() {
    }
}

export default TwoLevelCrumbs;
