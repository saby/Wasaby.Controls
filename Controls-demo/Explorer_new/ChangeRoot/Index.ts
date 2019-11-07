import {Control, TemplateFunction} from 'UI/Base';
import * as Template from 'wml!Controls-demo/Explorer_new/ChangeRoot/ChangeRoot';
import {Gadgets} from '../DataHelpers/DataCatalog';
import * as MemorySource from 'Controls-demo/Explorer/ExplorerMemory';

import 'css!Controls-demo/Controls-demo';

export default class extends Control {
   protected _template: TemplateFunction = Template;
   private _viewSource;
   private _columns = Gadgets.getColumns();
   private _viewMode: string = 'table';
   private _root = null;

   protected _beforeMount() {
      this._viewSource = new MemorySource({
         keyProperty: 'id',
         data: Gadgets.getData()
      });
   }

   private _onToggleRoot() {
      if (this._root === null) {
         this._root = 1;
      } else {
         this._root = null;
      }
   }
}
