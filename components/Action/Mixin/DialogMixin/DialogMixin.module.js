/*global define, $ws*/
define('js!SBIS3.CONTROLS.Action.DialognMixin', [
   'js!SBIS3.CONTROLS.ActionBase',
   'js!SBIS3.CORE.Dialog',
   'js!SBIS3.CORE.FloatArea',
   'js!SBIS3.CONTROLS.Data.Model',
   'js!SBIS3.CONTROLS.Data.Utils'
], function(ActionBase, Dialog, FloatArea, Model, Utils){
   'use strict';

   /**
    * Действие открытия окна с заданным шаблоном
    * @mixin  SBIS3.CONTROLS.Action.DialognMixin
    * @public
    * @author Крайнов Дмитрий Олегович
    */
   var DialognMixin = /** @lends SBIS3.CONTROLS.Action.DialognMixin.prototype */{
      $protected : {
         _options : {
            /**
             * @deprecated используйте template
             * @cfg {String} Устанавливает компонент, который будет использован в качестве диалога редактирования записи.
             * @see template
             */
            dialogComponent: '',
            /**
             * @cfg {String} Устанавливает компонент, который будет использован в качестве диалога редактирования записи.
             * @remark
             * Компонент должен быть наследником класса {@link SBIS3.CONTROLS.FormController}.
             * Подробнее о создании таких компонентов вы можете прочитать в разделе <a href="https://wi.sbis.ru/doc/platform/developmentapl/interfacedev/components/list/list-settings/records-editing/editing-dialog/component/">Создание компонента для диалога редактирования</a>.
             * Режим отображения диалога редактирования устанавливают с помощью опции {@link mode}.
             * @see mode
             */
            template : '',
            /**
             * @cfg {String} Устанавливает режим открытия диалога редактирования компонента.
             * @variant dialog Открытие производится в новом диалоговом окне.
             * @variant floatArea Открытие производится на всплывающей панели.
             * @remark
             * Диалог редактирования устанавливают с помощью опции {@link template}.
             * @see template
             */
            mode: 'dialog'

         },
         _dialog: undefined,
         /**
          * Ключ модели из связного списка
          * Отдельно храним ключ для модели из связного списка, т.к. он может не совпадать с ключом редактируемой модели
          * К примеру в реестре задач ключ записи в реестре и ключ редактируемой записи различается, т.к. одна и та же задача может находиться в нескольких различных фазах
          */
         _linkedModelKey: undefined,
      },
      /**
       * @typedef {Object} ExecuteMetaConfig
       * @property {DataSource} dataSource Источник данных, который будет установлен для диалога редактирования.
       * @property {String|Number} id Первичный ключ записи, которую нужно открыть на диалоге редактирования. Если свойство не задано, то нужно передать запись свойством record.
       * @property {Boolean} newModel Признак: true - в диалоге редактирования открыта новая запись, которой не существует в источнике данных.
       * @property {Object} filter Объект, данные которого будут использованы в качестве инициализирующих данных при создании новой записи.
       * Название свойства - это название поля записи, а значение свойства - это значение для инициализации.
       * @property {SBIS3.CONTROLS.Data.Model} record Редактируемая запись. Если передаётся ключ свойством key, то запись передавать необязательно.
       * @property {$ws.proto.Context} ctx Контекст, который нужно установить для диалога редактирования записи.
       */
      $constructor: function() {

         if ( this._options.dialogComponent && !this._options.template) {
            Utils.logger.stack(this._moduleName + '::$constructor(): option "dialogComponent" is deprecated and will be removed in 3.8.0', 1);
            this._options.template = this._options.dialogComponent;
         }

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
      _doExecute: function(meta) {
         return this._opendEditComponent(meta, this._options.template);
      },
      _openDialog: function(meta, template) {
         this._opendEditComponent(meta, template, 'dialog');
      },
      _openFloatArea: function(meta, template) {
         this._opendEditComponent(meta, template, 'floatArea');
      },
      _opendEditComponent: function(meta, template, mode) {
         this._linkedModelKey = meta.id;
         //Производим корректировку идентификатора только в случае, когда идентификатор передан
         if (meta.hasOwnProperty('id')) {
            meta.id = this._getEditKey(meta.item) || meta.id;
         }

         var self = this,
            compOptions = this._buildComponentConfig(meta),
            editDeffered = new $ws.proto.Deferred(),
            config = {
               opener: this,
               template: template||this._options.template,
               componentOptions: compOptions
            };

         if (meta.title) {
            config.title = meta.title;
         }

         config.componentOptions.handlers = this._getFormControllerHandlers();

         config.handlers = {
            onAfterClose: function (e, meta) {
               self._dialog = undefined;
               editDeffered.callback(meta, this._record);
            }
         };

         //делам загрузку компонента, только если в мете явно указали, что на прототипе в опциях есть данные об источнике данных
         if (meta.controllerSource && ( !config.componentOptions.record || meta.preloadRecord !== false )) {
            //Загружаем компонент, отнаследованный от formController'a, чтобы с его прототипа вычитать запись, которую мы прокинем при инициализации компонента
            //Сделано в рамках ускорения
            require([template], this._initTemplateComponentCallback.bind(this, config, meta, mode));
         }
         else {
            this._showDialog(config, meta, mode);
         }
         return editDeffered;
      },

      _initTemplateComponentCallback: function (config, meta, mode, templateComponent) {
         var self = this,
             def;
         var getRecordProtoMethod = templateComponent.prototype.getRecordFromSource;
         if (getRecordProtoMethod){
            def = getRecordProtoMethod.call(templateComponent.prototype, config.componentOptions);
            def.addCallback(function (record) {
               config.componentOptions.record = record;
               if (def.isNewRecord)
                   config.componentOptions.isNewRecord = true;
               if (!config.componentOptions.key){
                  //Если не было ключа, то отработал метод "создать". Запоминаем ключ созданной записи
                  config.componentOptions.key = record.getKey();
               }
               self._showDialog(config, meta, mode);
            });
         }
         else{
            self._showDialog(config, meta, mode);
         }
      },

      _showDialog: function(config, meta, mode){
         var floatAreaCfg,
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
            $ws.core.merge(this._dialog._options, config);
            this._dialog.reload();
         }
         else{
            this._dialog = new Component(config);
         }
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
      _updateModel: function (model, isNewModel) {
         if (isNewModel){
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
         if ($ws.helpers.instanceOfModule(collection.getDataSet && collection.getDataSet(), 'SBIS3.CONTROLS.Data.Collection.RecordSet')) {
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
         if ($ws.helpers.instanceOfModule(collection.getDataSet(), 'SBIS3.CONTROLS.Data.Collection.RecordSet')) {
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
         if ($ws.helpers.instanceOfMixin(collection, 'SBIS3.CONTROLS.Data.Collection.IList')) {
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

         if (newModel) {
            collectionRecord.set(collectionData.getIdProperty(), model.getKey().toString());
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
      _collectionReload: function() {
         this._options.linkedObject.reload();
      },
      /**
       * Получаем запись из связного списка по ключу редактируемой записи
       */
      _getCollectionRecord: function(model){
         var collectionData = this._getCollectionData(),
            index;

         if (collectionData && $ws.helpers.instanceOfMixin(collectionData, 'SBIS3.CONTROLS.Data.Collection.IList') && $ws.helpers.instanceOfMixin(collectionData, 'SBIS3.CONTROLS.Data.Collection.IIndexedCollection')) {
            index = collectionData.getIndexByValue(collectionData.getIdProperty(), this._linkedModelKey || model.getId());
            return collectionData.at(index);
         }
         return undefined;
      },
      _getCollectionData: function() {
         var collection = this._options.linkedObject;
         if ($ws.helpers.instanceOfMixin(collection, 'SBIS3.CONTROLS.ItemsControlMixin')) {
            collection = collection.getItems();
         }
         return collection;
      },
      _buildComponentConfig: function() {
         return {};
      }
   };

   DialognMixin.ACTION_MERGE = '_mergeRecords';
   DialognMixin.ACTION_ADD = '_createRecord'; //что добавляем? сделал через create
   DialognMixin.ACTION_RELOAD = '_collectionReload';
   DialognMixin.ACTION_DELETE = '_destroyModel';
   return DialognMixin;
});