define('js!Controls/Input/resources/BoxRender/BoxRender',
   [
      'Core/Control',
      'js!WS.Data/Type/descriptor',
      'tmpl!Controls/Input/resources/BoxRender/BoxRender',
      'js!Controls/Input/resources/TargetUtil',
      'css!SBIS3.CONTROLS.TextBox'
   ],
   function(Control, types, template, TargetUtil) {

      'use strict';

      var BoxRender = Control.extend({
         
         _controlName: 'Controls/Input/resources/BoxRender/BoxRender',
         _template: template,

         constructor: function(options) {
            BoxRender.superclass.constructor.apply(this, arguments);
            this._value = options.value;
            this._targetUtil = new TargetUtil();
         },

         _inputHandler: function(e) {
            var res = this._options.prepareValue(this._targetUtil.buildSplitValue(e.target, this._value));

            this._targetUtil.setValue(e.target, res.value);
            this._targetUtil.setPosition(e.target, res.position);
            this._targetUtil.saveSelection(e.target);

            if(this._value !== res.value){
               this._value = res.value;
               this._notify('onChangeValue', res.value);
            }
         },

         _keyUpHandler: function(e) {
            if (e.nativeEvent.keyCode > 36 && e.nativeEvent.keyCode < 41) {
               this._targetUtil.saveSelection(e.target);
            }
         },

         _clickHandler: function(e) {
            this._targetUtil.saveSelection(e.target);
         },

         _selectionHandler: function(e){
            this._targetUtil.saveSelection(e.target);
         },

         _notifyHandler: function(event, value) {
            this._notify(value);
         },

         _focusHandler: function(e) {
            if (this._options.selectOnClick) {
               e.target.select();
            }
         }
      });

      BoxRender.getDefaultOptions = function() {
         return {
            value: '',
            selectOnClick: false
         };
      };

      BoxRender.getOptionTypes = function() {
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

      return BoxRender;
   }
);