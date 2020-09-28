import {Control, IControlOptions, TemplateFunction} from 'UI/Base';
import {IItemAction, TItemActionShowType} from 'Controls/itemActions';
import {Memory} from 'Types/source';

import * as template from 'wml!Controls-demo/list_new/ItemActions/ItemActionsVisibility/Onhover/ItemActions';
import {Model} from "Types/entity";
import {IoC} from "Env/Env";

const menuToolbarItemActions: IItemAction[] = [
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
      showType: TItemActionShowType.MENU,
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
   protected _itemActions: IItemAction[] = menuToolbarItemActions;
   protected _template: TemplateFunction = template;
   protected _viewSource: Memory;

   protected _beforeMount(options?: IControlOptions, contexts?: object, receivedState?: void): Promise<void> | void {
      this._viewSource = new Memory({
         keyProperty: 'id',
         data: srcData
      });
   }
}
