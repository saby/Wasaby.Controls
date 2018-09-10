/**
 * Created by am.gerasimov on 17.07.2018.
 */
define('Controls-demo/FilterSearch/Panel', [
   'Core/Control',
   'wml!Controls-demo/FilterSearch/Panel',
   'Controls/Input/Dropdown',
   'wml!Controls-demo/FilterSearch/itemTemplate'
], function(Control, tempalte) {
   
   'use strict';
   
   return Control.extend({
      _template: tempalte
   });
});