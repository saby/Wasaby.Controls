/**
 * Created by as.suhoruchkin on 15.10.2015.
 */

define('js!SBIS3.CONTROLS.EditInPlaceBaseController',
   [
      'js!SBIS3.CORE.CompoundControl',
      'js!SBIS3.CONTROLS.EditInPlace'
   ],
   function (CompoundControl, EditInPlace) {

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
                  editFieldFocusHandler: undefined,
                  dataSource: undefined,
                  dataSet: undefined,
                  itemsContainer: undefined
               },
               _eip: undefined,
               _savingDeferred: undefined,
               _editingRecord: undefined,
               _eipHandlers: null
            },
            $constructor: function () {
               this._publish('onItemValueChanged', 'onBeginEdit', 'onEndEdit', 'onBeginAdd', 'onAfterEndEdit');
               this._eipHandlers = {
                  onKeyDown: this._onKeyDown.bind(this)
               };
               this._eip = new EditInPlace(this._getEditInPlaceConfig());
               //TODO: EIP Сухоручкин переделать на события
               this._eip.getContainer().bind('keyup', this._eipHandlers.onKeyDown);
               this._savingDeferred = $ws.proto.Deferred.success();
            },

            _getEditInPlaceConfig: function() {
               return {
                  editingTemplate: this._options.editingTemplate,
                  columns: this._options.columns,
                  element: $('<div>').prependTo(this._options.itemsContainer),
                  itemsContainer: this._options.itemsContainer,
                  getCellTemplate: this._options.getCellTemplate,
                  ignoreFirstColumn: this._options.ignoreFirstColumn,
                  context: this._getContextForEip(),
                  focusCatch: this._focusCatch.bind(this),
                  parent: this,
                  handlers: {
                     onItemValueChanged: function(event, difference, model) {
                        event.setResult(this._notify('onItemValueChanged', difference, model));
                     }.bind(this),
                     onChildFocusOut: this._onChildFocusOut.bind(this)
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
                  this._editNextTarget(key === $ws._const.key.down || key === $ws._const.key.enter);
               }
            },
            _editNextTarget: function (editNextRow) {
               var
                  nextTarget = this._getNextTarget(editNextRow);
               if (nextTarget.length) {
                  this.edit(nextTarget, this._options.dataSet.getRecordByKey(nextTarget.attr('data-id')));
               } else if (editNextRow && this._options.modeAutoAdd) {
                  this.add();
               } else {
                  this.endEdit(true);
               }
            },
            _getNextTarget: function(editNextRow) {
               var currentTarget = this._eip.getTarget();
               return currentTarget[editNextRow ? 'next' : 'prev']('.js-controls-ListView__item:not(".controls-editInPlace")');
            },
            showEip: function(target, record) {
               if (target && record) {
                  return this.edit(target, record)
               } else {
                  return this.add();
               }
            },
            edit: function (target, record) {
               return this._prepareEdit(record).addCallback(function(preparedrecord) {
                  if (preparedrecord) {
                     this._eip.edit(target, preparedrecord);
                  }
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
             * Завершить редактирование по месту
             * @param {Boolean} withSaving Сохранить изменения в dataSet
             * @private
             */
            endEdit: function(withSaving) {
               var
                  eip = this._getEditingEip(),
                  endEditResult;
               if (eip) {
                  endEditResult = this._notify('onEndEdit', eip.getEditingRecord(), withSaving);
                  if (endEditResult !== undefined) {
                     withSaving = endEditResult;
                  }
                  if (!withSaving || eip.validate()) {
                     eip.endEdit();
                     this._savingDeferred = withSaving ? eip.applyChanges() : $ws.proto.Deferred.success();
                     return this._savingDeferred.addCallback(function() {
                        this._endEdit(eip, withSaving);
                     }.bind(this));
                  }
                  return $ws.proto.Deferred.fail();
               }
               return this._savingDeferred;
            },
            _getEditingEip: function() {
               return this._eip.isEdit() ? this._eip : null;
             },
            _endEdit: function(eip, withSaving) {
               var
                  eipRecord = eip.getEditingRecord();
               if (this._editingRecord) {
                  this._editingRecord.merge(eipRecord);
                  this._editingRecord = undefined;
               }
               if (!this._options.dataSet.getRecordByKey(eipRecord.getKey())) {
                  withSaving ? this._options.dataSet.push(eipRecord) : eip.getTarget().remove();
               }
               if (withSaving) {
                  this._options.dataSource.sync(this._options.dataSet);
               }
               this._notify('onAfterEndEdit', withSaving ? this._options.dataSet.getRecordByKey(eipRecord.getKey()) : eipRecord, eip.getTarget(), withSaving);
            },
            add: function() {
               var options,
                   self = this;
               return this.endEdit(true).addCallback(function() {
                  options = self._notify('onBeginAdd');
                  return self._options.dataSource.create(options).addCallback(function (record) {
                     var target = $('<div class="js-controls-ListView__item"></div>').appendTo(self._options.itemsContainer);
                     self._eip.edit(target, record);
                     return record;
                  });
               });
            },
            /**
             * Обработчик потери фокуса областью редактирования по месту
             * @param event
             * @private
             */
            _focusCatch: function (event) {
               if (event.which === $ws._const.key.tab) {
                  this._editNextTarget(!event.shiftKey);
               }
            },
            _onChildFocusOut: function (event, control) {
               if (!(this._isChildControl(control) || this._isCurrentTarget(control))) {
                  this.endEdit(true);
               }
            },
            _isCurrentTarget: function(control) {
               var currentTarget = this._getEditingEip().getTarget(),
                   newTarget  = control.getContainer().closest('.js-controls-ListView__item');
               return currentTarget.attr('data-id') === newTarget.attr('data-id');
            },
            _isChildControl: function(control) {
               while (control && control !== this) {
                  control = control.getParent() || control.getOpener();
               }
               return control === this;
            },
            destroy: function() {
               this.endEdit();
               this._eip.getContainer().unbind('keyup', this._eipHandlers.onKeyDown);
               EditInPlaceBaseController.superclass.destroy.apply(this, arguments);
            }
         });

      return EditInPlaceBaseController;
   });