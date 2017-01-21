define('js!SBIS3.CONTROLS.OpenDialogAction', [
   'js!SBIS3.CONTROLS.DialogActionBase',
   'Core/core-instance',
   'Core/EventBus',
   'Core/core-merge',
   'Core/Indicator',
   'Core/IoC',
   'Core/Deferred',
   'Core/helpers/fast-control-helpers',
   'js!WS.Data/Entity/Record',
   'js!SBIS3.CONTROLS.Utils.InformationPopupManager',
   'js!WS.Data/Di',
   'js!SBIS3.CORE.Dialog',
   'js!SBIS3.CORE.FloatArea'
], function (DialogActionBase, cInstance, EventBus, cMerge, cIndicator, IoC, Deferred, fcHelpers, Record, InformationPopupManager, Di, Dialog, FloatArea) {

   'use strict';

   /**
    * Класс, описывающий действие открытия окна с заданным шаблоном. Применяется для работы с диалогами редактирования списков.
    * Подробнее об использовании класса вы можете прочитать в разделе <a href="https://wi.sbis.ru/doc/platform/developmentapl/interfacedev/components/editing-dialog/">Управление диалогом редактирования списка.</a>.
    * @class SBIS3.CONTROLS.OpenDialogAction
    * @extends SBIS3.CONTROLS.DialogActionBase
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
    *
    * @control
    * @public
    * @category Actions
    * @initial
    * <component data-component="SBIS3.CONTROLS.OpenDialogAction">
    * </component>
    */
   var OpenDialogAction = DialogActionBase.extend(/** @lends SBIS3.CONTROLS.OpenDialogAction.prototype */{
      /**
       * @event onUpdateModel Происходит при сохранении записи в источнике данных диалога.
       * @remark
       * Используется для <a href="https://wi.sbis.ru/doc/platform/developmentapl/interfacedev/components/editing-dialog/synchronization/">синхронизации изменений со списком</a>.
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       * @param {WS.Data/Entity/Record} record Экземпляр класса записи.
       * @param {String} key Первичный ключ записи.
       */
      /**
       * @event onDestroyModel Происходит при удалении записи из источника данных диалога.
       * @remark
       * Используется для <a href="https://wi.sbis.ru/doc/platform/developmentapl/interfacedev/components/editing-dialog/synchronization/">синхронизации изменений со списком</a>.
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       * @param {WS.Data/Entity/Record} record Экземпляр класса записи.
       */
      /**
       * @event onCreateModel Происходит при создании записи в источнике данных диалога.
       * @remark
       * Используется для <a href="https://wi.sbis.ru/doc/platform/developmentapl/interfacedev/components/editing-dialog/synchronization/">синхронизации изменений со списком</a>.
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       * @param {WS.Data/Entity/Record} record Запись, которая была создана в источнике данных диалога.
       */
      /**
       * @event onReadModel Происходит при чтении записи из источника данных диалога.
       * @remark
       * Используется для <a href="https://wi.sbis.ru/doc/platform/developmentapl/interfacedev/components/editing-dialog/synchronization/">синхронизации изменений со списком</a>.
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       * @param {WS.Data/Entity/Record} record Экземпляр класса записи.
       */
      $protected: {
         _options: {
            /**
             * @cfg {*|SBIS3.CONTROLS.DSMixin|WS.Data/Collection/IList} Устанавливает связанный с диалогом список.
             * @remark
             * Опция применятся при работе со <a href="https://wi.sbis.ru/doc/platform/developmentapl/interfacedev/components/list/">списками</a>, чтобы производить <a href="https://wi.sbis.ru/doc/platform/developmentapl/interfacedev/components/dialogs/synchronization/">синхронизацию изменений</a>.
             * Для списка, с которым производится связывание, устанавливается ограничение: в класс списка должы быть добавлены миксины ({@link SBIS3.CONTROLS.DSMixin} или {@link WS.Data/Collection/IList}).
             * @see setLinkedObject
             */
            linkedObject: undefined,
            /**
             * @cfg {String} Устанавливает способ инициализации данных диалога.
             * @remark
             * Описание значений опции вы можете найти в разделе <a href="https://wi.sbis.ru/doc/platform/developmentapl/interfacedev/components/dialogs/initializing-way/">Способы инициализации данных диалога</a>.
             * @variant local
             * @variant remote
             * @variant delayedRemote
             */
            initializingWay: 'remote',
            /**
             * @cfg {String} Поле записи, в котором лежит url, по которому откроется новая вкладка при вызове execute при зажатой клавише ctrl
             */
            urlProperty: ''
         },
         /**
          * Ключ модели из связного списка
          * Отдельно храним ключ для модели из связного списка, т.к. он может не совпадать с ключом редактируемой модели
          * К примеру в реестре задач ключ записи в реестре и ключ редактируемой записи различается, т.к. одна и та же задача может находиться в нескольких различных фазах
          */
         _linkedModelKey: undefined,
         _showedLoading: false,
         _openInNewTab: false
      },
      init: function(){
         OpenDialogAction.superclass.init.apply(this, arguments);
         $(document).bind('keydown keyup', this._setOpeningMode.bind(this));
      },
      /**
       * Устанавливает связанный список, с которым будет производиться синхронизация изменений диалога.
       * @param {*|SBIS3.CONTROLS.DSMixin|WS.Data/Collection/IList} linkedObject Экземпляр класса <a href="https://wi.sbis.ru/doc/platform/developmentapl/interfacedev/components/list/list-settings/">списка</a>.
       * @see linkedObject
       */
      setLinkedObject: function(linkedObject){
         this._options.linkedObject = linkedObject;
      },
      /**
       * Должен вернуть ключ записи, которую редактируем в диалоге
       */
      _getEditKey: function(item){
      },
      _setOpeningMode: function(event){
         this._openInNewTab = event.ctrlKey;
      },
      _needOpenInNewTab: function(){
        return this._openInNewTab;
      },
      _opendEditComponent: function(meta, dialogComponent, mode){
         var openUrl = meta.item && meta.item.get(this._options.urlProperty);
         if (this._needOpenInNewTab() && openUrl){
            window.open(openUrl);
         }
         else if (this._isNeedToRedrawDialog()){
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
            InformationPopupManager.showConfirmDialog({
                  message: rk('Сохранить изменения?')
               },
               this._positiveSaveConfirmDialogHandler.bind(this, templateComponent, args),
               this._negativeSaveConfirmDialogHandler.bind(this, args)
            );
         }
         else{
            self._setConfig.apply(self, args);
         }
      },

      _positiveSaveConfirmDialogHandler: function(templateComponent, args){
         var self = this;
         templateComponent.update({hideQuestion: true}).addCallback(function(){
            self._setConfig.apply(self, args);
         });
      },

      _negativeSaveConfirmDialogHandler: function(args){
         this._setConfig.apply(this, args);
      },

      _setConfig: function(meta, dialogComponent, mode){
         this._linkedModelKey = meta.id;
         //Производим корректировку идентификатора только в случае, когда идентификатор передан
         if (meta.hasOwnProperty('id')) {
            //Если передали ключ из getEditKey - значит FC будет работать с новой записью,
            //вычитанной по этому ключу
            meta.id = this._getEditKey(meta.item) || meta.id;
         }
         OpenDialogAction.superclass._setConfig.call(this, meta, dialogComponent, mode);

      },

      _showDialog: function(config, meta, mode){
         var initializingWay = config.componentOptions.initializingWay,
             dialogComponent = config.template;

         if (initializingWay == OpenDialogAction.INITIALIZING_WAY_REMOTE) {
            this._showLoadingIndicator();
            require([dialogComponent], this._initTemplateComponentCallback.bind(this, config, meta, mode));
         }
         else if (initializingWay == OpenDialogAction.INITIALIZING_WAY_DELAYED_REMOTE){
            this._showLoadingIndicator();
            require([dialogComponent], this._getRecordDeferred.bind(this, config, meta, mode));
         }
         else {
            this._createDialog(config, meta, mode);
         }
      },

      _createDialog: function(config, meta, mode){
         var Component = (mode == 'floatArea') ? FloatArea : Dialog;

         if (this._isNeedToRedrawDialog()){
            this._setNewDialogConfig(config);
         }
         else{
            this._dialog = new Component(config);
         }
      },

      _getRecordDeferred: function(config, meta, mode, templateComponent){
         var getRecordProtoMethod = templateComponent.prototype.getRecordFromSource,
            def = getRecordProtoMethod.call(templateComponent.prototype, config.componentOptions);
         this._hideLoadingIndicator();
         //TODO Условие в рамках совместимости. убрать как все перейдут на установку dataSource с опций
         if (!cInstance.instanceOfModule(def, 'Core/Deferred')){
            this._createDialog(config, meta, mode);
            return;
         }
         config.componentOptions._receiptRecordDeferred = def;
         this._createDialog(config, meta, mode);
      },

      _initTemplateComponentCallback: function (config, meta, mode, templateComponent) {
         var self = this,
            isNewRecord = (meta.isNewRecord !== undefined) ? meta.isNewRecord : !config.componentOptions.key,
            options,
            def;
         var getRecordProtoMethod = templateComponent.prototype.getRecordFromSource;
         if (getRecordProtoMethod){
            def = getRecordProtoMethod.call(templateComponent.prototype, config.componentOptions);

            //TODO Условие в рамках совместимости. убрать как все перейдут на установку dataSource с опций
            if (!cInstance.instanceOfModule(def, 'Core/Deferred')){
               self._hideLoadingIndicator();
               self._createDialog(config, meta, mode);
               return;
            }

            def.addCallback(function (record) {
               config.componentOptions.record = record;
               config.componentOptions.isNewRecord = isNewRecord;
               if (isNewRecord){
                  options = templateComponent.prototype.getComponentOptions.call(templateComponent.prototype, config.componentOptions);
                  config.componentOptions.key = self._getRecordId(record, options.idProperty);
               }
               self._createDialog(config, meta, mode);
            }).addErrback(function(error){
               //Не показываем ошибку, если было прервано соединение с интернетом. просто скрываем индикатор и оверлей
               if (!error._isOfflineMode){
                  //Помечаем ошибку обработанной, чтобы остальные подписанты на errback не показывали свой алерт
                  error.processed = true;
                  InformationPopupManager.showMessageDialog({
                     message: error.message,
                     status: 'error'
                  })
               }
            }).addBoth(function(){
               self._hideLoadingIndicator();
            });
         }
         else{
            self._createDialog(config, meta, mode);
         }
      },

      _showLoadingIndicator: function(){
         this._showedLoading = true;
         this._toggleOverlay(true);
         window.setTimeout(function(){
            if (this._showedLoading){
               cIndicator.setMessage('Загрузка...'); //setMessage зовет show у loadingIndicator
            }
         }.bind(this), 2000);
      },

      _hideLoadingIndicator: function(){
         this._showedLoading = false;
         this._toggleOverlay(false);
         cIndicator.hide();
      },

      _toggleOverlay: function(show){
         //При вызове execute, во время начала асинхронных операций при выставленной опции initializingWay = 'remote' || 'delayedRemote',
         //закрываем оверлеем весь боди, чтобы пользователь не мог взаимодействовать с интерфейсом, пока не загрузится диалог редактирования,
         //иначе пока не загрузилась одна панель, мы можем позвать открытие другой, что приведет к ошибкам.
         if (!this._overlay) {
            this._overlay = $('<div class="controls-OpenDialogAction-overlay ws-hidden"></div>');
            this._overlay.css({
               position: 'absolute',
               top: 0,
               left: 0,
               right: 0,
               bottom: 0,
               'z-index': 9999,
               opacity: 0
            });
            this._overlay.appendTo('body');
         }
         this._overlay.toggleClass('ws-hidden', !show);
      },

      _isNeedToRedrawDialog: function(){
         return this._dialog && !this._dialog.isDestroyed() && !this._dialog.isAutoHide();
      },

      _setNewDialogConfig: function(config){
         //Актуальные опции для FC содержатся в config.componentOptions, то что уже содержится в this._dialog._options нам не нужно
         this._dialog._options.componentOptions = {};
         cMerge(this._dialog._options, config);
         this._dialog.reload();
      },
      _buildComponentConfig: function(meta) {
         //Если запись в meta-информации отсутствует, то передаем null. Это нужно для правильной работы DataBoundMixin с контекстом и привязкой значений по имени компонента
         var record = (cInstance.instanceOfModule(meta.item, 'WS.Data/Entity/Record') ? meta.item.clone() : meta.item) || null,
            result = {
               isNewRecord: !!meta.isNewRecord,
               source: meta.source,
               key: meta.id,
               initValues: meta.filter,
               readMetaData: meta.readMetaData,
               record: record,
               handlers: this._getFormControllerHandlers(),
               initializingWay: meta.initializingWay || this._options.initializingWay
            };
         cMerge(result, meta.componentOptions);
         //Мы передаем клон записи из списка. После того, как мы изменим ее поля и сохраним, запись из связного списка будет помечена измененной,
         //т.к. при синхронизации мы изменили ее поля. При повторном открытии этой записи на редактирование, она уже будет помечена как измененная =>
         //ненужный вопрос о сохранении, если пользователь сразу нажмет на крест.
         //Делам так, чтобы отслеживать изменения записи только в момент работы FC.
         if (record) {
            record.acceptChanges();
         }

         //в дальнейшем будем мержить опции на этот конфиг и если в мете явно не передали dataSource
         //то в объекте не нужно создавать свойство, иначе мы затрем опции на FormController.
         if (meta.dataSource)
            result.dataSource = meta.dataSource;
         return result;
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
         if (additionalData.isNewRecord){
            this._createRecord(model, 0, additionalData);
         }
         else{
            this._mergeRecords(model, null, additionalData);
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
      _destroyModel: function(model, additionalData){
         var collectionRecord = this._getCollectionRecord(model, additionalData),
            collection = this._options.linkedObject;
         if (!collectionRecord){
            return;
         }
         //Уберём удаляемый элемент из массива выбранных у контрола, являющегося linkedObject.
         if (cInstance.instanceOfMixin(collection, 'SBIS3.CONTROLS.MultiSelectable')) {
            collection.removeItemsSelection([this._getRecordId(collectionRecord, additionalData.idProperty)]);
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
         var collectionRecord = colRec || this._getCollectionRecord(model, additionalData),
            collectionData = this._getCollectionData(),
            recValue;
         if (!collectionRecord) {
            return;
         }

         if (additionalData.isNewRecord){
            collectionRecord.set(collectionData.getIdProperty(), additionalData.key);
         }

         Record.prototype.each.call(collectionRecord, function (key, value) {
            recValue = model.get(key);
            if (model.has(key) && recValue != value && key !== model.getIdProperty()) {
               //клонируем модели, флаги, итд потому что при сете они теряют связь с рекордом текущим рекордом, а редактирование может еще продолжаться.
               if (recValue && (typeof recValue.clone == 'function')) {
                  recValue = recValue.clone();
               }
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
      _getCollectionRecord: function(model, additionalData){
         var collectionData = this._getCollectionData(),
             index;

         if (collectionData && cInstance.instanceOfMixin(collectionData, 'WS.Data/Collection/IList') && cInstance.instanceOfMixin(collectionData, 'WS.Data/Collection/IIndexedCollection')) {
            index = collectionData.getIndexByValue(collectionData.getIdProperty(), this._linkedModelKey || this._getRecordId(model, additionalData.idProperty));
            return collectionData.at(index);
         }
         return undefined;
      },

      _getRecordId: function(record, idProperty){
         if (idProperty) {
            return record.get(idProperty);
         }
         return record.getId();
      },

      _getCollectionData:function(){
         var collection = this._options.linkedObject;
         if (cInstance.instanceOfMixin(collection, 'SBIS3.CONTROLS.ItemsControlMixin')) {
            collection = collection.getItems();
         }
         return collection;
      }
   });

   OpenDialogAction.ACTION_CUSTOM = 'custom';
   OpenDialogAction.ACTION_MERGE = '_mergeRecords';
   OpenDialogAction.ACTION_ADD = '_createRecord';
   OpenDialogAction.ACTION_RELOAD = '_collectionReload';
   OpenDialogAction.ACTION_DELETE = '_destroyModel';
   OpenDialogAction.INITIALIZING_WAY_LOCAL = 'local';
   OpenDialogAction.INITIALIZING_WAY_REMOTE = 'remote';
   OpenDialogAction.INITIALIZING_WAY_DELAYED_REMOTE = 'delayedRemote';
   return OpenDialogAction;
});