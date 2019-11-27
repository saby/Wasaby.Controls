import {Control, TemplateFunction} from "UI/Base";
import controlTemplate = require('wml!Controls-demo/Suggest_new/SearchInput/Index');
import 'css!Controls-demo/Controls-demo';

export default class extends Control{
   protected _template: TemplateFunction = controlTemplate;
}