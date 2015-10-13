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
                  hoveredArea = this._areas[this._editing === 'first' && !isMobileBrowser ? 'second' : 'first'];
                  if (hoveredArea.target instanceof $) {
                     hoveredArea.target.show();
                  }
                  if (!target.container) {
                     this._hideEditInPlace();
                  } else {
                     record = this._options.dataSet.getRecordByKey(target.key);
                     if (!record || record.get('Раздел@')) {
                        this._hideEditInPlace();
                     } else if (!this._editing || this._areas[this._editing].record.getKey() !== target.key) {
                        if (isMobileBrowser) {
                           if (this._editing) {
                              this.finishEditing(true, true);
                           } else {
                              this._editing = 'first';
                           }
                           this._areas[this._editing].editInPlace.getContainer().bind('keyup', this._areaHandlers.onKeyDown);
                        }
                        hoveredArea.target = target.container;
                        hoveredArea.record = record;
                        hoveredArea.hovered = true;
                        this._updateArea(hoveredArea);
                     }
                  }
               }
            },
            /**
             * Показать редактирование по месту
             * @param area {$|String} Принимает два типа значений:
             * 1. jQuery-объект. В этом случае считаем, что передан Target и позиционируем текущее редактирование по месту относительно переданного Target.
             * 2. String. В этому случае считаем, что передано имя объекта-конфигурации области редактирования по месту.
             */
            showEditing: function(area) {
               if (this._editing) {
                  this.finishEditing(true);
               }
               this._editing = area instanceof $ ? 'first' : area;
               this._areas[this._editing].addInPlace = area instanceof $;
               if (area instanceof $) {
                  if (this._options.addInPlaceButton) {
                     this._options.addInPlaceButton.hide();
                  }
                  this._areas[this._editing].target = area;
                  this._options.dataSource.create().addCallback(function (rec) {
                     this._areas[this._editing].record = rec;
                     this._updateArea(this._areas[this._editing]);
                     this._areas[this._editing].editInPlace.show();
                     this._areas[this._editing].editInPlace.activateFirstControl();
                  }.bind(this));
               }
               this._areas[this._editing].target.addClass('controls-editInPlace__editing');
               this._areas[this._editing].hovered = false;
               this._areas[this._editing].editInPlace.getContainer().mousemove(this._onMouseMove.bind(this));
               this._areas[this._editing].editInPlace.getContainer().bind('keyup', this._areaHandlers.onKeyDown);
            },
            /**
             * Завершить редактирование по месту
             * @param {Boolean} saveFields Сохранить изменения в dataSet
             * @param {Boolean} notHide Не скрывать область editInPlace
             * @private
             */
            finishEditing: function(saveFields, notHide) {
               var
                   self = this,
                   result,
                   editingArea = this._areas[this._editing],
                   syncDataSource = function() {
                      if (editingArea.addInPlace) {
                         self._options.dataSet.push(editingArea.record);
                      }
                      if (self._options.addInPlaceButton) {
                         self._options.dataSource.once('onDataSync', function () {
                            self._options.addInPlaceButton.show();
                         }.bind(self));
                      }
                      self._options.dataSource.sync(self._options.dataSet);
                   },
                   removeAddInPlace = function() {
                      if (editingArea.addInPlace) {
                         editingArea.addInPlace = false;
                         editingArea.target.remove();
                         editingArea.target = null;
                      }
                   };
               editingArea.target.removeClass('controls-editInPlace__editing');
               if (!notHide) {
                  editingArea.editInPlace.hide();
                  editingArea.target.show();
                  editingArea.editInPlace.getContainer().unbind('keyup', this._areaHandlers.onKeyDown);
                  this._editing = null;
                  if (!isMobileBrowser) {
                     editingArea.editInPlace.getContainer().unbind('mousemove');
                  }
               }
               //Если необходимо, то сохраняем поля и перезагружаем dataSource
               if (saveFields) {
                  result = editingArea.editInPlace.applyChanges();
                  if (result instanceof $ws.proto.Deferred) {
                     result.addCallback(function() {
                        syncDataSource();
                        removeAddInPlace();
                     });
                     return result;
                  }
                  syncDataSource();
               } else if (this._options.addInPlaceButton) {
                  this._options.addInPlaceButton.show();
               }
               removeAddInPlace();
            },
            _getEditingArea: function() {
               return this._areas[this._editing];
            },
            _editAnotherRow: function(newTarget, activateFirstControl) {
               var area = this._getEditingArea(),
                   viewingArea;
               area.target = newTarget;
               area.record = this._options.dataSet.getRecordByKey(newTarget.data('id'));
               //Если будем редактировать строку, на которую наведена мышь, то скрываем вторую область
               viewingArea = this._areas[this._editing === 'first' ? 'second' : 'first'];
               if (viewingArea.editInPlace.isVisible() && viewingArea.record == area.record) {
                  viewingArea.editInPlace.hide();
               }
               this._updateArea(area);
               if (activateFirstControl) {
                  area.editInPlace.activateFirstControl();
               }
            },
            _onChildControlFocusIn: function(event, control) {
               //TODO: сначала стреляет onChildFocusIn а затем onControlFocusIn и поэтому непонятно какую область редактируем
               /*if (this._areas[this._editing].editInPlace.isVisible()) {
                  this._options.editFieldFocusHandler && this._options.editFieldFocusHandler(control);
               }*/
               this._options.editFieldFocusHandler && this._options.editFieldFocusHandler(control);
            },
            /**
             * Обработчик события по приходу фокуса на контрол в области редактирования по месту
             * @param e
             * @param control
             * @private
             */
            _onChildFocusIn: function(e, control) {
               if (!this._editing || control.getContainer().parents('.controls-editInPlace').attr('id') !== this._areas[this._editing].editInPlace.getContainer().attr('id')) {
                  this.showEditing(this._areas.first.hovered ? 'first' : 'second');
               }
            },
            _onChildFocusOut: function(e, control) {
               if (control && !control.getContainer().parents('.controls-editInPlace').length) {
                  this.finishEditing(this._areas[this._editing]);
               }
            },
            /**
             * Функция позволяет узнать, выполняется ли сейчас редактирование по месту
             * @returns {boolean} Выполняется редактирование по месту, или нет
             */
            isEditing: function() {
               return !!this._editing;
            },
            /**
             * Метод для скрытия областей редактирования по месту
             * @private
             */
            _hideEditInPlace: function() {
               if (isMobileBrowser) {
                  this._areas.first.editInPlace.hide();
               } else {
                  this._editing !== 'first' && this._areas.first.editInPlace.hide();
                  this._editing !== 'second' && this._areas.second.editInPlace.hide();
               }
            },
            /**
             * Обработчик по наведению мыши на область editInPlace
             * @param e
             * @private
             */
            _onMouseMove: function(e) {
               //Если имеется отображаемая область, а мышь уведена на редактируемую, то скрываем отображаемую область
               if ((this._areas.first.hovered || this._areas.second.hovered) && this._editing && e.currentTarget.id === this._areas[this._editing].editInPlace.getContainer().attr('id')) {
                  this._areas.first.hovered = this._areas.second.hovered = false;
                  this._areas[this._editing === 'first' ? 'second' : 'first'].target.mouseleave();
                  this._areas[this._editing !== 'first' ? 'second' : 'first'].target.mousemove();
               }
            },
            destroy: function() {
               if (this._editing) {
                  this._areas[this._editing].editInPlace.getContainer().bind('keyup', this._areaHandlers.onKeyDown);
                  this._editing = null;
               }
               if (!isMobileBrowser) {
                  this._areas.second.editInPlace.destroy();
                  this._areas.second = null;
               }
               this._areas.first.editInPlace.destroy();
               this._areas.first = null;
               EditInPlaceHoverController.superclass.destroy.apply(this, arguments);
            }
         });

      return EditInPlaceHoverController;

   });
