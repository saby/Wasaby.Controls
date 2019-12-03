import {Control, TemplateFunction} from "UI/Base";
import * as MemorySourceFilter from 'Controls-demo/Utils/MemorySourceFilter';
import * as SearchMemory from 'Controls-demo/Search/SearchMemory';
import {Memory} from 'Types/source';
import {_departmentsWithCompanies} from 'Controls-demo/Suggest_new/DemoHelpers/DataCatalog';
import controlTemplate = require('wml!Controls-demo/Suggest_new/Selector/SuggestTemplateWithTabs/SuggestTemplateWithTabs');
import suggestTemplate = require('wml!Controls-demo/Suggest_new/resources/SuggestTemplate');
import 'css!Controls-demo/Controls-demo';

export default class extends Control{
   protected _template: TemplateFunction = controlTemplate;
   private _suggestTemplate: TemplateFunction = suggestTemplate;
   protected _suggestTemplate: string;
   private _source: Memory;
   private _navigation: object;
   protected _beforeMount() {
      this._source = new SearchMemory({
         keyProperty: 'id',
         data: _departmentsWithCompanies,
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