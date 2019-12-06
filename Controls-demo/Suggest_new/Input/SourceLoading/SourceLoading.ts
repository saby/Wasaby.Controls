import {Control, TemplateFunction} from "UI/Base";
import * as MemorySourceFilter from 'Controls-demo/Utils/MemorySourceFilter';
import Deferred = require('Core/Deferred');
import DelaySuggestSource from 'Controls-demo/Suggest_new/Input/SourceLoading/Source';
import * as SearchMemory from 'Controls-demo/Search/SearchMemory';
import {Memory} from 'Types/source';
import {_departmentsDataLong} from 'Controls-demo/Suggest_new/DemoHelpers/DataCatalog';
import controlTemplate = require('wml!Controls-demo/Suggest_new/Input/SourceLoading/SourceLoading');
import suggestTemplate = require('wml!Controls-demo/Suggest_new/Input/SourceLoading/resources/SuggestTemplate');
import 'css!Controls-demo/Controls-demo';

export default class extends Control{
   protected _template: TemplateFunction = controlTemplate;
   private _suggestTemplate: TemplateFunction = suggestTemplate;
   private _source: DelaySuggestSource = null;
   private _navigation: object;
   protected _beforeMount() {

      this._source = new DelaySuggestSource({
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