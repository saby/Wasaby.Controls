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
       * Контрол, который открывает всплывающее окно с {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/forms-and-validation/editing-dialog/ диалогом редактирования записи}.
       * В зависимости от значения опции 'mode':
       * * 'stack' — используйте опции {@link Controls/popup:Stack}
       * * 'dialog' — используйте опции {@link Controls/popup:Dialog}
       * * 'sticky' — используйте опции {@link Controls/popup:Sticky}
       * <a href="/materials/demo-ws4-popup-edit">Демо-пример</a>
       * @class Controls/_popup/Opener/Edit
       * @control
       * @public
       * @author Красильников А.С.
       * @demo Controls-demo/Popup/Edit/Opener
       * @category Popup
       */
      /*
       * The control opens a popup with a record editing dialog.
       * When in the edit dialog the action takes place with the entry, control synchronize editable entry with recordsets.
       *  <li>If option 'mode' is set to 'stack' use {@link Controls/popup:Stack Stack options}</li>
       *  <li>If option 'mode' is set to 'dialog' use  {@link Controls/popup:Dialog Dialog options}</li>
       *  <li>If option 'mode' is set to 'sticky' use  {@link Controls/popup:Sticky Sticky options}</li>
       * <a href="/materials/demo-ws4-popup-edit">Demo-example</a>
       * {@link /doc/platform/developmentapl/interface-development/forms-and-validation/editing-dialog/ Подробнее}
       * @class Controls/_popup/Opener/Edit
       * @control
       * @public
       * @author Красильников А.С.
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
               cfg.templateOptions.record.acceptChanges();
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
          * Открывает всплывающее окно диалога редактирования.
          * @function Controls/_popup/Opener/Edit#open
          * @param {Object} meta Данные, по которым определяется, откуда диалог получит редактируемую запись. В объект можно передать свойства key и record. Политика обработки свойств подробно описана {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/forms-and-validation/editing-dialog/#step4 здесь}.
          * @param {Object} popupOptions Опции всплывающего окна диалога редактирования.
          * В зависимости от значения опции 'mode':
          * * 'stack' — смотреть {@link Controls/_popup/Opener/Stack/PopupOptions.typedef popupOptions стекового окна}
          * * 'dialog' — смотреть {@link Controls/_popup/Opener/Dialog/PopupOptions.typedef popupOptions диалогового окна}
          * * 'sticky' — смотреть {@link Controls/_popup/Opener/Sticky/PopupOptions.typedef popupOptions окна прилипающего блока}
          * @returns {undefined}
          * @example
          * * WML
          * <pre>
          *     <Controls.popup:Edit name="EditOpener">
          *        <ws:popupOptions template="Controls-demo/Popup/Edit/MyFormController">
          *           <ws:templateOptions source="{{_viewSource}}" />
          *        </ws:popupOptions>
          *     </Controls.popup:Edit>
          * </pre>
          * * JavaScript
          * <pre>
          * Control.extend({
          *    ...
          *    _itemClick(event, record) {
          *       var popupOptions = {
          *          closeOnOutsideClick: false,
          *       };
          *       this._children.EditOpener.open({record: record}, popupOptions);
          *    }
          * });
          * </pre>
          */
         /*
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
          * WML
          * <pre>
          *     <Controls.popup:Edit name="EditOpener">
          *        <ws:popupOptions template="Controls-demo/Popup/Edit/MyFormController">
          *           <ws:templateOptions source="{{_viewSource}}" />
          *        </ws:popupOptions>
          *     </Controls.popup:Edit>
          * </pre>
          * JavaScript
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
          * Закрывает всплывающее окно диалога редактирования.
          * @function Controls/_popup/Opener/Edit#close
          */
         /*
          * Close popup
          * @function Controls/_popup/Opener/Edit#close
          */
         close: function() {
            this._children.Opener.close();
            this._resultHandler = null;
         },

         /**
          * Возвращает информацию о том, открыто ли всплывающее окно.
          * @function Controls/_popup/Opener/Edit#isOpened
          */
         /*
          * Popup opened status
          * @function Controls/_popup/Opener/Edit#isOpened
          * @returns {Boolean} is popup opened
          */
         isOpened: function() {
            return this._children.Opener.isOpened();
         },
         /**
          * @typedef {Object} additionalData
          * @property {Boolean} isNewRecord Flag that determines what record is it.
          * @property {String} key Key of record
          */
         _onResult: function(data) {
            if (data && data.formControllerEvent) {
               /**
                * @event Controls/_popup/Opener/Edit#beforeItemEndEdit The event is called before the synchronization with the recordset.
                * @param {Vdom/Vdom:SyntheticEvent} eventObject The event descriptor.
                * @param {String} formControllerEvent Name of event from formController(update, create, delete)
                * @param {Object} record Data from formController
                * @param {additionalData} additionalData Additional data from formController
                */
               const eventResult = this._notify('beforeItemEndEdit', [data.formControllerEvent, data.record, data.additionalData || {}], { bubbling: true });
               if (eventResult !== Edit.CANCEL && this._options.items) {
                  _private.loadSynchronizer().addCallback((Synchronizer) => {
                     _private.synchronize(this, eventResult, data, Synchronizer);
                     if (data.formControllerEvent === 'update') {
                        // Если было создание, запоминаем ключ, чтобы при повторном сохранении знать, какую запись в реестре обновлять
                        if (data.additionalData.isNewRecord && !this._linkedKey) {
                           this._linkedKey = data.additionalData.key || data.record.getId();
                        }
                     }
                  });
               }
            } else {
               const args = Array.prototype.slice.call(arguments);
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
 * @description Закрыть окно редактирования.
 */
/**
 * @name Controls/_popup/Opener/Edit#close
 * @function
 * @description Close edit popup.
 */

/**
 * @name Controls/_popup/Opener/Edit#mode
 * @cfg {Object} Устанавливает режим отображения диалога редактирования.
 * @variant stack Отображение диалога в {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/openers/stack/ стековом окне}.
 * @variant dialog Отображение диалога в {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/openers/dialog/ диалоговом окне}.
 * @variant sticky Отображение диалога в {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/openers/sticky/ окне прилипающего блока}.
 */
/*
 * @name Controls/_popup/Opener/Edit#mode
 * @cfg {Object} Sets the display mode of the dialog.
 * @variant stack Open edit dialog in the stack panel.
 * @variant dialog Open edit dialog in the dialog popup.
 * @variant sticky Open edit dialog in the sticky popup.
 */

/**
 * @name Controls/_popup/Opener/Edit#items
 * @cfg {Object} Рекордсет для синхронизации с редактируемой записью.
 */
/*
 * @name Controls/_popup/Opener/Edit#items
 * @cfg {Object} RecordSet for synchronization with the editing record.
 */
