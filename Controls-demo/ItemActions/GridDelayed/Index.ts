import {Control, IControlOptions, TemplateFunction} from 'UI/Base';
import {Model} from 'Types/entity';
import {IItemAction, TItemActionShowType} from 'Controls/itemActions';
import {IoC} from 'Env/Env';
import {Memory} from 'Types/source';

import * as template from 'wml!Controls-demo/ItemActions/GridDelayed/GridItemActions';

interface ISrcData {
   id: number;
   title: string;
   description: string;
}

const columns = [
   {
      displayProperty: 'id'
   },
   {
      displayProperty: 'title'
   },
   {
      displayProperty: 'description'
   }
];

const srcData: ISrcData[] = [
   {
      id: 1,
      title: 'Notebooks 1',
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
   }
];

export default class GridDelayedItemActions extends Control<IControlOptions> {
   protected _itemActions: IItemAction[] = itemActions;
   protected _template: TemplateFunction = template;
   protected _viewSource: Memory;
   protected _columns: Array<{displayProperty: string}> = columns;
   protected _itemActionVisibility: string = 'delayed';

   protected _beforeMount(options?: IControlOptions, contexts?: object, receivedState?: void): Promise<void> | void {
      this._viewSource = new Memory({
         keyProperty: 'id',
         data: srcData
      });
   }
}
