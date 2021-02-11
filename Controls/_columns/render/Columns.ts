import { TemplateFunction } from 'UI/Base';
import template = require('wml!Controls/_columns/render/Columns');

import defaultItemTemplate = require('wml!Controls/_columns/render/resources/ItemTemplate');

import {ListView, IList} from 'Controls/list';

export interface IColumnsRenderOptions extends IList {
    columnMinWidth: number;
    columnMaxWidth: number;
    columnsMode: 'auto' | 'fixed';
    columnsCount: number;
    spacing: number;
}

export default class Columns extends ListView {
    protected _options: IColumnsRenderOptions;
    protected _template: TemplateFunction = template;

    protected _beforeMount(options: IColumnsRenderOptions): void {
        super._beforeMount(options);
        this._templateKeyPrefix = 'columns-render';
    }
    protected _resizeHandler(): void {
        this._notify('resize', []);
    }

    protected _getItemsContainerStyle(): string {
        const minmax = `minmax(${this._options.columnMinWidth + this._options.spacing}px, ${this._options.columnMaxWidth  + this._options.spacing}px) `;
        const gridTemplate = minmax.repeat(this._options.columnsCount);
        return  `grid-template-columns: ${gridTemplate};
                 -ms-grid-columns: ${gridTemplate};`;
    }
    protected _getMinMaxMidthStyle(min: number, max: number): string {
        return  `min-width:${min}px; max-width:${max}px; `;
    }
    protected _getPlaceholderStyle(): string {
        return  this._getMinMaxMidthStyle(this._options.columnMinWidth, this._options.columnMaxWidth);
    }
    protected _getColumnStyle(index: number): string {
        return this._getMinMaxMidthStyle(this._options.columnMinWidth + this._options.spacing, this._options.columnMaxWidth + this._options.spacing) + `-ms-grid-column: ${index + 1};`
    }
    static getDefaultOptions(): Partial<IColumnsRenderOptions> {
        return {
            itemTemplate: defaultItemTemplate
        };
    }
}

Object.defineProperty(Columns, 'defaultProps', {
   enumerable: true,
   configurable: true,

   get(): object {
      return Columns.getDefaultOptions();
   }
});
