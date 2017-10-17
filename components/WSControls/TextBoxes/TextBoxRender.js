define('js!WSControls/TextBoxes/TextBoxRender',
   [
      'Core/Control',
      'tmpl!WSControls/TextBoxes/TextBoxRender'
   ],
   function(Control, template) {

      'use strict';

      var TextBoxRender = Control.extend({
         _controlName: 'WSControls/TextBoxes/TextBoxRender',

         _template: template,

         constructor: function(options) {
            TextBoxRender.superclass.constructor.call(this, options);

            this._publish('onTagClick', 'onTagHover');
         },

         _beforeMount: function(options) {
            var
               handlers = ['input', 'focus', 'select', 'click', 'keyup', 'change'],
               self = this;

            handlers.forEach(function(item) {
               var nameHandler = item + 'Handler';
               self[nameHandler] = options[nameHandler].bind(self._parent);
            });
         },

         _notifyHandler: function(event, value) {
            this._notify(value);
         },
      });

      return TextBoxRender;
   }
);