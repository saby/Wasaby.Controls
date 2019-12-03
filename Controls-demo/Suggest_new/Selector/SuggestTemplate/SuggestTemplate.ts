import {Control, TemplateFunction} from "UI/Base";
import {Memory} from 'Types/source';
import {getNavigation, getSuggestSourceLong} from 'Controls-demo/Suggest_new/DemoHelpers/DataCatalog';
import controlTemplate = require('wml!Controls-demo/Suggest_new/Selector/SuggestTemplate/SuggestTemplate');
import suggestTemplate = require('wml!Controls-demo/Suggest_new/resources/SuggestTemplate');
import suggestTemplateGrid = require('wml!Controls-demo/Suggest_new/resources/SuggestTemplateGrid');
import 'css!Controls-demo/Controls-demo';

export default class extends Control{
   protected _template: TemplateFunction = controlTemplate;
   private _demoSuggestTemplate: TemplateFunction = suggestTemplate;
   private _demoSuggestTemplateGrid: TemplateFunction = suggestTemplateGrid;
   protected _suggestTemplate: string;
   protected _suggestTemplateGrid: string;
   private _source: Memory;
   private _navigation: object;
   protected _beforeMount() {
      this._suggestTemplate = 'wml!Controls-demo/Suggest_new/resources/SuggestTemplate';
      this._suggestTemplateGrid = 'Controls-demo/Suggest_new/resources/SuggestTemplateGrid';
      this._source = getSuggestSourceLong();
      this._navigation = getNavigation();
   }
}