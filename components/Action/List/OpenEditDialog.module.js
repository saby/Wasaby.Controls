/*global define, require, $ws*/
define('js!SBIS3.CONTROLS.Action.OpenEditDialog', [
   "Core/Deferred",
   "Core/core-merge",
   "js!SBIS3.CONTROLS.Action.Action",
   "js!SBIS3.CONTROLS.Action.DialogMixin",
   "js!SBIS3.CONTROLS.Action.List.ListMixin",
   "js!WS.Data/Entity/Model",
   "js!WS.Data/Utils",
   "Core/core-instance"
], function( Deferred, cMerge,Action, DialogMixin, ListMixin, Model, Utils, cInstance){
   'use strict';

   /**
    * Действие открытия окна с заданным шаблоном
    * @class SBIS3.CONTROLS.Action.OpenEditDialog
    * @mixes SBIS3.CONTROLS.Action.DialogMixin
    * @mixes SBIS3.CONTROLS.Action.List.ListMixin
    * @public
    * @author Крайнов Дмитрий Олегович
    */
   var OpenEditDialog = Action.extend([DialogMixin, ListMixin],/** @lends SBIS3.CONTROLS.Action.DialogMixin.prototype */{
      $protected : {
         /**
          * Ключ модели из связного списка
          * Отдельно храним ключ для модели из связного списка, т.к. он может не совпадать с ключом редактируемой модели
          * К примеру в реестре задач ключ записи в реестре и ключ редактируемой записи различается, т.к. одна и та же задача может находиться в нескольких различных фазах
          */
         _linkedModelKey: undefined
      },

      _opendEditComponent: function(meta, template, mode) {
         this._linkedModelKey = meta.id;
         return OpenEditDialog.superclass._opendEditComponent.call(this, meta, template, mode);
      },

      _showDialog: function(config, meta, template, mode) {
         //добавляем обработчики формконтронтроллера в конфиг
         config.componentOptions.handlers = cMerge(
            config.componentOptions.handlers || {},
            this._getFormControllerHandlers()
         );
         //делам загрузку компонента, только если в мете явно указали, что на прототипе в опциях есть данные об источнике данных
         if (meta.controllerSource && (!config.componentOptions.record || meta.preloadRecord !== false )) {
            //Загружаем компонент, отнаследованный от formController'a, чтобы с его прототипа вычитать запись, которую мы прокинем при инициализации компонента
            //Сделано в рамках ускорения
            var self = this;
            require([template], this._initTemplateComponentCallback.bind(this, config, meta, mode).addCallback(
               function () {
                  OpenEditDialog.superclass._showDialog.call(self, config, meta, mode);
               }
            ));
         }
         else {
            OpenEditDialog.superclass._showDialog.call(this, config, meta, mode);
         }

      },

      _initTemplateComponentCallback: function (config, meta, mode, templateComponent) {
         var self = this,
            def;
         var getRecordProtoMethod = templateComponent.prototype.getRecordFromSource;
         if (getRecordProtoMethod) {
            def = getRecordProtoMethod.call(templateComponent.prototype, config.componentOptions);
            return def.addCallback(function (record) {
               config.componentOptions.record = record;
               if (def.isNewRecord)
                  config.componentOptions.isNewRecord = true;
               if (!config.componentOptions.key){
                  //Если не было ключа, то отработал метод "создать". Запоминаем ключ созданной записи
                  config.componentOptions.key = record.getId();
               }
            });
         }
         else {
            return new Deferred().callback();
         }
      },

      /**
       * Возвращает обработчики на события formController'a
       */
      _getFormControllerHandlers: function() {
         return {
            onReadModel: this._actionHandler.bind(this),
            onUpdateModel: this._actionHandler.bind(this),
            onDestroyModel: this._actionHandler.bind(this),
            onCreateModel: this._actionHandler.bind(this)
         };
      },
      /**
       * Переопределяемый метод
       * В случае, если все действия выполняются самостоятельноно, надо вернуть Action.ACTION_CUSTOM, чтобы
       * не выполнялась базовая логика
       * @param model Запись, с которой работаем
       * @returns {String|Deferred} Сообщаем, нужно ли выполнять базовую логику. Если не нужно, то возвращаем Action.ACTION_CUSTOM
       */
      _onUpdateModel: function(model) {
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
       * В случае, если все действия выполняются самостоятельноно, надо вернуть Action.ACTION_CUSTOM, чтобы
       * не выполнялась базовая логика
       * @param model Запись, с которой работаем
       * @returns {String|Deferred} Сообщаем, нужно ли выполнять базовую логику. Если не нужно, то возвращаем Action.ACTION_CUSTOM
       */
      _onReadModel: function(model) {
      },

      _readModel: function(model) {
      },
      /**
       * Переопределяемый метод
       * В случае, если все действия выполняются самостоятельноно, надо вернуть Action.ACTION_CUSTOM, чтобы
       * не выполнялась базовая логика
       * @param model Запись, с которой работаем
       * @returns {String|Deferred} Сообщаем, нужно ли выполнять базовую логику. Если не нужно, то возвращаем Action.ACTION_CUSTOM
       */
      _onDestroyModel: function(model) {
      },
      /**
       * Базовая логика при событии ouDestroy. Дестроим рекорд в связном списке
       */
      _destroyModel: function(model) {
         var collectionRecord = this._getItems(model),
            collection = this._options.linkedObject;
         if (!collectionRecord){
            return;
         }
         //Уберём удаляемый элемент из массива выбранных у контрола, являющегося linkedObject.
         if (cInstance.instanceOfMixin(collection, 'SBIS3.CONTROLS.MultiSelectable')) {
            collection.removeItemsSelection([collectionRecord.getId()]);
         }
         if (cInstance.instanceOfModule(collection.getDataSet && collection.getDataSet(), 'WS.Data/Adapter/RecordSet')) {
            collection = collection.getDataSet();
         }
         collection.remove(collectionRecord);
      },
      /**
       * Переопределяемый метод
       * В случае, если все действия выполняются самостоятельноно, надо вернуть Action.ACTION_CUSTOM, чтобы
       * не выполнялась базовая логика
       * @param model Запись, с которой работаем
       * @returns {String|Deferred} Сообщаем, нужно ли выполнять базовую логику. Если не нужно, то возвращаем Action.ACTION_CUSTOM
       */
      _onCreateModel: function(model) {
      },
      /**
       * Обработка событий formController'a. Выполнение переопределяемых методов и notify событий.
       * Если из обработчиков событий и переопределяемых методов вернули не Action.ACTION_CUSTOM, то выполняем базовую логику.
       */
      _actionHandler: function(event, model) {
         var eventName = event.name,
            genericMethods = {
               onDestroyModel: '_destroyModel',
               onUpdateModel : '_updateModel',
               onReadModel: '_readModel'
            },
            args = Array.prototype.slice.call(arguments, 0);

         args.splice(0, 1); //Обрежем первый аргумент типа EventObject, его не нужно прокидывать в события и переопределяемый метод

         this._callHandlerMethod(args, eventName, genericMethods[eventName]);
      },

      _createRecord: function(model, at) {
         var collection = this._options.linkedObject,
            rec;
         at = at || 0;
         if (cInstance.instanceOfModule(collection.getDataSet(), 'WS.Data/Adapter/RecordSet')) {
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
      _mergeRecords: function(model, colRec, newModel) {
         var collectionRecord = colRec || this._getCollectionRecord(model),
            collectionData = this._getItems(),
            recValue;
         if (!collectionRecord) {
            return;
         }

         if (newModel) {
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

      _collectionReload: function() {
         this._options.linkedObject.reload();
      },
      /**
       * Получаем запись из связного списка по ключу редактируемой записи
       */
      _getCollectionRecord: function(model) {
         var collectionData = this._getItems(),
            index;

         if (collectionData && cInstance.instanceOfMixin(collectionData, 'WS.Data/Collection/IList') && cInstance.instanceOfMixin(collectionData, 'WS.Data/Collection/IIndexedCollection')) {
            index = collectionData.getIndexByValue(collectionData.getIdProperty(), this._linkedModelKey || model.getId());
            return collectionData.at(index);
         }
         return undefined;
      },

      _buildComponentConfig: function() {
         return {};
      },
      /**
       * поддерживаем сеттер для опции dialogComponent
       * @param val
       * @protected
       */
      setDialogComponent: function(val) {
         Utils.logger.stack(this._moduleName + '::$constructor(): option "dialogComponent" is deprecated and will be removed in 3.7.4.100', 1);
         this._options.template = val;
      }
   });

   OpenEditDialog.ACTION_MERGE = '_mergeRecords';
   OpenEditDialog.ACTION_ADD = '_createRecord'; //что добавляем? сделал через create
   OpenEditDialog.ACTION_RELOAD = '_collectionReload';
   OpenEditDialog.ACTION_DELETE = '_destroyModel';
   OpenEditDialog.INITIALIZING_WAY_LOCAL = 'local';
   OpenEditDialog.INITIALIZING_WAY_REMOTE = 'remote';
   OpenEditDialog.INITIALIZING_WAY_DELAYED_REMOTE = 'delayedRemote';
   return OpenEditDialog;
});