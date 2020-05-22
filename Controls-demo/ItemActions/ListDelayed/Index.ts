import {Control, IControlOptions, TemplateFunction} from 'UI/Base';
import {Model} from 'Types/entity';
import {IItemAction, TItemActionShowType} from 'Controls/itemActions';
import {IoC} from 'Env/Env';
import {Memory} from 'Types/source';

import * as template from 'wml!Controls-demo/ItemActions/ListDelayed/ListItemActions';

interface ISrcData {
   id: number;
   title: string;
   description: string;
}

const srcData: ISrcData[] = [
   {
      id: 1,
      title: 'Настолько длинное название папки что оно не влезет в максимальный размер 1',
      description: 'Другое название 1'
   },
   {
      id: 2,
      title: 'Notebooks 2',
      description: 'Описание вот такое'
   },
   {
      id: 3,
      title: 'Smartphones 3 ',
      description: 'Хватит страдать'
   }
];

const itemActions: IItemAction[] = [
   {
      id: 5,
      title: 'прочитано',
      showType: TItemActionShowType.TOOLBAR,
      handler(model: Model): void {
         IoC.resolve('ILogger').info('action read Click');
      }
   },
   {
      id: 1,
      icon: 'icon-PhoneNull',
      title: 'phone',
      handler(model: Model): void {
         IoC.resolve('ILogger').info('action phone Click ', model);
      }
   },
   {
      id: 2,
      icon: 'icon-EmptyMessage',
      title: 'message',
      parent: null,
      'parent@': true,
      handler(model: Model): void {
         alert('Message Click');
      }
   },
   {
      id: 3,
      icon: 'icon-Profile',
      title: 'profile',
      showType: TItemActionShowType.MENU_TOOLBAR,
      parent: 2,
      'parent@': null,
      handler(model: Model): void {
         IoC.resolve('ILogger').info('action profile Click');
      }
   },
   {
      id: 6,
      title: 'call',
      parent: 2,
      'parent@': null,
      handler(model: Model): void {
         IoC.resolve('ILogger').info('action profile Click');
      }
   },
   {
      id: 4,
      icon: 'icon-Erase',
      iconStyle: 'danger',
      title: 'delete pls',
      showType: TItemActionShowType.TOOLBAR,
      handler(model: Model): void {
         IoC.resolve('ILogger').info('action delete Click');
      }
   }
];

export default class ListDelayedItemActions extends Control<IControlOptions> {
   protected _itemActions: IItemAction[] = itemActions;
   protected _template: TemplateFunction = template;
   protected _viewSource: Memory;
   protected _markedKey: number | string;
   protected _itemActionVisibility: string = 'delayed';

   protected _beforeMount(options?: IControlOptions, contexts?: object, receivedState?: void): Promise<void> | void {
      this._viewSource = new Memory({
         keyProperty: 'id',
         data: srcData
      });
   }
}
