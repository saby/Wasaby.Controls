import {Control, IControlOptions, TemplateFunction} from 'UI/Base';
import {IItemAction} from 'Controls/itemActions';
import {Memory} from 'Types/source';

import * as template from 'wml!Controls-demo/ItemActions/ListDelayed/ListItemActions';

import {menuToolbarItemActions, srcData} from '../resources';

export default class ListDelayedItemActions extends Control<IControlOptions> {
   protected _itemActions: IItemAction[] = menuToolbarItemActions;
   protected _template: TemplateFunction = template;
   protected _viewSource: Memory;
   protected _itemActionVisibility: string = 'delayed';

   protected _beforeMount(options?: IControlOptions, contexts?: object, receivedState?: void): Promise<void> | void {
      this._viewSource = new Memory({
         keyProperty: 'id',
         data: srcData
      });
   }
}
