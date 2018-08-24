define('Controls-demo/Input/Text/TextPG',
   [
      'Core/Control',
      'WS.Data/Source/Memory',
      'WS.Data/Chain',
      'Core/core-merge',
      'tmpl!Controls-demo/Input/Text/TextPG',
      'tmpl!Controls-demo/PropertyGrid/PropertyGridTemplate',
      'json!Controls-demo/PropertyGrid/pgtext',

      'css!Controls-demo/Filter/Button/PanelVDom',
      'css!Controls-demo/Input/resources/VdomInputs',
      'css!Controls-demo/Wrapper/Wrapper'
   ],

   function(Control, MemorySource, Chain, cMerge, template, myTmpl, config) {
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

      var textOptions = {
         placeholder: 'Input text',
         tagStyle: 'primary',
         constraint: '',
         trim: false,
         maxLength: 100,
         selectOnClick: false,
         readOnly: false,
         tooltip: 'myTooltip',
      }; // опции компонента Text

      var dataObject = {
         value: {
            readOnly: true
         },
         constraint: {
            source: constraintSource
         }
      }; // настройки для редакторов

      var TextPG = Control.extend({
         _template: template,
         _metaData: null,
         _events: '',
         _textOptions: null,
         _my: myTmpl,
         someScope: null,
         _beforeMount: function() {
            this._textOptions = textOptions;
            this._metaData = config['Controls/Input/Text'].properties['ws-config'].options;
            this._metaData = cMerge(this._metaData, dataObject);

            console.log(this._metaData);
         },
         _valueChanged: function(event, value) {
            this._events += 'valueChanged : ' + value + '\n';
            this._notify('textValueChanged', [this._options.caption + ': ' + value]);
            this._notify('valueChanged', [value]);
            this._forceUpdate();

            // console.log(result);
         },
         _tagStyleHandler: function() {
            this._events += 'tagHover\r\n';
            this._children.infoBox.open({
               target: this._children.textBox._container,
               message: 'Hover'
            });

            // console.log(this._config['Controls/Input/Text'].properties['ws-config'].options);
         },
         _valueChangedHandler: function() {
            // this._options.items[index].value = value;
            this._forceUpdate();
         },

         _tagStyleClickHandler: function() {
            this._events += 'tagClick\r\n';
            this._children.infoBox.open({
               target: this._children.textBox._container,
               message: 'Click'
            });
         }
      });
      return TextPG;
   });
