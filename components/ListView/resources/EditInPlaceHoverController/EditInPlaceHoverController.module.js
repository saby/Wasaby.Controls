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
         isMobileBrowser = $ws._const.browser.isMobileSafari || $ws._const.browser.isMobileAndroid,

         EditInPlaceHoverController = EditInPlaceBaseController.extend( /** @lends SBIS3.CONTROLS.EditInPlaceHoverController.prototype */ {
            $protected: {
               _options: {
               },
               _secondArea: undefined
            },
            $constructor: function() {
               if (!isMobileBrowser) {
                  this._secondArea = this._initArea('second');
                  this._secondArea.editInPlace.getContainer().bind('keyup', this._areaHandlers.onKeyDown);
               }
            },
            _getEditingArea: function() {
               return this._editing === 'first' ? this._area : this._editing === 'second' ? this._secondArea : null;
            },
            _getHoveredArea: function() {
               return this._area.hovered ? this._area : this._secondArea.hovered ? this._secondArea : null;
            },
            _initArea: function() {
               var self = this;
               return {
                  editInPlace: new EditInPlace({
                     template: this._options.template,
                     columns: this._options.columns,
                     element: $('<div></div>'),
                     ignoreFirstColumn: this._options.ignoreFirstColumn,
                     focusCatch: this._focusCatch.bind(this),
                     context: this._getContextForArea(),
                     parent: this,
                     handlers: {
                        onChildControlFocusIn: this._onChildControlFocusIn.bind(this),
                        onChildFocusOut: this._onChildFocusOut.bind(this),
                        onChildFocusIn: this._onChildFocusIn.bind(this),
                        onFocusIn: this._onFocusIn.bind(this),
                        onFieldChange: function(event, fieldName, record) {
                           event.setResult(self._notify('onFieldChange', fieldName, record));
                        }
                     }
                  }),
                  record: null,
                  target: null,
                  hovered: false
               };
            },
            _showEditing: function(target) {
               var hoveredArea = this._getHoveredArea();
               if (target.hasClass('controls-editInPlace') || hoveredArea && hoveredArea.target.get(0) === target.get(0)) {
                  //TODO: отказаться от first и second
                  this._editing = this._area.hovered ? 'first' : 'second';
                  hoveredArea.hovered = false;
                  hoveredArea.editInPlace.activateFirstControl();
               } else {
                  this._editing = this._area.hovered ? 'second' : 'first';
                  EditInPlaceHoverController.superclass._showEditing.apply(this, arguments);
               }
               this._getEditingArea().editInPlace.getContainer().mousemove(this._onMouseMove.bind(this));
            },
            /**
             * Завершить редактирование по месту
             * @param {Boolean} saveFields Сохранить изменения в dataSet
             * @private
             */
            finishEditing: function(saveFields) {
               this._getEditingArea().editInPlace.getContainer().unbind('mousemove');
               return EditInPlaceHoverController.superclass.finishEditing.apply(this, arguments);
            },
            /**
             * Обновить отображение редактирования по месту
             * @param {Object} target Элемент, для которого отображается редактирование по месту
             * @private
             */
            updateHoveredArea: function(target) {
               var hoveredArea = this._editing == 'first' ? this._secondArea : this._area;
               this._hideHoveredArea();
               if (target.container && !target.container.hasClass('controls-ListView__folder')) {
                  if (isMobileBrowser) {
                     if (this._editing) {
                        this.finishEditing(true, true);
                     } else {
                        this._editing = 'first';
                     }
                  }
                  hoveredArea.hovered = true;
                  hoveredArea.target = target.container;
                  hoveredArea.record = this._options.dataSet.getRecordByKey(target.key);
                  this._showArea(hoveredArea, true);
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
               if (!this._editing || target.get(0) !== this._getEditingArea().editInPlace.getContainer().get(0)) {
                  this.showEditing(target);
               }
            },
            _onFocusIn: function(e) {
               //TODO: написать
               e._target.activateFirstControl();
            },
            /**
             * Обработчик по наведению мыши на область editInPlace
             * @private
             */
            _onMouseMove: function() {
               var hoveredArea = this._getHoveredArea();
               hoveredArea && hoveredArea.target.mouseleave();
            },
            destroy: function() {
               EditInPlaceHoverController.superclass.destroy.apply(this, arguments);
               if (!isMobileBrowser) {
                  this._secondArea.editInPlace.getContainer().unbind('keyup', this._areaHandlers.onKeyDown);
                  this._secondArea.editInPlace.destroy();
                  this._secondArea = null;
               }
            }
         });

      return EditInPlaceHoverController;

   });
