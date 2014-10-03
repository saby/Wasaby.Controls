/**
 * Модуль 'Компонент кнопка'.
 *
 * @description
 */
define('js!SBIS3.CONTROLS.CheckBox', ['js!SBIS3.CONTROLS.ToggleButtonBase', 'html!SBIS3.CONTROLS.CheckBox'], function(ToggleButtonBase, dotTplFn) {

   'use strict';

   /**
    * Контрол, отображающий стандартный чекбокс.
    * @class SBIS3.CONTROLS.CheckBox
    * @extends SBIS3.CONTROLS.ToggleButtonBase
    * @mixes SBIS3.CONTROLS._FormWidgetMixin
    * @control
    * @public
    * @category Inputs
    */

   var CheckBox = ToggleButtonBase.extend( /** @lends SBIS3.CONTROLS.CheckBox.prototype */ {
      $protected: {
         _dotTplFn : dotTplFn,
         _checkBoxCaption: null,
         _options: {

         }
      },

      $constructor: function() {
         this._checkBoxCaption = $('.js-controls-CheckBox__caption', this._container);
      },
     /**
      * Установить текст подписи флага.
      * @param {String} captionTxt Текст подписи флага.
      * @example
      * Из массива names установить подписи каждому флагу.
      * <pre>
      *    //names - массив с названиями товаров
      *    //flags - массив объектов-флагов
      *    $ws.helpers.forEach(names, function(name, index) {
      *       flags[index].setCaption(name);
      *    });
      * </pre>
      */
      setCaption: function(captionTxt){
         CheckBox.superclass.setCaption.call(this,captionTxt);
         this._checkBoxCaption.html(captionTxt || '');
      }

   });

   return CheckBox;

});