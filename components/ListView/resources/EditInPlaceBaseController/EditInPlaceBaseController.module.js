/**
 * Created by as.suhoruchkin on 15.10.2015.
 */

define('js!SBIS3.CONTROLS.EditInPlaceBaseController',
   [
      'js!SBIS3.CORE.CompoundControl'
   ],
   function (CompoundControl) {

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
                  dataSource: undefined,
                  dataSet: undefined,
                  addInPlaceButton: undefined
               },
               _area: undefined,
               _areaHandlers: null
            },
            $constructor: function () {
               this._publish('onFieldChange');
               this._areaHandlers = {
                  onKeyDown: this._onKeyDown.bind(this)
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
                  this._editNextTarget(key === $ws._const.key.down || key === $ws._const.key.enter, key === $ws._const.key.enter);
               }
            },
            _editNextTarget: function (editNextRow, closeIfLast) {
               var
                  result,
                  self = this,
                  area = this._getEditingArea(),
                  newTarget = area.target[editNextRow ? 'next' : 'prev']('.js-controls-ListView__item');
               while (newTarget.hasClass('controls-editInPlace')) {
                  newTarget = newTarget[editNextRow ? 'next' : 'prev']('.js-controls-ListView__item');
               }
               if (newTarget.length && !newTarget.hasClass('controls-ListView__folder')) {
                  result = this.finishEditing(true, true);
                  if (result instanceof $ws.proto.Deferred) {
                     result.addCallback(function () {
                        self.showEditing(newTarget);
                     });
                  } else {
                     this.showEditing(newTarget);
                  }
               } else if (closeIfLast) {
                  this.finishEditing(true);
               }
            },
            _showArea: function (area, target, record, activateControl) {
               area.target = target;
               area.record = record || this._options.dataSet.getRecordByKey(target.data('id'));
               area.editInPlace.getContainer().attr('data-id', area.record.getKey())
                   .bind('keyup', this._areaHandlers.onKeyDown)
                   .insertAfter(target);
               area.editInPlace.show();
               area.target.hide();
               area.editInPlace.updateFields(area.record);
               if (activateControl !== undefined) {
                  area.editInPlace.activateFirstControl();
               }
            },
            finishEditing: function(saveFields) {
               var
                   self = this,
                   result,
                   validate = this.validate(),
                   area = this._getEditingArea();
               if (validate || !saveFields) {
                  this._editing = null;
                  area.editInPlace.hide();
                  area.editInPlace.getContainer().unbind('keyup', this._areaHandlers.onKeyDown);
                  area.target.removeClass('controls-editInPlace__editing');
                  area.target.show();
                  if (saveFields) {
                     result = area.editInPlace.applyChanges();
                     if (result instanceof $ws.proto.Deferred) {
                        result.addCallback(function () {
                           self._syncDataSource(area);
                        });
                        return result;
                     }
                     this._syncDataSource(area);
                  } else if (this._options.addInPlaceButton) {
                     this._options.addInPlaceButton.show();
                  }
                  //TODO: переписать это место
                  if (area.addInPlace) {
                     if (!saveFields) {
                        area.target.remove();
                     }
                     area.addInPlace = false;
                  }
               }
               return validate;
            },
            showAdd: function(target) {
               this._options.dataSource.create().addCallback(function (rec) {
                  rec = this._options.dataSet._prepareRecordForAdd(rec);
                  target.attr('data-id', rec.getKey());
                  this.showEditing(target, rec, true);
               }.bind(this));
            },
            _syncDataSource: function(area) {
               var self = this;
               if (area.addInPlace) {
                  self._options.dataSet.push(area.record);
               }
               if (self._options.addInPlaceButton) {
                  self._options.dataSource.once('onDataSync', function () {
                     self._options.addInPlaceButton.show();
                  }.bind(self));
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
            _onChildFocusOut: function () {
               this.finishEditing(true);
            },
            destroy: function() {
               if (this.isEditing()) {
                  this.finishEditing();
               }
               EditInPlaceBaseController.superclass.destroy.apply(this, arguments);
            }
         });

      return EditInPlaceBaseController;
   });