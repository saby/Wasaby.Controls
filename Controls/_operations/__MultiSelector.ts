import {Control, IControlOptions, TemplateFunction} from 'UI/Base';
import * as template from 'wml!Controls/_operations/__MultiSelector';
import {Memory} from 'Types/source';
import {Model} from 'Types/entity';
import {SyntheticEvent} from 'Vdom/Vdom';

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

type TKeys = string[]|number[];
type TCount = void|number;
type TRoot = null|string|number;

export interface IMultiSelectorOptions extends IControlOptions {
   selectedKeys: TKeys;
   excludedKeys: TKeys;
   selectedKeysCount: TCount;
   root: TRoot;
}

export default class MultiSelector extends Control<IMultiSelectorOptions> {
   protected _template: TemplateFunction = template;
   protected _menuSource: Memory = null;
   protected _sizeChanged: boolean = false;
   protected _menuCaption: string = null;
   protected _isShowSelectedItems: boolean = false;

   protected _beforeMount(options: IMultiSelectorOptions): void {
      this._menuSource = this._getMenuSource(options.withShowSelected);
      this._updateSelection(options.selectedKeys, options.excludedKeys, options.selectedKeysCount, options.root);
   }

   protected _beforeUpdate(options: IMultiSelectorOptions): void {
      const currOpts = this._options;
      if (currOpts.selectedKeys !== options.selectedKeys ||
          currOpts.excludedKeys !== options.excludedKeys ||
          currOpts.selectedKeysCount !== options.selectedKeysCount) {
         this._updateSelection(options.selectedKeys, options.excludedKeys, options.selectedKeysCount, options.root);
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
      this._menuSource = this._getMenuSource(this._options.withShowSelected);
   }

   private _getAdditionalMenuItems(withShowSelected: boolean): Array<Object> {
      if (!withShowSelected) {
         return [];
      } else if (this._isShowSelectedItems) {
         return [SHOW_ALL_ITEM];
      } else {
         return [SHOW_SELECTED_ITEM];
      }
   }

   private _getMenuSource(withShowSelected: boolean): Memory {
      return new Memory({
         keyProperty: 'id',
         data: DEFAULT_ITEMS.concat(this._getAdditionalMenuItems(withShowSelected))
      });
   }

   private _updateSelection(selectedKeys: TKeys, excludedKeys: TKeys, count: TCount, root: TRoot): void {
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
         this._notify('viewTypeChanged', [itemId], {
            bubbling: true
         });

         this._isShowSelectedItems = !this._isShowSelectedItems;
         this._menuSource = this._getMenuSource(this._options.withShowSelected);
      } else {
         this._notify('selectedTypeChanged', [itemId], {
            bubbling: true
         });
      }
   }

   static getDefaultOptions(): object {
      return {
         root: null
      };
   }
}
