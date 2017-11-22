define('js!Controls/Input/resources/InputRender/InputRender',
   [
      'Core/Control',
      'js!WS.Data/Type/descriptor',
      'tmpl!Controls/Input/resources/InputRender/InputRender',
      'js!Controls/Input/resources/TargetUtil',
      'css!SBIS3.CONTROLS.TextBox'
   ],
   function(Control, types, template, TargetUtil) {

      'use strict';

      /**
       * @class Controls.Input.resources.InputRender.InputRender
       * @extends Core/Control
       * @control
       * @private
       * @category Input
       * @author Журавлев Максим Сергеевич
       */

      var InputRender = Control.extend({
         
         _controlName: 'Controls/Input/resources/InputRender/InputRender',
         _template: template,

         constructor: function(options) {
            InputRender.superclass.constructor.apply(this, arguments);
            this._value = options.value;
            this._targetUtil = new TargetUtil();
         },

         _inputHandler: function(e) {
            var res = this._options.prepareValue(this._targetUtil.buildSplitValue(e.target, this._value));

            this._targetUtil.setValue(e.target, res.value, res.position);
            this._targetUtil.saveSelectionPosition(e.target);

            if(this._value !== res.value){
               this._value = res.value;
               this._notify('onChangeValue', res.value);
            }
         },

         _keyUpHandler: function(e) {
            var keyCode = e.nativeEvent.keyCode;

            // При нажатии стрелок происходит смещение курсора.
            if (keyCode > 36 && keyCode < 41) {
               this._targetUtil.saveSelectionPosition(e.target);
            }
         },

         _clickHandler: function(e) {
            this._targetUtil.saveSelectionPosition(e.target);
         },

         _selectionHandler: function(e){
            this._targetUtil.saveSelectionPosition(e.target);
         },

         _notifyHandler: function(e, value) {
            this._notify(value);
         },

         _focusHandler: function(e) {
            if (this._options.selectOnClick) {
               e.target.select();
            }
         }
      });

      InputRender.getDefaultOptions = function() {
         return {
            value: '',
            selectOnClick: false
         };
      };

      InputRender.getOptionTypes = function() {
         return {
            value: types(String),
            selectOnClick: types(Boolean),
            prepareValue: types(Function).required(),
            tagStyle: types(String).oneOf([
               'primary',
               'done',
               'attention',
               'error',
               'info'
            ])
         };
      };

      return InputRender;
   }
);