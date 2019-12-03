import {Control, TemplateFunction} from "UI/Base";
import {Memory} from 'Types/source';
import {getNavigation, getEmptySource} from 'Controls-demo/Suggest_new/DemoHelpers/DataCatalog';
import controlTemplate = require('wml!Controls-demo/Suggest_new/Selector/EmptyTemplate/EmptyTemplate');
import suggestTemplate = require('wml!Controls-demo/Suggest_new/resources/SuggestTemplate');
import emptyTemplate = require('wml!Controls-demo/Suggest_new/resources/EmptyTemplate');
import 'css!Controls-demo/Controls-demo';
import 'css!Controls-demo/Suggest_new/Index';

export default class extends Control{
   protected _template: TemplateFunction = controlTemplate;
   private _demoSuggestTemplate: TemplateFunction = suggestTemplate;
   private _demoEmptyTemplate: TemplateFunction = suggestTemplate;
   protected _suggestTemplate: string;
   protected _emptyTemplate: string;
   private _source: Memory;
   private _navigation: object;
   protected _beforeMount() {
      this._suggestTemplate = 'wml!Controls-demo/Suggest_new/resources/SuggestTemplate';
      this._emptyTemplate = 'wml!Controls-demo/Suggest_new/resources/EmptyTemplate';
      this._source = getEmptySource();
      this._navigation = getNavigation();
   }
}