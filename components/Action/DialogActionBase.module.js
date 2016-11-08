define('js!SBIS3.CONTROLS.DialogActionBase', [
   "Core/Indicator",
   "Core/core-merge",
   "Core/Deferred",
   "Core/helpers/fast-control-helpers",
   "Core/helpers/collection-helpers",
   "Core/core-instance",
   "Core/IoC",
   "js!SBIS3.CONTROLS.ActionBase",
   "js!SBIS3.CORE.Dialog",
   "js!SBIS3.CORE.FloatArea",
   "js!WS.Data/Entity/Record",
   "js!SBIS3.CONTROLS.Utils.InformationPopupManager",
   "js!WS.Data/Di",
   "i18n!SBIS3.CONTROLS.DialogActionBase"
], function(cIndicator, cMerge, Deferred, fcHelpers, colHelpers, cInstance, IoC, ActionBase, Dialog, FloatArea, Record, InformationPopupManager, Di){
   'use strict';

   /**
    * Класс, который описывает действие открытия окна с заданным шаблоном.
    * @class SBIS3.CONTROLS.DialogActionBase
    * @public
    * @extends SBIS3.CONTROLS.ActionBase
    * @author Крайнов Дмитрий Олегович
    *
    * @ignoreOptions validators independentContext contextRestriction extendedTooltip
    * @ignoreOptions visible tooltip tabindex enabled className alwaysShowExtendedTooltip allowChangeEnable
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
    * @ignoreMethods setVisible toggle show isVisible hide getTooltip isAllowChangeEnable isEnabled isVisibleWithParents
    *
    * @ignoreEvents onActivate onAfterLoad onAfterShow onBeforeControlsLoad onBeforeLoad onBeforeShow onChange onClick
    * @ignoreEvents onFocusIn onFocusOut onKeyPressed onReady onResize onStateChanged onTooltipContentRequest
    * @ignoreEvents onDragIn onDragMove onDragOut onDragStart onDragStop
    */
   var DialogActionBase = ActionBase.extend(/** @lends SBIS3.CONTROLS.DialogActionBase.prototype */{
      $protected : {
         _options : {
            /**
             * @cfg {String} Устанавливает компонент, который будет использован в качестве диалога редактирования записи.
             * @remark
             * Компонент должен быть наследником класса {@link SBIS3.CONTROLS.FormController}.
             * Подробнее о создании таких компонентов вы можете прочитать в разделе <a href="https://wi.sbis.ru/doc/platform/developmentapl/interfacedev/components/list/list-settings/records-editing/editing-dialog/component/">Создание компонента для диалога редактирования</a>.
             * Режим отображения диалога редактирования устанавливают с помощью опции {@link mode}.
             * @see mode
             */
            dialogComponent : '',
            /**
             * @cfg {String} Устанавливает режим открытия диалога редактирования компонента.
             * @variant dialog Открытие производится в новом диалоговом окне.
             * @variant floatArea Открытие производится на всплывающей панели.
             * @remark
             * Диалог редактирования устанавливают с помощью опции {@link dialogComponent}.
             * @see dialogComponent
             */
            mode: 'dialog',
            /**
             * @cfg {*} Устанавливает связанный список, для которого будет открываться диалог редактирования записей.
             * @remark
             * Список должен быть с примесью миксинов ({@link SBIS3.CONTROLS.DSMixin} или {@link WS.Data/Collection/IList}) для работы с однотипными элементами.
             * Подробнее о базовых платформенных списках вы можете прочитать в разделе <a href="https://wi.sbis.ru/doc/platform/developmentapl/interfacedev/components/list/list-settings/list-types/">Виды списков</a>.
             */
            linkedObject: undefined,
            /**
             * @cfg {String} Устанавливает поведение для чтения записи и её установки в контекст диалога редактирования.
             * Подробнее о данной опции можно прочитать по <a href='https://wi.sbis.ru/doc/platform/developmentapl/interfacedev/components/list/list-settings/records-editing/editing-dialog/strategy/'>ссылке</a>
             * @variant local
             * @variant remote
             * @variant delayedRemote
             */
            initializingWay: 'remote'
         },
         _dialog: undefined,
         /**
          * Ключ модели из связного списка
          * Отдельно храним ключ для модели из связного списка, т.к. он может не совпадать с ключом редактируемой модели
          * К примеру в реестре задач ключ записи в реестре и ключ редактируемой записи различается, т.к. одна и та же задача может находиться в нескольких различных фазах
          */
         _linkedModelKey: undefined,
         /**
          * @var {WS.Data/Entity/Model} Запись которая пришла на редктирование, из метода прочитать или создать
          */
         _showedLoading: false
      },
      /**
       * @typedef {Object} ExecuteMetaConfig
       * @property {String|Number} id Первичный ключ записи, которую нужно открыть на диалоге редактирования. Если свойство не задано, то нужно передать запись свойством record.
       * @property {Object} filter Объект, данные которого будут использованы в качестве инициализирующих данных при создании новой записи.
       * Название свойства - это название поля записи, а значение свойства - это значение для инициализации.
       * @property {WS.Data/Entity/Record} item Редактируемая запись. Если передаётся ключ свойством id, то запись передавать необязательно.
       * @property {String} initializingWay Устанавливает поведение для чтения записи и её установки в контекст диалога редактирования. {@link initializingWay}
       * @property {Object} componentOptions Пользовательские опции, передаваемые в диалог редактирования
       * @property {Object} dialogOptions Опции, передаваемые в диалог {@link mode}
       * Свойства, которые можно указать для диалога:
       * <ul>
       *    <li><b>isStack</b> - по умолчанию true</li>
       *    <li><b>autoHide</b> - по умолчанию true</li>
       *    <li><b>buildMarkupWithContext</b> - по умолчанию true</li>
       *    <li><b>showOnControlsReady</b> - по умолчанию false</li>
       *    <li><b>autoCloseOnHide</b> - по умолчанию true</li>
       *    <li><b>border</b> - по умолчанию true</li>
       *    <li><b>target</b> - по умолчанию ''</li>
       *    <li><b>title</b> - по умолчанию ''</li>
       *    <li><b>side</b> - по умолчанию 'left'</li>
       *    <li><b>animation</b> - по умолчанию 'slide'</li>
       * </ul>
       */
      $constructor: function() {
         this._publish('onAfterShow', 'onBeforeShow', 'onExecuted', 'onReadModel', 'onUpdateModel', 'onDestroyModel', 'onCreateModel');
      },

      /**
       * Установить компонент, который будет использован в качестве диалога редактирования записи.
       * @param dialogComponent компонент, который будет использован в качестве диалога редактирования записи. {@link dialogComponent}.
       */
      setDialogComponent: function(dialogComponent){
         this._options.dialogComponent = dialogComponent;
      },
      /**
       * Установить режим открытия диалога редактирования компонента.
       * @param {String} mode режим открытия диалога редактирования компонента {@link mode}.
       */
      setMode: function(mode){
         this._options.mode = mode;
      },
      /**
       * Открывает диалог редактирования записи.
       * @param {ExecuteMetaConfig} meta Параметры, которые будут использованы для конфигурации диалога редактирования.
       * @example
       * Произведём открытие диалога с предустановленными полями для создаваемой папки:
       * <pre>
       * myAddFolderButton.subscribe('onActivated', function() { // Создаём обработчик нажатия кнопки
       *    myDialogAction.execute({ // Инициируем вызов диалога для создания новой папки
       *       filter: {
       *          'Раздел': null, // Поле иерархии, папка создаётся в корне иерархической структуры
       *          'Раздел@': true // Признак папки в иерархической структуре
       *       }
       *    });
       * });
       *
       */
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
         if (this._isNeedToRedrawDialog()){
            this._saveRecord(meta, dialogComponent, mode)
         }
         else{
            this._setConfig(meta, dialogComponent, mode);
         }
      },

      _saveRecord: function(meta, dialogComponent, mode){
         var args = arguments,
             self = this,
             templateComponent,
             currentRecord;

         templateComponent = this._dialog._getTemplateComponent();
         currentRecord = (templateComponent && templateComponent.getRecord) ? templateComponent.getRecord() : null; //Ярик говорит, что dialogActionBase используется не только для formController'a
         if (currentRecord && currentRecord.isChanged()){
            fcHelpers.question(rk('Сохранить изменения?'), {opener: templateComponent}).addCallback(function(result){
               if (result === true){
                  templateComponent.update({hideQuestion: true}).addCallback(function(){
                     self._setConfig.apply(self, args);
                  });
               }
               else {
                  self._setConfig.apply(self, args);
               }
            });
         }
         else{
            self._setConfig.apply(self, args);
         }
      },

      _setConfig: function(meta, dialogComponent, mode){
         this._linkedModelKey = meta.id;
         //Производим корректировку идентификатора только в случае, когда идентификатор передан
         if (meta.hasOwnProperty('id')) {
            //Если передали ключ из getEditKey - значит FC будет работать с новой записью,
            //вычитанной по этому ключу
            meta.id = this._getEditKey(meta.item) || meta.id;
         }

         var config,
             self = this,
             compOptions = this._buildComponentConfig(meta),
             initializingWay = compOptions.initializingWay;

         config = {
            opener: this,
            template: dialogComponent,
            componentOptions: compOptions,
            handlers: {
               onAfterClose: function(e, meta){
                  self._notifyOnExecuted(meta, this._record);
                  self._dialog = undefined;
               },
               onBeforeShow: function(){
                  self._notify('onBeforeShow');
               },
               onAfterShow: function(){
                  self._notify('onAfterShow');
               }
            }
         };

         //TODO Выпилить в 200+
         if (meta.controllerSource){
            initializingWay = DialogActionBase.INITIALIZING_WAY_REMOTE;
            IoC.resolve('ILogger').error('SBIS3.CONTROLS.OpenDialogAction', 'meta.controllerSource is no longer available since version 3.7.4.200. Use option initializingWay = OpenDialogAction.INITIALIZING_WAY_REMOTE instead.');
         }

         if (initializingWay == DialogActionBase.INITIALIZING_WAY_REMOTE) {
            this._showLoadingIndicator();
            require([dialogComponent], this._initTemplateComponentCallback.bind(this, config, meta, mode));
         }
         else if (initializingWay == DialogActionBase.INITIALIZING_WAY_DELAYED_REMOTE){
            this._showLoadingIndicator();
            require([dialogComponent], this._getRecordDeferred.bind(this, config, meta, mode));
         }
         else {
            this._showDialog(config, meta, mode);
         }
      },

      _getRecordDeferred: function(config, meta, mode, templateComponent){
         var getRecordProtoMethod = templateComponent.prototype.getRecordFromSource,
             def = getRecordProtoMethod.call(templateComponent.prototype, config.componentOptions);
         this._hideLoadingIndicator();
         //TODO Условие в рамках совместимости. убрать как все перейдут на установку dataSource с опций
         if (!cInstance.instanceOfModule(def, 'Core/Deferred')){
            this._showDialog(config, meta, mode);
            return;
         }
         config.componentOptions._receiptRecordDeferred = def;
         this._showDialog(config, meta, mode);
      },

      _initTemplateComponentCallback: function (config, meta, mode, templateComponent) {
         var self = this,
             isNewRecord = (meta.isNewRecord !== undefined) ? meta.isNewRecord : !config.componentOptions.key,
             def;
         var getRecordProtoMethod = templateComponent.prototype.getRecordFromSource;
         if (getRecordProtoMethod){
            def = getRecordProtoMethod.call(templateComponent.prototype, config.componentOptions);

            //TODO Условие в рамках совместимости. убрать как все перейдут на установку dataSource с опций
            if (!cInstance.instanceOfModule(def, 'Core/Deferred')){
               self._hideLoadingIndicator();
               self._showDialog(config, meta, mode);
               return;
            }

            def.addCallback(function (record) {
               config.componentOptions.record = record;
               config.componentOptions.isNewRecord = isNewRecord;
               if (isNewRecord){
                  config.componentOptions.key = record.getId();
               }
               self._showDialog(config, meta, mode);
            }).addErrback(function(error){
               InformationPopupManager.showMessageDialog({
                  message: error.message,
                  status: 'error'
               })
            }).addBoth(function(){
               self._hideLoadingIndicator();
            });
         }
         else{
            self._showDialog(config, meta, mode);
         }
      },

      _showLoadingIndicator: function(){
         this._showedLoading = true;
         window.setTimeout(function(){
            if (this._showedLoading){
               cIndicator.setMessage('Загрузка...'); //setMessage зовет show у loadingIndicator
            }
         }.bind(this), 750);
      },

      _hideLoadingIndicator: function(){
         this._showedLoading = false;
         cIndicator.hide();
      },

      _showDialog: function(config, meta, mode){
         var Component;

         cMerge(config, this._getDialogConfig(meta));
         mode = mode || this._options.mode;
         Component = (mode == 'floatArea') ? FloatArea : Dialog;

         if (this._isNeedToRedrawDialog()){
            this._setNewDialogConfig(config);
         }
         else{
            this._dialog = new Component(config);
         }
      },
      _isNeedToRedrawDialog: function(){
        return this._dialog && !this._dialog.isDestroyed() && !this._dialog.isAutoHide();
      },
      _setNewDialogConfig: function(config){
         cMerge(this._dialog._options, config);
         this._dialog.reload();
      },
      _getDialogConfig: function(meta){
         var defaultConfig = {
               isStack: true,
               autoHide: true,
               buildMarkupWithContext: true,
               showOnControlsReady: false,
               autoCloseOnHide: true,
               border: true,
               target: '',
               title: '',
               side: 'left',
               animation: 'slide'
            },
            floatAreaCfg = {};
         if (!meta.dialogOptions){
            meta.dialogOptions = {};
         }

         colHelpers.forEach(defaultConfig, function(defaultValue, key){
            if (meta.hasOwnProperty(key)){
               IoC.resolve('ILogger').log('OpenDialogAction', 'Опция ' + key + ' для диалога редактирования должна задаваться через meta.dialogOptions');
               floatAreaCfg[key] = meta[key];
            }
            else {
               floatAreaCfg[key] = (meta.dialogOptions[key] !== undefined) ? meta.dialogOptions[key] : defaultValue;
            }
         });

         return floatAreaCfg;
      },

      /**
       * Устанавливает связанный список, для которого будет открываться диалог редактирования записей.
       * @param linkedObject связанный список
       */
      setLinkedObject: function(linkedObject){
         this._options.linkedObject = linkedObject;
      },

      /**
       * Должен вернуть ключ записи, которую редактируем в диалоге
       */
      _getEditKey: function(item){
      },

      /**
       * Возвращает обработчики на события formController'a
       */
      _getFormControllerHandlers: function(){
         return {
            onReadModel: this._actionHandler.bind(this),
            onUpdateModel: this._actionHandler.bind(this),
            onDestroyModel: this._actionHandler.bind(this),
            onCreateModel: this._actionHandler.bind(this)
         }
      },

      /**
       * Переопределяемый метод
       * В случае, если все действия выполняются самостоятельноно, надо вернуть OpenDialogAction.ACTION_CUSTOM, чтобы
       * не выполнялась базовая логика
       * @param model Запись, с которой работаем
       * @returns {String|Deferred} Сообщаем, нужно ли выполнять базовую логику. Если не нужно, то возвращаем OpenDialogAction.ACTION_CUSTOM
       */
      _onUpdateModel: function(model){
      },
      /**
       * Базовая логика при событии ouUpdate. Обновляем рекорд в связном списке
       */
      _updateModel: function (model, additionalData) {
         if (additionalData && additionalData.isNewRecord){
            this._createRecord(model, 0, additionalData);
         }
         else{
            this._mergeRecords(model);
         }
      },

      /**
       * Переопределяемый метод
       * В случае, если все действия выполняются самостоятельноно, надо вернуть OpenDialogAction.ACTION_CUSTOM, чтобы
       * не выполнялась базовая логика
       * @param model Запись, с которой работаем
       * @returns {String|Deferred} Сообщаем, нужно ли выполнять базовую логику. Если не нужно, то возвращаем OpenDialogAction.ACTION_CUSTOM
       */
      _onReadModel: function(model){
      },
      _readModel: function(model){
      },

      /**
       * Переопределяемый метод
       * В случае, если все действия выполняются самостоятельноно, надо вернуть OpenDialogAction.ACTION_CUSTOM, чтобы
       * не выполнялась базовая логика
       * @param model Запись, с которой работаем
       * @returns {String|Deferred} Сообщаем, нужно ли выполнять базовую логику. Если не нужно, то возвращаем OpenDialogAction.ACTION_CUSTOM
       */
      _onDestroyModel: function(model){
      },
      /**
       * Базовая логика при событии ouDestroy. Дестроим рекорд в связном списке
       */
      _destroyModel: function(model){
         var collectionRecord = this._getCollectionRecord(model),
            collection = this._options.linkedObject;
         if (!collectionRecord){
            return;
         }
         //Уберём удаляемый элемент из массива выбранных у контрола, являющегося linkedObject.
         if (cInstance.instanceOfMixin(collection, 'SBIS3.CONTROLS.MultiSelectable')) {
            collection.removeItemsSelection([collectionRecord.getId()]);
         }
         if (cInstance.instanceOfModule(collection.getItems && collection.getItems(), 'WS.Data/Collection/RecordSet')) {
            collection = collection.getItems();
         }
         collection.remove(collectionRecord);
      },

      /**
       * Переопределяемый метод
       * В случае, если все действия выполняются самостоятельноно, надо вернуть OpenDialogAction.ACTION_CUSTOM, чтобы
       * не выполнялась базовая логика
       * @param model Запись, с которой работаем
       * @returns {String|Deferred} Сообщаем, нужно ли выполнять базовую логику. Если не нужно, то возвращаем OpenDialogAction.ACTION_CUSTOM
       */
      _onCreateModel: function(model){
      },
      /**
       * Обработка событий formController'a. Выполнение переопределяемых методов и notify событий.
       * Если из обработчиков событий и переопределяемых методов вернули не OpenDialogAction.ACTION_CUSTOM, то выполняем базовую логику.
       */
      _actionHandler: function(event, model) {
         var eventName = event.name,
            genericMethods = {
               onDestroyModel: '_destroyModel',
               onUpdateModel : '_updateModel',
               onReadModel: '_readModel'
            },
            args = Array.prototype.slice.call(arguments, 0),
            self = this,
            eventResult,
            actionResult,
            methodResult,
            genericMethod;

         args.splice(0, 1); //Обрежем первый аргумент типа EventObject, его не нужно прокидывать в события и переопределяемый метод
         eventResult = actionResult = this._notify.apply(this, [eventName].concat(args));

         genericMethod = genericMethods[eventName];
         if (eventResult !== DialogActionBase.ACTION_CUSTOM) {
            methodResult  = this['_' + eventName].apply(this, args);
            actionResult = methodResult || eventResult;
         }
         if (actionResult === DialogActionBase.ACTION_CUSTOM || !this._options.linkedObject) {
            return;
         }
         if (actionResult !== undefined){
            genericMethod = actionResult;
         }
         if (actionResult instanceof Deferred){
            actionResult.addCallback(function(result){
               if (self[genericMethod]){
                  self[genericMethod].apply(this, args);
               }
            })
         } else {
            if (this[genericMethod]){
               this[genericMethod].apply(this, args);
            }
         }
      },

      _createRecord: function(model, at, additionalData){
         var collection = this._options.linkedObject,
            rec;
         at = at || 0;
         if (cInstance.instanceOfModule(collection.getItems(), 'WS.Data/Collection/RecordSet')) {
             //Создаем новую модель, т.к. Record не знает, что такое первичный ключ - это добавляется на модели.
            rec = Di.resolve(collection.getItems().getModel(), {
               adapter: collection.getItems().getAdapter(),
               format: collection.getItems().getFormat(),
               idProperty: collection.getItems().getIdProperty()
            });
            this._mergeRecords(model, rec, additionalData);
         } else  {
            rec = model.clone();
         }
         if (cInstance.instanceOfMixin(collection, 'WS.Data/Collection/IList')) {
            collection.add(rec, at);
         }
         else {
            if (collection.getItems()){
               collection.getItems().add(rec, at);
            }
            else{
               if (collection.isLoading()){
                  collection.once('onItemsReady', function(){
                     this.getItems().add(rec, at);
                  });
               }
               else{
                  collection.setItems([rec]);
               }
            }
         }
      },

      /**
       * Мержим поля из редактируемой записи в существующие поля записи из связного списка.
       */
      _mergeRecords: function(model, colRec, additionalData){
         var collectionRecord = colRec || this._getCollectionRecord(model),
            collectionData = this._getCollectionData(),
            recValue;
         if (!collectionRecord) {
            return;
         }

         if (additionalData && additionalData.isNewRecord){
            collectionRecord.set(collectionData.getIdProperty(), additionalData.key);
         }

         Record.prototype.each.call(collectionRecord, function (key, value) {
            recValue = model.get(key);
            if (model.has(key) && recValue != value && key !== model.getIdProperty()) {
               //Нет возможности узнать отсюда, есть ли у свойства сеттер или нет
               try {
                  this.set(key, recValue);
               } catch (e) {
                  if (!(e instanceof ReferenceError)) {
                     throw e;
                  }
               }
            }
         });
      },
      _collectionReload: function(){
         this._options.linkedObject.reload();
      },
      /**
       * Получаем запись из связного списка по ключу редактируемой записи
       */
      _getCollectionRecord: function(model){
         var collectionData = this._getCollectionData(),
            index;

         if (collectionData && cInstance.instanceOfMixin(collectionData, 'WS.Data/Collection/IList') && cInstance.instanceOfMixin(collectionData, 'WS.Data/Collection/IIndexedCollection')) {
            index = collectionData.getIndexByValue(collectionData.getIdProperty(), this._linkedModelKey || model.getId());
            return collectionData.at(index);
         }
         return undefined;
      },

      _getCollectionData:function(){
         var collection = this._options.linkedObject;
         if (cInstance.instanceOfMixin(collection, 'SBIS3.CONTROLS.ItemsControlMixin')) {
            collection = collection.getItems();
         }
         return collection;
      }
   });

   DialogActionBase.ACTION_CUSTOM = 'custom';
   DialogActionBase.ACTION_MERGE = '_mergeRecords';
   DialogActionBase.ACTION_ADD = '_createRecord';
   DialogActionBase.ACTION_RELOAD = '_collectionReload';
   DialogActionBase.ACTION_DELETE = '_destroyModel';
   DialogActionBase.INITIALIZING_WAY_LOCAL = 'local';
   DialogActionBase.INITIALIZING_WAY_REMOTE = 'remote';
   DialogActionBase.INITIALIZING_WAY_DELAYED_REMOTE = 'delayedRemote';

   return DialogActionBase;
});