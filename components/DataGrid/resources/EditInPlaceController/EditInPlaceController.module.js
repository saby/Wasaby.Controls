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
                  ignoreFirstColumn: false
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
               return {
                  editInPlace: new EditInPlace({
                     columns: this._options.columns,
                     element: $('<div id="' + id + '"></div>').appendTo(this._container),
                     visible: false,
                     handlers: {
                        onMouseDown: isMobileBrowser ? undefined : this._areaHandlers.onMouseDownEditInPlace
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
               this._areas[this._editing].hovered = false;
               this._areas[this._editing].editInPlace.getContainer().mousemove(this._onMouseMove.bind(this));
               //Это убирает класс hovered со строки, над которой editInPlace и скрывает опции записи (если те имеются)
               this._areas[this._editing].target.mouseleave();
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
                  container = $container[0];
               area.editInPlace.updateFields(area.record);
               //Рассчитываем top, lineHeight и height для editInPlace панели
               container.style.top = target.offsetTop + 'px';
               container.style.lineHeight = height - 6 + 'px';
               container.style.height = height - 4 + 'px';
               if (updateWidth) {
                  tds = $target.find('.controls-DataGrid__td');
                  $container.find('> div').each(function (idx, div) {
                     div.style.width = $(tds[this._options.ignoreFirstColumn ? idx + 1 : idx]).outerWidth() - 2 + 'px';
                  }.bind(this));
               }
            },
            /**
             * Завершить редактирование по месту
             * @param {Boolean} saveFields Сохранить изменения в dataSet
             * @param {Boolean} notHide Не скрывать область editInPlace
             * @private
             */
            finishEditing: function(saveFields, notHide) {
               var editingArea = this._areas[this._editing];
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
                  editingArea.editInPlace.applyChanges();
                  if (editingArea.addInPlace) {
                     this._options.dataSet.push(editingArea.record);
                  }
                  if (this._options.addInPlaceButton) {
                     this._options.dataSource.once('onDataSync', function () {
                        this._options.addInPlaceButton.show();
                     }.bind(this));
                  }
                  this._options.dataSource.sync(this._options.dataSet);
               } else if (this._options.addInPlaceButton) {
                  this._options.addInPlaceButton.show();
               }
               if (editingArea.addInPlace) {
                  editingArea.addInPlace = false;
                  editingArea.target.remove();
                  editingArea.target = null;
               }
            },
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
                  key = e.which,
                  newTarget,
                  area,
                  viewingArea;
               if (key === $ws._const.key.esc) {
                  this.finishEditing();
                  e.stopImmediatePropagation();
                  e.preventDefault();
               } else if (key === $ws._const.key.enter || key === $ws._const.key.down || key === $ws._const.key.up) {
                  area = this._areas[this._editing];
                  newTarget = $('[data-id="' + area.record.getKey() + '"]')[key === $ws._const.key.down || key === $ws._const.key.enter ? 'next' : 'prev']('.controls-ListView__item');
                  if (newTarget.length) {
                     this.finishEditing(true, true);
                     area.target = newTarget;
                     area.record = this._options.dataSet.getRecordByKey(newTarget.data('id'));
                     //Если будем редактировать строку, на которую наведена мышь, то скрываем вторую область
                     viewingArea = this._areas[this._editing === 'first' ? 'second' : 'first'];
                     if (viewingArea.editInPlace.isVisible() && viewingArea.record == area.record) {
                        viewingArea.editInPlace.hide();
                     }
                     this._updateArea(area);
                     e.stopImmediatePropagation();
                     e.preventDefault();
                  } else if (key === $ws._const.key.enter) {
                     this.finishEditing(true);
                  }
               }
            },
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
             * @private
             */
            updateDisplay: function(target) {
               var
                  hoveredArea,
                  record;
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
            },
            /**
             * Обработчик по наведению мыши на область editInPlace
             * @param e
             * @private
             */
            _onMouseMove: function(e) {
               //Если имеется отображаемая область, а мышь уведена на редактируемую, то скрываем отображаемую область
               if ((this._areas.first.hovered || this._areas.second.hovered) && this._editing && e.currentTarget.id === this._areas[this._editing].editInPlace.getContainer().attr('id')) {
                  this._areas[this._editing === 'first' ? 'second' : 'first'].target.mouseleave();
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
            }
         });

      return EditInPlaceController;

   });
