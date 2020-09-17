import {Control, IControlOptions, TemplateFunction} from 'UI/Base';
import {IItemAction} from 'Controls/itemActions';
import {Memory} from 'Types/source';

import * as template from 'wml!Controls-demo/list_new/ItemActions/ItemActionsStyle/ItemActions';

import {getContactsCatalog as getData} from '../../DemoHelpers/DataCatalog';
import {getActionsForContacts as getItemActions} from '../../DemoHelpers/ItemActionsCatalog';

export default class ListDelayedItemActions extends Control<IControlOptions> {
   protected _itemActions: IItemAction[] = getItemActions();
   protected _template: TemplateFunction = template;
   protected _viewSource: Memory;

   protected _beforeMount(options?: IControlOptions, contexts?: object, receivedState?: void): Promise<void> | void {
      this._viewSource = new Memory({
         keyProperty: 'id',
         data: [getData().pop()]
      });
   }

   static _styles: string[] = ['Controls-demo/Controls-demo', 'Controls-demo/list_new/ItemActions/ItemActionsStyle/ItemActionsStyle'];
}
