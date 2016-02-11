/* global define, console, doT, $ws, $ */
define('js!SBIS3.CONTROLS.ListControl.Demo.AnimatedList', [
   'js!SBIS3.CONTROLS.ListControl',
   'js!SBIS3.CONTROLS.ListControl.Demo.AnimatedList.View',
   'html!SBIS3.CONTROLS.ListControl.Demo.AnimatedList/View'
], function (ListControl, AnimatedListView, AnimatedListTemplate) {
   'use strict';

   /**
    * Списка с анимацией.
    * @class SBIS3.CONTROLS.ListControl.Demo.AnimatedList
    * @extends SBIS3.CONTROLS.ListControl
    * @author Крайнов Дмитрий Олегович
    */
   var AnimatedList = ListControl.extend(/** @lends SBIS3.CONTROLS.ListControl.Demo.AnimatedList.prototype */{
      $protected: {
         _viewConstructor: AnimatedListView
      },
      _getViewTemplate: function () {
         return AnimatedListTemplate;
      }
   });

   return AnimatedList;
});
