import {Control, IControlOptions, TemplateFunction} from 'UI/Base';
import {IItemAction} from 'Controls/itemActions';
import {Memory} from 'Types/source';

import * as template from 'wml!Controls-demo/ItemActions/GridVisible/GridItemActions';

import {menuItemActions, columns, srcData} from '../resources';

export default class GridVisibleItemActions extends Control<IControlOptions> {
   protected _itemActions: IItemAction[] = menuItemActions;
   protected _template: TemplateFunction = template;
   protected _viewSource: Memory;
   protected _columns: Array<{displayProperty: string}> = columns;
   protected _itemActionVisibility: string = 'visible';

   protected _beforeMount(options?: IControlOptions, contexts?: object, receivedState?: void): Promise<void> | void {
      this._viewSource = new Memory({
         keyProperty: 'id',
         data: srcData
      });
   }
}
