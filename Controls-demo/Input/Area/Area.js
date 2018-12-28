define('Controls-demo/Input/Area/Area', [
   'Core/Control',
   'wml!Controls-demo/Input/Area/Area',
   'WS.Data/Source/Memory',
   'css!Controls-demo/Input/resources/VdomInputs'
], function(Control, template, MemorySource) {

   'use strict';

   var VdomDemoArea = Control.extend({
      _template: template,
      _text1: '',
      _placeholder: 'Input text',
      _constraint: '',
      _trim: false,
      _maxLength: '1000',
      _minLines: 1,
      _maxLines: 5,
      _readOnly: false,
      _example: '',
      _selectOnClick: false,
      _tagStyle: 'danger',
      _items: null,
      _tooltip: 'Area',
      _newLineKeySource: null,
      _newLineKey: 'enter',
      _beforeMount: function() {
         this._items = [
            {title: '[0-9]', example: 'You can use only digits'},
            {title: '[a-zA-Z]', example: 'You can use only letters'},
            {title: '[a-z]', example: 'You can use only lowercase letters'},
            {title: '[A-Z]', example: 'You can use only uppercase letters'}
         ];
         this._newLineKeySource = new MemorySource({
            idProperty: 'title',
            data: [
               { title: 'enter' },
               { title: 'ctrlEnter' }
            ]
         });
      },
      changeNewLineKey: function(e, key) {
         this._newLineKey = key;
      },

      _tagStyleHandler: function() {
         this._children.infoBoxArea.open({
            target: this._children.textArea._container,
            message: 'Hover'
         });
      },
      _tagStyleClickHandler: function() {
         this._children.infoBoxArea.open({
            target: this._children.textArea._container,
            message: 'Click'
         });
      },
      _validationChangedHandler: function() {
         if (this._validationErrorsValue) {
            this._validationErrors = ['Some error'];
         } else {
            this._validationErrors = null;
         }
      },
      _eventHandler: function(e, value) {
         this._eventResult = e.type + ': ' + value;
      },

      paste_text: function(e) {
         this._children.textArea.paste('567');
      }

   });
   return VdomDemoArea;
});
