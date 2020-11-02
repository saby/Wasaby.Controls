import { Control, TemplateFunction } from 'UI/Base';
import { Memory } from 'Types/source';
import { getData } from '../resources/DataSource';

// @ts-ignore
import template = require('wml!Controls-demo/HotKeys/ScrollHotKey/ScrollHotKey');

class ScrollHotKey extends Control {
   _template: TemplateFunction = template;

   protected _viewSource: Memory;

   protected _beforeMount(): void {
      this._viewSource = new Memory({
         keyProperty: 'id',
         data: getData(50)
      });
   }

}

ScrollHotKey._styles = ['Controls-demo/HotKeys/resources/HotKeys'];

export default ScrollHotKey;
