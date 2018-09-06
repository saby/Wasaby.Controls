/**
 * Created by am.gerasimov on 17.07.2018.
 */
define('Controls-demo/Filter/Panel', [
   'Core/Control',
   'wml!Controls-demo/Filter/Panel',
   'Controls/Input/Dropdown',
   "wml!Controls-demo/Filter/itemTemplate"
], function(Control, tempalte) {
   
   'use strict';
   
   var Panel = Control.extend({
      _template: tempalte
   });
   
   return Panel;
});