import rk = require('i18n!Controls');
import {Control, IControlOptions, TemplateFunction} from 'UI/Base';
import * as template from 'wml!Controls/_operations/__MultiSelector';
import {Memory, Rpc} from 'Types/source';
import {Model} from 'Types/entity';
import {SyntheticEvent} from 'Vdom/Vdom';
import {TKeysSelection, TSelectionRecord, ISelectionObject} from 'Controls/interface';
import * as selectionToRecord from 'Controls/_operations/MultiSelector/selectionToRecord';

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
   id: 'selected',
   title: rk('Показать отмеченнные')
};

const SHOW_ALL_ITEM =  {
   id: 'all',
   title: rk('Показать все')
};

type TCount = null|number|void;

export interface ISelectedCountConfig {
   rpc: Rpc;
   data: object;
   command: string;
}

export interface IMultiSelectorOptions extends IControlOptions {
   selectedKeys: TKeysSelection;
   excludedKeys: TKeysSelection;
   selectedKeysCount: TCount;
   root?: number|string;
   selectionViewMode?: 'all'|'selected';
   selectedCountConfig?: ISelectedCountConfig;
}

export default class MultiSelector extends Control<IMultiSelectorOptions> {
   protected _template: TemplateFunction = template;
   protected _menuSource: Memory = null;
   protected _sizeChanged: boolean = false;
   protected _menuCaption: string = null;

   protected _beforeMount(options: IMultiSelectorOptions): Promise<TCount> {
      this._menuSource = this._getMenuSource(options);
      return this._updateMenuCaptionByOptions(options);
   }

   protected _beforeUpdate(options: IMultiSelectorOptions): void|Promise<TCount> {
      const currOpts = this._options;
      const selectionIsChanged = currOpts.selectedKeys !== options.selectedKeys || currOpts.excludedKeys !== options.excludedKeys;

      if (selectionIsChanged || currOpts.selectionViewMode !== options.selectionViewMode) {
         this._menuSource = this._getMenuSource(options);
      }

      if (selectionIsChanged || currOpts.selectedKeysCount !== options.selectedKeysCount) {
         return this._updateMenuCaptionByOptions(options);
      }
   }

   protected _afterUpdate(oldOptions?: IMultiSelectorOptions): void {
      if (this._sizeChanged) {
         this._sizeChanged = false;
         this._notify('controlResize', [], { bubbling: true });
      }
   }

   private _getAdditionalMenuItems(options: IMultiSelectorOptions): object[] {
      const additionalItems = [];
      const isAllSelected = options.selectedKeys.includes(options.root) && options.excludedKeys.includes(options.root);

      if (options.selectionViewMode === 'selected') {
         additionalItems.push(SHOW_ALL_ITEM);
         // Показываем кнопку если есть выбранные и невыбранные записи
      } else if (options.selectionViewMode === 'all' && options.selectedKeys.length && (!isAllSelected || options.excludedKeys.length > 1)) {
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

   private _updateMenuCaptionByOptions(options: IMultiSelectorOptions): Promise<TCount> {
      const selectedKeys = options.selectedKeys;
      const excludedKeys = options.excludedKeys;
      const selection = this._getSelection(selectedKeys, excludedKeys);

      return this._getCount(selection, options.selectedKeysCount).then((countResult) => {
         this._menuCaption = this._getMenuCaption(selection, countResult, options.root);
         this._sizeChanged = true;
      });
   }

   private _getMenuCaption({selected, excluded}: ISelectionObject, count: TCount, root: number|string): string {
      let caption;

      if (count > 0 && selected.length) {
         caption = rk('Отмечено') + ': ' + count;
      } else if (selected[0] === root && (!excluded.length || excluded[0] === root && excluded.length === 1)) {
         caption = rk('Отмечено всё');
      } else if (count === null) {
         caption = rk('Отмечено');
      } else {
         caption = rk('Отметить');
      }

      return caption;
   }

   private _getCount(selection: ISelectionObject, count: TCount): Promise<TCount> {
      let methodResult;
      let countResult;

      if (this._isCorrectCount(count) || !this._options.selectedCountConfig) {
         countResult = count === undefined ? selection.selected.length : count;
         methodResult = Promise.resolve(countResult);
      } else {
         methodResult = this._getCountByMethodCall(selection);
      }

      return methodResult;
   }

   private _getCountByMethodCall(selection: ISelectionObject): Promise<TCount> {
      const selectionCountConfig = this._options.selectedCountConfig;
      const data = this._getDataForCallWithSelection(selection);

      this._children.countIndicator.show();
      return selectionCountConfig.rpc.call(selectionCountConfig.command, data).then((dataSet) => {
         this._children.countIndicator.hide();
         return dataSet.getScalar('count') as number;
      });
   }

   private _getDataForCallWithSelection(selection: ISelectionObject): object {
      const selectionCountConfig = this._options.selectedCountConfig;
      const data = {...selectionCountConfig.data || {}};
      const filter = {...(data.filter || {})};
      Object.assign(filter, {selection: this._getSelectionRecord(selection, selectionCountConfig.rpc)});
      data.filter = filter;
      return data;
   }

   private _getSelectionRecord(selection: ISelectionObject, rpc: Rpc): TSelectionRecord {
      return selectionToRecord(selection, rpc.getAdapter());
   }

   private _getSelection(selectedKeys: TKeysSelection, excludedKeys: TKeysSelection): ISelectionObject {
      return {
         selected: selectedKeys,
         excluded: excludedKeys
      };
   }

   private _isCorrectCount(count: TCount): boolean {
      return typeof count === 'number' || count === undefined;
   }

   protected _onMenuItemActivate(event: SyntheticEvent<'menuItemActivate'>, item: Model): void {
      let itemId: string = item.get('id');

      this._notify('selectedTypeChanged', [itemId], {
         bubbling: true
      });
   }

   static getDefaultOptions(): object {
      return {
         root: null,
         selectedKeys: [],
         excludedKeys: []
      };
   }
}
