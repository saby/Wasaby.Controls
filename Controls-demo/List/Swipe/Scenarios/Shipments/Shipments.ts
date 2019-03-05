import Control = require('Core/Control');
import * as template from 'wml!Controls-demo/List/Swipe/Scenarios/Shipments/Shipments';
import { IItemAction, ShowType } from 'Controls/_list/Swipe/interface/IItemAction';
import { HierarchicalMemory } from 'Types/source';
import 'css!Controls-demo/List/Swipe/Scenarios/Shipments/Shipments';
import 'wml!Controls-demo/List/Swipe/Scenarios/Shipments/firstColumn';
import 'wml!Controls-demo/List/Swipe/Scenarios/Shipments/secondColumn';
import 'wml!Controls-demo/List/Swipe/Scenarios/Shipments/thirdColumn';
import 'wml!Controls-demo/List/Swipe/Scenarios/Shipments/fourthColumn';
import 'wml!Controls-demo/List/Swipe/Scenarios/Shipments/fifthColumn';
import 'wml!Controls-demo/List/Swipe/Scenarios/Shipments/sixthColumn';

export default class Shipments extends Control {
   private _template: Function = template;
   private _itemActions: IItemAction[];
   private _columns: object[];
   private _source: HierarchicalMemory;

   _beforeMount(): void {
      this._itemActions = [
         {
            id: 0,
            icon: 'icon-PhoneNull',
            title: 'phone',
            showType: ShowType.MENU_TOOLBAR
         },
         {
            id: 1,
            icon: 'icon-DK',
            title: 'Расчеты по документу',
            showType: ShowType.MENU_TOOLBAR
         }
      ];
      this._columns = [
         {
            template:
               'wml!Controls-demo/List/Swipe/Scenarios/Shipments/firstColumn'
         },
         {
            template:
               'wml!Controls-demo/List/Swipe/Scenarios/Shipments/secondColumn'
         },
         {
            template:
               'wml!Controls-demo/List/Swipe/Scenarios/Shipments/thirdColumn',
            align: 'right'
         },
         {
            template:
               'wml!Controls-demo/List/Swipe/Scenarios/Shipments/fourthColumn'
         },
         {
            template:
               'wml!Controls-demo/List/Swipe/Scenarios/Shipments/fifthColumn'
         },
         {
            template:
               'wml!Controls-demo/List/Swipe/Scenarios/Shipments/sixthColumn',
            align: 'right'
         }
      ];
      const data = [
         {
            id: 0,
            date: '19.06.18',
            additionalText: '...14567',
            title: 'Тандер, АО (Магнит)',
            additionalInfo: [
               'Комментарий из документа',
               'Набор художника',
               'Краски ПФ-111',
               '...'
            ],
            orgNames: ['Основной склад', 'Фаворит, ООО'],
            sum: 8700,
            regulationName: 'Реализация',
            author: 'Никитина О.В.'
         },
         {
            id: 1,
            date: '07.06.18',
            additionalText: '...10005',
            title: 'Основа, ООО',
            orgNames: ['Основной склад', 'Мили, ООО'],
            regulationName: 'Реализация',
            author: 'Можалойвская Л.А.'
         }
      ];
      this._source = new HierarchicalMemory({
         parentProperty: 'parent',
         nodeProperty: 'parent@',
         idProperty: 'id',
         data
      });
   }
}
