define('SBIS3.CONTROLS/VdomPhoneTextBox',
   [
      'Core/Control',
      'tmpl!SBIS3.CONTROLS/VdomPhoneTextBox/VdomPhoneTextBox',

      'Controls/Input/Phone'
   ],
   function(Control, template) {

      'use strict';

      /**
       * Поле ввода телефонного номера.
       * Данный контрол является оберткой над vdom контролом Controls/Input/Phone.
       * Использовать следует только после согласования с платформой.
       * @class SBIS3.CONTROLS/VdomPhoneTextBox
       * @extends Core/Control
       * @author Журавлев М. С.
       */
      var VdomPhoneTextBox = Control.extend(/** @lends SBIS3.CONTROLS/VdomPhoneTextBox.prototype*/{
         _template: template,

         _beforeMount: function(options) {
            this._srcText = options.srcText;
         },

         _textChangeHandler: function() {
            this._notify('textChange', [this._srcText]);
         },

         /**
          * Получает текстовое значение поля ввода телефонного номера без разделителей.
          * @returns {*|srcText|string}
          * @example
          * <pre>
          *     myComponent.subscribe('onTextChange', function(){
       *        myPhone.getSrcText();
       *     });
          * </pre>
          * @see srcText
          * @see setSrcText
          */
         getSrcText: function() {
            return this._srcText;
         },

         /**
          * Устанавливает текстовое значение поля ввода телефонного номера без разделителей.
          * @param srcText
          * @example
          * <pre>
          *     myComponent.subscribe('onClick', function(){
       *        myPhone.setSrcText("88001002424");
       *     });
          * </pre>
          * @see srcText
          * @see getSrcText
          */
         setSrcText: function(srcText) {
            this._srcText = srcText;
            this._forceUpdate();
         }
      });

      return VdomPhoneTextBox;
   }
);