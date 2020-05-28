import {Control, IControlOptions, TemplateFunction} from 'UI/Base';
import {IItemAction} from 'Controls/itemActions';
import {Memory} from 'Types/source';

import * as template from 'wml!Controls-demo/ItemActions/ListVisible/ListItemActions';

import {menuItemActions, srcData} from '../resources';

export default class ListVisibleItemActions extends Control<IControlOptions> {
   protected _itemActions: IItemAction[] = menuItemActions;
   protected _template: TemplateFunction = template;
   protected _viewSource: Memory;
   protected _itemActionVisibility: string = 'visible';

   protected _beforeMount(options?: IControlOptions, contexts?: object, receivedState?: void): Promise<void> | void {
      this._viewSource = new Memory({
         keyProperty: 'id',
         data: srcData
      });
   }
}
