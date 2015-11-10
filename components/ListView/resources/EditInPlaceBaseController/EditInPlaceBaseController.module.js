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
                  ignoreFirstColumn: false,
                  editFieldFocusHandler: undefined,
                  dataSource: undefined,
                  dataSet: undefined,
                  itemsContainer: undefined
               },
               _area: undefined,
               _editing: false,
               _areaHandlers: null
            },
            $constructor: function () {
               this._publish('onFieldChange');
               this._areaHandlers = {
                  onKeyDown: this._onKeyDown.bind(this)
               };
               this._area = this._initArea();
               this._area.editInPlace.getContainer().bind('keyup', this._areaHandlers.onKeyDown);
            },
            _initArea: function() {
               var self = this;
               return {
                  editInPlace: new EditInPlace({
                     template: this._options.template,
                     columns: this._options.columns,
                     element: $('<div>'),
                     ignoreFirstColumn: this._options.ignoreFirstColumn,
                     context: this._getContextForArea(),
                     focusCatch: this._focusCatch.bind(this),
                     parent: this,
                     handlers: {
                        onChildFocusOut: this._onChildFocusOut.bind(this),
                        onFieldChange: function(event, fieldName, record) {
                           event.setResult(self._notify('onFieldChange', fieldName, record));
                        }
                     }
                  }),
                  record: null,
                  target: null
               };
            },
            _getContextForArea: function () {
               var ctx = new $ws.proto.Context({restriction: 'set'});

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
            canAcceptFocus: function () {
               return false;
            },
            /**
             * Обработчик глобального хука клавиатуры
             * @param {Object} e jQuery event
             * @private
             */
            _onKeyDown: function (e) {
               var
                  key = e.which;
               if (key === $ws._const.key.esc) {
                  e.stopImmediatePropagation();
                  e.preventDefault();
                  this.finishEditing();
               } else if (key === $ws._const.key.enter || key === $ws._const.key.down || key === $ws._const.key.up) {
                  e.stopImmediatePropagation();
                  e.preventDefault();
                  this._editNextTarget(key === $ws._const.key.down || key === $ws._const.key.enter);
               }
            },
            _editNextTarget: function (editNextRow) {
               var area = this._getEditingArea(),
                  //TODO: в ie8 работать не будет из за :not()
                  newTarget = area.target[editNextRow ? 'nextAll' : 'prevAll']('.js-controls-ListView__item:not(".controls-editInPlace")').slice(0, 1);
               if (newTarget.length && !newTarget.hasClass('controls-ListView__folder')) {
                  this.showEditing(newTarget);
               } else if (!newTarget.length && editNextRow) {
                  this.showAdd();
               }
            },
            showEditing: function (target, record) {
               var result,
                   self = this;
               if (this._editing) {
                  result = this.finishEditing(true);
               }
               if (result instanceof $ws.proto.Deferred) {
                  result.addCallback(function() {
                     self._showEditing(target, record);
                  });
               } else if (result !== false) {
                  this._showEditing(target, record);
               }
            },
            _showEditing: function(target, record, notActivate) {
               var area,
                   isAdd = target.hasClass('controls-EditInPlace__add');
               if (!this._editing) {
                  this._editing = true;
               }
               area = this._getEditingArea();
               area.addInPlace = isAdd;
               area.target = target;
               area.record = record || this._options.dataSet.getRecordByKey(target.data('id'));
               this._showArea(area, notActivate);
            },
            _showArea: function(area, notActivate) {
               area.editInPlace.getContainer().insertBefore(area.target);
               area.target.hide();
               area.editInPlace.show();
               area.target.hide();
               area.editInPlace.updateFields(area.record);
               if (notActivate !== true) {
                  area.editInPlace.activateFirstControl();
               }
            },
            finishEditing: function(saveFields) {
               var
                  self = this,
                  result,
                  area = this._getEditingArea(),
                  validate = area.editInPlace.validate();
               if (validate || !saveFields) {
                  this._editing = null;
                  area.editInPlace.hide();
                  area.target.show();
                  if (saveFields) {
                     result = area.editInPlace.applyChanges();
                     if (result instanceof $ws.proto.Deferred) {
                        result.addCallback(function () {
                           self._finishEditing(area, saveFields);
                        });
                        return result;
                     }
                  }
                  this._finishEditing(area, saveFields);
               }
               return validate;
            },
            _finishEditing: function(area, saveFields) {
               if (saveFields) {
                  this._syncDataSource(area);
               }
               if (area.addInPlace) {
                  this._removeAddInPlace(area, saveFields);
               }
            },
            showAdd: function() {
               var
                   area = this._getEditingArea(),
                   target = $('<div class="js-controls-ListView__item controls-EditInPlace__add"></div>');
               if (!area || area.editInPlace.validate()) {
                  target.appendTo(this._options.itemsContainer);
                  this._options.dataSource.create().addCallback(function (rec) {
                     rec = this._options.dataSet._prepareRecordForAdd(rec);
                     target.attr('data-id', rec.getKey());
                     this.showEditing(target, rec);
                  }.bind(this));
               }
            },
            _removeAddInPlace: function(area, saveFields) {
               area.target.removeClass('.controls-EditInPlace__add');
               area.addInPlace = false;
               if (!saveFields) {
                  area.target.remove();
               }
            },
            _syncDataSource: function(area) {
               var self = this;
               if (area.addInPlace) {
                  self._options.dataSet.push(area.record);
               }
               self._options.dataSource.sync(self._options.dataSet);
            },
            /**
             * todo Переписать этот метод. Надо переделать объект _areas на две отдельные переменные: _area и _secondArea
             * @returns {SBIS3.CONTROLS.EditInPlaceClickController.$protected._area|*|SBIS3.CONTROLS.EditInPlaceClickController._area}
             * @private
             */
            _getEditingArea: function() {
               return this._editing ? this._area : null;
            },
            /**
             * Функция позволяет узнать, выполняется ли сейчас редактирование по месту
             * @returns {boolean} Выполняется редактирование по месту, или нет
             */
            isEditing: function () {
               return !!this._editing;
            },
            /**
             * Обработчик потери фокуса областью редактирования по месту
             * @param event
             * @private
             */
            _focusCatch: function (event) {
               if (event.which === $ws._const.key.tab) {
                  this._editNextTarget(!event.shiftKey, true);
               }
            },
            _onChildFocusOut: function (event, control) {
               if (!this._isChildControl(control)) {
                  this.finishEditing(true);
               }
            },
            _isChildControl: function(control) {
               while (control && control !== this) {
                  control = control.getParent() || control.getOpener();
               }
               return control === this;
            },
            destroy: function() {
               if (this.isEditing()) {
                  this.finishEditing();
               }
               this._area.editInPlace.getContainer().unbind('keyup', this._areaHandlers.onKeyDown);
               this._area.editInPlace.destroy();
               this._area = null;
               EditInPlaceBaseController.superclass.destroy.apply(this, arguments);
            }
         });

      return EditInPlaceBaseController;
   });