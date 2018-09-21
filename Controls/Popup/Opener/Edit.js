/**
 * Created by as.krasilnikov on 05.09.2018.
 */
define('Controls/Popup/Opener/Edit',
   [
      'Core/Control',
      'wml!Controls/Popup/Opener/Edit/Edit',
      'Core/core-clone',
      'Core/core-merge',
      'Core/core-instance',
      'Core/Deferred'
   ],
   function(Control, template, CoreClone, CoreMerge, cInstance, Deferred) {
      /**
       * action of open the edit popup
       * @class Controls/Popup/Opener/Edit
       * @control
       * @author Красильников А.С.
       * @category Popup
       * @extends Core/Control
       */

      var _private = {
         getConfig: function(instance, meta, popupOptions) {
            var cfg = instance._options.popupOptions ? CoreClone(instance._options.popupOptions) : {};
            CoreMerge(cfg, popupOptions || {});
            cfg.templateOptions = cfg.templateOptions || {};
            cfg.eventHandlers = cfg.eventHandlers || {};

            instance._resultHandler = cfg.eventHandlers.onResult;
            cfg.eventHandlers.onResult = instance._onResult;


            if (meta && meta.record) {
               cfg.templateOptions.record = meta.record.clone();
               instance._linkedKey = cfg.templateOptions.record.getId();
            } else {
               instance._linkedKey = undefined;
            }
            return cfg;
         },
         processingResult: function(RecordSynchronizer, data, items, editKey) {
            if (data.formControllerEvent === 'update') {
               if (data.additionalData.isNewRecord) {
                  RecordSynchronizer.addRecord(data.record, data.additionalData, items);
               } else {
                  RecordSynchronizer.mergeRecord(data.record, items, editKey);
               }
            } else if (data.formControllerEvent === 'delete') {
               RecordSynchronizer.deleteRecord(items, editKey);
            }
         },

         getResultArgs: function(instance, data, RecordSynchronizer) {
            return [RecordSynchronizer, data, instance._options.items, instance._linkedKey];
         },
         synchronize: function(instance, eventResult, data, Synchronizer) {
            if (cInstance.instanceOfModule(eventResult, 'Core/Deferred')) {
               data.additionalData = data.additionalData || {};

               eventResult.addCallback(function(record) {
                  data.record = record;
                  _private.processingResult.apply(_private, _private.getResultArgs(instance, data, Synchronizer));
               });
            } else {
               _private.processingResult.apply(_private, _private.getResultArgs(instance, data, Synchronizer));
            }
         },
         loadSynchronizer: function() {
            var synchronizedModule = 'Controls/Utils/RecordSynchronizer';
            var loadDef = new Deferred();
            if (requirejs.defined(synchronizedModule)) {
               loadDef.callback(requirejs(synchronizedModule));
            } else {
               requirejs([synchronizedModule], function(RecordSynchronizer) {
                  loadDef.callback(RecordSynchronizer);
               });
            }
            return loadDef;
         }
      };

      var Edit = Control.extend({
         _template: template,
         _resultHandler: null,
         _openerTemplate: '',
         _linkedKey: null, // key to obtain a synchronized record

         _beforeMount: function(options) {
            this._onResult = this._onResult.bind(this);
            var def = new Deferred();

            if (options.mode === 'dialog') {
               this._openerTemplate = 'Controls/Popup/Opener/Dialog';
            } else if (options.mode === 'dialog') {
               this._openerTemplate = 'Controls/Popup/Opener/Sticky';
            } else {
               this._openerTemplate = 'Controls/Popup/Opener/Stack';
            }

            requirejs([this._openerTemplate], def.callback.bind(def));
            return def;
         },

         open: function(meta, popupOptions) {
            var config = _private.getConfig(this, meta, popupOptions);
            this._children.Opener.open(config);
         },

         _onResult: function(data) {
            if (data && data.formControllerEvent) {
               var eventResult = this._notify('beforeItemEndEdit', [data.formControllerEvent, data.record, data.additionalData || {}], { bubbling: true });
               var self = this;
               if (eventResult !== Edit.CANCEL && this._options.items) {
                  _private.loadSynchronizer().addCallback(function(Synchronizer) {
                     _private.synchronize(self, eventResult, data, Synchronizer);
                  });
               }
            } else if (this._resultHandler) {
               this._resultHandler.apply(this, arguments);
            }
         }
      });

      Edit._private = _private;

      Edit.getDefaultOptions = function() {
         return {
            mode: 'stack',
            items: undefined
         };
      };

      Edit.CANCEL = 'cancel';

      return Edit;
   });
