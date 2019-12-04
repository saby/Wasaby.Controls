import {Control, TemplateFunction} from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Suggest_new/Selector/SuggestTemplate/resources/SuggestTemplateGrid');

class SuggestTemplateGrid extends Control{
   protected _template: TemplateFunction = controlTemplate;
   protected _columns = null;

   _beforeMount() {
      this._columns = [
         {
            displayProperty: 'title'
         }, {
            displayProperty: 'owner'
         }
      ];
   }
}
export default SuggestTemplateGrid;
