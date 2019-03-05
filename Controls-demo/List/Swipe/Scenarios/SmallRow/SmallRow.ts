import Control = require('Core/Control');
import * as template from 'wml!Controls-demo/List/Swipe/Scenarios/SmallRow/SmallRow';
import {
   IItemAction,
   ShowType
} from 'Controls/_list/Swipe/interface/IItemAction';
// @ts-ignore
import { HierarchicalMemory } from 'Types/source';

export default class SmallRow extends Control {
   private _template: Function = template;
   private _itemActions: IItemAction[];
   private _header: object[];
   private _columns: object[];
   private _source: HierarchicalMemory;

   _beforeMount(): void {
      this._itemActions = [
         {
            id: 1,
            icon: 'icon-PhoneNull',
            title: 'phone',
            showType: ShowType.TOOLBAR
         },
         {
            id: 2,
            icon: 'icon-EmptyMessage',
            title: 'message',
            showType: ShowType.TOOLBAR
         },
         {
            id: 3,
            icon: 'icon-Profile',
            title: 'profile',
            showType: ShowType.MENU
         },
         {
            id: 4,
            icon: 'icon-Erase',
            iconStyle: 'danger',
            title: 'delete',
            showType: ShowType.TOOLBAR
         }
      ];
      this._header = [
         {
            title: '',
            displayProperty: 'title'
         },
         {
            title: 'Ед. изм.',
            displayProperty: 'unit'
         }
      ];
      this._columns = [
         {
            displayProperty: 'title'
         },
         {
            displayProperty: 'unit',
            width: '100px'
         }
      ];
      this._source = new HierarchicalMemory({
         parentProperty: 'parent',
         nodeProperty: 'parent@',
         idProperty: 'id',
         data: [{
            id: 0,
            title: 'Домашняя птица',
            parent: null,
            'parent@': true
         }, {
            id: 1,
            title: 'Индейка',
            unit: 'кг',
            parent: 0,
            'parent@': null
         }, {
            id: 2,
            title: 'Кура',
            unit: 'кг',
            parent: 0,
            'parent@': null
         }]
      });
   }
}
