/**
 * Модуль 'Компонент кнопка'.
 *
 * @description
 */
define('js!SBIS3.CONTROLS.TabButton',
   ['js!SBIS3.CONTROLS.RadioButtonBase', 'html!SBIS3.CONTROLS.TabButton', 'html!SBIS3.CONTROLS.TabButton/TabContentTpl'], function (RadioButtonBase, dotTplFn, tabContentTpl) {

   'use strict';
   /**
    * Контрол, отображающий корешок закладки. Работает только в составе группы. В джине не вытаскивается
    * @class SBIS3.CONTROLS.TabButton
    * @extends SBIS3.CONTROLS.RadioButtonBase
    * @author Крайнов Дмитрий Олегович
    */
   var TabButton = RadioButtonBase.extend(/** @lends SBIS3.CONTROLS.TabButton.prototype */ {
      $protected: {
         _options: {
            align: 'right',
            additionalText: '',
            editable: false,
            template: tabContentTpl
         }
      },
      _dotTplFn: dotTplFn,

      $constructor: function () {
      }
   });

   return TabButton;

});