import {Control, IControlOptions, TemplateFunction} from 'UI/Base';
import {IItemAction, TItemActionShowType} from 'Controls/itemActions';
import {Memory} from 'Types/source';
import {Model} from 'Types/entity';
import {IoC} from 'Env/Env';

import * as template from 'wml!Controls-demo/list_new/ItemActions/MenuItemTemplate/MenuItemTemplate';
import * as downloadTemplate from 'wml!Controls-demo/list_new/ItemActions/MenuItemTemplate/_downloadItemTemplate';

interface ISrcData {
   id: number;
   title: string;
   description: string;
}

interface IItemActionWithTemplate extends IItemAction {
   menuItemTemplate?: TemplateFunction;
   fileInfo?: {
      prettySize: string
   }
}

const menuToolbarItemActions: IItemActionWithTemplate[] = [
   {
      id: 2,
      icon: 'icon-DownloadNew',
      title: 'Сохранить на компьютер',
      showType: TItemActionShowType.MENU,
      menuItemTemplate: downloadTemplate,
      fileInfo: {
         prettySize: '900Pb'
      },
      'parent@': null,
      handler(model: Model): void {
         IoC.resolve('ILogger').info('action download Click');
      }
   },
   {
      id: 3,
      icon: 'icon-Erase',
      iconStyle: 'danger',
      title: 'Удалить',
      showType: TItemActionShowType.MENU_TOOLBAR,
      handler(model: Model): void {
         IoC.resolve('ILogger').info('action delete Click');
      }
   }
];

const data: ISrcData[] = [
   {
      id: 1,
      title: 'База данных Пентагона',
      description: 'Свежая база, без СМС и регистрации'
   },
   {
      id: 2,
      title: 'Самое точное вычисление расстояния до соседней вселенной',
      description: 'Но это не точно'
   },
   {
      id: 3,
      title: 'Весь исходный код СБИСа версии 300.2103 от 12.03.2300',
      description: 'Инфа 100%'
   }
];

export default class ListDelayedItemActions extends Control<IControlOptions> {
   protected _itemActions: IItemAction[] = menuToolbarItemActions;
   protected _template: TemplateFunction = template;
   protected _viewSource: Memory;

   protected _beforeMount(options?: IControlOptions, contexts?: object, receivedState?: void): Promise<void> | void {
      this._viewSource = new Memory({
         keyProperty: 'id',
         data
      });
   }

   static _styles: string[] = ['Controls-demo/list_new/ItemActions/MenuItemTemplate/MenuItemTemplate'];
}
