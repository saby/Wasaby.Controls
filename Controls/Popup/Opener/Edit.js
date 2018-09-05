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
      'WS.Data/Entity/Record',
      'WS.Data/Di'
   ],
   function(Control, template, CoreClone, CoreMerge, cInstance, Record, Di) {
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
         processingResult: function(instance, eventName, record, additionalData) {
            if (eventName === 'update') {
               if (additionalData.isNewRecord) {
                  _private.addRecord(instance, record, additionalData);
               } else {
                  _private.mergeRecord(instance, record);
               }
            } else if (eventName === 'delete') {
               _private.deleteRecord(instance, record);
            }
         },

         addRecord: function(instance, editRecord, additionalData) {
            var newRecord = _private.createRecord(instance, editRecord);
            var items = _private.getItems(instance);
            var at = additionalData.at || 0;

            if (additionalData.isNewRecord) {
               newRecord.set(items.getIdProperty(), additionalData.key);
            }

            items.add(newRecord, at);
         },

         mergeRecord: function(instance, editRecord) {
            var syncRecord = _private.getSyncRecord(instance);
            var changedValues = _private.getChangedValues(syncRecord, editRecord);

            _private.setRecordValues(syncRecord, changedValues);
         },

         deleteRecord: function(instance) {
            var syncRecord = _private.getSyncRecord(instance);
            var items = _private.getItems(instance);
            items.remove(syncRecord);
         },

         createRecord: function(instance, editRecord) {
            var items = _private.getItems(instance);
            var syncRecord;

            syncRecord = Di.resolve(items.getModel(), {
               adapter: items.getAdapter(),
               format: items.getFormat(),
               idProperty: items.getIdProperty()
            });

            var changedValues = _private.getChangedValues(syncRecord, editRecord);
            _private.setRecordValues(syncRecord, changedValues);

            return syncRecord;
         },

         getSyncRecord: function(instance) {
            var items = _private.getItems(instance);
            var index = items.getIndexByValue(items.getIdProperty(), _private.getLinkedKey(instance));
            return items.at(index);
         },
         getChangedValues: function(syncRecord, editRecord) {
            var newValues = {};
            var recValue;

            Record.prototype.each.call(syncRecord, function(key, value) {
               if (editRecord.has(key)) {
                  recValue = editRecord.get(key);

                  if (recValue !== value && key !== editRecord.getIdProperty()) {
                     // clone the model, flags, etc because when they lose touch with the current record, the edit can still continue.
                     if (recValue && (typeof recValue.clone === 'function')) {
                        recValue = recValue.clone();
                     }
                     newValues[key] = recValue;
                  }
               }
            });

            return newValues;
         },
         setRecordValues: function(record, values) {
            // The property may not have a setter
            try {
               record.set(values);
            } catch (e) {
               if (!(e instanceof ReferenceError)) {
                  throw e;
               }
            }
         },
         getItems: function(instance) {
            return instance._options.items;
         },
         getLinkedKey: function(instance) {
            return instance._linkedKey;
         }
      };

      var Edit = Control.extend({
         _template: template,
         _resultHandler: null,
         _linkedKey: null, // key to obtain a synchronized record

         _beforeMount: function() {
            this._onResult = this._onResult.bind(this);
         },

         open: function(meta, popupOptions) {
            var config = _private.getConfig(this, meta, popupOptions);
            this._children.Opener.open(config);
         },

         _onResult: function(data) {
            if (data && data.formControllerEvent) {
               var eventResult = this._notify('beforeItemEndEdit', [data.formControllerEvent, data.record, data.additionalData || {}], { bubbling: true });
               if (eventResult !== Edit.CANCEL && this._options.items) {
                  if (cInstance.instanceOfModule(eventResult, 'Core/Deferred')) {
                     data.additionalData = data.additionalData || {};

                     // todo Написать unit для случая с deferred
                     eventResult.addCallback(function(record) {
                        _private.processingResult(this, data.formControllerEvent, record, data.additionalData);
                     });
                  } else {
                     _private.processingResult(this, data.formControllerEvent, data.record, data.additionalData);
                  }
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
