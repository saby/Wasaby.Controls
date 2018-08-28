define('Controls-demo/Input/Text/Text', [
   'Core/Control',
   'tmpl!Controls-demo/Input/Text/Text',
   'css!Controls-demo/Input/resources/VdomInputs'
], function(Control, template) {
   'use strict';

   var VdomDemoText = Control.extend({
      _template: template,
      _text1: '',
      _tagStyle: 'primary',
      _placeholder: 'Input text',
      _constraint: '',
      _trim: false,
      _maxLength: 100,
      _example: '',
      _selectOnClick: false,
      _readOnly: false,
      _items: [
         { title: '[0-9]', example: 'You can use only digits' },
         { title: '[a-zA-Z]', example: 'You can use only letters' },
         { title: '[a-z]', example: 'You can use only lowercase letters' },
         { title: '[A-Z]', example: 'You can use only uppercase letters' }
      ],
      _tooltip: 'Text',
      _tagStyleHandler: function() {
         this._children.infoBox.open({
            target: this._children.textBox._container,
            message: 'Hover'
         });
      },
      _tagStyleClickHandler: function() {
         this._children.infoBox.open({
            target: this._children.textBox._container,
            message: 'Click'
         });
      },
      valueChangedHandler: function() {
         if (this._validationErrorsValue) {
            this._validationErrors = ['Some error'];
         } else {
            this._validationErrors = null;
         }
      },
      _setValue: function(e, record) {
         this._example = record.get('example');
      },
      _eventHandler: function(e, value) {
         this._eventResult = e.type + ': ' + value;
      },

      paste_text: function(e) {
         this._children.textBox.paste('567');
      }

   });
   return VdomDemoText;
});
