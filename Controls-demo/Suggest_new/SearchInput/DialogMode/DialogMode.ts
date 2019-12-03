import {Control, TemplateFunction} from "UI/Base";
import {Memory} from 'Types/source';
import {getNavigation, getSuggestSourceWithImages} from 'Controls-demo/Suggest_new/DemoHelpers/DataCatalog';
import controlTemplate = require('wml!Controls-demo/Suggest_new/SearchInput/DialogMode/DialogMode');
import suggestTemplate = require('wml!Controls-demo/Suggest_new/resources/SuggestTemplatePopup');
import 'css!Controls-demo/Controls-demo';
import 'css!Controls-demo/Suggest_new/Index';

export default class extends Control{
   protected _template: TemplateFunction = controlTemplate;
   private _demoSuggestTemplate: TemplateFunction = suggestTemplate;
   protected _suggestTemplate: string;
   private _source: Memory;
   private _navigation: object;
   protected _beforeMount() {
      this._suggestTemplate = 'wml!Controls-demo/Suggest_new/resources/SuggestTemplatePopup';
      this._source = getSuggestSourceWithImages();
      this._navigation = getNavigation();
   }
}