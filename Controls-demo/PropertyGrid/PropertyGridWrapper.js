define('Controls-demo/PropertyGrid/PropertyGridWrapper',
   [
      'Core/Control',
      'Core/Deferred',
      'Core/core-merge',
      'wml!Controls-demo/PropertyGrid/PropertyGridWrapper',
      'json!Controls-demo/PropertyGrid/pgtext',

      'css!Controls-demo/Filter/Button/PanelVDom',
      'css!Controls-demo/Input/resources/VdomInputs',
      'css!Controls-demo/Wrapper/Wrapper'
   ],

   function(Control, Deferred, cMerge, template, myTmpl) {
      'use strict';

      var PGWrapper = Control.extend({
         _template: template,
         _metaData: null,
         myEvent: '',
         _my: myTmpl,
         _demoName: '',
         _beforeMount: function(opts) {

            var testName = opts.content.split('/');
            testName.splice(0, 1);
            this._demoName = testName.join('');
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
               notOrigin = this._children[opts.componentOpt.name]._notify;
            this._children[opts.componentOpt.name]._notify = function(event, arg) {
               self.myEvent += event + '\n';
               if (event === opts.eventType) {
                  opts.componentOpt[opts.nameOption] = arg[0];
               }
               notOrigin.apply(this, arguments);
               self._children.PropertyGrid._forceUpdate();
            };
         },
         _valueChangedHandler: function() {
            this._notify('optionsChanged', [this._options]);
         },
         reset: function() {
            this.myEvent = '';
         }
      });
      return PGWrapper;
   });
