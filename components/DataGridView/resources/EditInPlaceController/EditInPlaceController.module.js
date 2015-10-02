/**
 * Created by as.avramenko on 01.04.2015.
 */

define('js!SBIS3.CONTROLS.EditInPlaceController',
   [
      'js!SBIS3.CORE.CompoundControl',
      'js!SBIS3.CONTROLS.EditInPlace',
      'html!SBIS3.CONTROLS.EditInPlaceController',
      'css!SBIS3.CONTROLS.EditInPlaceController'
   ],
   function(Control, EditInPlace, dotTplFn) {

      'use strict';

      /**
       * @class SBIS3.CONTROLS.EditInPlaceController
       * @extends SBIS3.CORE.CompoundControl
       * @control
       * @public
       */

      var
         isMobileBrowser = $ws._const.browser.isMobileSafari || $ws._const.browser.isMobileAndroid,

         EditInPlaceController = Control.extend( /** @lends SBIS3.CONTROLS.EditInPlaceController.prototype */ {
            _dotTplFn: dotTplFn,
            $protected: {
               _options: {
                  columns: [],
                  dataSource: undefined,
                  dataSet: undefined,
                  addInPlaceButton: undefined,
                  ignoreFirstColumn: false,
                  editFieldFocusHandler: undefined
               },
               //Редактируемая область
               _editing: null,
               _areas: {
                  first: null,
                  second: null
               },
               _areaHandlers: null
            },
            $constructor: function() {
               this._publish('onValueChange');
               this._areaHandlers = {
                  onKeyDown: this._onKeyDown.bind(this),
                  onMouseDownEditInPlace: isMobileBrowser ? undefined : this._onMouseDownEditInPlace.bind(this),
                  onMouseDown: isMobileBrowser ? undefined : this._onMouseDown.bind(this)
               };
               this._areas.first = this._initArea('first');
               if (!isMobileBrowser) {
                  this._areas.second = this._initArea('second');
               }
            },
            /**
             * Инициализирует область для редактирования по месту
             * @param id
             * @returns {{editInPlace: EditInPlace, record: null, target: null, hovered: boolean}}
             * @private
             */
            _initArea: function(id) {
               var self = this;
               return {
                  editInPlace: new EditInPlace({
                     columns: this._options.columns,
                     element: $('<div id="' + id + '"></div>').appendTo(this._container),
                     visible: false,
                     focusCatch: this._focusCatch.bind(this),
                     editFieldFocusHandler: this._options.editFieldFocusHandler,
                     handlers: {
                        onMouseDown: isMobileBrowser ? undefined : this._areaHandlers.onMouseDownEditInPlace,
                        onValueChange: function(event, fieldName, record) {
                           event.setResult(self._notify('onValueChange', fieldName, record));
                        }
                     }
                  }),
                  record: null,
                  target: null,
                  hovered: false
               };
            },
            /**
             * Обработчик события по нажатию мыши в области редактирования по месту
             * @param e
             * @param target
             * @private
             */
            _onMouseDownEditInPlace: function(e, target) {
               if (!this._editing || target.parents('.controls-editInPlace').attr('id') !== this._areas[this._editing].editInPlace.getContainer().attr('id')) {
                  this.showEditing(this._areas.first.hovered ? 'first' : 'second');
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
                  this.finishEditing(this._areas[this._editing]);
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
                     this._updateArea(this._areas[this._editing], true);
                     this._areas[this._editing].editInPlace.show();
                     this._areas[this._editing].editInPlace.activateFirstField();
                  }.bind(this));
               }
               this._areas[this._editing].target.addClass('controls-editInPlace__editing');
               this._areas[this._editing].hovered = false;
               this._areas[this._editing].editInPlace.getContainer().mousemove(this._onMouseMove.bind(this));
               this._areas[this._editing].editInPlace.getContainer().bind('keyup', this._areaHandlers.onKeyDown);
               $ws._const.$win.bind(isMobileBrowser ? 'touchend' : 'mouseup', this._areaHandlers.onMouseDown);
            },
            /**
             * Обновить область editInPlace (позицию, размеры, содержимое)
             * @param {Object} area Обновляемая область editInPlace
             * @private
             */
            _updateArea: function(area, updateWidth) {
               var
                  tds,
                  $target = area.target,
                  target = $target[0],
                  height = target.getBoundingClientRect().height,
                  $container = area.editInPlace.getContainer(),
                  container = $container[0],
                  divIdx,
                  divs;
               area.editInPlace.updateFields(area.record);
               //Рассчитываем top, lineHeight и height для editInPlace панели
               container.style.top = target.offsetTop + 1 + 'px';
               container.style.lineHeight = height - 6 + 'px';
               container.style.height = height - 4 + 'px';
               if (updateWidth) {
                  divIdx = 0;
                  tds = $target.find('.controls-DataGridView__td');
                  divs = $container.find('> div');
                  $ws.helpers.forEach(this._options.columns, function(col, idx) {
                     if (col.editor) {
                        //todo в width заложены правые отступы в 2px (чтобы между полями ввода было пустое пространство)
                        divs[divIdx].style.width = $(tds[this._options.ignoreFirstColumn ? idx + 1 : idx]).outerWidth() - 2 + 'px';
                        divs[divIdx].style.left = parseInt(tds[this._options.ignoreFirstColumn ? idx + 1 : idx].offsetLeft, 10) + 'px';
                        divIdx += 1;
                     }
                  }, this);
               }
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
                  editingArea.editInPlace.getContainer().unbind('keyup', this._areaHandlers.onKeyDown);
                  this._editing = null;
                  if (!isMobileBrowser) {
                     editingArea.editInPlace.getContainer().unbind('mousemove');
                  }
                  $ws._const.$win.unbind(isMobileBrowser ? 'touchend' : 'mouseup', this._areaHandlers.onMouseDown);
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
            /**
             * Функция позволяет узнать, выполняется ли сейчас редактирование по месту
             * @returns {boolean} Выполняется редактирование по месту, или нет
             */
            isEditing: function() {
               return !!this._editing;
            },
            /**
             * Обработчик глобального хука мыши
             * @param {Object} e jQuery event
             * @private
             */
            _onMouseDown: function(e) {
               if (this._editing) {
                  this.finishEditing(this._areas[this._editing]);
               }
            },
            /**
             * Обработчик глобального хука клавиатуры
             * @param {Object} e jQuery event
             * @private
             */
            _onKeyDown: function(e) {
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
            /**
             * Метод позволяет запустить редактирование следующей/предыдущей записи
             * @param editNextRow Запускать редактирование следующей записи (при false - предыдущей)
             * @param closeIfLast Завершать редактирование по месту, если текущая запись является последней
             * @param activateFirstField Вызывать активацию первого контрола (по z-index) - нужно, когда перемещаемся по KEY.TAB
             * @private
             */
            _editNextTarget: function(editNextRow, closeIfLast, activateFirstField) {
               var
                  result,
                  viewingArea,
                  self = this,
                  area = this._areas[this._editing],
                  newTarget = $('tr[data-id="' + area.record.getKey() + '"]')[editNextRow ? 'next' : 'prev']('.controls-ListView__item'),
                  editAnotherRow = function() {
                     area.target = newTarget;
                     area.record = self._options.dataSet.getRecordByKey(newTarget.data('id'));
                     //Если будем редактировать строку, на которую наведена мышь, то скрываем вторую область
                     viewingArea = self._areas[self._editing === 'first' ? 'second' : 'first'];
                     if (viewingArea.editInPlace.isVisible() && viewingArea.record == area.record) {
                        viewingArea.editInPlace.hide();
                     }
                     self._updateArea(area);
                     if (activateFirstField) {
                        area.editInPlace.activateFirstField();
                     }
                  };
               if (newTarget.length && !newTarget.hasClass('controls-ListView__folder')) {
                  result = this.finishEditing(true, true);
                  if (result instanceof $ws.proto.Deferred) {
                     result.addCallback(function() {
                        editAnotherRow();
                     });
                  } else {
                     editAnotherRow();
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
            _focusCatch: function(event) {
               if (event.which === $ws._const.key.tab && !event.shiftKey) {
                  this._editNextTarget(true, true, true);
               }
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
             * Обновить отображение редактирования по месту
             * @param {Object} target Элемент, для которого отображается редактирование по месту
             * @param {Boolean} recalcPos Выполнять принудительный пересчёт позиции редактирования по месту
             * @private
             */
            updateDisplay: function(target, recalcPos) {
               var hoveredArea,
                   record;
               if (target) {
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
                        hoveredArea = this._areas[this._editing === 'first' && !isMobileBrowser ? 'second' : 'first'];
                        hoveredArea.target = target.container;
                        hoveredArea.record = record;
                        hoveredArea.hovered = true;
                        this._updateArea(hoveredArea, !hoveredArea.editInPlace.isVisible());
                        hoveredArea.editInPlace.show();
                     }
                  }
               } else if (recalcPos && this._editing) {
                  this._updateArea(this._areas[this._editing], true);
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
                  $ws._const.$win.unbind(isMobileBrowser ? 'touchend' : 'mouseup', this._areaHandlers.onMouseDown);
                  this._areas[this._editing].editInPlace.getContainer().bind('keyup', this._areaHandlers.onKeyDown);
                  this._editing = null;
               }
               if (!isMobileBrowser) {
                  this._areas.second.editInPlace.destroy();
                  this._areas.second = null;
               }
               this._areas.first.editInPlace.destroy();
               this._areas.first = null;
               EditInPlaceController.superclass.destroy.apply(this, arguments);
            }
         });

      return EditInPlaceController;

   });
