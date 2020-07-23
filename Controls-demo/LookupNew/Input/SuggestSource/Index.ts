import {Control, TemplateFunction} from 'UI/Base';
import * as Template from 'wml!Controls-demo/LookupNew/Input/SuggestSource/Index';
import {COMPANIES} from 'Controls-demo/LookupNew/resources/DataStorage';
import {Memory} from 'Types/source';

export default class extends Control {
   protected _template: TemplateFunction = Template;
   protected _source: Memory = new Memory({
      keyProperty: 'id',
      data: COMPANIES
   });
   protected _suggestSource: Memory = new Memory({
      keyProperty: 'id',
      data: {...COMPANIES, ...{
            id: 'Рога и копыта, ООО',
            title: 'Рога и копыта, ООО',
            city: 'г. Абакан',
            description: null,
            active: false
         }}
   });
   protected _selectedKeys: string[] = ['Ромашка, ООО'];

   static _styles: string[] = ['Controls-demo/Controls-demo', 'Controls-demo/LookupNew/Lookup'];
}
