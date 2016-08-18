define('js!SBIS3.CONTROLS.DialogActionBase', ['js!SBIS3.CONTROLS.ActionBase', 'js!SBIS3.CORE.Dialog', 'js!SBIS3.CORE.FloatArea', 'js!WS.Data/Entity/Model', 'i18n!SBIS3.CONTROLS.DialogActionBase'], function(ActionBase, Dialog, FloatArea, Model){
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
   var OpenDialogAction = ActionBase.extend(/** @lends SBIS3.CONTROLS.DialogActionBase.prototype */{
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
            linkedObject: undefined
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
         _record: undefined,
         _showedLoading: false
      },
      /**
       * @typedef {Object} ExecuteMetaConfig
       * @property {DataSource} dataSource Источник данных, который будет установлен для диалога редактирования.
       * @property {String|Number} id Первичный ключ записи, которую нужно открыть на диалоге редактирования. Если свойство не задано, то нужно передать запись свойством record.
       * @property {Boolean} newModel Признак: true - в диалоге редактирования открыта новая запись, которой не существует в источнике данных.
       * @property {Object} filter Объект, данные которого будут использованы в качестве инициализирующих данных при создании новой записи.
       * Название свойства - это название поля записи, а значение свойства - это значение для инициализации.
       * @property {WS.Data/Entity/Record} record Редактируемая запись. Если передаётся ключ свойством key, то запись передавать необязательно.
       * @property {$ws.proto.Context} ctx Контекст, который нужно установить для диалога редактирования записи.
       */
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
         this._linkedModelKey = meta.id;
         //Производим корректировку идентификатора только в случае, когда идентификатор передан
         if (meta.hasOwnProperty('id')) {
            var newKey = this._getEditKey(meta.item);
            //Если передали ключ из getEditKey - значит FC будет работать с новой записью,
            //вычитанной по этому ключу
            //Выписал задачу в 374.120 для настройки типовых стратегий поведения
            //https://inside.tensor.ru/opendoc.html?guid=aaecfb86-59b9-4302-89be-09ba67d89cc7&description=
            if (newKey && newKey !== meta.id){
               meta.id = newKey;
            }
         }

         var self = this,
            config,
            compOptions = this._buildComponentConfig(meta);
         config = {
            opener: this,
            template: dialogComponent,
            componentOptions: compOptions
         };
         if (meta.title) {
            config.title = meta.title;
         }

         config.componentOptions.handlers = this._getFormControllerHandlers();

         config.handlers = {
            onAfterClose: function (e, meta) {
               self._dialog = undefined;
               // В виду того, что сейчас доступны две технологии работы с источником и сейчас не все перешли на новую - поддерживаем старую, забирая record из FloatArea
               // Выпилить по задаче: https://inside.tensor.ru/opendoc.html?guid=21a3feb5-6431-42f0-9136-edad2206ca83&description=
               self._notifyOnExecuted(meta, this._record || self._record);
               self._record = undefined;
            }
         };

         //делам загрузку компонента, только если в мете явно указали, что на прототипе в опциях есть данные об источнике данных
         if (meta.controllerSource && ( !config.componentOptions.record || meta.preloadRecord !== false )) {
            //Загружаем компонент, отнаследованный от formController'a, чтобы с его прототипа вычитать запись, которую мы прокинем при инициализации компонента
            //Сделано в рамках ускорения
            this._showLoadingIndicator();
            require([dialogComponent], this._initTemplateComponentCallback.bind(this, config, meta, mode));
         }
         else {
            this._showDialog(config, meta, mode);
         }
      },

      _initTemplateComponentCallback: function (config, meta, mode, templateComponent) {
         var self = this,
            def;
         var getRecordProtoMethod = templateComponent.prototype.getRecordFromSource;
         if (getRecordProtoMethod){
            def = getRecordProtoMethod.call(templateComponent.prototype, config.componentOptions);
            def.addCallback(function (record) {
               self._record = record;
               self._hideLoadingIndicator();
               config.componentOptions.record = record;
               if (def.isNewRecord)
                  config.componentOptions.isNewRecord = true;
               if (!config.componentOptions.key){
                  //Если не было ключа, то отработал метод "создать". Запоминаем ключ созданной записи
                  config.componentOptions.key = record.getId();
               }
               self._showDialog(config, meta, mode);
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
               $ws.single.Indicator.show();
            }
         }.bind(this), 750);
      },

      _hideLoadingIndicator: function(){
         this._showedLoading = false;
         $ws.single.Indicator.hide();
      },

      _showDialog: function(config, meta, mode){
         var self = this,
            templateComponent,
            currentRecord,
            floatAreaCfg,
            Component;
         mode = mode || this._options.mode;
         if (mode == 'floatArea'){
            Component = FloatArea;
            floatAreaCfg = this._getFloatAreaConfig(meta);
            $ws.core.merge(config, floatAreaCfg);
         } else if (mode == 'dialog') {
            Component = Dialog;
         }

         if (this._dialog && !this._dialog.isAutoHide()){
            templateComponent = this._dialog._getTemplateComponent();
            currentRecord = templateComponent.getRecord ? templateComponent.getRecord() : null; //Ярик говорит, что dialogActionBase используется не только для formController'a
            if (currentRecord && currentRecord.isChanged()){
               $ws.helpers.question(rk('Сохранить изменения?'), {opener: templateComponent}).addCallback(function(result){
                  if (result){
                     templateComponent.update({hideQuestion: true}).addCallback(function(){
                        self._setNewDialogConfig(config);
                     });
                  }
                  else {
                     self._setNewDialogConfig(config);
                  }
               });
            }
            else{
               this._setNewDialogConfig(config);
            }
         }
         else{
            this._dialog = new Component(config);
         }
      },
      _setNewDialogConfig: function(config){
         $ws.core.merge(this._dialog._options, config);
         this._dialog.reload();
      },
      _getFloatAreaConfig: function(meta){
         var defaultConfig = {
               isStack: true,
               autoHide: true,
               buildMarkupWithContext: false,
               showOnControlsReady: true,
               autoCloseOnHide: true,
               target: '',
               side: 'left',
               animation: 'slide'
            },
            floatAreaCfg = {};

         $ws.helpers.forEach(defaultConfig, function(value, prop){
            floatAreaCfg[prop] = meta[prop] !== undefined ? meta[prop] : defaultConfig[prop];
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
            this._createRecord(model);
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
         if ($ws.helpers.instanceOfMixin(collection, 'SBIS3.CONTROLS.MultiSelectable')) {
            collection.removeItemsSelection([collectionRecord.getId()]);
         }
         if ($ws.helpers.instanceOfModule(collection.getDataSet && collection.getDataSet(), 'WS.Data/Collection/RecordSet')) {
            collection = collection.getDataSet();
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
         if (eventResult !== OpenDialogAction.ACTION_CUSTOM) {
            methodResult  = this['_' + eventName].apply(this, args);
            actionResult = methodResult || eventResult;
         }
         if (actionResult === OpenDialogAction.ACTION_CUSTOM || !this._options.linkedObject) {
            return;
         }
         if (actionResult !== undefined){
            genericMethod = actionResult;
         }
         if (actionResult instanceof $ws.proto.Deferred){
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

      _createRecord: function(model, at){
         var collection = this._options.linkedObject,
            rec;
         at = at || 0;
         if ($ws.helpers.instanceOfModule(collection.getDataSet(), 'WS.Data/Collection/RecordSet')) {
            //Создаем новую модель, т.к. Record не знает, что такое первичный ключ - это добавляется на модели.
            rec = new Model({
               format: collection.getDataSet().getFormat(),
               idProperty: collection.getItems().getIdProperty(),
               adapter: collection.getItems().getAdapter()
            });
            this._mergeRecords(model, rec, true);
         } else  {
            rec = model.clone();
         }
         if ($ws.helpers.instanceOfMixin(collection, 'WS.Data/Collection/IList')) {
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
      _mergeRecords: function(model, colRec, newModel){
         var collectionRecord = colRec || this._getCollectionRecord(model),
            collectionData = this._getCollectionData(),
            recValue;
         if (!collectionRecord) {
            return;
         }

         if (newModel){
            collectionRecord.set(collectionData.getIdProperty(), model.getId().toString());
         }

         collectionRecord.each(function (key, value) {
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

         if (collectionData && $ws.helpers.instanceOfMixin(collectionData, 'WS.Data/Collection/IList') && $ws.helpers.instanceOfMixin(collectionData, 'WS.Data/Collection/IIndexedCollection')) {
            index = collectionData.getIndexByValue(collectionData.getIdProperty(), this._linkedModelKey || model.getId());
            return collectionData.at(index);
         }
         return undefined;
      },

      _getCollectionData:function(){
         var collection = this._options.linkedObject;
         if ($ws.helpers.instanceOfMixin(collection, 'SBIS3.CONTROLS.ItemsControlMixin')) {
            collection = collection.getItems();
         }
         return collection;
      },

      _buildComponentConfig: function() {
         return {}
      }
   });
   OpenDialogAction.ACTION_CUSTOM = 'custom';
   OpenDialogAction.ACTION_MERGE = '_mergeRecords';
   OpenDialogAction.ACTION_ADD = '_createRecord'; //что добавляем? сделал через create
   OpenDialogAction.ACTION_RELOAD = '_collectionReload';
   OpenDialogAction.ACTION_DELETE = '_destroyModel';
   return OpenDialogAction;
});