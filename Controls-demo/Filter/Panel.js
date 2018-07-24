/**
 * Created by am.gerasimov on 17.07.2018.
 */
define('Controls-demo/Filter/Panel', [
   'Core/Control',
   'tmpl!Controls-demo/Filter/Panel',
   'Controls/Input/Dropdown',
   "tmpl!Controls-demo/Filter/itemTemplate"
], function(Control, tempalte) {
   
   'use strict';
   
   var Panel = Control.extend({
      _template: tempalte
   });
   
   return Panel;
});