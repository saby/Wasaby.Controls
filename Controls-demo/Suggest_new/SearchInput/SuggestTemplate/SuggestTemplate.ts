import {Control, TemplateFunction} from "UI/Base";
import * as MemorySourceFilter from 'Controls-demo/Utils/MemorySourceFilter';
import * as SearchMemory from 'Controls-demo/Search/SearchMemory';
import {Memory} from 'Types/source';
import {_departmentsDataLong} from 'Controls-demo/Suggest_new/DemoHelpers/DataCatalog';
import controlTemplate = require('wml!Controls-demo/Suggest_new/SearchInput/SuggestTemplate/SuggestTemplate');
import suggestTemplate = require('wml!Controls-demo/Suggest_new/resources/SuggestTemplate');
import suggestTemplateGrid = require('wml!Controls-demo/Suggest_new/resources/SuggestTemplateGrid');
import 'css!Controls-demo/Controls-demo';

export default class extends Control{
   protected _template: TemplateFunction = controlTemplate;
   private _suggestTemplate: TemplateFunction = suggestTemplate;
   private _suggestTemplateGrid: TemplateFunction = suggestTemplateGrid;
   private _source: Memory;
   private _navigation: object;

   protected _beforeMount() {
      this._source = new SearchMemory({
         keyProperty: 'id',
         data: _departmentsDataLong,
         searchParam: 'title',
         filter: MemorySourceFilter()
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