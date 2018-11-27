/**
 * Created by as.suhoruchkin on 15.10.2015.
 */

define('SBIS3.CONTROLS/ListView/resources/EditInPlaceBaseController/EditInPlaceBaseController',
   [
   "Core/Context",
   "Core/constants",
   "Core/Deferred",
   "Core/IoC",
   "Lib/Control/CompoundControl/CompoundControl",
   'Core/CommandDispatcher',
   "Lib/Mixins/PendingOperationProducerMixin",
   "tmpl!SBIS3.CONTROLS/ListView/resources/EditInPlaceBaseController/AddRowTpl",
   "SBIS3.CONTROLS/ListView/resources/EditInPlace/EditInPlace",
   "SBIS3.CONTROLS/ControlHierarchyManager",
   "Data/type",
   "Core/core-instance",
   "Core/Indicator",
   'css!SBIS3.CONTROLS/ListView/resources/EditInPlaceBaseController/EditInPlaceBaseController'

],
   function (cContext, constants, Deferred, IoC, CompoundControl, CommandDispatcher, PendingOperationProducerMixin, AddRowTpl, EditInPlace, ControlHierarchyManager, type, cInstance, Indicator) {

      'use strict';

      var Model = type.Model;
      var Record = type.Record;

      /**
       * @class SBIS3.CONTROLS/ListView/resources/EditInPlaceBaseController/EditInPlaceBaseController
       * @extends Lib/Control/CompoundControl/CompoundControl
       * @author Сухоручкин А.С.
       * @control
       * @public
       */
      var
         BeginEditResult = { // Возможные результаты события "BeginEditResult"
            CANCEL: 'Cancel', // Отменить запуск редактирования
            PENDING_ALL: 'PendingAll', // В результате редактирования ожидается вся запись, как есть (с текущим набором полей)
            PENDING_MODIFIED_ONLY: 'PendingModifiedOnly' // В результате редактирования ожидаются только измененные поля
         },
         EndEditResult = { // Возможные результаты события "onEndEdit"
            CANCEL: 'Cancel', // Отменить завершение редактирования/добавления
            SAVE: 'Save', // Завершать с штатным сохранением результатов редактирования/добавления.
            NOT_SAVE: 'NotSave', // Завершать без сохранения результатов. ВНИМАНИЕ! Использование данной константы в добавлении по месту приводит к автоудалению созданной записи
            CUSTOM_LOGIC: 'CustomLogic' // Завершать с кастомной логика сохранения. Используется, например, при добавлении по месту, когда разработчику необходимо самостоятельно обработать добавляемую запись
         },

         CONTEXT_RECORD_FIELD = 'sbis3-controls-edit-in-place',
         EditInPlaceBaseController = CompoundControl.extend([PendingOperationProducerMixin],/** @lends SBIS3.CONTROLS/ListView/resources/EditInPlaceBaseController/EditInPlaceBaseController.prototype */ {
            $protected: {
               _options: {
                  editingTemplate: undefined,
                  getCellTemplate: undefined,
                  itemsProjection: undefined,
                  columns: undefined,
                  /**
                   * @cfg {Boolean} Завершение редактирования при потере фокуса
                   */
                  endEditByFocusOut: false,
                  /**
                   * @cfg {Boolean} Режим автоматического добавления элементов
                   * @remark
                   * Используется при включенном редактировании по месту. Позволяет при завершении редактирования последнего элемента автоматически создавать новый.
                   * @example
                   * <pre>
                   *     <option name="modeAutoAdd">true</option>
                   * </pre>
                   */
                  modeAutoAdd: false,
                  modeSingleEdit: false,
                  ignoreFirstColumn: false,
                  notEndEditClassName: undefined,
                  editFieldFocusHandler: undefined,
                  dataSource: undefined,
                  items: undefined,
                  itemsContainer: undefined,
                  getEditorOffset: undefined,
                  parentProperty: undefined,
                  currentRoot: undefined
               },
               _eip: undefined,
               // Используется для хранения Deferred при сохранении в редактировании по месту.
               // Обязательно нужен, т.к. лишь таким способом можно обработать несколько последовательных вызовов endEdit и вернуть ожидаемый результат (Deferred).
               _savingDeferred: undefined,
               // Используется в случае, если перед редактированием запись перечитывается, и на редактирование мы отправляем запись, не свзяанную с рекордсетом,
               // и для перерисовки строки после редактирования, необходимо смержит новые данные именно в эту запись
               _editingRecord: undefined,
               _pendingOperation: undefined, // Используется для хранения операции ожидания, зарегистрированной у первого родителя с Lib/Mixins/PendingOperationParentMixin
               //TODO: Данная переменная нужна для автодобавления по enter(mode autoadd), чтобы определить в какой папке происходит добавление элемента
               //Вариант решения проблемы не самый лучший, и добавлен как временное решение для выпуска 3.7.3.150. В версию .200 придумать нормальное решение.
               _lastTargetAdding: undefined,
               //Флаг отвечает за блокировку при добавлении записей. Если несколько раз подряд будет отправлена команда добавления, то уйдёт несколько запросов на бл
               _addLock: false,
               _addTarget: undefined,
               _isAdd: false,
               _isEditNextTarget: false
            },
            $constructor: function () {
               this._publish('onItemValueChanged', 'onBeginEdit', 'onAfterBeginEdit', 'onEndEdit', 'onBeginAdd', 'onAfterEndEdit', 'onInitEditInPlace', 'onHeightChange', 'onBeginSave', 'onEndSave');
               CommandDispatcher.declareCommand(this, 'commitEdit', this.commitEdit);
               CommandDispatcher.declareCommand(this, 'cancelEdit', this.cancelEdit);
               this._savingDeferred = Deferred.success();
            },

            init: function() {
               EditInPlaceBaseController.superclass.init.apply(this, arguments);
               // Если фокус ушел на кнопку закрытия диалога, то редактирование по месту не должно реагировать на это, т.к.
               // его и так завершат через finishChildPendingOperation (и туда попадет правильный аргумент - с сохранением
               // или без завершать редактирование по месту)
               // isCloseButtonPressed: https://online.sbis.ru/opendoc.html?guid=e6e98641-8c5a-4b28-97a0-5c1caa0af1f2
               if (this.getOpener() && this.getOpener().getTopParent()) {
                  this._closeButton = this.getOpener().getTopParent()._container.closest('.ws-window').find('.ws-float-close');
                  this._closeButtonPressedCb = this._closeButtonPressed.bind(this);
                  this._closeButton.on('mousedown', this._closeButtonPressedCb);
               }
            },

            _closeButtonPressed: function() {
               // isCloseButtonPressed: https://online.sbis.ru/opendoc.html?guid=e6e98641-8c5a-4b28-97a0-5c1caa0af1f2
               this._isCloseButtonPressed = true;
            },

            /**
             * Возвращает признак валидности данных изменяемой записи
             * @returns {boolean|*}
             */
            isValidChanges: function() {
               // Данные считаются валидными, если изменений не было (на это указывает признак наличия операции ожидания) или валидация вернула true
               return !this._pendingOperation || this.validate();
            },

            // Говорим, что область готова принимать фокус всегда, когда активно редактирование по месту
            // https://online.sbis.ru/opendoc.html?guid=4a15311b-fbe0-4818-89bf-16fb4d1f457c
            _canAreaAcceptFocus: function() {
               return this.isEdit();
            },

            isEdit: function() {
               return this._eip && this._eip.isEdit();
            },

            _getEip: function() {
               if (!this._eip) {
                  this._createEip();
               }
               return this._eip;
            },

            _createEip: function() {
               this._eip = new EditInPlace(this._getEditInPlaceConfig());
            },
            //Переопределяем метод, т.к. контроллер не имеет вёрстки, и сам не умеет принимать активность.
            setActive: function() {
               var eip = this._getEditingEip();
               if (eip) {
                  eip.setActive.apply(eip, arguments);
               }
            },
            setItems: function(items) {
               this._options.items = items;
            },
            setItemsProjection: function(itemsProjection) {
               this._options.itemsProjection = itemsProjection;
            },
            setEditingTemplate: function(template) {
               this._destroyEip();
               this._options.editingTemplate = template;
               this._createEip();
            },

            getEditingTemplate: function() {
               return this._options.editingTemplate;
            },

            setColumns: function(columns) {
               this._options.columns = columns;
            },

            setIgnoreFirstColumn: function(value) {
               this._options.ignoreFirstColumn = value;
            },

            _getEditInPlaceConfig: function() {
               var
                  self = this,
                  config;
               config = {
                  editingTemplate: this._options.editingTemplate,
                  columns: this._options.columns,
                  element: $('<div>').prependTo(this._options.itemsContainer),
                  itemsContainer: this._options.itemsContainer,
                  getCellTemplate: this._options.getCellTemplate,
                  ignoreFirstColumn: this._options.ignoreFirstColumn,
                  context: this._getContextForEip(),
                  focusCatch: this._focusCatch.bind(this),
                  getEditorOffset: this._options.getEditorOffset,
                  parent: this,
                  handlers: {
                     onItemValueChanged: function(event, difference, model) {
                        event.setResult(self._notify('onItemValueChanged', difference, model));
                     },
                     onInit: function() {
                        self._notify('onInitEditInPlace', this);
                     },
                     onKeyPress: function(event, originalEvent) {
                        self._onKeyPress(originalEvent);
                     },
                     onHeightChange: this._onHeightChange.bind(this)
                  }
               };
               if (this._options.endEditByFocusOut) {
                  config.handlers.onFocusOut = this._onChildFocusOut.bind(this);
               }
               return config;
            },
            _onHeightChange: function(event, model) {
               this._notify('onHeightChange', model);
            },
            _getContextForEip: function () {
               var
                  ctx = cContext.createContext(this, {restriction: 'set'});
               ctx.subscribe('onFieldNameResolution', function (event, fieldName) {
                  var
                     record,
                     path = fieldName.split(cContext.STRUCTURE_SEPARATOR);
                  if (path[0] !== CONTEXT_RECORD_FIELD) {
                     record = this.getValue(CONTEXT_RECORD_FIELD);
                     if (record && record.get(path[0]) !== undefined) {
                        event.setResult(CONTEXT_RECORD_FIELD + cContext.STRUCTURE_SEPARATOR + fieldName);
                     }
                  }
               });
               return ctx;
            },
            /**
             * Обработчик клавиатуры
             * @private
             */
            _onKeyPress: function (e) {
               var key = e.which;
               if (key === constants.key.esc) {
                  e.stopImmediatePropagation();
                  e.preventDefault();
                  this.cancelEdit();
               } else if (key === constants.key.enter || key === constants.key.down || key === constants.key.up) {
                  e.stopImmediatePropagation();
                  e.preventDefault();
                  this.editNextTarget(key === constants.key.down || key === constants.key.enter);
               }
            },

            editNextTarget: function(editNextRow) {
               var
                  self = this,
                  fromAdd = this._isAdd,
                  nextTarget = this._getNextTarget(this._getCurrentTarget(), editNextRow);

               this._isEditNextTarget = true;
               this.commitEdit(true).addCallback(function() {
                  self._editNextTarget(nextTarget, editNextRow, fromAdd);
               }).addBoth(function() {
                  self._isEditNextTarget = false;
               });
            },

            _editNextTarget: function (target, editNextRow, fromAdd) {
               var self = this;
               if (target.length && !this._options.modeSingleEdit) {
                  this.edit(this._options.items.getRecordById(target.attr('data-id'))).addCallback(function(result) {
                     if (!result) {
                        self._editNextTarget(self._getNextTarget(target, editNextRow), editNextRow);
                     }
                  });
               // Запускаем добавление если нужно редактировать следующую строку, но строки нет и включен режим автодобавления
               // и выключен режим редактирования единичной записи (или последняя редактируемая запись на самом деле добавляется)
               } else if (editNextRow && this._options.modeAutoAdd && (!this._options.modeSingleEdit || fromAdd)) {
                  this.add({
                     target: this._lastTargetAdding
                  });
               }
            },
            _getNextTarget: function(currentTarget, editNextRow) {
               //Ищем с помощью nextAll и prevAll т.к. между строками таблицы могут находиться блоки группировки, футеры папок и т.д. и
               //при помощи next и prev при указанном селекторе мы бы ни чего не нашли, хотя нужные строки могли быть.
               currentTarget = this._options.itemsContainer.find('.js-controls-ListView__item[data-id="' + currentTarget.attr('data-id') + '"]:not(".controls-editInPlace")');
               return currentTarget[editNextRow ? 'nextAll' : 'prevAll']('.js-controls-ListView__item:not(".controls-editInPlace")').eq(0);
            },
            _getCurrentTarget: function() {
               return this._eip.getTarget();
            },

            getEditingRecord: function() {
               return this.isEdit() ? this._getEditingEip().getEditingRecord() : undefined;
            },

            showEip: function(model, options, withoutActivateFirstControl) {
               if (options && options.isEdit) {
                  return this.edit(model, withoutActivateFirstControl);
               } else {
                  return this.add(options, withoutActivateFirstControl);
               }
            },
            isAdd: function() {
               return this._isAdd;
            },
            edit: function (model, withoutActivateFirstControl) {
               var
                  self = this,
                  reReadModel;
               return this.commitEdit().addCallback(function() {
                  //TODO: Постепенно нужно отказываться от начала редактирования по моделе, нужно редактировать по ключу(хэшу).
                  //Сейчас возникают ошибки, из-за того, что в метод edit передаётся модель, а затем вызвается endEdit,
                  //в следствии чего может случиться reload и переданная нам модель, станет оторванной от recordSet'а.
                  //Из-за этого при сохранении оторванной записи, изменённые данные не попадают в recordSet.
                  //Переход на редактирование по ключам будет по задаче https://inside.tensor.ru/opendoc.html?guid=00cb0405-e407-4502-b067-06098aabdfd2
                  if (model.getState() === Record.RecordState.DETACHED) {
                     reReadModel = self._options.items.getRecordById(model.get(self._options.idProperty));
                     model = reReadModel || model;
                  }
                  return self._prepareEdit(model).addCallback(function(preparedRecord) {
                     var editingRecord;
                     if (preparedRecord) {
                        var
                            parentProjItem,
                            // Элемент проекции нужно получать именно по записи, открытой на редактирование, т.к. только у неё правильный hash
                            itemProjItem = self._options.itemsProjection.getItemBySourceItem(model);
                        self._getEip().edit(preparedRecord, itemProjItem, withoutActivateFirstControl);
                        editingRecord = self._getEip().getEditingRecord();
                        //TODO: необходимо разбивать контроллер редактирования по месту, для плоских и иерархических представлений
                        if (self._options.parentProperty) {
                           parentProjItem = itemProjItem.getParent();
                           self._lastTargetAdding = parentProjItem.isRoot() ? null : parentProjItem;
                        }
                        if (!self._pendingOperation) {
                           self._subscribeToAddPendingOperation(editingRecord);
                        }
                        self._notify('onAfterBeginEdit', editingRecord);
                     }
                     return editingRecord;
                  })
               });
            },
            _prepareEdit: function(record) {
               var
                  allowEdit,
                  self = this,
                  beginEditResult,
                  loadingIndicator;
               //Если необходимо перечитывать запись перед редактированием, то делаем это
               beginEditResult = this._notify('onBeginEdit', record, this._isAdd);
               if (beginEditResult instanceof Deferred) {
                  loadingIndicator = setTimeout(function () {
                     Indicator.setMessage(rk('Пожалуйста, подождите…'));
                  }, 100);
                  return beginEditResult.addCallback(function(readRecord) {
                     self._editingRecord = record;
                     return readRecord;
                  }).addBoth(function (result) {
                     clearTimeout(loadingIndicator);
                     Indicator.hide();
                     return result;
                  });
               } else {
                  //Запрет на редактирование может быть только у существующих элементов. Если происходит добавление по месту,
                  //то не логично запрещать его. Например почти все кто использует редактирование, запрещают редактирование папок,
                  //но не нужно запрещать редактирование только что добавленных папок.
                  allowEdit = record.getState() === Record.RecordState.DETACHED || (beginEditResult !== false && beginEditResult !== BeginEditResult.CANCEL);
                  if (beginEditResult === BeginEditResult.PENDING_ALL) {
                     this._addPendingOperation();
                  }
                  return Deferred.success(allowEdit ? record : false);
               }
            },
            /**
             * Регистрируем pending лишь при изменении полей редактируемой записи
             * @param record
             * @private
             */
            _subscribeToAddPendingOperation: function(record) {
               record.subscribe('onPropertyChange', this._addPendingOperationByChange, this);
            },
            _unsubscribeFromAddPendingOperation: function(record) {
               record.unsubscribe('onPropertyChange', this._addPendingOperationByChange, this);
            },
            /**
             * Регистрирует операцию ожидания у родителя, к которому подмешан Lib/Mixins/PendingOperationParentMixin
             * @private
             */
            _addPendingOperation: function() {
               var
                  opener = this.getOpener();
               if (opener) {
                  this._pendingOperation = this._registerPendingOperation('EditInPlaceController', this._handlePendingOperation.bind(this), opener);
               }
            },
            /**
             * Регистрирует операцию ожидания по событию изменения
             * @param event
             * @private
             */
            _addPendingOperationByChange: function(event) {
               this._addPendingOperation();
               this._unsubscribeFromAddPendingOperation(event.getTarget());
            },
            /**
             * Разрегистрирует операцию ожидания у родителя, к которому подмешан Lib/Mixins/PendingOperationParentMixin
             * @private
             */
            _removePendingOperation: function() {
               var
                  opener = this.getOpener();
               if (opener && this._pendingOperation) {
                  this._unregisterPendingOperation(this._pendingOperation);
                  this._pendingOperation = undefined;
               }
            },
            /**
             * Обрабатывает операцию ожидания, пришедшую от родителя, в котором была зарегистрирована эта операция (метод _addPendingOperation)
             * @param withSave
             * @returns {*}
             * @private
             */
            _handlePendingOperation: function(withSave) {
               return withSave ? this.commitEdit() : this.cancelEdit();
            },
            /**
             * Завершить редактирование по месту с сохранением
             * @param {Boolean} commitAdd При добавлении записать добавляемую запись на бл даже если она не была изменена.
             * @private
             */
            commitEdit: function(commitAdd) {
               return this._prepareEndEdit(!!this._pendingOperation || (commitAdd && this._isAdd));
            },
            /**
             * Завершить редактирование по месту без сохранения
             * @private
             */
            cancelEdit: function() {
               return this._prepareEndEdit(false);
            },

            _prepareEndEdit: function(withSaving) {
               var
                  endEditResult,
                  self = this,
                  eip = this._getEditingEip();
               //При начале редактирования строки(если до этого так же что-то редактировалось), данный метод вызывается два раза:
               //первый по уходу фокуса с предидущей строки, второй при начале редактирования новой строки. Если второй вызов метода
               //произойдёт раньше чем завершится первый, то мы два раза попытаемся завершить редактирование, что ведёт к 2 запросам
               //на сохранения записи. Чтобы это предотвратить добавим проверку на то, что сейчас уже идёт сохранение(this._savingDeferred.isReady())
               if (eip && this._savingDeferred.isReady()) {
                  this._savingDeferred = new Deferred();
                  endEditResult = this._notify('onEndEdit', eip.getEditingRecord(), withSaving);
                  this._notify('onBeginSave');
                  if (endEditResult instanceof Deferred) {
                     return endEditResult.addBoth(function(result) {
                        result = endEditResult.isSuccessful() ? result : EndEditResult.CANCEL;
                        return self._endEdit(eip, withSaving, result);
                     });
                  } else {
                     return this._endEdit(eip, withSaving, endEditResult);
                  }
               }
               //TODO: Надо обсудить c Витей, почему в стрельнувшем Deferred и если результат тоже был Deferred - нельзя делать addCallback.
               /* Уточнение: вот это НЕ работает и никто не знает как это починить.
                  var
                     res = $ws.proto.Deferred.success(),
                     d1 = $ws.proto.Deferred.success(),
                     d2 = $ws.proto.Deferred.success();
                  d1.addCallback(function(){ return res; });
                  d2.addCallback(function(){ return res; }); */
               /**
                * Как код упал, так его и чиним. Никогда нельзя было делать addCallback к дефереду, который уже отстрелили.
                * 2 года код ниже не менялся и код, в пендингах и в deferred
                * Еще одна причина убрать Deferred
                */
               return (this._savingDeferred.isReady() || this._savingDeferred.isCallbacksLocked()) ? Deferred.success() : this._savingDeferred;
            },
            _endEdit: function(eip, withSaving, endEditResult) {
               var
                   self = this,
                   needValidate;
               //TODO: Поддержка старого варианта результата.
               if (typeof endEditResult === "boolean") {
                  endEditResult = endEditResult ? EndEditResult.SAVE : EndEditResult.NOT_SAVE;
                  IoC.resolve('ILogger').log('onEndEdit', 'Boolean result is deprecated. Use constants EditInPlaceBaseController.EndEditResult.');
               }

               //Не портим переменную withSaving в случае CUSTOM_LOGIC
               if (endEditResult && endEditResult !== EndEditResult.CUSTOM_LOGIC) {
                  withSaving = endEditResult === EndEditResult.SAVE;
               }
               needValidate = withSaving || endEditResult === EndEditResult.CUSTOM_LOGIC;

               if (endEditResult === EndEditResult.CANCEL || needValidate && !eip.validate()) {
                  this._notify('onEndSave');
                  this._savingDeferred.errback();
                  return Deferred.fail();
               } else if (endEditResult === EndEditResult.CUSTOM_LOGIC) {
                  this._afterEndEdit(eip, withSaving);
                  return Deferred.success();
               } else {
                  this._updateModel(eip, withSaving).addCallback(function () {
                     self._afterEndEdit(eip, withSaving);
                  }).addErrback(function() {
                     self._notify('onEndSave');
                     self._savingDeferred.errback();
                  });
                  return this._savingDeferred;
               }
            },
            _getEditingEip: function() {
               return this._eip && this._eip.isEdit() ? this._eip : null;
            },
            _updateModel: function(eip, withSaving) {
               var
                  self = this,
                  deferred = Deferred.success(),
                  eipRecord = eip.getEditingRecord();
               if (withSaving) {
                  if (this._options.dataSource) {
                     deferred = this._options.dataSource.update(eipRecord).addCallback(function () {
                        self._acceptChanges(eip, eipRecord);
                     }).addErrback(function (error) {
                        require(['SBIS3.CONTROLS/Utils/InformationPopupManager'], function(InformationPopupManager) {
                           InformationPopupManager.showMessageDialog({
                              message: error.message,
                              opener: self,
                              status: 'error'
                           });
                        });
                        return error;
                     });
                  } else {
                     this._acceptChanges(eip, eipRecord);
                  }
               }
               return deferred;
            },
            _acceptChanges: function(eip, record) {
               eip.acceptChanges();
               if (this._editingRecord) {
                  this._editingRecord.merge(record);
                  this._editingRecord = undefined;
               }
               if (this._isAdd) {
                  this._options.items.add(record);
               }
            },
            _afterEndEdit: function(eip, withSaving) {
               var isAdd = this._isAdd;
               this._notify('onEndSave');
               //После завершения редактирования, обязательно нужно удалить навешенный pending
               this._removePendingOperation();
               //При завершение редактирования, нужно сначала удалять фейковую строку, а потом скрывать редакторы.
               //Иначе если сначала скрыть редакторы, курсор мыши может оказаться над фейковой строкой и произойдёт
               //нотификация о смене hoveredItem, которой быть не должно, т.к. у hoveredItem не будет ни рекорда ни контейнера.
               if (isAdd) {
                  this._isAdd = false;
                  this._destroyAddTarget();
               }
               eip.endEdit();
               this._notify('onAfterEndEdit', eip.getOriginalRecord(), eip.getTarget(), withSaving);

               if (this._needDestroyEip(isAdd)) {
                  this._destroyEip();
               }
               if (!this._savingDeferred.isReady()) {
                  this._savingDeferred.callback();
               }
            },

            _needDestroyEip: function(afterAdd) {
               //Редактирование записи может быть завершено с помощью нажатия клавиши enter, тогда сразу после завершения
               //редактирования, будет запущено редактирование следующей строки(this._isEditNextTarget = true).
               //При разрушении редакторов, фокус перейдёт на таблицу, и нажатия клавиш будет обрабатываться таблицей.
               //Между завершение редактирования, и началом нового редактирования могут происходить асинхронные операции,
               //например вычетка записи с бл. Если в этот момент нажать ещё раз enter, то это нажатие будет обработано
               //таблицей, т.к. редакторы разрушились, и будет показана карточка элемента таблицы. Такого происходить не должно.
               //Поэтому в случае this._isEditNextTarget = true, не будем разрушать редактирование, чтобы не повторилась
               //вышеуказанная ошибка. В случае если было добавление по месту, редактирования можно разрушать всегда,
               //т.к. зажатие клавиши enter при добавлении, нетиповой сценарий, т.к. пустые записи создаваться не должны,
               //и после первого же нажатия enter случится ошибка валидации.
               return !this._isEditNextTarget || afterAdd;
            },

            _prepareAdd: function(options) {
               var
                  creatingDeferred,
                  modelOptions,
                  // Поддержал deferred в качестве результата onBeginAdd, что позволит самостоятельно создавать записи при добавлении по месту
                  beginAddResult = this._notify('onBeginAdd', options);
               if (beginAddResult instanceof Deferred) {
                  creatingDeferred = beginAddResult;
               } else {
                  modelOptions = options.model || beginAddResult;
                  creatingDeferred = this._createModel(modelOptions, options.preparedModel)
               }
               return creatingDeferred;
            },
            add: function(options, withoutActivateFirstControl) {
               var
                  self = this,
                  editingRecord;
               if (!this._addLock) {
                  this._addLock = true;
                  this._lastTargetAdding = options.target;
                  return this.commitEdit().addCallback(function() {
                     return self._prepareAdd(options).addCallback(function (createdModel) {
                        return self._prepareEdit(createdModel).addCallback(function(model) {
                           if (self._options.parentProperty) {
                              if (options.target) {
                                 model.set(self._options.parentProperty, options.target.getContents().getId());
                              } else {
                                 // Берем именно currentRoot, ведь он может отличаться от null
                                 model.set(self._options.parentProperty, self._options.currentRoot !== undefined ? self._options.currentRoot : null);
                              }
                              model.acceptChanges([self._options.parentProperty]);
                           }
                           //Единственный надёжный способ при завершении добавления записи узнать, что происходит именно добавление, это запомнить флаг.
                           //Раньше использовалось проверка на getState, но запись могли перечитать, и мы получали неверный результат.
                           //Так же мы пытались находить запись в текущем рекордсете, но например при поиске надор данных изменяется и вызывается
                           //завершение редактирования, но записи уже может не быть в рекордсете.
                           self._isAdd = true;
                           self._createAddTarget(model, options);
                           self._getEip().edit(model, undefined, withoutActivateFirstControl);
                           editingRecord = self._getEip().getEditingRecord();
                           if (!self._pendingOperation) {
                              self._subscribeToAddPendingOperation(editingRecord);
                           }
                           self._notify('onAfterBeginEdit', editingRecord);
                           return editingRecord;
                        });
                     });
                  }).addBoth(function(result){
                     self._addLock = false;
                     return result;
                  });
               } else {
                  return Deferred.fail();
               }
            },
            _createModel: function(modelOptions, preparedModel) {
               if (preparedModel instanceof Model) {
                  return Deferred.success(preparedModel);
               } else {
                  return this._options.dataSource.create(modelOptions).addCallback(function(model) {
                     return model;
                  }).addErrback(function(error) {
                     require(['SBIS3.CONTROLS/Utils/InformationPopupManager'], function(InformationPopupManager) {
                        InformationPopupManager.showMessageDialog({
                           message: error.message,
                           status: 'error'
                        });
                     });
                     return error;
                  });
               }
            },
            _createAddTarget: function(model, options) {
               var
                   lastTarget,
                   currentTarget,
                   targetHash = null,
                   addTarget = $(AddRowTpl({
                      model: model,
                      columns: this._options.columns,
                      ignoreFirstColumn: this._options.ignoreFirstColumn
                   }));
               
               addTarget.attr('data-id', model.getId() === undefined ? '' : model.getId() + '');
               if (options.target) {
                  // Могут сделать reload в событии onEndEdit и тогда hash поменяется. Приходится его брать повторно из itemsProjection.
                  targetHash = this._options.itemsProjection.getItemBySourceItem(this._options.items.getRecordById(options.target.getContents().getId())).getHash();
               }
               if (targetHash) {
                  currentTarget = $('.controls-ListView__item[data-hash="' + targetHash + '"]', this._options.itemsContainer.get(0));
                  if (options.addPosition !== 'top') {
                     while (currentTarget.length) {
                        lastTarget = currentTarget;
                        currentTarget = $('.controls-ListView__item[data-parent-hash="' + currentTarget.data('hash') + '"]', this._options.itemsContainer.get(0)).last();
                     }
                  }
                  addTarget.insertAfter(lastTarget || currentTarget);
               } else {
                  addTarget[options.addPosition === 'top' ? 'prependTo': 'appendTo'](this._options.itemsContainer);
               }
               this._addTarget = addTarget;
            },

            _destroyAddTarget: function() {
               if (this._addTarget) {
                  this._addTarget.remove();
                  this._addTarget = undefined;
               }
            },
            /**
             * Обработчик потери фокуса областью редактирования по месту
             * @param event
             * @private
             */
            _focusCatch: function (event) {
               if (event.which === constants.key.tab) {
                  this.editNextTarget(!event.shiftKey);
               }
            },
            _onChildFocusOut: function (event, destroyed, focusedControl) {
               var
                  // Если фокус ушел на кнопку закрытия диалога, то редактирование по месту не должно реагировать на это, т.к.
                  // его и так завершат через finishChildPendingOperation (и туда попадет правильный аргумент - с сохранением
                  // или без завершать редактирование по месту)
                  // isCloseButtonPressed: https://online.sbis.ru/opendoc.html?guid=e6e98641-8c5a-4b28-97a0-5c1caa0af1f2
                  endEdit = !this._isCloseButtonPressed && (!cInstance.instanceOfModule(focusedControl, 'Deprecated/Controls/CloseButton/CloseButton') && !focusedControl ||
                     (this._allowEndEdit(focusedControl) && this._isAnotherTarget(focusedControl, this)));
               if (endEdit) {
                  this.commitEdit();
               }
               this._isCloseButtonPressed = false;
            },
            _allowEndEdit: function(control) {
               return !control.getContainer().closest('.' + this._options.notEndEditClassName).length;
            },
            /**
             * Функция проверки, куда был переведен фокус
             * @param target
             * @param control
             * @returns {boolean} Возвращает true, если фокус переведен на компонент, не являющийся дочерним элементом родителя редактирования по месту.
             * @private
             */
            _isAnotherTarget: function(target, control) {
               return !ControlHierarchyManager.checkInclusion(control, target.getContainer());
            },

            _destroyEip: function() {
               if (this._eip) {
                  this._eip.destroy();
                  //Необходимо разрушить фейковую строку добавления, при разрушении редакторов, т.к. редакторы разрушаются
                  //например при вызове relaod, а DOM чистится только после того, как отработает списочный метод.
                  //В указанном промежутке времени,в DOM будет лежать пустая строка, которая выглядит некрасиво.
                  this._destroyAddTarget();
                  this._eip = null;
               }
            },
            destroy: function() {
               if (this._closeButton) {
                  this._closeButton.off('mousedown', this._closeButtonPressedCb);
               }
               this.cancelEdit();
               this._destroyEip();
               EditInPlaceBaseController.superclass.destroy.apply(this, arguments);
            }
         });

      EditInPlaceBaseController.EndEditResult = EndEditResult;
      EditInPlaceBaseController.BeginEditResult = BeginEditResult;

      return EditInPlaceBaseController;
   });
