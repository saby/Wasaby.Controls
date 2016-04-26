define('js!SBIS3.CONTROLS.DialogActionBase', ['js!SBIS3.CONTROLS.ActionBase', 'js!SBIS3.CORE.Dialog', 'js!SBIS3.CORE.FloatArea', 'js!SBIS3.CONTROLS.Data.Record'], function(ActionBase, Dialog, FloatArea, Record){
   'use strict';

   /**
    * Действие открытия окна с заданным шаблоном
    * @class SBIS3.CONTROLS.DialogActionBase
    * @public
    * @extends SBIS3.CONTROLS.ActionBase
    * @author Крайнов Дмитрий Олегович
    *
    * @ignoreOptions validators independentContext contextRestriction extendedTooltip
    *
    * @ignoreMethods activateFirstControl activateLastControl addPendingOperation applyEmptyState applyState clearMark
    * @ignoreMethods changeControlTabIndex destroyChild detectNextActiveChildControl disableActiveCtrl findParent
    * @ignoreMethods focusCatch getActiveChildControl getChildControlById getChildControlByName getChildControls
    * @ignoreMethods getClassName getContext getEventBusOf getEventHandlers getEvents getExtendedTooltip getOpener
    * @ignoreMethods getImmediateChildControls getLinkedContext getNearestChildControlByName getOwner getOwnerId
    * @ignoreMethods getReadyDeferred getStateKey getTabindex getUserData getValue hasActiveChildControl hasChildControlByName
    * @ignoreMethods hasEventHandlers isActive isAllReady isDestroyed isMarked isReady makeOwnerName setOwner setSize
    * @ignoreMethods markControl moveFocus moveToTop once registerChildControl registerDefaultButton saveToContext
    * @ignoreMethods sendCommand setActive setChildActive setClassName setExtendedTooltip setOpener setStateKey activate
    * @ignoreMethods setTabindex setTooltip setUserData setValidators setValue storeActiveChild subscribe unregisterChildControl
    * @ignoreMethods unregisterDefaultButton unsubscribe validate waitAllPendingOperations waitChildControlById waitChildControlByName
    *
    * @ignoreEvents onActivate onAfterLoad onAfterShow onBeforeControlsLoad onBeforeLoad onBeforeShow onChange onClick
    * @ignoreEvents onFocusIn onFocusOut onKeyPressed onReady onResize onStateChanged onTooltipContentRequest
    */
   var OpenDialogAction = ActionBase.extend(/** @lends SBIS3.CONTROLS.DialogActionBase.prototype */{
      $protected : {
         _options : {
            /**
             * @cfg {String}
             * Компонент который будет отображен
             */
            dialogComponent : '',
            /**
             * @cfg {String}
             * @variant dialog в новом диалоге
             * @variant floatArea во всплывающей панели
             * Режим отображения компонента редактирования - в диалоге или панели
             */
            mode: 'dialog',
            //TODO переименовать
            linkedObject: undefined
         },
         _dialog: undefined,
         _formController: undefined
      },

      execute : function(meta) {
         this._opendEditComponent(meta, this._options.dialogComponent);
      },

      _openDialog: function(meta, dialogComponent){
         this._opendEditComponent(meta, dialogComponent, 'dialog');
      },

      _openFloatArea: function(meta, dialogComponent){
         this._opendEditComponent(meta, dialogComponent, 'floatArea');
      },

      _opendEditComponent: function(meta, dialogComponent, mode){
         var self = this,
            config, Component,

         compOptions = this._buildComponentConfig(meta);
         config = {
            opener: this,
            template: dialogComponent,
            componentOptions: compOptions
         };
         if (meta.title) {
            config.title = meta.title;
         }

         mode = mode || this._options.mode;
         if (mode == 'floatArea'){
            Component = FloatArea;
            config.isStack = meta.isStack !== undefined ? meta.isStack : true;
            config.autoHide = meta.autoHide !== undefined ? meta.autoHide : true;
            config.autoCloseOnHide = meta.autoCloseOnHide !== undefined ? meta.autoCloseOnHide : true;
         } else if (mode == 'dialog') {
            Component = Dialog;
         }

         //для формконтроллера теперь всегда есть контекст с рекордом. Сделано в рамках ускорения, чтобы в случае чего
         //компоненты на момент инициализации могли подцепить значение из контекста
         config.context = new $ws.proto.Context({restriction: 'set'}).setPrevious(this.getLinkedContext());
         config.context.setValue('record', config.record || new Record());

         if (this._dialog && !this._dialog.isAutoHide()){
            $ws.core.merge(this._dialog._options, config);
            this._dialog.reload();
            return;
         }

         config.componentOptions.handlers = this._getFormControllerHandlers();
         config.handlers = {
            onAfterClose: function (e, meta) {
               self._dialog = undefined;
               self._notifyOnExecuted(meta, this._record);
            },
            onBeforeShow: function () {
               self._formController = this._getTemplateComponent();
            }
         };

         this._dialog = new Component(config);
      },

      _getFormControllerHandlers: function(){
         return {
            onRead: this._readHandler.bind(this),
            onUpdate: this._updateHandler.bind(this),
            onDestroy: this._destroyHandler.bind(this),
            onCreate: this._createHandler.bind(this)
         }
      },

      _updateHandler: function(event, record){
         var actionResult = this._getEventResult('onUpdate'),
             self = this;

         if (actionResult instanceof $ws.proto.Deferred){
            actionResult.addCallback(function(result){
               self._update(record, result);
            })
         }
         else{
            this._update(record, actionResult);
         }
      },
      _onUpdate: function(record){
      },

      _update: function (record, result) {
         var collectionRecord,
             recValue;
         collectionRecord = this._getCollectionRecord(result);
         if (!collectionRecord) {
            return;
         }
         recValue = record.get(key);
         collectionRecord.each(function (key, value) {
            if (record.has(key) && recValue != value) {
               this.set(key, recValue);
            }
         });
      },

      _readHandler: function(event, record){
         var actionResult = this._getEventResult('onRead', record);
      },
      _onRead: function(record){
      },

      _destroyHandler: function(event, record){
         var actionResult = this._getEventResult('onDestroy', record),
            collectionRecord;

         collectionRecord = this._getCollectionRecord(actionResult);
         collectionRecord && collectionRecord.destroy();
      },
      _onDestroy: function(){
      },

      _createHandler: function(event, record){
         var actionResult = this._getEventResult('onCreate', record);
      },
      _onCreate: function(){
      },

      _getEventResult: function(eventName, record){
         var actionResult = this['_' + eventName](record),
             notifyResult = this._notify(eventName, record);
         //TODO что мы в итоге ждем в ответе, сейчас с deferred'ами отвалится
         if (actionResult !== OpenDialogAction.ACTION_MANUAL && notifyResult !== undefined){
            actionResult = notifyResult;
         }
         return actionResult;
      },

      _getCollectionRecord: function(actionResult){
         var collection = this._options.linkedObject;
         if (actionResult === OpenDialogAction.ACTION_MANUAL){
            return undefined;
         }
         if ($ws.helpers.instanceOfMixin(collection, 'SBIS3.CONTROLS.DSMixin')) {
            collection = this.getItems();
         }
         if ($ws.helpers.instanceOfMixin(collection, 'SBIS3.CONTROLS.Data.Collection.IList') && $ws.helpers.instanceOfMixin(collection, 'SBIS3.CONTROLS.Data.Collection.IIndexedCollection')) {
            return collection.getIndexByValue(record.getIdProperty(), record.getId());
         }
         return undefined;
      },

      _buildComponentConfig: function() {
         return {}
      }
   });
   OpenDialogAction.ACTION_MANUAL = 'manual';
   OpenDialogAction.ACTION_BASE = 'base';
   return OpenDialogAction;
});