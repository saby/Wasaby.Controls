import {Control, TemplateFunction} from 'UI/Base';
import {getItemActions} from 'Controls-demo/Suggest_new/DemoHelpers/ItemActionsCatalog';
import controlTemplate = require('wml!Controls-demo/Suggest_new/resources/SuggestTemplatePopup');

class SuggestTemplatePopup extends Control{
   protected _template: TemplateFunction = controlTemplate;
   private _itemActions: Memory;protected _beforeMount() {
   this._itemActions = getItemActions();
}
}
export default SuggestTemplatePopup;
