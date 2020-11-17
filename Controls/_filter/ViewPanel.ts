import Control = require('Core/Control');
import template = require('wml!Controls/_filter/ViewPanel/ViewPanel');
import {resetFilter} from 'Controls/_filter/resetFilterUtils';
import {SyntheticEvent} from 'Vdom/Vdom';
import {IControlOptions, TemplateFunction} from 'UI/Base';
import {object} from 'Types/util';
import {GroupItem} from 'Controls/display';
import {Model} from 'Types/entity';

/**
 * Контрол "Панель фильтра с набираемыми параметрами ".
 *
 * @class Controls/_filter/ViewPanel
 * @extends Core/Control
 * @mixes Controls/_filter/ViewPanel/interface/IFilterViewPanel
 *
 * @public
 * @author Мельникова Е.А.
 *
 */

export default class ViewPanel extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
    protected _source: object[] = null;
    protected _editingObject: object = {};

    protected _beforeMount(options): void {
        this._source = this._getSource(options.source);
        this._updateEditingObject(this._source);
    }

    protected _beforeUpdate(newOptions): void {
        this._source = this._getSource(newOptions.source);
        this._updateEditingObject(this._source);
    }

    protected _resetFilter(): void {
        resetFilter(this._source);
        this._updateEditingObject(this._source);
        this._notifyChanges();
    }

    protected _applyFilter(): void {
        this._notifyChanges();
    }

    protected _editingObjectChanged(event: SyntheticEvent, editingObject: object): void {
        this._editingObject = editingObject;
        this._updateSource(editingObject);
    }

    protected _itemClick(event: SyntheticEvent, displayItem: unknown, clickEvent: SyntheticEvent<MouseEvent>): void {
        const isResetClick = clickEvent?.target.closest('.controls-FilterViewPanel__groupReset');
        if (displayItem instanceof GroupItem) {
            displayItem.toggleExpanded();
            if (isResetClick) {
                this._resetFilterItem(displayItem);
            }
        }
    }

    private _resetFilterItem(item: unknown): void {
        const itemContent = item.getContents();
        this._source.forEach((item) => {
            const group = object.getPropertyValue(item, 'group');
            const name = object.getPropertyValue(item, 'name');
            if (group === itemContent || name === itemContent) {
                const resetValue = object.getPropertyValue(item, 'resetValue');
                object.setPropertyValue(item, 'value', resetValue);
            }
        });
        this._updateEditingObject(this._source);
        this._notifyChanges();
    }

    private _updateSource(editingObject: object): void {
        this._source.forEach((item) => {
            item.value = editingObject[item.name];
        });
    }

    private _updateEditingObject(source: object[]): void {
        source.forEach((item) => {
            this._editingObject[item.name] = item.value;
        });
    }

    private _notifyChanges(): void {
        this._notify('filterChanged', [this._editingObject]);
        this._notify('itemsChanged', [this._source]);
    }

    private _getSource(source: object[]): object[] {
        source.forEach((item) => {
            const caption = object.getPropertyValue(item, 'caption');
            item.caption = caption || '';
        });
        return source;
    }

    static _theme: string[] = ['Controls/filter', 'Controls/Classes'];
}
