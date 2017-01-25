/**
 * Created by as.avramenko on 01.04.2015.
 */

define('js!SBIS3.CONTROLS.EditInPlaceHoverController',
   [
   "Core/core-merge",
   "Core/Deferred",
   "js!SBIS3.CONTROLS.EditInPlaceBaseController",
   "js!SBIS3.CONTROLS.EditInPlace"
],
   function ( cMerge, Deferred, EditInPlaceBaseController, EditInPlace) {

      'use strict';

      /**
       * @class SBIS3.CONTROLS.EditInPlaceHoverController
       * @extends SBIS3.CONTROLS.EditInPlaceBaseController
       * @control
       * @public
       */

      var
         EditInPlaceHoverController = EditInPlaceBaseController.extend( /** @lends SBIS3.CONTROLS.EditInPlaceHoverController.prototype */ {
            $protected: {
               _options: {
               },
               _hoveredEip: null,
               _secondEip: undefined
            },

            isEdit: function() {
               var firstEipIsEdit = EditInPlaceHoverController.superclass.isEdit.apply(this);
               return firstEipIsEdit || (this._secondEip && this._secondEip.isEdit());
            },

            _createEip: function() {
               EditInPlaceHoverController.superclass._createEip.apply(this);
               this._secondEip = new EditInPlace(this._getEditInPlaceConfig());
            },

            _getEditInPlaceConfig: function() {
               return cMerge(EditInPlaceHoverController.superclass._getEditInPlaceConfig.apply(this), {
                  handlers: {
                     onChildControlFocusIn: this._onChildControlFocusIn.bind(this),
                     onFocusIn: this._onChildFocusIn.bind(this)
                  }
               })
            },
            _onChangeHeight: function() {
               if (this._hoveredEip) {
                  this._hoveredEip.hide();
               }
               EditInPlaceHoverController.superclass._onChangeHeight.apply(this, arguments)
            },
            _getCurrentTarget: function() {
               return this._getEditingEip().getTarget();
            },
            showEip: function(model, options) {
               if (options && options.isEdit === false) {
                  this.show(model, this._options.itemsProjection.getItemBySourceItem(model));
                  return Deferred.success();
               } else {
                  return EditInPlaceHoverController.superclass.showEip.apply(this, arguments);
               }
            },
            /**
             * Обновить область отображаемую по ховеру
             * @param {Object} target Элемент, для которого отобразить область по ховеру
             * @private
             */
            show: function(model, itemProj) {
               if (this._notify('onBeginEdit', model) !== false) {
                  if (!this._hoveredEip) {
                     this._hoveredEip = this._getEip().isEdit() ? this._secondEip : this._eip;
                  }
                  this._hoveredEip.show(model, itemProj);
               } else {
                  if (this._hoveredEip) {
                     this._hoveredEip.hide();
                  }
               }
            },
            /**
             * Скрыть область отображаемую по ховеру
             * @private
             */
            hide: function() {
               if (this._hoveredEip) {
                  this._hoveredEip.hide();
                  this._hoveredEip = null;
               }
            },
            _onChildControlFocusIn: function(event, control) {
               this._options.editFieldFocusHandler && this._options.editFieldFocusHandler(control);
            },
            edit: function (model) {
               var hoveredEip = this._hoveredEip;
               return this.endEdit(true).addCallback(function() {
                  if (hoveredEip && (hoveredEip.getOriginalRecord().getId() === model.getId())) {
                     if (this._notify('onBeginEdit', model) !== false) {
                        this._hoveredEip = null;
                        hoveredEip.edit(model);
                        this._notify('onAfterBeginEdit', model);
                        if (!this._pendingOperation) {
                           this._subscribeToAddPendingOperation(model);
                        }
                        return model;
                     }
                  } else {
                     return EditInPlaceHoverController.superclass.edit.apply(this, [model])
                  }
               }.bind(this));
            },
            _getEditingEip: function() {
               return this._secondEip && this._secondEip.isEdit() ? this._secondEip : EditInPlaceHoverController.superclass._getEditingEip.call(this);
            },
            /**
             * Обработчик события по приходу фокуса на контрол в области редактирования по месту
             * @private
             */
            _onChildFocusIn: function(event) {
               var
                  editingEip = this._getEditingEip();
               if (!editingEip || editingEip.getContainer().get(0) !== event.getTarget().getContainer().get(0)) {
                  this.edit(this._hoveredEip.getEditingRecord());
               }
            },
            _destroyEip: function() {
               EditInPlaceHoverController.superclass._destroyEip.apply(this);
               //Очистим переменную, в которой хранится eip показанный по ховеру.
               //Иначе он сохранится в переменной при разрушении,и мы продолжим с ним работать, что может привестьи к ошибкам.
               this._hoveredEip = null;
               if (this._secondEip) {
                  this._secondEip.destroy();
                  this._secondEip = null;
               }
            },
            destroy: function() {
               EditInPlaceHoverController.superclass.destroy.apply(this, arguments);
            }
         });

      return EditInPlaceHoverController;

   });
