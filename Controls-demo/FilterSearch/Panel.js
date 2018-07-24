/**
 * Created by am.gerasimov on 17.07.2018.
 */
define('Controls-demo/FilterSearch/Panel', [
   'Core/Control',
   'tmpl!Controls-demo/FilterSearch/Panel',
   'Controls/Input/Dropdown',
   'tmpl!Controls-demo/FilterSearch/itemTemplate'
], function(Control, tempalte) {
   
   'use strict';
   
   return Control.extend({
      _template: tempalte
   });
});