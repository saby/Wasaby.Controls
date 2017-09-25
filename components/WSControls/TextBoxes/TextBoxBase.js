define('js!WSControls/TextBoxes/TextBoxBase',
   [
      'Core/Control',
      'js!WS.Data/Type/descriptor'
   ],
   function(Control, types) {

      /**
       * Базовый класс для текстового поля
       *
       * @class SBIS3.CONTROLS.TextBoxBase
       * @extends Core/Control
       * @public
       *
       * @author Крайнов Дмитрий Олегович
       */
      var TextBoxBase = Control.extend({
         _controlName: 'WSControls/TextBoxes/TextBoxBase',

         constructor: function(options) {
            TextBoxBase.superclass.constructor.call(this, options);

            this._publish('onChangeText');
         },

         _beforeMount: function(options) {
            this._updateText(options);
         },

         _beforeUpdate: function(newOptions) {
            this._updateText(newOptions);
         },

         _updateText: function(options) {
            this._text = options.text;
         },

         _inputHandler: function(event) {
            this._text = event.target.value;
            this._notify('onChangeText', this._text);
         }
      });

      TextBoxBase.getOptionTypes = function() {
         return {
            text: types(String)
         }
      };

      return TextBoxBase;
   }
);