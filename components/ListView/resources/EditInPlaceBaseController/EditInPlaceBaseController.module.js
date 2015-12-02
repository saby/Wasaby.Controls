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
                  template: undefined,
                  columns: [],
                  readRecordBeforeEdit: false,
                  ignoreFirstColumn: false,
                  editFieldFocusHandler: undefined,
                  dataSource: undefined,
                  dataSet: undefined,
                  itemsContainer: undefined,
                  onFieldChange: undefined
               },
               _eip: undefined,
               _savingDeferred: undefined,
               _editingRecord: undefined,
               _areaHandlers: null
            },
            $constructor: function () {
               this._areaHandlers = {
                  onKeyDown: this._onKeyDown.bind(this)
               };
               this._area = new EditInPlace(this._getEditInPlaceConfig());
               //TODO: EIP Сухоручкин переделать на события
               this._area.getContainer().bind('keyup', this._areaHandlers.onKeyDown);
               this._savingDeferred = $ws.proto.Deferred.success();
            },
            _getEditInPlaceConfig: function() {
               return {
                  template: this._options.template,
                  columns: this._options.columns,
                  element: $('<div>'),
                  ignoreFirstColumn: this._options.ignoreFirstColumn,
                  context: this._getContextForArea(),
                  focusCatch: this._focusCatch.bind(this),
                  onFieldChange: this._options.onFieldChange,
                  parent: this,
                  handlers: {
                     onChildFocusOut: this._onChildFocusOut.bind(this)
                  }
               };
            },
            _getContextForArea: function () {
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
                  this.endEdit();
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
               } else if (editNextRow) {
                  this.add();
               }
            },
            _getNextTarget: function(editNextRow) {
               var currentTarget = this._area.getTarget();
               return currentTarget[editNextRow ? 'nextAll' : 'prevAll']('.js-controls-ListView__item:not(".controls-editInPlace")').slice(0, 1);
            },
            edit: function (target, record) {
               var
                  self = this;
               return this.endEdit(true).addCallback(function() {
                  var
                     loadingIndicator,
                     result = new $ws.proto.Deferred();
                  //Если необходимо перечитывать запись перед редактированием, то делаем это
                  if (self._options.readRecordBeforeEdit) {
                     loadingIndicator = setTimeout(function () {
                        $ws.helpers.toggleIndicator(true);
                     }, 100);
                     result
                        .addCallback(function() {
                           return self._options.dataSource.read(record.getKey());
                        })
                        .addCallback(function(readRecord) {
                           //Запоминаем запись, которую редактируем для того, чтобы по завершению редактирования подмержить в неё измененные данные
                           self._editingRecord = record;
                           record = readRecord;
                        })
                        .addBoth(function() {
                           clearTimeout(loadingIndicator);
                           $ws.helpers.toggleIndicator(false);
                        });
                  }
                  return result.addCallback(function() {
                     self._edit(target, record);
                  }).callback();
               });
            },
            _edit: function(target, record) {
               this._area.editing = true;
               this._area.show(target, record);
               this._area.activateFirstControl();
            },
            /**
             * Завершить редактирование по месту
             * @param {Boolean} saveFields Сохранить изменения в dataSet
             * @private
             */
            endEdit: function(saveFields) {
               var area = this._area;
               if (area.editing) {
                  if (area.validate() || !saveFields) {
                     area.editing = false;
                     this._savingDeferred = saveFields ? area.applyChanges() : $ws.proto.Deferred.success();
                     return this._savingDeferred.addCallback(function() {
                        this._endEdit(area, saveFields);
                     }.bind(this));
                  }
                  return $ws.proto.Deferred.fail();
               }
               return this._savingDeferred;
            },
            _endEdit: function(area, saveFields) {
               if (this._editingRecord) {
                  this._editingRecord.merge(area.getRecord());
                  this._editingRecord = undefined;
               }
               area.hide();
               if (!this._options.dataSet.getRecordByKey(area.getRecord().getKey())) {
                  saveFields ? this._options.dataSet.push(area.getRecord()) : area.getTarget().remove();
               }
               if (saveFields) {
                  this._options.dataSource.sync(this._options.dataSet);
               }
            },
            add: function() {
               var self = this;
               return this.endEdit(true).addCallback(function() {
                  return self._options.dataSource.create().addCallback(function (rec) {
                     var target = $('<div class="js-controls-ListView__item"></div>').attr('data-id', rec.getKey()).appendTo(self._options.itemsContainer);
                     self._edit(target, rec);
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
               if (!this._isChildControl(control)) {
                  this.endEdit(true);
               }
            },
            _isChildControl: function(control) {
               while (control && control !== this) {
                  control = control.getParent() || control.getOpener();
               }
               return control === this;
            },
            destroy: function() {
               this.endEdit();
               this._area.getContainer().unbind('keyup', this._areaHandlers.onKeyDown);
               EditInPlaceBaseController.superclass.destroy.apply(this, arguments);
            }
         });

      return EditInPlaceBaseController;
   });