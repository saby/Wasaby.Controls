/*global define*/
define('js!SBIS3.CONTROLS.Demo.TabButtonsFullDemo', [
   'js!SBIS3.CORE.CompoundControl',
   'html!SBIS3.CONTROLS.Demo.TabButtonsFullDemo',
   'css!SBIS3.CONTROLS.Demo.TabButtonsFullDemo',
   'html!SBIS3.CONTROLS.Demo.TabButtonsFullDemo/resources/Demo2/ItemTemplate',
   'html!SBIS3.CONTROLS.Demo.TabButtonsFullDemo/resources/Demo2/tabSpaceTemplate',
   'html!SBIS3.CONTROLS.Demo.TabButtonsFullDemo/resources/Demo3/ItemTemplate',
   'html!SBIS3.CONTROLS.Demo.TabButtonsFullDemo/resources/Demo4/ItemTemplate',
   'html!SBIS3.CONTROLS.Demo.TabButtonsFullDemo/resources/Demo5/ItemTemplate',
   'html!SBIS3.CONTROLS.Demo.TabButtonsFullDemo/resources/Demo8/ItemTemplate',
   'js!SBIS3.CONTROLS.TabButtons',
   'js!SBIS3.CONTROLS.Button'
], function (CompoundControl, dotTplFn) {

   'use strict';

   var TabButtonsFullDemo = CompoundControl.extend(/** @lends SBIS3.CONTROLS.Demo.MyTabButtons.prototype */{
      _dotTplFn: dotTplFn
   });
   return TabButtonsFullDemo;
});