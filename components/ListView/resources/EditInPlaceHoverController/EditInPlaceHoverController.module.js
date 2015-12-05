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
            $constructor: function() {
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
            _getNextTarget: function(editNextRow) {
               return this._getEditingEip().getTarget()[editNextRow ? 'nextAll' : 'prevAll']('.js-controls-ListView__item:not(".controls-editInPlace")').slice(0, 1);
            },
            /**
             * Обновить область отображаемую по ховеру
             * @param {Object} target Элемент, для которого отобразить область по ховеру
             * @private
             */
            show: function(target, record) {
               this._hoveredEip = this._eip.isEdit() ? this._secondEip : this._eip;
               this._hoveredEip.show(target, record);
            },
            /**
             * Скрыть область отображаемую по ховеру
             * @private
             */
            hide: function() {
               this._hoveredEip = this._eip.isEdit() ? this._secondEip : this._eip;
               this._hoveredEip.hide();
            },
            _onChildControlFocusIn: function(event, control) {
               this._options.editFieldFocusHandler && this._options.editFieldFocusHandler(control);
            },
            edit: function (target, record) {
               var hoveredEip = this._hoveredEip;
               if (hoveredEip.isVisible() && (hoveredEip.getTarget().get(0) === target.get(0))) {
                  this.endEdit(true).addCallback(function() {
                     this._hoveredEip.edit(target, record);
                  }.bind(this));
               } else {
                  EditInPlaceHoverController.superclass.edit.apply(this, arguments);
               }
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
                  this.edit(this._hoveredEip.getTarget(), this._hoveredEip.getRecord());
               }
            },
            destroy: function() {
               this._secondEip.editInPlace.unbind('keyup', this._eipHandlers.onKeyDown);
               EditInPlaceHoverController.superclass.destroy.apply(this, arguments);
            }
         });

      return EditInPlaceHoverController;

   });
