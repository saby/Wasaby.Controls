define('Controls-demo/Input/Number/Number', [
   'Core/Control',
   'tmpl!Controls-demo/Input/Number/Number',
   'WS.Data/Source/Memory',
   'css!Controls-demo/Input/resources/VdomInputs'
], function(Control, template, Memory) {

   'use strict';

   var VdomDemoNumber = Control.extend({
      _template: template,
      _placeholder: 'Input number',
      _text1: '',
      _textAlign: 'left',
      _tagStyle: 'done',
      _integersLength: 5,
      _precision: 2,
      _onlyPositive: true,
      _showEmptyDecimals: false,
      _readOnly: false,
      _eventResult: '',
      _selectOnClick: false,
      _items: [
         {title: 'left'},
         {title: 'right'}
      ],
      _tooltip: '',
      _tagStyleHandler: function() {
         this._children.infoBoxNumber.open({
            target: this._children.textNumber._container,
            message: 'Hover'
         });
      },
      _tagStyleClickHandler: function() {
         this._children.infoBoxNumber.open({
            target: this._children.textNumber._container,
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
      _createMemory: function() {
         return new Memory({
            idProperty: 'title',
            data: this._items
         });
      },
      _eventHandler: function(e, value) {
         this._eventResult = e.type + ': ' + value;
      },
   });
   return VdomDemoNumber;
});
