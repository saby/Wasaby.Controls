/* global define, console, doT, $ws, $ */
define('js!SBIS3.CONTROLS.ButtonGroupBaseDSView', [
   'js!SBIS3.CONTROLS.ListControl.View'
], function (ListView) {
   'use strict';

   /**
    * Представление списка для набора кнопок
    * @class SBIS3.CONTROLS.ButtonGroupBaseDSView
    * @extends SBIS3.CONTROLS.ListControl.View
    * @public
    * @author Крайнов Дмитрий Олегович
    */
   return ListView.extend(/** @lends SBIS3.CONTROLS.ButtonGroupBaseDSView.prototype */{
      $protected: {
         _сssPrefix: 'controlButtonGroupBaseDSView-',
         _itemContainerTag: 'span'
      },

      isHorizontal: function () {
         return true;
      }
   });
});
