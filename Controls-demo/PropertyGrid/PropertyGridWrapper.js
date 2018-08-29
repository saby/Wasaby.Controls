dataObject = undefined;
define('Controls-demo/PropertyGrid/PropertyGridWrapper',
   [
      'Core/Control',
      'WS.Data/Source/Memory',
      'WS.Data/Chain',
      'Core/Deferred',
      'Core/core-merge',
      'tmpl!Controls-demo/PropertyGrid/PropertyGridWrapper',
      'tmpl!Controls-demo/PropertyGrid/PropertyGridTemplate',
      'json!Controls-demo/PropertyGrid/pgtext',

      'css!Controls-demo/Filter/Button/PanelVDom',
      'css!Controls-demo/Input/resources/VdomInputs',
      'css!Controls-demo/Wrapper/Wrapper'
   ],

   function(Control, MemorySource, Chain, Deferred, cMerge, template, myTmpl) {
      'use strict';

      var PGWrapper = Control.extend({
         _template: template,
         _metaData: null,
         myEvent: '',
         _textOptions: null,
         _my: myTmpl,
         someScope: null,
         _beforeMount: function(opts) {
            var def = new Deferred();
            opts.description = cMerge(opts.description, opts.dataObject);
            if (typeof opts.content === 'string') {
               console.log(opts.content);
               require([opts.content], function() {
                  def.callback();
               });
               return def;
            }
         },
         _afterMount: function(opts) {
            var self = this,
               notOrigin = this._children[opts.txtOpt.name]._notify;
            this._children[opts.txtOpt.name]._notify = function(event, arg) {
               self.myEvent += event + '\n';
               notOrigin.apply(this, arguments);
               self._forceUpdate();
            };
         },
         _valueChangedHandler: function() {
            this._forceUpdate();
         }
      });
      return PGWrapper;
   });
