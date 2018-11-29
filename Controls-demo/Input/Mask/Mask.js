define('Controls-demo/Input/Mask/Mask',
   [
      'Core/Control',
      'wml!Controls-demo/Input/Mask/Mask',
      'Controls/Input/Mask/Formatter',
      'WS.Data/Source/Memory',
      'Controls/Input/Mask',
      'css!Controls-demo/Input/resources/VdomInputs'

   ],
   function(Control, template, Formatter, Memory) {
      'use strict';
      var Mask = Control.extend({
         _template: template,
         _mask: '',
         _placeholder: 'Input value',
         _replacer: '-',
         _tagStyle: 'info',
         _value: '',
         _example: '',
         _tooltip: 'Mask',
         _readOnly: false,
         _items: null,
         _beforeMount: function() {
            this._items = [
               { title: 'dd dd dddddd', example: 'You can use mask of Russian passport' },
               {
                  title: 'ddd-ddd-ddd dd',
                  example: 'You can use mask of INILA(Insurance Number of Individual Ledger Account)'
               },
               { title: '(ddd(ddd)ddd)', example: '' },
               { title: 'd\\{1,3}l\\{1,3}', example: '' }
            ];
         },
         _tagStyleHandler: function() {
            this._children.infoBoxMask.open({
               target: this._children.textMask._container,
               message: 'Hover'
            });
         },
         _tagStyleClickHandler: function() {
            this._children.infoBoxMask.open({
               target: this._children.textMask._container,
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
         _suggestSource: function() {
            return new Memory({
               idProperty: 'title',
               data: this._items,
               filter: function(record, filter) {
                  if (record.get('title').indexOf(filter.title) !== -1) {
                     return true;
                  }
               }
            });
         }
      });
      return Mask;
   });
