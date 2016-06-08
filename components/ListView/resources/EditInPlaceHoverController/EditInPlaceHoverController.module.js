/**
 * Created by as.avramenko on 01.04.2015.
 */

define('js!SBIS3.CONTROLS.EditInPlaceHoverController',
   [
      'js!SBIS3.CONTROLS.EditInPlaceBaseController',
      'js!SBIS3.CONTROLS.EditInPlace'
   ],
   function (EditInPlaceBaseController, EditInPlace) {

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
               this._secondEip.getContainer().bind('keyup', this._eipHandlers.onKeyDown);
            },

            _getEditInPlaceConfig: function() {
               return $ws.core.merge(EditInPlaceHoverController.superclass._getEditInPlaceConfig.apply(this), {
                  handlers: {
                     onChildControlFocusIn: this._onChildControlFocusIn.bind(this),
                     onChildFocusIn: this._onChildFocusIn.bind(this)
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
            showEip: function(target, record, options) {
               if (options && options.isEdit === false) {
                  this.show(target, record, this._options.itemsProjection.getItemBySourceItem(record))
               } else {
                  EditInPlaceHoverController.superclass.showEip.apply(this, arguments)
               }
            },
            /**
             * Обновить область отображаемую по ховеру
             * @param {Object} target Элемент, для которого отобразить область по ховеру
             * @private
             */
            show: function(target, record, itemProj) {
               if (this._notify('onBeginEdit', record) !== false) {
                  if (!this._hoveredEip) {
                     this._hoveredEip = this._eip.isEdit() ? this._secondEip : this._eip;
                  }
                  this._hoveredEip.show(target, record, itemProj);
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
            edit: function (target, record) {
               var hoveredEip = this._hoveredEip;
               return this.endEdit(true).addCallback(function() {
                  if (hoveredEip && (hoveredEip.getTarget().get(0) === target.get(0))) {
                     if (this._notify('onBeginEdit', record) !== false) {
                        hoveredEip.edit(target, record);
                        this._hoveredEip = null;
                        this._notify('onAfterBeginEdit', record);
                        return record;
                     }
                  } else {
                     return EditInPlaceHoverController.superclass.edit.apply(this, [target, record])
                  }
               }.bind(this));
            },
            _getEditingEip: function() {
               return this._eip.isEdit() ? this._eip : this._secondEip.isEdit() ? this._secondEip : null;
            },
            /**
             * Обработчик события по приходу фокуса на контрол в области редактирования по месту
             * @param e
             * @param control
             * @private
             */
            _onChildFocusIn: function(e, control) {
               var
                  target = control.getContainer().closest('.controls-editInPlace'),
                  editingEip = this._getEditingEip();
               if (!editingEip || editingEip.getContainer().get(0) !== target.get(0)) {
                  this.edit(this._hoveredEip.getTarget(), this._hoveredEip.getEditingRecord());
               }
            },
            _destroyEip: function() {
               EditInPlaceHoverController.superclass._destroyEip.apply(this);
               if (this._secondEip) {
                  this._secondEip.getContainer().unbind('keyup', this._eipHandlers.onKeyDown);
                  this._secondEip.destroy();
                  this._secondEip = null;
               }
            },
            destroy: function() {
               this._secondEip.getContainer().unbind('keyup', this._eipHandlers.onKeyDown);
               EditInPlaceHoverController.superclass.destroy.apply(this, arguments);
            }
         });

      return EditInPlaceHoverController;

   });
