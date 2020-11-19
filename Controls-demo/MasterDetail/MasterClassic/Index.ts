import {Control, TemplateFunction} from "UI/Base";
import {Memory} from 'Types/source';
import controlTemplate = require('wml!Controls-demo/MasterDetail/MasterClassic/Index');
import itemTemplate = require('wml!Controls-demo/MasterDetail/itemTemplates/masterItemTemplate');
import data = require('Controls-demo/MasterDetail/Data');

export default class extends Control{
   protected _template: TemplateFunction = controlTemplate;
   protected _masterSource: Memory;

   protected _gridColumns: any = [
      {
         displayProperty: 'name',
         width: '1fr',
         template: itemTemplate
      }
   ];

   protected _beforeMount() {
      this._masterSource = new Memory({
         keyProperty: 'id',
         data: data.master
      });
   }

   static _styles: string[] = ['Controls-demo/Controls-demo', 'Controls-demo/MasterDetail/Demo'];
}
