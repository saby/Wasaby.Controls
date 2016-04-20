/**
 * Created by as.suhoruchkin on 15.10.2015.
 */

define('js!SBIS3.CONTROLS.EditInPlaceBaseController',
   [
      'js!SBIS3.CORE.CompoundControl',
      'js!SBIS3.CONTROLS.EditInPlace',
      'js!SBIS3.CONTROLS.Data.Model'
   ],
   function (CompoundControl, EditInPlace, Model) {

      'use strict';

      /**
       * @class SBIS3.CONTROLS.EditInPlaceBaseController
       * @extends SBIS3.CORE.CompoundControl
       * @control
       * @public
       */

      var
         CONTEXT_RECORD_FIELD = 'sbis3-controls-edit-in-place',
         EditInPlaceBaseController = CompoundControl.extend(/** @lends SBIS3.CONTROLS.EditInPlaceBaseController.prototype */ {
            $protected: {
               _options: {
                  editingTemplate: undefined,
                  getCellTemplate: undefined,
                  columns: [],
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
                  ignoreFirstColumn: false,
                  notEndEditClassName: undefined,
                  editFieldFocusHandler: undefined,
                  dataSource: undefined,
                  dataSet: undefined,
                  itemsContainer: undefined,
                  getEditorOffset: undefined
               },
               _eip: undefined,
               // Используется для хранения Deferred при сохранении в редактировании по месту.
               // Обязательно нужен, т.к. лишь таким способом можно обработать несколько последовательных вызовов endEdit и вернуть ожидаемый результат (Deferred).
               _savingDeferred: undefined,
               _editingRecord: undefined,
               _eipHandlers: null
            },
            $constructor: function () {
               this._publish('onItemValueChanged', 'onBeginEdit', 'onAfterBeginEdit', 'onEndEdit', 'onBeginAdd', 'onAfterEndEdit', 'onInitEditInPlace');
               this._eipHandlers = {
                  onKeyDown: this._onKeyDown.bind(this)
               };
               this._createEip();
               this._savingDeferred = $ws.proto.Deferred.success();
            },

            _createEip: function() {
               this._destroyEip();
               this._eip = new EditInPlace(this._getEditInPlaceConfig());
               //TODO: EIP Сухоручкин переделать на события
               this._eip.getContainer().bind('keyup', this._eipHandlers.onKeyDown);
            },

            setEditingTemplate: function(template) {
               this._options.editingTemplate = template;
               this._createEip();
            },

            getEditingTemplate: function() {
               return this._options.editingTemplate;
            },

            _getEditInPlaceConfig: function() {
               var
                   self = this;
               return {
                  editingTemplate: this._options.editingTemplate,
                  columns: this._options.columns,
                  element: $('<div>').prependTo(this._options.itemsContainer),
                  itemsContainer: this._options.itemsContainer,
                  getCellTemplate: this._options.getCellTemplate,
                  ignoreFirstColumn: this._options.ignoreFirstColumn,
                  context: this._getContextForEip(),
                  focusCatch: this._focusCatch.bind(this),
                  editingItem: this._options.editingItem,
                  getEditorOffset: this._options.getEditorOffset,
                  parent: this,
                  handlers: {
                     onItemValueChanged: function(event, difference, model) {
                        event.setResult(self._notify('onItemValueChanged', difference, model));
                     },
                     onChildFocusOut: this._onChildFocusOut.bind(this),
                     onInit: function() {
                        self._notify('onInitEditInPlace', this);
                     }
                  }
               };
            },
            _getContextForEip: function () {
               var
                  ctx = new $ws.proto.Context({restriction: 'set'});
               ctx.subscribe('onFieldNameResolution', function (event, fieldName) {
                  var
                     record,
                     path = fieldName.split($ws.proto.Context.STRUCTURE_SEPARATOR);
                  if (path[0] !== CONTEXT_RECORD_FIELD) {
                     record = this.getValue(CONTEXT_RECORD_FIELD);
                     if (record && record.get(path[0]) !== undefined) {
                        event.setResult(CONTEXT_RECORD_FIELD + $ws.proto.Context.STRUCTURE_SEPARATOR + fieldName);
                     }
                  }
               });
               return ctx;
            },
            /**
             * Обработчик клавиатуры
             * @private
             */
            _onKeyDown: function (e) {
               var key = e.which;
               if (key === $ws._const.key.esc) {
                  e.stopImmediatePropagation();
                  e.preventDefault();
                  this.endEdit(false);
               } else if (key === $ws._const.key.enter || key === $ws._const.key.down || key === $ws._const.key.up) {
                  e.stopImmediatePropagation();
                  e.preventDefault();
                  this._editNextTarget(this._getCurrentTarget(), key === $ws._const.key.down || key === $ws._const.key.enter);
               }
            },
            _editNextTarget: function (currentTarget, editNextRow) {
               var
                  self = this,
                  nextTarget = this._getNextTarget(currentTarget, editNextRow);
               if (nextTarget.length) {
                  this.edit(nextTarget, this._options.dataSet.getRecordByKey(nextTarget.attr('data-id'))).addCallback(function(result) {
                     if (!result) {
                        self._editNextTarget(nextTarget, editNextRow);
                     }
                  });
               } else if (editNextRow && this._options.modeAutoAdd) {
                  this.add();
               } else {
                  this.endEdit(true);
               }
            },
            _getNextTarget: function(currentTarget, editNextRow) {
               return currentTarget[editNextRow ? 'next' : 'prev']('.js-controls-ListView__item:not(".controls-editInPlace")');
            },
            _getCurrentTarget: function() {
               return this._eip.getTarget();
            },
            showEip: function(target, model, options) {
               if (options && options.isEdit) {
                  return this.edit(target, model, options)
               } else {
                  return this.add(model, options);
               }
            },
            edit: function (target, record) {
               return this._prepareEdit(record).addCallback(function(preparedRecord) {
                  if (preparedRecord) {
                     this._eip.edit(target, preparedRecord);
                     this._notify('onAfterBeginEdit', preparedRecord);
                     return preparedRecord;
                  }
                  return preparedRecord;
               }.bind(this));
            },
            _prepareEdit: function(record) {
               var self = this;
               return this.endEdit(true).addCallback(function() {
                  var
                     loadingIndicator,
                     beginEditResult;
                  //Если необходимо перечитывать запись перед редактированием, то делаем это
                  beginEditResult = self._notify('onBeginEdit', record);
                  if (beginEditResult instanceof $ws.proto.Deferred) {
                     loadingIndicator = setTimeout(function () {
                        $ws.helpers.toggleIndicator(true);
                     }, 100);
                     return beginEditResult.addCallback(function(readRecord) {
                        self._editingRecord = readRecord;
                        return readRecord;
                     }).addBoth(function (readRecord) {
                        clearTimeout(loadingIndicator);
                        $ws.helpers.toggleIndicator(false);
                        return readRecord;
                     });
                  } else if (beginEditResult !== false) {
                     return record;
                  }
               });
            },
            /**
             * Отправить команду блокировки
             * todo EIP Авраменко, Сухоручкин: сейчас сделано через pendingOperation, в будущем переделать на команды блокировки родительких компонентов
             * @private
             */
            _sendLockCommand: function(savingDeferred) {
               var
                  opener = this.getOpener(),
                  dialog;
               if (opener) {
                  dialog = opener.getParentByClass('SBIS3.CORE.RecordArea') || opener.getTopParent();
                  if (dialog) {
                     dialog.addPendingOperation(savingDeferred);
                  }
               }
            },
            /**
             * Завершить редактирование по месту
             * @param {Boolean} withSaving Сохранить изменения в dataSet
             * @private
             */
            endEdit: function(withSaving) {
               var
                  eip = this._getEditingEip(),
                  record,
                  endEditResult;
               //При начале редактирования строки(если до этого так же что-то редактировалось), данный метод вызывается два раза:
               //первый по уходу фокуса с предидущей строки, второй при начале редактирования новой строки. Если второй вызов метода
               //произойдёт раньше чем завершится первый, то мы два раза попытаемся завершить редактирование, что ведёт к 2 запросам
               //на сохранения записи. Чтобы это предотвратить добавим проверку на то, что сейчас уже идёт сохранение(this._savingDeferred.isReady())
               if (eip && this._savingDeferred.isReady()) {
                  record = eip.getEditingRecord();
                  withSaving = withSaving && record.isChanged();
                  endEditResult = this._notify('onEndEdit', record, withSaving);
                  if (endEditResult instanceof $ws.proto.Deferred) {
                     return endEditResult.addCallback(function(result) {
                        return this._endEdit(eip, withSaving, result);
                     }.bind(this));
                  } else {
                     return this._endEdit(eip, withSaving, endEditResult);
                  }
               }
               //TODO: Надо обсудить c Витей, почему в стрельнувшем Deferred и если результат тоже был Deferred - нельзя делать addCallback.
               return this._savingDeferred.isReady() ? $ws.proto.Deferred.success() : this._savingDeferred;
            },
            _endEdit: function(eip, withSaving, endEditResult) {
               if (endEditResult !== undefined) {
                  withSaving = endEditResult;
               }
               if (!withSaving || eip.validate()) {
                  this._savingDeferred = new $ws.proto.Deferred();
                  this._sendLockCommand(this._savingDeferred);
                  if (withSaving) {
                     eip.applyChanges().addCallback(function() {
                        this._afterEndEdit(eip, withSaving);
                     }.bind(this))
                  } else {
                     this._afterEndEdit(eip, withSaving);
                  }
                  return this._savingDeferred;
               }
               return $ws.proto.Deferred.fail();
            },
            _getEditingEip: function() {
               return this._eip.isEdit() ? this._eip : null;
            },
            _afterEndEdit: function(eip, withSaving) {
               var
                  eipRecord = eip.getEditingRecord(),
                  isAdd = !eipRecord.isStored();
               if (this._editingRecord) {
                  this._editingRecord.merge(eipRecord);
                  this._editingRecord = undefined;
               }
               if (withSaving) {
                  this._options.dataSource.update(eipRecord).addCallback(function() {
                     isAdd && this._options.dataSet.push(eipRecord);
                  }.bind(this)).addBoth(function() {
                     this._notifyOnAfterEndEdit(eip, eipRecord, withSaving, isAdd);
                  }.bind(this));
               } else {
                  this._notifyOnAfterEndEdit(eip, eipRecord, withSaving, isAdd);
               }
            },
            //TODO: Нужно переименовать метод
            _notifyOnAfterEndEdit: function(eip, eipRecord, withSaving, isAdd) {
               var target = eip.getTarget();
               eip.endEdit();
               isAdd && target.remove();
               this._notify('onAfterEndEdit', eipRecord, target, withSaving);
               if (!this._savingDeferred.isReady()) {
                  this._savingDeferred.callback();
               }
            },
            add: function(model, options) {
               var
                   self = this,
                   target = this._createAddTarget(options);
               model = model || this._notify('onBeginAdd');
               return this.endEdit(true).addCallback(function() {
                  return self._options.dataSource.create(model).addCallback(function (record) {
                     target.attr('data-id', '' + record.getId());
                     self._eip.edit(target, record);
                     // Todo разобраться в целесообразности этого пересчёта вообще, почему на десктопе всё работает?
                     // При начале отслеживания высоты строки, один раз нужно пересчитать высоту синхронно, это нужно для добавления по месту,
                     //т.к. при добавлении создаётся новая tr у которой изначально нет высоты и опции записи не могут верно спозиционироваться.
                     self._eip.recalculateHeight();
                     self._notify('onAfterBeginEdit', record);
                     return record;
                  });
               });
            },
            _createAddTarget: function(options) {
               var
                   footer,
                   target;
               if (this._options.columns) {
                  target = $('<tr><td colspan="' + (this._options.columns.length + (this._options.ignoreFirstColumn ? 1 : 0)) + '"></td></tr>');
               } else {
                  target = $('<div>');
               }
               target.addClass("js-controls-ListView__item controls-ListView__item");
               if (options && options.initiator) {
                  footer = options.initiator.closest('.controls-TreeDataGridView__folderFooter');
               }
               return footer ? target.insertBefore(footer) : target.appendTo(this._options.itemsContainer);
            },
            /**
             * Обработчик потери фокуса областью редактирования по месту
             * @param event
             * @private
             */
            _focusCatch: function (event) {
               if (event.which === $ws._const.key.tab) {
                  this._editNextTarget(this._getCurrentTarget(), !event.shiftKey);
               }
            },
            _onChildFocusOut: function (event, control) {
               var
                  endEdit = this._allowEndEdit(control) && (this._isAnotherTarget(control, this) || this._isCurrentTarget(control));
               if (endEdit) {
                  this.endEdit(true);
               }
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
               do {
                  target = target.getParent() || target.getOpener();
               }
               while (target && target !== control);
               return target !== control;
            },
            _isCurrentTarget: function(control) {
               var currentTarget = this._getEditingEip().getTarget(),
                   newTarget  = control.getContainer().closest('.js-controls-ListView__item');
               return currentTarget.attr('data-id') == newTarget.attr('data-id');
            },
            _destroyEip: function() {
               if (this._eip) {
                  this.endEdit();
                  this._eip.getContainer().unbind('keyup', this._eipHandlers.onKeyDown);
                  this._eip.destroy();
                  this._eip = null;
               }
            },
            destroy: function() {
               this._destroyEip();
               EditInPlaceBaseController.superclass.destroy.apply(this, arguments);
            }
         });

      return EditInPlaceBaseController;
   });