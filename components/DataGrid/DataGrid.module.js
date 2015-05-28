define('js!SBIS3.CONTROLS.DataGrid',
   [
      'js!SBIS3.CONTROLS.ListViewDS',
      'html!SBIS3.CONTROLS.DataGrid',
      'html!SBIS3.CONTROLS.DataGrid/resources/rowTpl',
      'js!SBIS3.CORE.MarkupTransformer',
      'js!SBIS3.CONTROLS.EditInPlaceController',
      'js!SBIS3.CONTROLS.Link',
      'js!SBIS3.CONTROLS.DragAndDropMixin'
   ],
   function(ListView, dotTplFn, rowTpl, MarkupTransformer, EditInPlaceController, Link, DragAndDropMixin) {
   'use strict';
      /* TODO: Надо считать высоту один раз, а не делать константой */
      var
         ITEMS_ACTIONS_HEIGHT = 20;
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
         _currentThumbPosition: undefined,            //Контейнер скроллбара
         _scrollingNow: false,                        //Флаг обозаначающий, происходит ли в данный момент скролирование элементов
         _options: {
            /**
             * @typedef {Object} Columns
             * @property {String} title Заголовок колонки
             * @property {String} field Имя поля
             * @property {Number} width Ширина колонки
             * Значение необходимо задавать для колонок с фиксированной шириной.
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
               addInPlace: false
            },
            /**
             * @cfg {Number} Частичный скролл
             */
            startScrollColumn: undefined
         }
      },

      $constructor: function() {
         this._thead = $('.controls-DataGrid__thead', this._container.get(0));
         this._colgroup = $('.controls-DataGrid__colgroup', this._container.get(0))
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
         var self = this;
         if (!this._editInPlace) {
            this._dataSet.subscribe('onRecordChange', function(event, record) {
               self._getItemsContainer().find('.controls-ListView__item[data-id="' + record.getKey() + '"]')
                  .empty()
                  .append($(self._getItemTemplate(record)).children());
            });
            this._createEditInPlace();
         }
      },

      _createEditInPlace: function() {
         this._editInPlace = new EditInPlaceController({
            columns: this._options.columns,
            addInPlaceButton: this._addInPlaceButton,
            element: $('<div>').appendTo(this._container.find('.controls-DataGrid__table')),
            dataSet: this._dataSet,
            ignoreFirstColumn: this._options.multiselect,
            dataSource: this._dataSource
         });
      },
      
      _onChangeHoveredItem: function(hoveredItem) {
         if (this._options.editInPlace.enabled && this._options.columns && this._options.columns.length) {
            this._initEditInPlace();
            this._editInPlace.updateDisplay(hoveredItem);
         }
         DataGrid.superclass._onChangeHoveredItem.apply(this, arguments);
      },

      _checkTargetContainer: function(target) {
         return this._thead.length && $.contains(this._thead[0], target[0]) ||
                this._addInPlaceButton && $.contains(this._addInPlaceButton.getContainer().parent()[0], target[0]) ||
                DataGrid.superclass._checkTargetContainer.apply(this, arguments);
      },

      _getItemsContainer: function(){
         return $('.controls-DataGrid__tbody', this._container);
      },

      _getItemTemplate: function(item){
         if (!this._options.itemTemplate) {

            var rowData = {
               columns : $ws.core.clone(this._options.columns),
               multiselect : this._options.multiselect,
               hierField: this._options.hierField + '@',
               startScrollColumn: this._options.startScrollColumn
            };

            for (var i = 0; i < rowData.columns.length; i++) {
               var value;
               if (rowData.columns[i].cellTemplate) {
                  var cellTpl = rowData.columns[i].cellTemplate;
                  value = MarkupTransformer(doT.template(cellTpl)({item : item, field : rowData.columns[i].field}));
               }
               else {
                  value = item.get(rowData.columns[i].field);
                  value = ((value != undefined) && (value != null)) ? value : '';
               }
               rowData.columns[i].value = value;
               rowData.columns[i].item = item;
            }
            return this._rowTpl(rowData)
         }
         else {
            return this._options.itemTemplate(item)
         }

      },

      _drawItemsCallback: function () {
         if(this._options.startScrollColumn !== undefined) {
            var needShowScroll = this._isPartScrollNeeded();

            this._isPartScrollVisible ?
               needShowScroll ?
                  this._updatePartScrollWidth() : this._hidePartScroll() :
               needShowScroll ?
                  this._showPartScroll() : this._hidePartScroll();

            this._movableElems = this._findMovableCells();
         }
      },
      /************************/
      /*   Частичный скролл   */
      /***********************/
      _initPartScroll: function() {
         (this._arrowLeft = this._thead.find('.controls-DataGrid__PartScroll__arrowLeft')).click(this._arrowClickHandler.bind(this, true));
         (this._arrowRight = this._thead.find('.controls-DataGrid__PartScroll__arrowRight')).click(this._arrowClickHandler.bind(this, false));
         (this._thumb = this._getDragContainer()).mousedown(this._thumbClickHandler.bind(this));
         this.initializeDragAndDrop();
      },

      _dragStart: function() {
         $ws._const.$body.addClass('ws-unSelectable');
         this._scrollingNow = true;
      },

      _arrowClickHandler: function(isRightArrow) {
         var shift = (this._getWithinElem()[0].offsetWidth/100)*5;
         this._dragMove(false, {left: (parseInt(this._thumb[0].style.left) || 0) + (isRightArrow ?  -shift : shift)});
      },

      _thumbClickHandler: function() {
        this._thumb.addClass('controls-DataGrid__PartScroll__thumb-clicked');
      },

      _dragEnd: function() {
         $ws._const.$body.removeClass('ws-unSelectable');
         this._thumb.removeClass('controls-DataGrid__PartScroll__thumb-clicked');
         this._scrollingNow = false;
      },

      _getDragContainer: function() {
         return this._thead.find('.controls-DataGrid__PartScroll__thumb');
      },

      _getWithinElem: function() {
         return this._thead.find('.controls-DataGrid__PartScroll__container');
      },

      _dragMove: function(event, cords) {
         var correctCords = this._checkThumbPosition(cords),
             movePosition = -correctCords*this._partScrollRatio;

         this._setThumbPosition(correctCords);
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
         return this._container.find('.controls-DataGrid__scrolledCell');
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

      _isPartScrollNeeded: function() {
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

      isNowScrolling: function() {
         return this._scrollingNow;
      },

      /*******************************/
      /*  Конец частичного скролла   */
      /*******************************/

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
              docFragmentForColGroup = document.createDocumentFragment();

          this._thead.find('.controls-DataGrid__th').eq(0).parent().remove();
          this._colgroup.empty();
          this._options.columns = columns;

          for (var i = 0; i < columns.length; i++) {
             var column = document.createElement('col');
             if (columns[i]['width']) column.width = columns[i]['width'];
             docFragmentForColGroup.appendChild(column);
             headerTr.append(
                $('<th class="controls-DataGrid__th' +
                (this._options.startScrollColumn !== undefined ? this._options.startScrollColumn <= i ?
                      ' controls-DataGrid__scrolledCell' : ' controls-DataGrid__notScrolledCell' : '')
                + '"></th>').text(columns[i].title));
          }

          if (this._editInPlace) {
             this._editInPlace.destroy();
             this._createEditInPlace();
          }

          this._colgroup.append(docFragmentForColGroup);
          this._thead.prepend(headerTr);
          this._redraw();
       },
      _getItemActionsPosition: function(item) {
         return {
            top: item.position.top + ((item.size.height > ITEMS_ACTIONS_HEIGHT) ? item.size.height - ITEMS_ACTIONS_HEIGHT : 0 ),
            right: 0
         };
      },
      _showItemActions: function() {
         if(!this.isNowScrolling()) {
            DataGrid.superclass._showItemActions.call(this);
         }
      },

      reload: function() {
         if (this._editInPlace && this._editInPlace.isEditing()) {
            this._editInPlace.finishEditing();
         }
         DataGrid.superclass.reload.apply(this, arguments);
      },

      _getLeftOfItemContainer : function(container) {
         return $(".controls-DataGrid__td", container.get(0)).first();
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