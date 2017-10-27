/**
 * Модуль 'Компонент радиокнопка'.
 *
 * @description
 */
define('js!SBIS3.CONTROLS.RadioButton',
   [
      'js!SBIS3.CONTROLS.RadioButtonBase',
      'tmpl!SBIS3.CONTROLS.RadioButton',
      'Core/Sanitize',
      'css!SBIS3.CONTROLS.RadioButton'
   ],
   function(RadioButtonBase,dotTplFn, Sanitize) {

   'use strict';

   /**
    * Контрол, отображающий стандартную радиокнопку. Работает только в составе группы. В WebGenie не вытаскивается.
    * @class SBIS3.CONTROLS.RadioButton
    * @extends SBIS3.CONTROLS.RadioButtonBase
    * @cssModifier controls-Radio__primary акцентные кнопки
    * @public
    * @author Журавлев Максим Сергеевич
    *
    * @css controls-RadioButton__caption Класс для изменения отображения текста подписи у радиокнопки.
    */

   var RadioButton = RadioButtonBase.extend( /** @lends SBIS3.CONTROLS.RadioButton.prototype */ {
      _dotTplFn: dotTplFn,
      $protected: {
         _radioButtonCaption: '',
         _options: {

         }
      },

      $constructor: function() {
         this._radioButtonCaption = $('.js-controls-RadioButton__caption', this._container);
      },
       /**
        * Метод установки текста подписи у кнопки.
        * @param captionTxt Текст подписи у кнопки.
        * @example
        * <pre>
        *     MyRadioGroup.getItemsInstance(2).setCaption('SomeNewCaption');
        * </pre>
        * @see items
        */
      setCaption: function(captionTxt){
         RadioButton.superclass.setCaption.call(this,captionTxt);
         this._radioButtonCaption.html(captionTxt || '');
      },

      _modifyOptions: function(options) {
         RadioButton.superclass._modifyOptions.call(this, options);

         options.sanitize = function(markup) {
            return Sanitize(markup.caption, {validNodes: {component: true}, validAttributes : {config: true} });
         };

         return options;
      }

   });

   return RadioButton;

});