import { Control, TemplateFunction } from 'UI/Base';
import { Memory } from 'Types/source';
import { getData } from '../resources/DataSource';

// @ts-ignore
import template = require('wml!Controls-demo/HotKeys/ListHotKeyMixed/ListHotKeyMixed');

class ListHotKeyMixed extends Control {
   _template: TemplateFunction = template;

   protected _viewSource: Memory;

   protected _beforeMount(): void {
      this._viewSource = new Memory({
         keyProperty: 'id',
         data: getData( 10)
      });
   }

}

ListHotKeyMixed._styles = ['Controls-demo/HotKeys/resources/HotKeys'];

export default ListHotKeyMixed;
