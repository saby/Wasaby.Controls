import {Control, TemplateFunction} from 'UI/Base';
import * as Template from 'wml!Controls-demo/Explorer_new/backgroundStyle/custom/backgroundStyleCustom';
import {Gadgets} from '../../DataHelpers/DataCatalog';
import {Memory} from 'Types/source';
import * as MemorySource from 'Controls-demo/Explorer/ExplorerMemory';
import {IColumn} from 'Controls/_grid/interface/IColumn';
import {TRoot, IHeader} from 'Controls-demo/types';

export default class extends Control {
   protected _template: TemplateFunction = Template;
   protected _viewSource: MemorySource;
   protected _columns: IColumn[] = Gadgets.getSearchColumns();
   protected _root: TRoot = null;
   protected _searchStartingWith: string = 'root';
   protected _searchStartingWithSource: Memory = null;
   protected _filter = {demo: 123};
   protected _header: IHeader[] = [
      {
         title: ''
      },
      {
         title: 'Код'
      },
      {
         title: 'Цена'
      }
   ];

   protected _beforeMount(): void {
      this._viewSource = new MemorySource({
         keyProperty: 'id',
         data: Gadgets.getSearchData()
      });
      this._searchStartingWithSource = new Memory({
         keyProperty: 'id',
         data: [
            {
               id: 'root', title: 'root'
            },
            {
               id: 'current', title: 'current'
            }
         ]
      });
   }

   static _theme: string[] = ['Controls/Classes'];
   static _styles: string[] = [
      'Controls-demo/Controls-demo',
      'Controls-demo/Explorer_new/backgroundStyle/custom/backgroundStyleCustom'
   ];
}
