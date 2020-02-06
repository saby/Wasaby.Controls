import { TemplateFunction } from 'UI/Base';
import template = require('wml!Controls/_listRender/Columns/Columns');

import defaultItemTemplate = require('wml!Controls/_listRender/Columns/resources/ItemTemplate');

import { SyntheticEvent } from 'Vdom/Vdom';
import { CollectionItem } from 'Controls/display';
import {default as BaseRender, IRenderOptions} from './Render';

export default class Columns extends BaseRender {
    protected _template: TemplateFunction = template;

    protected _beforeMount(options: IRenderOptions): void {
        super._beforeMount(options);
        this._templateKeyPrefix = `columns-render-${this.getInstanceId()}`;
    }

    protected _beforeUnmount(): void {
        this._unsubscribeFromModelChanges(this._options.listModel);
    }

    protected _onItemSwipe(e: SyntheticEvent<null>, item: CollectionItem<unknown>): void {
        e.stopPropagation();
        this._notify('itemSwipe', [item, e]);
    }

    // Обработка клавиатуры будет реализована по работам с маркером в ColumnsView
    protected _onItemKeyDown(e: SyntheticEvent<KeyboardEvent>, item: CollectionItem<unknown>): void {
        e.preventDefault();
        e.stopPropagation();
    }

    // Обработка клавиатуры будет реализована по работам с маркером в ColumnsView
    protected _keyDown(e: SyntheticEvent<KeyboardEvent>): void {
        e.preventDefault();
        e.stopPropagation();
    }

    static getDefaultOptions(): Partial<IRenderOptions> {
        return {
            itemTemplate: defaultItemTemplate
        };
    }
}
