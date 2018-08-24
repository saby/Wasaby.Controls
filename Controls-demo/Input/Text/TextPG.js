define('Controls-demo/Input/Text/TextPG',
   [
      'Core/Control',
      'WS.Data/Source/Memory',
      'WS.Data/Chain',
      'tmpl!Controls-demo/Input/Text/TextPG',
      'tmpl!Controls-demo/PropertyGrid/PropertyGridTemplate',
      'json!Controls-demo/PropertyGrid/pgtext',

      'css!Controls-demo/Filter/Button/PanelVDom',
      'css!Controls-demo/Input/resources/VdomInputs',
      'css!Controls-demo/Wrapper/Wrapper'
   ],

   function(Control, MemorySource, Chain, template, myTmpl, config) {
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

      var result = (function(defaults, params) {
         var obj = Object.create(defaults);
         // debugger;
         var merge = function(result, params) {
            for (var key in params) {
               if (params.hasOwnProperty(key)) {
                  if (key in result && typeof params[key] === 'object' && typeof result[key] === 'object') {
                     merge(result[key], params[key]);
                  } else {
                     result[key] = params[key];
                  }
               }
            }
         };
         merge(obj, params);
         return obj;
      })(config['Controls/Input/Text'].properties['ws-config'].options, dataObject); // добавляем настройки редактора к json файлу


      var TextPG = Control.extend({
         _template: template,
         _metaData: config['Controls/Input/Text'].properties['ws-config'].options,
         _events: '',
         _my: myTmpl,
         _textOptions: textOptions,
         someScope: null,
         _beforeMount: function() {
            // this.someScope = {};
            // for (var i in config) {
            //
            // }
            console.log(this._metaData);
         },

         //
         // _afterMount: function() {
         //
         // },

         _itemsSimple: config['Controls/Input/Text'].properties['ws-config'].options,
         _valueChanged: function(event, value) {
            this._events += 'valueChanged : ' + value + '\n';
            this._notify('textValueChanged', [this._options.caption + ': ' + value]);
            this._notify('valueChanged', [value]);

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
