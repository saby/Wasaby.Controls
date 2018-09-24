/**
 * Created by as.krasilnikov on 05.09.2018.
 */
define('Controls-demo/Popup/Edit/MyFormController',
   [
      'Core/Control',
      'wml!Controls-demo/Popup/Edit/MyFormController',
      'WS.Data/Source/Memory',
      'css!Controls-demo/Popup/Edit/MyFormController'
   ],
   function (Control, template, MemorySource) {
      'use strict';

      var MyFormController = Control.extend({
         _template: template,
         _record: null,
         _key: null,
         _beforeMount: function (options) {
            this._record = options.record;
            this._dataSource = options.source || new MemorySource({
                  idProperty: 'id',
                  data: [{id: 0}]
               });
         },

         _beforeUpdate: function(opt) {
            if (opt.record) {
               this._record = opt.record;
            }
         },

         _update: function () {
            return this._children.formControllerInst.update();
         },

         _delete: function () {
            return this._children.formControllerInst.delete();
         },


         _createSuccessedHandler: function (event, record) {
            this._record = record;
         },
         _updateSuccessedHandler: function(event, record) {
            this._record = record;
            this._notify('close');
         },
         _deleteSuccessedHandler: function(record) {
            this._notify('close');
         },
         _errorHandler: function(event, error) {
            var cfg = {
               message: event.type,
               details: error.message,
               style: 'error',
               type: 'ok'
            };
            this._children.popupOpener.open(cfg);
         }
      });

      return MyFormController;
   }
);