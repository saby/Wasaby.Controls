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
            /**
             * @cfg {Object}
             * Связный список, который надо обновлять после изменения записи
             * Список должен быть с примесью миксинов для работы с однотипными элементами (DSMixin или IList)
             */
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

      /**
       * Возвращает обработчики на события formController'a
       */
      _getFormControllerHandlers: function(){
         return {
            onRead: this._readHandler.bind(this),
            onUpdate: this._updateHandler.bind(this),
            onDestroy: this._destroyHandler.bind(this),
            onCreate: this._createHandler.bind(this)
         }
      },

      /**
       * Обрабатываем событие onUpdate у formController'a
       */
      _updateHandler: function(event, record){
         this._actionHandler('Update', record);
      },
      /**
       * Переопределяемый метод
       * В случае, если все действия выполняются самостоятельноно, надо вернуть OpenDialogAction.ACTION_MANUAL, чтобы
       * не выполнялась базовая логика
       * @param record Запись, с которой работаем
       * @returns {String|Deferred} Сообщаем, нужно ли выполнять базовую логику. Если не нужно, то возвращаем OpenDialogAction.ACTION_MANUAL
       */
      _onUpdate: function(record){
         return '';
      },
      /**
       * Базовая логика при событии ouUpdate. Обновляем рекорд в связном списке
       */
      _Update: function (record, result) {
         var collectionRecord,
             recValue;
         collectionRecord = this._getCollectionRecord(record);
         if (!collectionRecord) {
            return;
         }
         this._mergeRecords(collectionRecord, record);
      },

      /**
       * Обрабатываем событие onRead у formController'a
       */
      _readHandler: function(event, record){
         this._actionHandler('Read', record);
      },
      /**
       * Переопределяемый метод
       * В случае, если все действия выполняются самостоятельноно, надо вернуть OpenDialogAction.ACTION_MANUAL, чтобы
       * не выполнялась базовая логика
       * @param record Запись, с которой работаем
       * @returns {String|Deferred} Сообщаем, нужно ли выполнять базовую логику. Если не нужно, то возвращаем OpenDialogAction.ACTION_MANUAL
       */
      _onRead: function(record){
         return '';
      },

      /**
       * Обрабатываем событие onDestroy у formController'a
       */
      _destroyHandler: function(event, record){
         this._actionHandler('Destroy', record);
      },
      /**
       * Переопределяемый метод
       * В случае, если все действия выполняются самостоятельноно, надо вернуть OpenDialogAction.ACTION_MANUAL, чтобы
       * не выполнялась базовая логика
       * @param record Запись, с которой работаем
       * @returns {String|Deferred} Сообщаем, нужно ли выполнять базовую логику. Если не нужно, то возвращаем OpenDialogAction.ACTION_MANUAL
       */
      _onDestroy: function(record){
         return '';
      },
      /**
       * Базовая логика при событии ouDestroy. Дестроим рекорд в связном списке
       */
      _Destroy: function(record, result){
         var collectionRecord = this._getCollectionRecord(record);
         collectionRecord && collectionRecord.destroy();
      },

      /**
       * Обрабатываем событие onCreate у formController'a
       */
      _createHandler: function(event, record){
         this._actionHandler('Create', record);
      },
      /**
       * Переопределяемый метод
       * В случае, если все действия выполняются самостоятельноно, надо вернуть OpenDialogAction.ACTION_MANUAL, чтобы
       * не выполнялась базовая логика
       * @param record Запись, с которой работаем
       * @returns {String|Deferred} Сообщаем, нужно ли выполнять базовую логику. Если не нужно, то возвращаем OpenDialogAction.ACTION_MANUAL
       */
      _onCreate: function(record){
         return '';
      },
      /**
       * Базовая логика при событии ouCreate. Добавляем рекорд в связный список
       */
      _Create: function(record, result){
         var collection = this._options.linkedObject,
            rec;
         if ($ws.helpers.instanceOfModule(collection, 'SBIS3.CONTROLS.Data.Collection.RecordSet')) {
            rec = new Record({
               format: collection.getFormat()
            });
            this._mergeRecords(rec, record);
         } else  {
            rec = record.clone()
         }
         collection.add(rec);
      },

      /**
       * Обработка событий formController'a. Выполнение переопределяемых методов и notify событий.
       * Если из обработчиков событий и переопределяемых методов вернули не OpenDialogAction.ACTION_MANUAL, то выполняем базовую логику.
       */
      _actionHandler: function(action, record) {
         var eventResult = this._notify('on' + action, record),
            actionResult = this['_on' + action](record),
            genericMethod = '_' + action,
            self = this;
         if (actionResult !== OpenDialogAction.ACTION_MANUAL && eventResult !== undefined) {
            actionResult = eventResult;
         }
         if (actionResult === OpenDialogAction.ACTION_MANUAL || !this._options.linkedObject) {
            return;
         }
         if (actionResult instanceof $ws.proto.Deferred){
            actionResult.addCallback(function(result){
               if (self[genericMethod]){
                  self[genericMethod](record, result);
               }
            })
         } else {
            if (this[genericMethod]){
               this[genericMethod](record, actionResult);
            }
         }
      },

      /**
       * Мержим поля из редактируемой записи в существующие поля записи из связного списка.
       */
      _mergeRecords: function(collectionRecord, record){
         var recValue;
         collectionRecord.each(function (key, value) {
            recValue = record.get(key);
            if (record.has(key) && recValue != value) {
               this.set(key, recValue);
            }
         });
      },
      /**
       * Получаем запись из связного списка по ключу редактируемой записи
       */
      _getCollectionRecord: function(record){
         var collection = this._options.linkedObject;
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