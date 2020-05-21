import { TemplateFunction } from 'UI/Base';
import { ItemActionsBase } from 'Controls-demo/ItemActions/resources/ItemActionsBase';
import * as template from 'wml!Controls-demo/ItemActions/resources/ListItemActions';

export default class ListVisibleItemActions extends ItemActionsBase {
   protected _template: TemplateFunction = template;
   protected _itemActionVisibility: string = 'visible';
}
