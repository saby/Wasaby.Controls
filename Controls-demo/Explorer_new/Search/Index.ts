import {Control, TemplateFunction} from 'UI/Base';
import * as Template from 'wml!Controls-demo/Explorer_new/Search/Search';
import {Gadgets} from '../DataHelpers/DataCatalog';
import {Memory} from 'Types/source';
import * as MemorySource from 'Controls-demo/Explorer/ExplorerMemory';

import 'css!Controls-demo/Controls-demo';

export default class extends Control {
   protected _template: TemplateFunction = Template;
   private _viewSource;
   private _columns = Gadgets.getColumns();
   private _viewMode: string = 'table';
   private _root = null;
   private _searchStartingWith: string = 'root';
   private _searchStartingWithSource: Memory = null;
   private _filter = { demo: 123 };

   protected _beforeMount() {
      this._viewSource = new MemorySource({
         keyProperty: 'id',
         data: Gadgets.getData()
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
}
