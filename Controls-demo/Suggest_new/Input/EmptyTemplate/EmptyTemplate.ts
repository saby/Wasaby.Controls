import {Control, TemplateFunction} from "UI/Base";
import {Memory} from 'Types/source';
import controlTemplate = require('wml!Controls-demo/Suggest_new/Input/EmptyTemplate/EmptyTemplate');
import suggestTemplate = require('wml!Controls-demo/Suggest_new/resources/SuggestTemplate');
import emptyTemplate = require('wml!Controls-demo/Suggest_new/resources/EmptyTemplate');
import 'css!Controls-demo/Controls-demo';
import 'css!Controls-demo/Suggest_new/Index';

export default class extends Control{
   protected _template: TemplateFunction = controlTemplate;
   private _suggestTemplate: TemplateFunction = suggestTemplate;
   private _demoEmptyTemplate: TemplateFunction = suggestTemplate;
   private _source: Memory;
   private _navigation: object;
   protected _beforeMount() {
      this._source = new Memory({
         data: []
      });
      this._navigation = {
         source: 'page',
         view: 'page',
         sourceConfig: {
            pageSize: 2,
            page: 0,
            hasMore: false
         }
      };
   }
}