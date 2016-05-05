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
            onRead: this._actionHandler.bind(this),
            onUpdate: this._actionHandler.bind(this),
            onDestroy: this._actionHandler.bind(this),
            onCreate: this._actionHandler.bind(this)
         }
      },

      /**
       * Переопределяемый метод
       * В случае, если все действия выполняются самостоятельноно, надо вернуть OpenDialogAction.ACTION_CUSTOM, чтобы
       * не выполнялась базовая логика
       * @param record Запись, с которой работаем
       * @returns {String|Deferred} Сообщаем, нужно ли выполнять базовую логику. Если не нужно, то возвращаем OpenDialogAction.ACTION_CUSTOM
       */
      _onUpdate: function(record){
      },
      /**
       * Базовая логика при событии ouUpdate. Обновляем рекорд в связном списке
       */
      _update: function (record, isNewModel) {
         if (isNewModel){
            this._create(record);
         }
         else{
            this._mergeRecords(record);
         }
      },

      /**
       * Переопределяемый метод
       * В случае, если все действия выполняются самостоятельноно, надо вернуть OpenDialogAction.ACTION_CUSTOM, чтобы
       * не выполнялась базовая логика
       * @param record Запись, с которой работаем
       * @returns {String|Deferred} Сообщаем, нужно ли выполнять базовую логику. Если не нужно, то возвращаем OpenDialogAction.ACTION_CUSTOM
       */
      _onRead: function(record){
      },
      _read: function(record){
      },

      /**
       * Переопределяемый метод
       * В случае, если все действия выполняются самостоятельноно, надо вернуть OpenDialogAction.ACTION_CUSTOM, чтобы
       * не выполнялась базовая логика
       * @param record Запись, с которой работаем
       * @returns {String|Deferred} Сообщаем, нужно ли выполнять базовую логику. Если не нужно, то возвращаем OpenDialogAction.ACTION_CUSTOM
       */
      _onDestroy: function(record){
      },
      /**
       * Базовая логика при событии ouDestroy. Дестроим рекорд в связном списке
       */
      _destroy: function(record){
         var collectionRecord = this._getCollectionRecord(record),
            collection = this._options.linkedObject;
         if (!collectionRecord){
            return;
         }
         if ($ws.helpers.instanceOfMixin(collection, 'SBIS3.CONTROLS.Data.Collection.IList')) {
            collection.remove(collectionRecord);
         }
         else{
            collection.getDataSource().destroy(collectionRecord.getId());
         }
      },

      /**
       * Переопределяемый метод
       * В случае, если все действия выполняются самостоятельноно, надо вернуть OpenDialogAction.ACTION_CUSTOM, чтобы
       * не выполнялась базовая логика
       * @param record Запись, с которой работаем
       * @returns {String|Deferred} Сообщаем, нужно ли выполнять базовую логику. Если не нужно, то возвращаем OpenDialogAction.ACTION_CUSTOM
       */
      _onCreate: function(record){
      },
      /**
       * Базовая логика при событии ouCreate. Добавляем рекорд в связный список
       */
      _create: function(record, at){
         var collection = this._options.linkedObject,
            rec;
         at = at || 0;
         if ($ws.helpers.instanceOfModule(collection.getDataSet(), 'SBIS3.CONTROLS.Data.Collection.RecordSet')) {
            rec = new Record({
               format: collection.getDataSet().getFormat()
            });
            this._mergeRecords(record, rec);
         } else  {
            rec = record.clone();
         }
         if ($ws.helpers.instanceOfMixin(collection, 'SBIS3.CONTROLS.Data.Collection.IList')) {
            collection.add(rec, at);
         }
         else {
            collection.getItems().add(rec, at);
         }
      },

      /**
       * Обработка событий formController'a. Выполнение переопределяемых методов и notify событий.
       * Если из обработчиков событий и переопределяемых методов вернули не OpenDialogAction.ACTION_CUSTOM, то выполняем базовую логику.
       */
      _actionHandler: function(event, record) {
         var eventName = event.name,
            eventResult = this._notify(eventName, record),
            genericMethod = '_' + eventName.replace('on', '').toLowerCase(),
            self = this,
            baseActions = [OpenDialogAction.ACTION_CUSTOM, OpenDialogAction.ACTION_MERGE, OpenDialogAction.ACTION_ADD, OpenDialogAction.ACTION_RELOAD, OpenDialogAction.ACTION_DELETE],
            actionResult = eventResult,
            methodResult;
         if (eventResult !== OpenDialogAction.ACTION_CUSTOM) {
            methodResult  = this['_' + eventName](record);
            actionResult = methodResult || eventResult;
         }
         if (actionResult === OpenDialogAction.ACTION_CUSTOM || !this._options.linkedObject) {
            return;
         }
         if (actionResult !== undefined){
            genericMethod = actionResult;
         }
         Array.prototype.splice.call(arguments, 0, 1);
         if (actionResult instanceof $ws.proto.Deferred){
            actionResult.addCallback(function(result){
               if (self[genericMethod]){
                  self[genericMethod].apply(this, arguments);
               }
            })
         } else {
            if (this[genericMethod]){
               this[genericMethod].apply(this, arguments);
            }
         }
      },

      /**
       * Мержим поля из редактируемой записи в существующие поля записи из связного списка.
       */
      _mergeRecords: function(record, colRec){
         var collectionRecord = colRec || this._getCollectionRecord(record),
             recValue;
         if (!collectionRecord) {
            return;
         }
         collectionRecord.each(function (key, value) {
            recValue = record.get(key);
            if (record.has(key) && recValue != value) {
               this.set(key, recValue);
            }
         });
      },
      _collectionReload: function(){
         this._options.linkedObject.reload();
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
   OpenDialogAction.ACTION_CUSTOM = 'custom';
   OpenDialogAction.ACTION_MERGE = '_mergeRecords';
   OpenDialogAction.ACTION_ADD = '_create'; //что добавляем? сделал через create
   OpenDialogAction.ACTION_RELOAD = '_collectionReload';
   OpenDialogAction.ACTION_DELETE = '_destroy';
   return OpenDialogAction;
});