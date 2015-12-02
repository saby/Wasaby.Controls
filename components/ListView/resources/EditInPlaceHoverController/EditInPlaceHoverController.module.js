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
               _secondArea: undefined
            },
            $constructor: function() {
               this._secondArea = this._createArea();
               this._secondArea.editInPlace.getContainer().bind('keyup', this._areaHandlers.onKeyDown);
            },
            _getEditingArea: function() {
               return this._area.editing ? this._area : this._secondArea.editing ? this._secondArea : null;
            },
            _getHoveredArea: function() {
               return this._area.hovered ? this._area : this._secondArea.hovered ? this._secondArea : null;
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
               return this._getEditingArea().target[editNextRow ? 'nextAll' : 'prevAll']('.js-controls-ListView__item:not(".controls-editInPlace")').slice(0, 1);
            },
            //TODO: Сухоручкин, Авраменко. переписать этот метод!
            _edit: function(target, record) {
               /*
               * здесь мы определяем, какую область нужно начинать редактировать
               * */
               var hoveredArea = this._getHoveredArea();
               if (target.hasClass('controls-editInPlace') || hoveredArea && (hoveredArea.target.get(0) === target.get(0))) {
                  hoveredArea.hovered = false;
                  hoveredArea.editing = true;
                  if (!target.hasClass('controls-editInPlace')) {
                     hoveredArea.editInPlace.activateFirstControl();
                  }
               } else {
                  EditInPlaceHoverController.superclass._edit.apply(this, arguments);
               }
            },
            /**
             * Обновить область отображаемую по ховеру
             * @param {Object} target Элемент, для которого отобразить область по ховеру
             * @private
             */
            updateHoveredArea: function(target) {
               var hoveredArea = this._area.editing ? this._secondArea : this._area;
               this._hideHoveredArea();
               if (target.container && !target.container.hasClass('controls-editInPlace')) {
                  hoveredArea.hovered = true;
                  hoveredArea.target = target.container;
                  hoveredArea.record = this._options.dataSet.getRecordByKey(target.key);
                  this._showEditArea(hoveredArea);
               }
            },
            /**
             * Метод для скрытия областей редактирования по месту
             * @private
             */
            _hideHoveredArea: function() {
               var area  = this._getHoveredArea();
               if (area) {
                  area.hovered = false;
                  area.editInPlace.hide();
                  area.target.show();
               }
            },
            _onChildControlFocusIn: function(event, control) {
               this._options.editFieldFocusHandler && this._options.editFieldFocusHandler(control);
            },
            /**
             * Обработчик события по приходу фокуса на контрол в области редактирования по месту
             * @param e
             * @param control
             * @private
             */
            _onChildFocusIn: function(e, control) {
               var target = control.getContainer().closest('.controls-editInPlace');
               //TODO: EIP Сухоручкин вторая проверка зачем?
               if (!this.isEditing() || this._getEditingArea().editInPlace.getContainer().get(0) !== target.get(0)) {
                     this.edit(target, this._getHoveredArea().record);
               }
            },
            isEditing: function() {
               return this._area.editing || this._secondArea.editing;
            },
            destroy: function() {
               EditInPlaceHoverController.superclass.destroy.apply(this, arguments);
               this._secondArea.editInPlace.getContainer().unbind('keyup', this._areaHandlers.onKeyDown);
               this._secondArea.editInPlace.destroy();
               this._secondArea = null;
            }
         });

      return EditInPlaceHoverController;

   });
