import {Control, TemplateFunction} from 'UI/Base';
import * as Suggest from 'Controls-demo/Suggest/Suggest';
import controlTemplate = require('wml!Controls-demo/Suggest/SearchInputFooter/SearchInputFooter');

class SearchInputFooter extends Suggest{
   protected _template: TemplateFunction = controlTemplate;
}
export default SearchInputFooter;
