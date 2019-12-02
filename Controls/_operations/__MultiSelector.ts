import {Control, IControlOptions, TemplateFunction} from 'UI/Base';
import * as template from 'wml!Controls/_operations/__MultiSelector';
import {Memory} from 'Types/source';
import {Model} from 'Types/entity';
import {SyntheticEvent} from 'Vdom/Vdom';
import {TKeySelection as TKey, TKeysSelection as TKeys} from 'Controls/interface/';

const DEFAULT_ITEMS = [
   {
      id: 'selectAll',
      title: rk('Все')
   }, {
      id: 'unselectAll',
      title: rk('Снять')
   }, {
      id: 'toggleAll',
      title: rk('Инвертировать')
   }
];

const SHOW_SELECTED_ITEM =  {
   id: 'showSelected',
   title: rk('Показать отмеченнные')
};

const SHOW_ALL_ITEM =  {
   id: 'showAll',
   title: rk('Показать все')
};

type TCount = void|number;

export interface IMultiSelectorOptions extends IControlOptions {
   selectedKeys: TKeys;
   excludedKeys: TKeys;
   selectedKeysCount: TCount;
   root: TKey;
}

export default class MultiSelector extends Control<IMultiSelectorOptions> {
   protected _template: TemplateFunction = template;
   protected _menuSource: Memory = null;
   protected _sizeChanged: boolean = false;
   protected _menuCaption: string = null;
   protected _isShowSelectedItems: boolean = false;

   protected _beforeMount(options: IMultiSelectorOptions): void {
      this._menuSource = this._getMenuSource(options);
      this._updateSelection(options.selectedKeys, options.excludedKeys, options.selectedKeysCount, options.root);
   }

   protected _beforeUpdate(options: IMultiSelectorOptions): void {
      const currOpts = this._options;
      const selectionIsChanged = currOpts.selectedKeys !== options.selectedKeys || currOpts.excludedKeys !== options.excludedKeys;

      if (selectionIsChanged || currOpts.selectedKeysCount !== options.selectedKeysCount) {
         this._updateSelection(options.selectedKeys, options.excludedKeys, options.selectedKeysCount, options.root);
      }

      if (selectionIsChanged || currOpts.withShowSelected !== options.withShowSelected) {
         this._menuSource = this._getMenuSource(options);
      }
   }

   protected _afterUpdate(oldOptions?: IMultiSelectorOptions): void {
      if (this._sizeChanged) {
         this._sizeChanged = false;
         this._notify('controlResize', [], { bubbling: true });
      }
   }

   protected _viewTypeChanged(e: SyntheticEvent, typeView: string): void {
      this._isShowSelectedItems = typeView === 'showSelected';
      this._menuSource = this._getMenuSource(this._options);
   }

   private _getAdditionalMenuItems(options: IMultiSelectorOptions): Array<Object> {
      let additionalItems: Array<Object> = [];
      let isAllSelected = options.selectedKeys.includes(options.root) && options.excludedKeys.includes(options.root);

      if (this._isShowSelectedItems) {
         additionalItems.push(SHOW_ALL_ITEM);
      } else if (options.withShowSelected && options.selectedKeys.length && (!isAllSelected || options.excludedKeys.length > 1)) {
         additionalItems.push(SHOW_SELECTED_ITEM);
      }

      return additionalItems;
   }

   private _getMenuSource(options: IMultiSelectorOptions): Memory {
      return new Memory({
         keyProperty: 'id',
         data: DEFAULT_ITEMS.concat(this._getAdditionalMenuItems(options))
      });
   }

   private _updateSelection(selectedKeys: TKeys, excludedKeys: TKeys, count: TCount, root: TKey): void {
      const selectedCount = count === undefined ? selectedKeys.length : count;

      if (selectedCount > 0 && selectedKeys.length) {
         this._menuCaption = rk('Отмечено') + ': ' + selectedCount;
      } else if (selectedKeys[0] === root && (!excludedKeys.length || excludedKeys[0] === root && excludedKeys.length === 1)) {
         this._menuCaption = rk('Отмечено всё');
      } else if (selectedCount === null) {
         this._menuCaption = rk('Отмечено');
      } else {
         this._menuCaption = rk('Отметить');
      }
      this._sizeChanged = true;
   }

   protected _onMenuItemActivate(event: SyntheticEvent<'menuItemActivate'>, item: Model): void {
      let itemId: string = item.get('id');

      if (itemId === 'showSelected' || itemId === 'showAll') {
         this._isShowSelectedItems = !this._isShowSelectedItems;
         this._menuSource = this._getMenuSource(this._options);

         this._notify('viewModeChanged', [itemId], {
            bubbling: true
         });
      } else {
         this._notify('selectedTypeChanged', [itemId], {
            bubbling: true
         });
      }
   }

   static getDefaultOptions(): object {
      return {
         root: null,
         selectedKeys: [],
         excludedKeys: []
      };
   }
}
