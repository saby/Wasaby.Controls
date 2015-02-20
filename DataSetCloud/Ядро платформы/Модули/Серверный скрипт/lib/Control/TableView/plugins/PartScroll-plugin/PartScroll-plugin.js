/**
 * Created with JetBrains PhpStorm.
 * User: am.gerasimov
 * Date: 11.11.2014
 * Time: 13:34
 * To change this template use File | Settings | File Templates.
 */

define('js!SBIS3.CORE.PartScrollPlugin',
   [
      'js!SBIS3.CORE.TableView'
   ],
   function(TableView){

   'use strict';

   var
      CORRECT_LEFT_POSITION = 4;

   /**
    * @class   $ws.proto.TableView.PartScrollPlugin
    * @extends $ws.proto.TableView
    * @plugin
    */
   $ws.proto.TableView.PartScrollPlugin = TableView.extendPlugin(/** @lends $ws.proto.TableView.PartScrollPlugin.prototype */{
      $withoutCondition: ['_rowsEventHandler'],
      $protected: {
         _options: {
            display: {
               /**
                * @cfg {Boolean} Использовать ли широкий скролл
                * Скроллбар будет показываться по всей видимой ширине браузера, а не только между
                * скроллируемыми столбцами
                */
               wideScroll: false,
               /**
                * @cfg {Boolean} Использовать частичный скролл при нехватке места
                * <wiTag group="Отображение"
                * @group Display
                */
               usePartScroll : false,
               /**
                * @cfg {Number} Количество столбцов слева, которые будут не скролируемы
                * <wiTag group="Отображение"
                * @group Display
                */
               startScrollColumn: 0
            }
         },
         _partScrollContainer: undefined,       //Контейнер скроллбара
         _currentPosition: 0,                   //Текущая позиция ползунка
         _movableElements: undefined,           //Элементы, которые двигаем
         _rightArrow: undefined,                //Контейнер для правой стрелки
         _leftArrow: undefined,                 //Контейнер для левой стрелки
         _thumbWrapper: undefined,              //Обёртка ползунка
         _thumb: undefined,                     //Контейнер для ползунка
         _thumbMargin: null,                    //Отступ ползунка
         _ratio: null,                          //Соотношение скролируемой области и скроллбара
         _isScrollVisible: false,               //Видимость скроллбара
         _rightSideStopMoving: 0
      },
      $condition: function() {
         return this._options.display.usePartScroll;
      },
      $constructor: function(){
         this.subscribe('onAfterRender', this._onAfterRenderHandler);
         if(this._headContainer.find('.ws-browser-head-results')) {
            this.subscribe('onResultUpdate', this._findMovableCells.bind(this));
         }
      },
      /**
       * Устанавливает ширину скролла
       * @private
       */
      _setContainerWidth: function() {
         var width = this._data.width(),
            headWidth = this._browserContainer.width(),
            outOfRangeWidth = width - headWidth,
            correctWidth = 0,
            trackWidth;

         if(!this._options.display.wideScroll) {
            var tr = this._headContainer.find('tr.ws-browser-head-top:first'),
               notScrolledTds = tr.find('.ws-browser-cell-with-noScroll');

            this._partScrollContainer.addClass('ws-browser-scroll-notWide');
            for(var i = 0, len = notScrolledTds.length; i < len; ++i) {
               correctWidth += notScrolledTds[i].clientWidth;
            }
            this._partScrollContainer.css('margin-left', correctWidth);
         }
         //когда посчитали ширину скрола, посчитаем соотношение,
         //как нам двигать скролируемый контент относительно ползунка
         trackWidth = headWidth - correctWidth - this._thumbWrapper.width() - this._thumbMargin*2 + CORRECT_LEFT_POSITION;
         this._ratio = outOfRangeWidth/trackWidth;
         this._partScrollContainer.width(headWidth-correctWidth);
      },
      _onAfterRenderHandler: function() {
         if(this._columnMap.length > 0) {
            if (this._isScrollVisible) {
               if (this._checkContainerSize()) {
                  this._refreshScroll();
               } else {
                  this._partScrollContainer.addClass('ws-hidden');
                  this._isScrollVisible = false;
               }
            } else if (this._checkContainerSize()) {
               this._addClassesToHeader();
               this.showScroll();
            }
         }
      },
      /** Проставляет классы, находит нужные ячейки и т.д.
       * Обновляет скролл под текущий браузер
       */
      _refreshScroll: function() {
         this._addClassesToHeader();
         this._findMovableCells();
         this._setContainerWidth();
      },

      /** Проверяет размер таблицы и контейнера **/

      _checkContainerSize: function() {
         return this._browserContainer.width() < this._data.width();
      },
      /**
       * Ищет ячейки, которые нужно двигать
       * @private
       */
      _findMovableCells: function() {
         //firefox запрещает двигать табличные элементы, поэтому ищем вложенные
         if(!$ws._const.browser.firefox) {
            this._movableElements = this._container.find('.ws-browser-cell-with-scroll');
         } else {
            this._movableElements = this._container.find('.ws-browser-cell-with-scroll').children();
         }
      },
      /**
       * Для столбцов, которые скролим необходимо добавить класс
       * @private
       */
      _mapColumns: function(){
         //Временно нужно для интеграционных тестов
         if(typeof this._options.display.startScrollColumn === 'string') {
            this._options.display.startScrollColumn = parseInt(this._options.display.startScrollColumn, 10);
         }
         for (var i in this._columnMap){
            if(this._columnMap.hasOwnProperty(i)) {
               if (this._options.display.usePartScroll && this._columnMap[i].index+1 > this._options.display.startScrollColumn){
                  this._columnMap[i].className += ' ws-browser-cell-with-scroll';
               } else {
                  this._columnMap[i].className += ' ws-browser-cell-with-noScroll';
               }
            }
         }
      },
      /**
       * Создает основную структуру скролла
       * @private
       */
      _createContainer: function() {
         var scrollContainer = [
            '<div class="ws-browser-scrollContainer ws-hidden">',
               '<div class="ws-browser-scrollArrow-left icon-24 icon-DayBackward  icon-disabled"></div>',
               '<div class="ws-browser-scrollWrapper">',
                  '<div class="ws-browser-scroll"></div>',
               '</div>',
               '<div class="ws-browser-scrollArrow-right icon-24 icon-DayForward icon-primary action-hover"></div>',
            '</div>'].join('');

         this._headContainer.append(scrollContainer);

         this._partScrollContainer = this._headContainer.find('.ws-browser-scrollContainer');
         this._rightArrow = this._partScrollContainer.find('.ws-browser-scrollArrow-right');
         this._leftArrow = this._partScrollContainer.find('.ws-browser-scrollArrow-left');
         this._thumb = this._partScrollContainer.find('.ws-browser-scroll');
         this._thumbWrapper = this._partScrollContainer.find('.ws-browser-scrollWrapper');

         this._container.addClass('ws-browser-with-partScroll');
         this._data.parent().css('overflow-x', 'hidden');
         this._thumbMargin = parseInt(this._thumbWrapper.css('margin-left'), 10);
         this._addClassesToHeader();
      },
      /**
       * Показывает скролл, но только если он необходим
       */
      showScroll: function() {
         if(!this._isScrollVisible) {
            this._setContainerWidth();
            this._isScrollVisible = true;
            this._partScrollContainer.removeClass('ws-hidden');
            this._findMovableCells();
         }
      },
      _addClassesToHeader: function() {
         var self = this;
         if(self._options.display.showHead) {
            this._head.find('[columnId]').each(function() {
               if(parseInt(this.getAttribute('columnId')) + 1 <= self._options.display.startScrollColumn) {
                  $(this).addClass('ws-browser-cell-with-noScroll');
               } else {
                  $(this).addClass('ws-browser-cell-with-scroll');
               }
            });
         }
         this._headContainer.addClass('ws-unSelectable');
      },
      /**
       * Обработчик события движения мыши на строках
       * @param e
       * @private
       */
      _rowsEventHandler: function(e) {
         $(e.target).closest('tr').find('.ws-browser-cell-with-noScroll')
            .toggleClass('ws-browser-cell-hover', e.type === 'mouseenter');
      },
      /**
       * Инициализируем события скрола
       * @private
       */
      _initEvents: function() {
         var self = this;

         this._rightArrow.bind('click', self._scrollRightArrowHandler.bind(self));
         this._leftArrow.bind('click', self._scrollLeftArrowHandler.bind(self));

         if(self.isTree()) {
            self.subscribe('onFolderOpen', self._onTreeOpenBrach);
         }
         this._rowsEventsBinder(true);
         //При фокусе на обертку, которая чуть больше по высоте, навешиваем класс ховера
         //Обёртка нужна для того, чтобы пользователю было легче зацепится за ползунок
         this._thumbWrapper.bind('mouseenter mouseleave', function(e) {
            self._thumb.toggleClass('ws-browser-scroll-clicked', e.type === 'mouseenter');
         });
         this._thumbWrapper.bind('mousedown', function(e) {
            var startX = e.pageX - self._thumb.offset().left;

            self._thumb.addClass('ws-browser-scroll-clicked');
            $ws.helpers.clearSelection();

            $ws._const.$doc.bind('mousemove.wsScrollMove', self._scrollMoveHandler.bind(self, startX));
            $ws._const.$doc.bind('mouseup.wsScrollMove', self._scrollMoveEnd.bind(self));
            self._rowsEventsBinder.call(self, false);
         });
      },
      /**
       * При открытии ветки дерева, навешивает на новые элементы классы
       * @param event
       * @param rowKey
       * @param newRowKeys
       * @param rows
       * @private
       */
      _onTreeOpenBrach: function(event, rowKey, newRowKeys, rows) {
         var tds = rows.find('td'),
            srolledCells = [];
         if(tds.length) {
            for (var i = 0, len = tds.length; i < len; i++) {
               if(parseInt(tds[i].getAttribute('coldefindex'), 10) < this._options.display.startScrollColumn) {
                  $(tds[i]).addClass('ws-browser-cell-with-noScroll');
               } else {
                  $(tds[i]).addClass('ws-browser-cell-with-scroll');
                  srolledCells.push(tds[i]);
               }
            }
            if($ws._const.browser.firefox) {
               srolledCells = $(srolledCells).children();
            }
            //Оказывается, выборка jQuery не совсем массив, и метод concat с ней не работает
            this._movableElements = $.merge(this._movableElements, srolledCells);
         }
      },
      _rowsEventsBinder: function(doBind) {
         if(doBind) {
            this._browserContainer.delegate('tr', 'mouseenter mouseleave', this._rowsEventHandler);
         } else {
            this._browserContainer.undelegate('tr', 'mouseenter mouseleave', this._rowsEventHandler);
         }
      },
      /**
       * Обработчик движения ползунка
       * @param {Number} startPageX
       * @param event
       * @private
       */
      _scrollMoveHandler: function(startPageX, event) {
         this._currentPosition = event.pageX - startPageX - this._partScrollContainer.get(0).getBoundingClientRect().left-this._thumbMargin;

         $ws.helpers.clearSelection();
         this._checkPosition();
         this._thumbWrapper.get(0).style.left = this._currentPosition + 'px';
         this._moveColumns(this._currentPosition);
      },
      /**
       * Проверяет позицию ползунка, меняет активность стрелок
       * Если ползунок пытается уйти за пределы контейнера, возвращает его обратно
       * @returns {boolean}
       * @private
       */
      _checkPosition: function() {
         if (this._currentPosition <= 0){
            this._toggleActiveArrow(this._leftArrow, false);
            this._currentPosition = 0;
         } else if (!this._leftArrow.hasClass('icon-primary')) {
            this._toggleActiveArrow(this._leftArrow, true);
         }
         //Смотрю clientWidth, это значительно быстрее чем .width()
         if (this._currentPosition >= this._partScrollContainer.get(0).clientWidth-this._thumbWrapper.get(0).clientWidth-this._thumbMargin*2+CORRECT_LEFT_POSITION) {
            this._toggleActiveArrow(this._rightArrow, false);
            this._currentPosition = this._partScrollContainer.get(0).clientWidth-this._thumbWrapper.get(0).clientWidth-this._thumbMargin*2+CORRECT_LEFT_POSITION;
         } else if (!this._rightArrow.hasClass('icon-primary')) {
            this._toggleActiveArrow(this._rightArrow, true);
         }
      },
      /**
       *
       * @param {jQuery} arrow Стрелка, которую включаем/выключаем
       * @param {Boolean} enable Если true - делаем стрелку активной, если false - неактивной
       * @private
       */
      _toggleActiveArrow: function(arrow, enable) {
         if(enable) {
            arrow.removeClass('icon-disabled').addClass('icon-primary action-hover');
         } else {
            arrow.removeClass('icon-primary action-hover').addClass('icon-disabled');
         }
      },
      /**
       * Срабатывает, когда мы закончили скроллинг (отпустили кнопку мыши)
       * @private
       */
      _scrollMoveEnd: function() {
         this._rowsEventsBinder(true);
         this._thumbWrapper.removeClass('ws-browser-scroll-clicked');
         $ws._const.$doc.unbind('.wsScrollMove');
      },
      /**
       * Обработчик клика по правой стрелке
       * @private
       */
      _scrollRightArrowHandler: function() {
         this._currentPosition += (this._partScrollContainer.get(0).clientWidth/100)*5;

         this._checkPosition();
         this._thumbWrapper.get(0).style.left = this._currentPosition + 'px';
         this._moveColumns(this._currentPosition);
      },
      /**
       * Обработчик клика по левой стрелке
       * @private
       */
      _scrollLeftArrowHandler: function() {
         this._currentPosition -= (this._partScrollContainer.get(0).clientWidth/100)*5;

         this._checkPosition();
         this._thumbWrapper.get(0).style.left = this._currentPosition + 'px';
         this._moveColumns(this._currentPosition);
      },
      /**
       * Двигает нужные колонки в браузере
       * @param {Number} position
       * @private
       */
      _moveColumns: function(position) {
         //Делаю через нативный style, это быстрее в 2-3! раза чем .css()
         //особенно заметно, когда у нас много элементов
         var movePosition = -position*this._ratio;
         for(var i= 0, len = this._movableElements.length; i < len; i++) {
            this._movableElements[i].style.left = movePosition + 'px';
         }
      }
   });
});