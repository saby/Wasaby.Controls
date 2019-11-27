import {Control, TemplateFunction} from "UI/Base";
import {Memory} from 'Types/source';
import {getDefaultNavigation, getEmptySource} from 'Controls-demo/Suggest_new/DemoHelpers/DataCatalog';
import controlTemplate = require('wml!Controls-demo/Suggest_new/Input/EmptyTemplate/EmptyTemplate');
import 'css!Controls-demo/Controls-demo';

export default class extends Control{
   protected _template: TemplateFunction = controlTemplate;
   private _source: Memory;
   private _defaultNavigation: object;
   protected _beforeMount() {
      this._source = getEmptySource();
      this._defaultNavigation = getDefaultNavigation();
   }
}