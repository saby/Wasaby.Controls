import {Control, TemplateFunction} from "UI/Base";
import {Memory} from 'Types/source';
import {getDefaultNavigation, getMaxCountNavigation, getSuggestSourceLong} from 'Controls-demo/Suggest_new/DemoHelpers/DataCatalog';
import controlTemplate = require('wml!Controls-demo/Suggest_new/Selector/Navigation/Navigation');
import 'css!Controls-demo/Controls-demo';

export default class extends Control{
   protected _template: TemplateFunction = controlTemplate;
   private _source: Memory;
   private _defaultNavigation: object;
   private _maxCountNavigation: object;
   protected _beforeMount() {
      this._source = getSuggestSourceLong();
      this._defaultNavigation = getDefaultNavigation();
      this._maxCountNavigation = getMaxCountNavigation();
   }
}