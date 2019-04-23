/**
 * Created by as.krasilnikov on 05.09.2018.
 */
import Control = require('Core/Control');
import template = require('wml!Controls/_popup/Opener/Edit/Edit');
import CoreClone = require('Core/core-clone');
import CoreMerge = require('Core/core-merge');
import cInstance = require('Core/core-instance');
import Deferred = require('Core/Deferred');
      /**
       * The control opens a popup with a record editing dialog. When in the edit dialog the action takes place with the entry, control synchronize editable entry with recordsets.
       * <a href="/materials/demo-ws4-popup-edit">Demo-example</a>
       * @class Controls/_popup/Opener/Edit
       * @control
       * @public
       * @demo Controls-demo/Popup/Edit/Opener
       * @category Popup
       */

      var _private = {
         getConfig: function(instance, meta, popupOptions) {
            var cfg = instance._options.popupOptions ? CoreClone(instance._options.popupOptions) : {};
            CoreMerge(cfg, popupOptions || {});
            cfg.templateOptions = cfg.templateOptions || {};
            cfg.eventHandlers = cfg.eventHandlers || {};

            instance._resultHandler = cfg.eventHandlers.onResult;
            cfg.eventHandlers.onResult = instance._onResult;


            if (meta.record) {
               cfg.templateOptions.record = meta.record.clone();
               instance._linkedKey = cfg.templateOptions.record.getId();
            } else {
               instance._linkedKey = undefined;
            }

            if (meta.key) {
               cfg.templateOptions.key = meta.key;
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

            if (options.mode === 'dialog') {
               this._openerTemplate = require('Controls/popup').Dialog;
            } else if (options.mode === 'sticky') {
               this._openerTemplate = require('Controls/popup').Sticky;
            } else {
               this._openerTemplate = require('Controls/popup').Stack;
            }
         },

         /**
          * Open edit popup.
          * @function Controls/_popup/Opener/Edit#open
          * @param {Object} meta Data to edit: key, record.
          * @param {Object} popupOptions options for edit popup.
          * <ul>
          *     <li>if mode option equal 'stack' see {@link Controls/_popup/Opener/Stack/PopupOptions.typedef popupOptions}</li>
          *     <li>if mode option equal 'dialog' see {@link Controls/_popup/Opener/Dialog/PopupOptions.typedef popupOptions}</li>
          *     <li>if mode option equal 'sticky' see {@link Controls/_popup/Opener/Sticky/PopupOptions.typedef popupOptions}</li>
          * </ul>
          * @returns {undefined}
          * @example
          * wml
          * <pre>
          *     <Controls.Popup.Opener.Edit name="EditOpener">
          *        <ws:popupOptions template="Controls-demo/Popup/Edit/MyFormController">
          *           <ws:templateOptions source="{{_viewSource}}" />
          *        </ws:popupOptions>
          *     </Controls.Popup.Opener.Edit>
          * </pre>
          * js
          * <pre>
          *   Control.extend({
          *        ...
          *
          *        _itemClick(event, record) {
          *           var popupOptions = {
          *              closeOnOutsideClick: false,
          *           };
          *
          *           var meta = {
          *              record: record,
          *          };
          *
          *           this._children.EditOpener.open(meta, popupOptions);
          *       }
          *    });
          * </pre>
          */
         open: function(meta, popupOptions) {
            var config = _private.getConfig(this, meta || {}, popupOptions);
            this._children.Opener.open(config);
         },

         /**
          * Close popup
          * @function Controls/_popup/Opener/Edit#close
          */
         close: function() {
            this._children.Opener.close();
         },

         /**
          * Popup opened status
          * @function Controls/_popup/Opener/Edit#isOpened
          * @returns {Boolean} is popup opened
          */
         isOpened: function() {
            return this._children.Opener.isOpened();
         },

         _onResult: function(data) {
            if (data && data.formControllerEvent) {
               /**
                * @event Controls/_popup/Opener/Edit#beforeItemEndEdit The event is called before the synchronization with the recordset.
                */
               var eventResult = this._notify('beforeItemEndEdit', [data.formControllerEvent, data.record, data.additionalData || {}], { bubbling: true });
               var self = this;
               if (eventResult !== Edit.CANCEL && this._options.items) {
                  _private.loadSynchronizer().addCallback(function(Synchronizer) {
                     _private.synchronize(self, eventResult, data, Synchronizer);
                  });
               }
            } else {
               var args = Array.prototype.slice.call(arguments);
               if (this._resultHandler) {
                  this._resultHandler.apply(this, args);
               }
               this._notify('result', args);
            }
         },
         _closeHandler: function(event) {
            this._notify(event.type, []);
         },
         _openHandler: function(event) {
            this._notify(event.type, []);
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

      export = Edit;


/**
 * @name Controls/_popup/Opener/Edit#close
 * @function
 * @description Close edit popup.
 */

/**
 * @name Controls/_popup/Opener/Edit#popupOptions
 * @cfg {Object} Sets the popup configuration.
 * @description
 * <ul>
 *     <li>if mode option equal 'stack' see {@link Controls/interface/IStackOptions#popupOptions popupOptions}</li>
 *     <li>if mode option equal 'dialog' see {@link Controls/interface/IDialogOptions#popupOptions popupOptions}</li>
 *     <li>if mode option equal 'sticky' see {@link Controls/interface/IStickyOptions#popupOptions popupOptions}</li>
 * </ul>
 *
 */

/**
 * @name Controls/_popup/Opener/Edit#mode
 * @cfg {Object} Sets the display mode of the dialog.
 * @variant stack Open edit dialog in the stack panel.
 * @variant dialog Open edit dialog in the dialog popup.
 * @variant sticky Open edit dialog in the sticky popup.
 */

/**
 * @name Controls/_popup/Opener/Edit#items
 * @cfg {Object} RecordSet for synchronization with the editing record.
 */
