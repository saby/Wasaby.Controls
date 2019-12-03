import {Control, TemplateFunction} from "UI/Base";
import {Memory} from 'Types/source';
import {getNavigation, getSuggestSourceLong} from 'Controls-demo/Suggest_new/DemoHelpers/DataCatalog';
import controlTemplate = require('wml!Controls-demo/Suggest_new/Input/DisplayProperty/DisplayProperty');
import suggestTemplate = require('wml!Controls-demo/Suggest_new/resources/SuggestTemplate');
import 'css!Controls-demo/Controls-demo';

export default class extends Control{
   protected _template: TemplateFunction = controlTemplate;
   private _demoSuggestTemplate: TemplateFunction = suggestTemplate;
   protected _suggestTemplate: string;
   private _source: Memory;
   private _navigation: object;
   protected _beforeMount() {
      this._suggestTemplate = 'wml!Controls-demo/Suggest_new/resources/SuggestTemplate';
      this._source = getSuggestSourceLong();
      this._navigation = getNavigation();
   }
}