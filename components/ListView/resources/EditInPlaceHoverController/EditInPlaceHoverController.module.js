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
                  columns: [],
                  ignoreFirstColumn: false,
                  editFieldFocusHandler: undefined
               },
               //Редактируемая область
               _editing: null,
               _areas: {
                  first: null,
                  second: null
               }
            },
            $constructor: function() {
               this._areas.first = this._initArea('first');
               if (!isMobileBrowser) {
                  this._areas.second = this._initArea('second');
               }
            },
            _getEditingArea: function() {
               return this._areas[this._editing];
            },
            _getHoveredArea: function() {
               return this._areas.first.hovered ? this._areas.first : this._areas.second.hovered ? this._areas.second : null;
            },
            _initArea: function(id) {
               var self = this;
               return {
                  editInPlace: new EditInPlace({
                     template: this._options.template,
                     columns: this._options.columns,
                     element: $('<div id="' + id + '"></div>'),
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
            showEditing: function(target) {
               var hoveredArea = this._getHoveredArea(),
                   validate,
                   area;
               if (this._editing) {
                  validate = this.finishEditing(true);
               }

               if (validate !== false) {
                  if (target.hasClass('controls-editInPlace') || hoveredArea && hoveredArea.target.attr('data-id') === target.attr('data-id')) {
                     this._editing = this._areas.second.hovered ? 'second' : 'first';
                  } else {
                     this._editing = this._areas.first.hovered ? 'second' : 'first';
                  }
                  area = this._getEditingArea();
                  if (!target.hasClass('controls-editInPlace')) {
                     this._showArea(area, target, null, true);
                  }
                  area.hovered = false;
                  area.target.addClass('controls-editInPlace__editing');
                  area.editInPlace.getContainer().mousemove(this._onMouseMove.bind(this));
               }
            },
            /**
             * Завершить редактирование по месту
             * @param {Boolean} saveFields Сохранить изменения в dataSet
             * @param {Boolean} notHide Не скрывать область editInPlace
             * @private
             */
            finishEditing: function(saveFields) {
               this._getEditingArea().editInPlace.getContainer().unbind('mousemove');
               EditInPlaceHoverController.superclass.finishEditing.apply(this, arguments);
            },
            /**
             * Обновить отображение редактирования по месту
             * @param {Object} target Элемент, для которого отображается редактирование по месту
             * @param {Boolean} recalcPos Выполнять принудительный пересчёт позиции редактирования по месту
             * @private
             */
            updateHoveredArea: function(target) {
               var hoveredArea,
                   record;
               if (target) {
                  hoveredArea = this._getHoveredArea();
                  if (hoveredArea && hoveredArea.target instanceof $) {
                     hoveredArea.target.show();
                  }
                  if (!target.container) {
                     this._hideHoveredArea();
                  } else {
                     record = this._options.dataSet.getRecordByKey(target.key);
                     if (!record || record.get('Раздел@')) {
                        this._hideHoveredArea();
                     } else if (!this._editing || this._areas[this._editing].record.getKey() !== target.key) {
                        hoveredArea = this._areas[this._editing == 'first' ? 'second' : 'first'];
                        if (isMobileBrowser) {
                           if (this._editing) {
                              this.finishEditing(true, true);
                           } else {
                              this._editing = 'first';
                           }
                           this._getEditingArea.editInPlace.getContainer().bind('keyup', this._areaHandlers.onKeyDown);
                        }
                        hoveredArea.hovered = true;
                        this._showArea(hoveredArea, target.container);
                     }
                  }
               }
            },
            /**
             * Метод для скрытия областей редактирования по месту
             * @private
             */
            _hideHoveredArea: function() {
               var area  = this._getHoveredArea();
               area && area.editInPlace.hide();
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
               var target = control ? control.getContainer().closest('.controls-editInPlace') : e._target.getContainer();
               if (!this._editing || target.attr('id') !== this._getEditingArea().editInPlace.getContainer().attr('id')) {
                  this.showEditing(target);
               }
            },
            _onFocusIn: function(e) {
               //TODO: написать
               e._target.activateFirstControl();
            },
            /**
             * Обработчик по наведению мыши на область editInPlace
             * @param e
             * @private
             */
            _onMouseMove: function(e) {
               var hoveredArea = this._getHoveredArea();
               //Если имеется отображаемая область, а мышь уведена на редактируемую, то скрываем отображаемую область
               if (hoveredArea && this._editing && e.currentTarget.id === this._getEditingArea().editInPlace.getContainer().attr('id')) {
                  hoveredArea.target.mouseleave();
               }
            },
            destroy: function() {
               EditInPlaceHoverController.superclass.destroy.apply(this, arguments);
               if (this._editing) {
                  this._getEditingArea().editInPlace.getContainer().unbind('keyup', this._areaHandlers.onKeyDown);
                  this._editing = null;
               }
               if (!isMobileBrowser) {
                  this._areas.second.editInPlace.destroy();
                  this._areas.second = null;
               }
               this._areas.first.editInPlace.destroy();
               this._areas.first = null;
            }
         });

      return EditInPlaceHoverController;

   });
