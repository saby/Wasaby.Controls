import Control = require('Core/Control');
import * as template from 'wml!Controls-demo/List/Swipe/Scenarios/Tile/Tile';
import { IItemAction, ShowType } from 'Controls/List/Swipe/interface/IItemAction';
import { HierarchicalMemory } from 'Types/source';
import explorerImages = require('Controls-demo/Explorer/ExplorerImages');

export default class Tile extends Control {
   private _template: Function = template;
   private _itemActions: IItemAction[];
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
            title: 'delete',
            iconStyle: 'danger',
            showType: ShowType.TOOLBAR
         },
         {
            id: 5,
            icon: 'icon-PhoneNull',
            title: 'second phone',
            showType: ShowType.TOOLBAR
         },
         {
            id: 6,
            icon: 'icon-EmptyMessage',
            title: 'second message',
            showType: ShowType.TOOLBAR
         },
         {
            id: 7,
            icon: 'icon-Profile',
            title: 'second profile',
            showType: ShowType.MENU
         },
         {
            id: 8,
            icon: 'icon-Erase',
            title: 'second delete',
            iconStyle: 'danger',
            showType: ShowType.TOOLBAR
         }
      ];
      this._source = new HierarchicalMemory({
         idProperty: 'id',
         parentProperty: 'parent',
         data: [
            {
               id: 1,
               parent: null,
               type: true,
               title: 'Документы отделов'
            },
            {
               id: 11,
               parent: 1,
               type: true,
               title: '1. Электронный документооборот'
            },
            {
               id: 12,
               parent: 1,
               type: true,
               title: '2. Отчетность через интернет'
            },
            {
               id: 13,
               parent: 1,
               type: null,
               title: 'Сравнение условий конкурентов по ЭДО.xlsx',
               image: explorerImages[4],
               isDocument: true
            },
            {
               id: 111,
               parent: 11,
               type: true,
               title: 'Задачи'
            },
            {
               id: 112,
               parent: 11,
               type: null,
               title: 'Сравнение систем по учету рабочего времени.xlsx',
               image: explorerImages[5],
               isDocument: true
            },
            {
               id: 2,
               parent: null,
               type: true,
               title: 'Техническое задание'
            },
            {
               id: 21,
               parent: 2,
               type: null,
               title: 'PandaDoc.docx',
               image: explorerImages[6],
               isDocument: true
            },
            {
               id: 22,
               parent: 2,
               type: null,
               title: 'SignEasy.docx',
               image: explorerImages[7],
               isDocument: true
            },
            {
               id: 3,
               parent: null,
               type: true,
               title: 'Анализ конкурентов'
            },
            {
               id: 4,
               parent: null,
               type: null,
               title: 'Договор на поставку печатной продукции',
               image: explorerImages[0],
               isDocument: true
            },
            {
               id: 5,
               parent: null,
               type: null,
               title: 'Договор аренды помещения',
               image: explorerImages[1],
               isDocument: true
            }
         ]
      });
   }
}
