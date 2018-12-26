define('Controls-demo/PendingRegistrator/PendingRegistratorPG',
   [
      'Core/Control',
      'wml!Controls-demo/PendingRegistrator/PendingRegistratorPG',
      'json!Controls-demo/PropertyGrid/pgtext',
      'Controls-demo/PendingRegistrator/Content'
   ],

   function(Control, template, config, contentTemplate) {
      'use strict';

      var result = Control.extend({
         _template: template,
         _content: 'Controls-demo/PendingRegistrator/RegistratorExample',
         _metaData: null,
         _dataObject: null,
         _componentOptions: null,
         _eventType: null,
         _nameOption: null,

         _beforeMount: function() {
            this._componentOptions = {
               name: 'pendingRegistrator',
               content: contentTemplate
            };
            this._dataObject = {
            };
            this._metaData = config[this._content].properties['ws-config'].options;
         }
      });
      return result;
   });
