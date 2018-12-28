define('Controls/Date/MonthList/List', [
   'Controls/List',
   'wml!Controls/List/List',
   'Controls/List/ListViewModel',
   'Core/Deferred',
   'Controls/Utils/tmplNotify',
   'Controls/List/ListView',
   'Controls/List/ListControl',
   'Controls/Date/MonthList/ListControl'
], function(
   List
) {
   'use strict';

   /**
    * Plain list with custom item template. Can load data from data source.
    *
    * @class Controls/Date/MonthList/List
    * @extends Controls/List
    * @control
    * @author Миронов А.Ю.
    */

   var ModuleControl = List.extend(/** @lends Controls/Date/MonthList/List.prototype */{
      _viewTemplate: 'Controls/Date/MonthList/ListControl'
   });

   return ModuleControl;
});
