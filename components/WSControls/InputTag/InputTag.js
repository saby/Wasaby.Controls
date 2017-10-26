define('js!WSControls/InputTag/InputTag',
   [
      'Core/Control',
      'tmpl!WSControls/InputTag/InputTag',
      'css!WSControls/InputTag/InputTag'
   ],
   function(Control, template) {

      'use strict';

      var InputTag = Control.extend({
         _controlName: 'WSControls/InputTag/InputTag',

         _template: template,

         _beforeMount: function(options) {
            var component = options.component;
            component._publish('onInputTagMouseEnter', 'onInputTagActivated');
            this._mouseenterInputTagHandler = this._mouseenterInputTagHandler.bind(component);
            this._activatedInputTagHandler = this._activatedInputTagHandler.bind(component);
         },

         _mouseenterInputTagHandler: function() {
            this._notify('onInputTagMouseEnter');
         },

         _activatedInputTagHandler: function() {
            this._notify('onInputTagActivated');
         }
      });

      return InputTag;
   }
);