define('Controls-demo/Input/Text/TextPG',
   [
      'Core/Control',
      'WS.Data/Source/Memory',
      'WS.Data/Chain',
      'tmpl!Controls-demo/Input/Text/TextPG',
      'tmpl!Controls-demo/PropertyGrid/PropertyGridTemplate',
      'css!Controls-demo/Filter/Button/PanelVDom',
      'css!Controls-demo/Input/resources/VdomInputs',
      'css!Controls-demo/Switch/UnionSwitchDemo'
   ],

   function(Control, MemorySource, Chain, template, myTmpl) {
      'use strict';
      var sourcePeriod = [
         { key: 1, title: 'done' },
         { key: 2, title: 'error' },
         { key: 3, title: 'primary' },
         { key: 4, title: 'info' },
         { key: 5, title: 'attention' }
      ];
      var constraintSource = [
         { id: 1, title: '[0-9]', example: 'You can use only digits' },
         { id: 2, title: '[a-zA-Z]', example: 'You can use only letters' },
         { id: 3, title: '[a-z]', example: 'You can use only lowercase letters' },
         { id: 4, title: '[A-Z]', example: 'You can use only uppercase letters' }
      ];
      var itemsSimple = {
         tagStyle: {
            id: 'tagStyle',
            type: 'enum',
            value: 'error',
            emptyText: 'none',
            displayProperty: 'title',
            keyProperty: 'key',
            nullValue: undefined,
            source: sourcePeriod
         },
         placeholder: {
            id: 'placeholder',
            type: 'funct',
            value: 'Input',
            flag: false
         },
         value: {
            id: 'value',
            type: 'string',
            value: 'Input',
            readOnly: true,
         },
         tooltip: {
            id: 'tooltip',
            type: 'string',
            value: 'my tooltip'
         },
         constraint: {
            id: 'constraint',
            type: 'string',
            config: {
               template: 'custom',
               value: 'title',
               comment: 'example',
            },
            value: '',
            source: constraintSource
         },
         maxLength: {
            id: 'maxLength',
            type: 'number',
            value: 100
         },
         selectOnClick: {
            id: 'selectOnClick',
            type: 'boolean',
            value: false
         },
         readOnly: {
            id: 'readOnly',
            type: 'boolean',
            value: false
         },
         trim: {
            id: 'trim',
            type: 'boolean',
            value: false
         },
      };

      var PanelVDom = Control.extend({
         _template: template,
         _events: '',
         _my: myTmpl,
         _itemsSimple: itemsSimple,
         _valueChanged: function(event, value) {
            this._events += 'valueChanged : ' + value + '\n';
            this._notify('textValueChanged', [this._options.caption + ': ' + value]);
            this._notify('valueChanged', [value]);
         },
         _tagStyleHandler: function() {
            this._events += 'tagHover\r\n';
            this._children.infoBox.open({
               target: this._children.textBox._container,
               message: 'Hover'
            });
         },
         _tagStyleClickHandler: function() {
            this._events += 'tagClick\r\n';
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
      });
      return PanelVDom;
   });
