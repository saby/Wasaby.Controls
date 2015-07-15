define('js!SBIS3.CONTROLS.DataGrid',
   [
      'js!SBIS3.CONTROLS.ListViewDS',
      'html!SBIS3.CONTROLS.DataGrid',
      'html!SBIS3.CONTROLS.DataGrid/resources/rowTpl',
      'js!SBIS3.CORE.MarkupTransformer',
      'js!SBIS3.CONTROLS.EditInPlaceController',
      'js!SBIS3.CONTROLS.Link',
      'js!SBIS3.CONTROLS.DragAndDropMixin',
      'is!browser?html!SBIS3.CONTROLS.DataGrid/resources/DataGridGroupBy'
   ],
   function(ListView, dotTplFn, rowTpl, MarkupTransformer, EditInPlaceController, Link, DragAndDropMixin, groupByTpl) {
   'use strict';
      /* TODO: Надо считать высоту один раз, а не делать константой */
      var
         ITEMS_ACTIONS_HEIGHT = 20,
         ANIMATION_DURATION = 500; //Продолжительность анимации скрола заголовков
   /**
    * Контрол, отображающий набор данных в виде в таблицы с несколькими колонками.
    * @class SBIS3.CONTROLS.DataGrid
    * @extends SBIS3.CONTROLS.ListView
    * @control
    * @public
    * @demo SBIS3.CONTROLS.Demo.MyDataGrid
    * @initial
    * <component data-component='SBIS3.CONTROLS.DataGrid'>
    *    <options name="columns" type="array">
    *       <options>
    *          <option name="title">Поле 1</option>
    *          <option name="width">100</option>
    *       </options>
    *       <options>
    *          <option name="title">Поле 2</option>
    *       </options>
    *    </options>
    * </component>
    */

   var DataGrid = ListView.extend([DragAndDropMixin],/** @lends SBIS3.CONTROLS.DataGrid.prototype*/ {
      _dotTplFn : dotTplFn,
      $protected: {
         _rowTpl : rowTpl,
         _rowData : [],
         _editInPlace: null,
         _addInPlaceButton: null,
         _isPartScrollVisible: false,                 //Видимость скроллбара
         _movableElements: undefined,                 //Скролируемые элементы
         _arrowLeft: undefined,                       //Контейнер для левой стрелки
         _arrowRight: undefined,                      //Контейнер для правой стрелки
         _thumb: undefined,                           //Контейнер для ползунка
         _stopMovingCords: {
            left: 0,
            right: 0
         },
         _currentScrollPosition: undefined,           //Текущее положение частичного скрола заголовков
         _scrollingNow: false,                        //Флаг обозаначающий, происходит ли в данный момент скролирование элементов
         _options: {
            /**
             * @typedef {Object} Columns
             * @property {String} title Заголовок колонки
             * @property {String} field Имя поля
             * @property {String} width Ширина колонки
             * Значение необходимо задавать для колонок с фиксированной шириной.
             * @property {Boolean} highlight=true Подсвечивать фразу при поиске
             * @property {String} className Имя класса, который будет применён к каждой ячейке столбца
             * @property {String} captionTemplate Шаблон отображения шапки колонки
             * @property {String} cellTemplate Шаблон отображения ячейки
             */
            /**
             * @cfg {Columns[]} Набор колонок
             * @see setColumns
             * @see getColumns
             */
            columns: [],
            /**
             * @cfg {Boolean} Отображать заголовки колонок
             * @example
             * <pre>
             *     <option name="showHead">false</option>
             * </pre>
             */
            showHead : true,
            /**
             * @typedef {Object} PagingEnum
             * @variant no Не используется
             * @variant part Частичная
             * @variant full Полная
             */
            /**
             * @cfg {PagingEnum} Режим постраничной навигации
             * @remark
             * При частичной постраничной навигации заранее неизвестно общее количество страниц.
             * @example
             * <pre>
             *     <option name="paging">full</option>
             * </pre>
             * @see setPage
             * @see getPage
             */
            paging: 'no',
            /**
             * @cfg {Object} Редактирование по месту
             */
            editInPlace: {
               enabled: false,
               addInPlace: false,
               onValueChange: undefined
            },
            /**
             * @cfg {Number} Частичный скролл
             */
            startScrollColumn: undefined
         }
      },

      $constructor: function() {
         this._thead = $('.controls-DataGrid__thead', this._container.get(0));
         this._colgroup = $('.controls-DataGrid__colgroup', this._container.get(0));
         this._checkColumns();
      },

      init: function() {
         DataGrid.superclass.init.call(this);
         if (this._options.editInPlace.enabled && this._options.editInPlace.addInPlace && !this._editInPlace) {
            this._initAddInPlace();
         }
         if(this._options.startScrollColumn !== undefined) {
            this._initPartScroll();
         }
      },
      _initAddInPlace: function() {
         var
            self = this,
            itemsContainer = this._getItemsContainer(),
            tr = '';
         this._addInPlaceButton = new Link({
            name: 'controls-ListView__addInPlace-button',
            icon: 'sprite:icon-16 icon-NewCategory',
            caption: 'Новая запись',
            element: $('<div>').appendTo(this._container.find('.controls-DataGrid__addInPlace-container'))
         });
         if (this._options.multiselect) {
            tr += '<td class="controls-DataGrid__td"></td>';
         }
         for (var i in this._options.columns) {
            tr += '<td class="controls-DataGrid__td"></td>';
         }
         tr += '</tr>';
         this._addInPlaceButton.subscribe('onActivated', function() {
            self._initEditInPlace();
            self._editInPlace.showEditing(
               $('<tr class="controls-DataGrid__tr controls-ListView__item">' + tr)
                  .appendTo(itemsContainer));
         });
      },

      _initEditInPlace: function() {
         var
            self = this,
            row,
            debounceInterval = 10;
         if (!this._editInPlace) {
            this._dataSet.subscribe('onRecordChange', function(event, record) {
               row = self._getItemsContainer().find('.controls-ListView__item[data-id="' + record.getKey() + '"]');
               row.empty()
                  .append($(self._getItemTemplate(record)).children());
               self._addItemAttributes(row, record);
               if(self._isPartScrollVisible) {
                  self._findMovableCells();
                  self._moveThumbAndColumns({left: self._currentScrollPosition});
               }
            }.debounce(debounceInterval));
            this._createEditInPlace();
         }
      },
      setDataSource: function(ds) {
         DataGrid.superclass.setDataSource.apply(this, arguments);
         if (this._options.editInPlace.enabled && this._editInPlace) {
            this._editInPlace.destroy();
            this._editInPlace = null;
         }
      },
      _createEditInPlace: function() {
         this._editInPlace = new EditInPlaceController({
            columns: this._options.columns,
            addInPlaceButton: this._addInPlaceButton,
            element: $('<div>').insertBefore(this._container.find('.controls-DataGrid__table')),
            dataSet: this._dataSet,
            ignoreFirstColumn: this._options.multiselect,
            dataSource: this._dataSource,
            handlers: this._options.editInPlace.onValueChange ? {
               onValueChange: this._options.editInPlace.onValueChange
            } : undefined
         });
      },
      
      _onChangeHoveredItem: function(hoveredItem) {
         if(!this.isNowScrollingPartScroll()) {
            this._updateEditInPlaceDisplay(hoveredItem);
         }
         DataGrid.superclass._onChangeHoveredItem.apply(this, arguments);
      },
      _updateEditInPlaceDisplay: function(hoveredItem) {
         if (this._options.editInPlace.enabled && this._options.columns && this._options.columns.length) {
            this._initEditInPlace();
            this._editInPlace.updateDisplay(hoveredItem);
         }
      },
      _checkTargetContainer: function(target) {
         return this._options.showHead && this._thead.length && $.contains(this._thead[0], target[0]) ||
                this._addInPlaceButton && $.contains(this._addInPlaceButton.getContainer().parent()[0], target[0]) ||
                DataGrid.superclass._checkTargetContainer.apply(this, arguments);
      },

      _getItemsContainer: function(){
         return $('.controls-DataGrid__tbody', this._container);
      },

      _getItemTemplate: function(item){
         if (!this._options.itemTemplate) {

            var rowData = {
               columns: $ws.core.clone(this._options.columns),
               decorators: this._decorators,
               color: this._options.colorField ? item.get(this._options.colorField) : '',
               multiselect : this._options.multiselect,
               hierField: this._options.hierField + '@',
               startScrollColumn: this._options.startScrollColumn
            };

            for (var i = 0; i < rowData.columns.length; i++) {
               var value,
                   column = rowData.columns[i];
               if (column.cellTemplate) {
                  var cellTpl = column.cellTemplate;
                  value = MarkupTransformer(doT.template(cellTpl)({
                     item: item,
                     field: column.field,
                     highlight: column.highlight
                  }));
               } else {
                  value = item.get(column.field);
                  value = ((value != undefined) && (value != null)) ? value : '';
               }
               column.value = value;
               column.item = item;
            }
            return this._rowTpl(rowData)
         }
         else {
            return this._options.itemTemplate(item)
         }

      },

      _isHoverControl: function($target) {
         return DataGrid.superclass._isHoverControl.apply(this, arguments) ||
                this._editInPlace && $.contains(this._editInPlace.getContainer()[0], $target[0]);
      },

      _drawItemsCallback: function () {
         if(this._options.startScrollColumn !== undefined) {

          /* Т.к. у таблицы стиль table-layout:fixed, то в случае,
             когда суммарная ширина фиксированных колонок шире родительского контейнера,
             колонка с резиновой шириной скукоживается до 0,
             потому что table-layout:fixed игнорирует минимальную ширину колонки.
             Поэтому мы вынуждены посчитать... и установить минимальную ширину на всю таблицу целиком.
             В этом случае плавающая ширина скукоживаться не будет.
             Пример можно посмотреть в реестре номенклатур. */
            this._setColumnWidthForPartScroll();
            var needShowScroll = this._isTableWide();

            this._isPartScrollVisible ?
               needShowScroll ?
                  this._updatePartScrollWidth() : this._hidePartScroll() :
               needShowScroll ?
                  this._showPartScroll() : this._hidePartScroll();

            this._findMovableCells();
         }
         DataGrid.superclass._drawItemsCallback.call(this);
      },
      // <editor-fold desc="PartScrollBlock">

      //TODO Нужно вынести в отдельный класс(контроллер?), чтобы не смешивать все drag-and-drop'ы в кучу

      /************************/
      /*   Частичный скролл   */
      /***********************/
      _initPartScroll: function() {
         (this._arrowLeft = this._thead.find('.controls-DataGrid__PartScroll__arrowLeft')).click(this._arrowClickHandler.bind(this, true));
         (this._arrowRight = this._thead.find('.controls-DataGrid__PartScroll__arrowRight')).click(this._arrowClickHandler.bind(this, false));
         (this._thumb = this._getDragContainer()).mousedown(this._thumbClickHandler.bind(this));
         this.initializeDragAndDrop();
      },


      _setColumnWidthForPartScroll: function() {
         var tds = this._getItemsContainer().find('.controls-DataGrid__tr').eq(0).find('.controls-DataGrid__td'),
            columns = this.getColumns(),
            tdIndex,
            minWidth;

         /* если у нас включается прокрутка заголовкой,
            то минимальная ширина ужимается до заданного значения,
            и в этом режиме можно просто поставить width,
            т.к. в режиме table-layout:fixed учитывается только width */
         if(tds.length) {
            for (var i = 0; i < columns.length; i++) {
               tdIndex = this._options.multiselect ? i + 1 : i;
               minWidth = columns[i].minWidth && parseInt(columns[i].minWidth, 10);
               if (minWidth && tds[tdIndex]&& tds[tdIndex].offsetWidth < minWidth) {
                  this._colgroup.find('col')[tdIndex].width = minWidth + 'px';
               }
            }
         }
      },

      _dragStart: function() {
         $ws._const.$body.addClass('ws-unSelectable');
         this._scrollingNow = true;
      },

      _arrowClickHandler: function(isRightArrow) {
         var shift = (this._getWithinElem()[0].offsetWidth/100)*5;
         this._moveThumbAndColumns({left: (parseInt(this._thumb[0].style.left) || 0) + (isRightArrow ?  -shift : shift)});
      },

      _thumbClickHandler: function() {
        this._thumb.addClass('controls-DataGrid__PartScroll__thumb-clicked');
      },

      _dragEnd: function() {
         this._animationAtPartScrollDragEnd();
         $ws._const.$body.removeClass('ws-unSelectable');
         this._thumb.removeClass('controls-DataGrid__PartScroll__thumb-clicked');
         this._scrollingNow = false;
      },

      /*
       * Анимация по окончании скрола заголовков
       * Используется для того, чтобы в редактировании по месту не было обрезков при прокрутке
       */
      _animationAtPartScrollDragEnd: function() {
         if(this._currentScrollPosition === this._stopMovingCords.right) {
            return;
         }
         //Найдём элемент, который нужно доскролить
         var arrowRect = this._arrowLeft[0].getBoundingClientRect(),
             elemToScroll = document.elementFromPoint(arrowRect.left + arrowRect.width / 2, arrowRect.top + arrowRect.height + 1),
             elemRect,
             elemWidth,
             delta;

         //Если нашли, то расчитаем куда и на сколько нам скролить
         if(elemToScroll) {
            elemRect = elemToScroll.getBoundingClientRect();
            delta = arrowRect.left - elemRect.left;
            elemWidth = elemToScroll.offsetWidth;

            //Подключим анимацию
            this._container.addClass('controls-DataGrid__PartScroll__animation');
            this._moveThumbAndColumns({left: this._currentScrollPosition - ((delta > elemWidth / 2  ? - (elemWidth - delta) : delta) / this._partScrollRatio)});

            //Тут приходится делать таймаут, чтобы правильно прошло выключение-включение анимации
            setTimeout(function() {
               this._container.removeClass('controls-DataGrid__PartScroll__animation')
            }.bind(this), ANIMATION_DURATION);
         }
      },

      _getDragContainer: function() {
         return this._thead.find('.controls-DataGrid__PartScroll__thumb');
      },

      _getWithinElem: function() {
         return this._thead.find('.controls-DataGrid__PartScroll__container');
      },

      _dragMove: function(event, cords) {
         this._moveThumbAndColumns(cords);
      },

      _moveThumbAndColumns: function(cords) {
         this._currentScrollPosition = this._checkThumbPosition(cords);
         var movePosition = -this._currentScrollPosition*this._partScrollRatio;

         this._setThumbPosition(this._currentScrollPosition);
         for(var i= 0, len = this._movableElems.length; i < len; i++) {
            this._movableElems[i].style.left = movePosition + 'px';
         }
      },

      _setThumbPosition: function(cords) {
         this._thumb[0].style.left = cords + 'px';
      },

      _updatePartScrollWidth: function() {
         var containerWidth = this._container[0].offsetWidth,
             scrollContainer = this._getWithinElem(),
             thumbWidth = this._thumb[0].offsetWidth,
             correctMargin = 0,
             notScrolledCells;

         /* Найдём ширину нескролируемых колонок */
         if(this._options.startScrollColumn > 0) {
            notScrolledCells = this._thead.find('tr').eq(0).find('.controls-DataGrid__notScrolledCell');
            for(var i = 0, len = notScrolledCells.length; i < len; i++) {
               correctMargin += notScrolledCells[i].offsetWidth
            }
            /* Сдвинем контейнер скрола на ширину нескролируемых колонок */
            scrollContainer[0].style.marginLeft = correctMargin + 'px';
         }
         /* Проставим ширину контейнеру скрола */
         scrollContainer[0].style.width = containerWidth - correctMargin + 'px';

         /* Найдём соотношение, для того чтобы правильно двигать скролируемый контент относительно ползунка */
         this._partScrollRatio = (this._getItemsContainer()[0].offsetWidth - containerWidth) / (containerWidth - correctMargin - thumbWidth - 40);
         this._stopMovingCords.right = scrollContainer[0].offsetWidth - thumbWidth - 40;
      },

      _findMovableCells: function() {
         this._movableElems = this._container.find('.controls-DataGrid__scrolledCell');
      },

      _checkThumbPosition: function(cords) {
         if (cords.left <= this._stopMovingCords.left){
            this._toggleActiveArrow(this._arrowLeft, false);
            return 0;
         } else if (!this._arrowLeft.hasClass('icon-primary')) {
            this._toggleActiveArrow(this._arrowLeft, true);
         }

         if (cords.left >= this._stopMovingCords.right) {
            this._toggleActiveArrow(this._arrowRight, false);
            return this._stopMovingCords.right;
         } else if (!this._arrowRight.hasClass('icon-primary')) {
            this._toggleActiveArrow(this._arrowRight, true);
         }
         return cords.left;
      },

      _toggleActiveArrow: function(arrow, enable) {
         arrow.toggleClass('icon-disabled', !enable)
              .toggleClass('icon-primary action-hover', enable);
      },

      _isTableWide: function() {
         return this._container[0].offsetWidth < this._getItemsContainer()[0].offsetWidth;
      },

      _hidePartScroll: function() {
         if(this._isPartScrollVisible) {
            this._getWithinElem().addClass('ws-hidden');
            this._isPartScrollVisible = false;
         }
      },

      _showPartScroll: function() {
         if(!this._isPartScrollVisible) {
            this._getWithinElem().removeClass('ws-hidden');
            this._updatePartScrollWidth();
            this._isPartScrollVisible = true;
         }
      },

      isNowScrollingPartScroll: function() {
         return this._scrollingNow;
      },

      /*******************************/
      /*  Конец частичного скролла   */
      /*******************************/
      // </editor-fold>
       /**
        * Метод получения текущего описания колонок представления данных.
        * @returns {*|columns} Описание набора колонок.
        * @example
        * <pre>
        *    var columns = dataGrid.getColumns(),
        *        newColumns = [];
        *    for(var i = 0, l = columns.length; i < l; i++){
        *       if(columns[i].title !== "Примечание")
        *          newColumns.push(columns[i]);
        *    }
        *    newColumns.push({
        *       title: 'ФИО',
        *       field: 'РП.ФИО'
        *    });
        *    dataGrid.setColumns(newColumns);
        * </pre>
        */
      getColumns : function() {
         return this._options.columns;
      },
       /**
        * Метод установки либо замены колонок, заданных опцией {@link columns}.
        * @param columns Новый набор колонок.
        * @example
        * <pre>
        *    var columns = dataGrid.getColumns(),
        *        newColumns = [];
        *    for(var i = 0, l = columns.length; i < l; i++){
        *       if(columns[i].title !== "Примечание")
        *          newColumns.push(columns[i]);
        *    }
        *    newColumns.push({
        *       title: 'ФИО',
        *       field: 'РП.ФИО'
        *    });
        *    dataGrid.setColumns(newColumns);
        * </pre>
        */
       setColumns : function(columns) {
          var headerTr = $('<tr>'),
              docFragmentForColGroup = document.createDocumentFragment(),
              isPartScrollUsed = this._options.startScrollColumn !== undefined;

          this._thead.find('.controls-DataGrid__th').eq(0).parent().remove();
          this._colgroup.empty();
          if (this._options.multiselect) {
             headerTr.append('<th class="controls-DataGrid__th' +
             (isPartScrollUsed ?
                this._options.startScrollColumn === 0 ?
                   ' controls-DataGrid__scrolledCell' :
                   ' controls-DataGrid__notScrolledCell"></th>' : '"></th>'));
             docFragmentForColGroup.appendChild($('<col width="24px">')[0]);
          }
          this._options.columns = columns;
          for (var i = 0; i < columns.length; i++) {
             var column = document.createElement('col');
             if (columns[i].width) column.width = columns[i].width;
             docFragmentForColGroup.appendChild(column);
             headerTr.append(
                $('<th class="controls-DataGrid__th' +
                  (isPartScrollUsed ?
                      this._options.startScrollColumn <= i ?
                         ' controls-DataGrid__scrolledCell' :
                         ' controls-DataGrid__notScrolledCell' : '') + 
                     '" title="' + columns[i].title + '"><div class="controls-DataGrid__th-content">' + columns[i].title + '</div></th>'));
          }

          if (this._editInPlace) {
             this._editInPlace.destroy();
             this._createEditInPlace();
          }

          this._colgroup.append(docFragmentForColGroup);
          this._thead.prepend(headerTr);
          this._checkColumns();
          this._redraw();
       },
      /**
       * Проверяет настройки колонок, заданных опцией {@link columns}.
       */
      _checkColumns : function() {
         for (var i = 0; i < this._options.columns.length; i++) {
            var column = this._options.columns[i];
            if (column.highlight === undefined) {
               column.highlight =  true;
            }
         }
      },
      _getItemActionsPosition: function(item) {
         return {
            top: item.position.top + ((item.size.height > ITEMS_ACTIONS_HEIGHT) ? item.size.height - ITEMS_ACTIONS_HEIGHT : 0 ),
            right: 0
         };
      },
      _showItemActions: function() {
         if(!this.isNowScrollingPartScroll()) {
            DataGrid.superclass._showItemActions.call(this);
         }
      },

      reload: function() {
         if (this._editInPlace && this._editInPlace.isEditing()) {
            this._editInPlace.finishEditing();
         }
         return DataGrid.superclass.reload.apply(this, arguments);
      },

      _getLeftOfItemContainer : function(container) {
         return $(".controls-DataGrid__td", container.get(0)).first();
      },
      //------------------------GroupBy---------------------
      _getGroupTpl : function(){
         return this._options.groupBy.template || groupByTpl;
      },

      destroy: function() {
         if(this._options.startScrollColumn !== undefined) {
            this._thumb.unbind('click');
            this._thumb = undefined;
            this._arrowLeft.unbind('click');
            this._arrowLeft = undefined;
            this._arrowRight.unbind('click');
            this._arrowRight = undefined;
            this._movableElems = [];
         }
         DataGrid.superclass.destroy.call(this);
      }

   });

   return DataGrid;

});