define('Controls-demo/PropertyGrid/PropertyGridWrapper',
   [
      'Core/Control',
      'Core/Deferred',
      'Core/core-merge',
      'wml!Controls-demo/PropertyGrid/PropertyGridWrapper',
      'wml!Controls-demo/PropertyGrid/PropertyGridTemplate',
      'wml!Controls-demo/PropertyGrid/Types/booleanOrNull',
      'wml!Controls-demo/PropertyGrid/Types/string',
      'wml!Controls-demo/PropertyGrid/Types/array',
      'wml!Controls-demo/PropertyGrid/Types/number',
      'wml!Controls-demo/PropertyGrid/Types/datetime',
      'wml!Controls-demo/PropertyGrid/Types/boolean',
      'wml!Controls-demo/PropertyGrid/Types/functionOrString',
      'wml!Controls-demo/PropertyGrid/Types/function',
      'wml!Controls-demo/PropertyGrid/Types/enum',
      'wml!Controls-demo/PropertyGrid/Types/object',


      'json!Controls-demo/PropertyGrid/pgtext',
      'css!Controls-demo/Filter/Button/PanelVDom',
      'css!Controls-demo/Input/resources/VdomInputs',
      'css!Controls-demo/Wrapper/Wrapper',

   ],

   function(Control, Deferred, cMerge, template, myTmpl, booleanOrNull, stringTmpl, arrayTmpl, numberTmpl,
            datetimeTmpl, booleanTmpl, functOrString, functionTmpl, enumTmpl, objTmpl) {
      'use strict';

      var PGWrapper = Control.extend({
         _template: template,
         _metaData: null,
         dataTemplates: null,
         myEvent: '',
         _my: myTmpl,
         _demoName: '',
         _exampleControlOptions: {},
         _beforeMount: function(opts) {
            this.dataTemplates = {
               'Boolean|null': booleanOrNull,
               'String': stringTmpl,
               'Array': arrayTmpl,
               'Number': numberTmpl,
               'DateTime': datetimeTmpl,
               'Boolean': booleanTmpl,
               'function|String': functOrString,
               'function': functionTmpl,
               'enum': enumTmpl,
               'Object': objTmpl,
            };
            var testName = opts.content.split('/');
            testName.splice(0, 1);
            this._demoName = testName.join('');
            this._exampleControlOptions = opts.componentOpt;
            var def = new Deferred();
            opts.description = cMerge(opts.description, opts.dataObject);
            if (typeof opts.content === 'string') {
               require([opts.content], function() {
                  def.callback();
               });
               return def;
            }
         },
         _afterMount: function(opts) {
            var self = this,
               container = this._children[opts.componentOpt.name]._container;

            container.controlNodes.forEach(function(config) {
               var notOrigin = config.control._notify;

               config.control._notify = function(event, arg) {
                  self.myEvent += event + '\n';
                  if (event === opts.eventType) {
                     opts.componentOpt[opts.nameOption] = arg[0];
                  }
                  notOrigin.apply(this, arguments);
                  self._forceUpdate();
                  self._children.PropertyGrid._forceUpdate();
               };
            });
         },
         _clickHandler: function() {
            if (this._options.dataObject.showClickEvent === true) {
               this.myEvent += 'click\n';
            }
         },
         _valueChangedHandler: function(event, option, newValue) {
            this._exampleControlOptions[option] = newValue;
            this._notify('optionsChanged', [this._options]);
         },
         reset: function() {
            this.myEvent = '';
         }
      });
      return PGWrapper;
   });
