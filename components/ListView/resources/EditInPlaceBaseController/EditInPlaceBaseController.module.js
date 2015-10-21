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
            _updateArea: function (area) {
               area.editInPlace.getContainer().insertBefore(area.target);
               area.target.hide();
               area.editInPlace.show();
               area.editInPlace.updateFields(area.record);
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
            _editNextTarget: function (editNextRow, closeIfLast, activateFirstControl) {
               var
                  result,
                  self = this,
                  area = this._getEditingArea(),
                  newTarget = area.target[editNextRow ? 'next' : 'prev']('.controls-ListView__item');
               if (newTarget.length && !newTarget.hasClass('controls-ListView__folder')) {
                  result = this.finishEditing(true, true);
                  if (result instanceof $ws.proto.Deferred) {
                     result.addCallback(function () {
                        self._editAnotherRow(newTarget, activateFirstControl);
                     });
                  } else {
                     this._editAnotherRow(newTarget, activateFirstControl);
                  }
               } else if (closeIfLast) {
                  this.finishEditing(true);
               }
            },
            /**
             * Обработчик потери фокуса областью редактирования по месту
             * @param event
             * @private
             */
            _focusCatch: function (event) {
               if (event.which === $ws._const.key.tab && !event.shiftKey) {
                  this._editNextTarget(true, true, true);
               }
            }
         });

      return EditInPlaceBaseController;
   });