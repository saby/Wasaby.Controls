
define('SBIS3.CONTROLS/Paging', [
   'Lib/Control/CompoundControl/CompoundControl',
   'tmpl!SBIS3.CONTROLS/Paging/Paging',
   'SBIS3.CONTROLS/Mixins/ItemsControlMixin',
   'SBIS3.CONTROLS/Mixins/Selectable',
   'Core/constants',
   'tmpl!SBIS3.CONTROLS/Paging/resources/ItemsTemplate',
   'SBIS3.CONTROLS/Button/IconButton',
   'css!SBIS3.CONTROLS/Paging/Paging'
], function(CompoundControl, dotTplFn, ItemsControlMixin, Selectable, constants, ItemsTemplate) {

   'use strict';

   /**
    * Класс контрола "Кнопки постраничной навигации".
    * Состоит из базовых кнопок для навигации: "Перейти на первую страницу", "Перейти на предыдущую страницу", "Перейти на следующую страницу" и "Перейти к последней странице".
    * Отображение последней кнопки зависит от режима постраничной навигации (см. {@link mode}).
    * Отображение номеров страниц устанавливается в опции {@link showPages}.
    *
    * @class SBIS3.CONTROLS/Paging
    * @extends Lib/Control/CompoundControl/CompoundControl
    *
    * @mixes SBIS3.CONTROLS/Mixins/ItemsControlMixin
    * @mixes SBIS3.CONTROLS/Mixins/Selectable
    *
    * @control
    * @category Decorate
    * @public
    *
    * @author Крайнов Д.О.
    */

   var getRecordForRedraw = function(projection, cfg) {
      var
         selId, firstElem, lastElem,
         dot1 = false,
         dot2 = false,
         count = projection.getCount(),
         records = [];
      if (cfg.showPages && projection) {     //У таблицы могут позвать перерисовку, когда данных еще нет
         selId = parseInt(cfg.selectedKey, 10) || 1;  //TODO || 1 - не очень хорошо, это должно уже из Selectable приходить
         firstElem = selId - 1;
         lastElem = selId + 1;

         if (firstElem < 1) {
            firstElem = selId;
            lastElem = selId + 2 > count ? count : selId + 2;
         }
         if (lastElem > count) {
            firstElem = count - 2 < 0 ? 0 : count - 2;
            lastElem = count;
         }

         if (cfg.mode == 'full') {
            if (firstElem - 1 > 1) {
               dot1 = true;
            }
            if (lastElem + 1 < count) {
               dot2 = true;
            }
         }

         var counter = 1;
         projection.each(function (item) {
            var curId = parseInt(item.getContents().getId(), 10);
            if (cfg.mode == 'part') {
               if (curId >= firstElem && curId <= lastElem) {
                  records.push(item);
               }
            }
            else if (cfg.mode == 'full') {
               if (counter == 1 || counter == count) {
                  records.push(item);
               }
               else {
                  if (dot1 && counter == 2) {
                     records.push('...');
                  }
                  if (dot2 && counter == count - 1) {
                     records.push('...');
                  }
                  if (curId >= firstElem && curId <= lastElem) {
                     records.push(item);
                  }
               }
            }
            counter++;
         });
      }
      return records;
   },

   generateItems = function(cfg) {
      if (cfg.pagesCount && !cfg.items) {
         cfg.items = [];
         cfg.idProperty = 'id';
         cfg.displayProperty = 'text';
         for (var i = 1; i <= cfg.pagesCount; i++) {
            cfg.items.push({
               id : i,
               text : i.toString()
            });
         }
      }
   };

   var Pager = CompoundControl.extend([ItemsControlMixin, Selectable],/** @lends SBIS3.CONTROLS/Paging.prototype */{
      _dotTplFn: dotTplFn,
      /**
       * @event onPageChange Происходит при смене текущей страницы: при клике по номеру страницы или стрелке перехода на другую страницу.
       * @param {Core/EventObject} eventObject Дескриптор события.
       * @param {Number} number Номер новой страницы.
       * @remark
       * Необходимо вызвать функцию на успех с аргументом типа Boolean: есть ли следующая страница.
       */
       /**
        * @event onFirstPageSet Происходит при клике на кнопку "Перейти на первую страницу".
        * @param {Core/EventObject} eventObject Дескриптор события.
        * @remark
        */
       /**
        * @event onLastPageSet Происходит при клике на кнопку "Перейти к последней странице".
        * @param {Core/EventObject} eventObject Дескриптор события.
        */
      $protected: {
         _prevBtn: null,
         _nextBtn: null,
         _options: {
            _canServerRender: true,
            _getRecordsForRedraw : getRecordForRedraw,
            allowEmptySelection: false,
             /**
              * @cfg {String} Устанавливает режим работы постраничной навигации.
              * @remark
              * <ul>
              *     <li>part - "частичная". В этом режиме пользователь видит номера текущей страницы, следующей и предыдущей; общее количество страниц неизвестно. Кнопка навигации "Перейти к последней странице" недоступна для использования.
              *         ![](/part.png)
              *     </li>
              *     <li>full - "полная". В этом режиме пользователь видит номера первой страниц, последней и промежуточных страниц, которые разделены друг от друга троеточием.
              *         ![](/full.png)
              *     </li>
              * </ul>
              * @see getMode
              */
            mode: 'part',
             /**
              * @cfg {Number} Устанавливает число элементов, отображаемых на одной странице.
              * @remark
              * В контексте работы с источником данных эта опция устанавливает число запрашиваемых записей.
              * @see setPagesCount
              * @see getPagesCount
              */
            pagesCount: null,
             /**
              * @cfg {Boolean} Устанавливает отображение номеров страниц.
              * @remark
              * Номера страниц отображаются между базовыми кнопками для навигации.
              * ![](/showpages.png)
              */
            showPages: true,
             /**
              * @cfg {Object} Устанавливает конфигурацию для отображения кнопок навигации и номеров страниц.
              * @remark
              * Список свойств объекта:
              * <ul>
              *     <li>begin (Boolean) - устанавливает отображение кнопки "Перейти на первую страницу";</li>
              *     <li>prev (Boolean) - устанавливает отображение кнопки "Перейти на предыдущую страницу";</li>
              *     <li>pages (Boolean) - устанавливает отображение нумеров страниц;</li>
              *     <li>next (Boolean) - устанавливает отображение кнопки "Перейти на следующую страницу";</li>
              *     <li>end (Boolean) - устанавливает отображение кнопки "Перейти к последней странице".</li>
              * </ul>
              * @example
              *
              */
            visiblePath: null
         }
      },
      $constructor: function(){
         this._publish('onPageChange');
      },
      _modifyOptions: function(cfg) {
         generateItems(cfg);
         var newCfg = Pager.superclass._modifyOptions.apply(this, arguments);
         newCfg._itemsTemplate = ItemsTemplate;

         /**
          * Опция navigationToolbar должна будет заменить mode и pagesCount. Пока поддерживаем совместимость.
          */
         if (!cfg.visiblePath) {
            cfg.visiblePath = {
               begin: true,
               prev: true,
               pages: cfg.showPages,
               next: true,
               end: cfg.mode === 'full'
            };
         }

         return newCfg;
      },
      init: function(){
         Pager.superclass.init.call(this);
         if (!this._prevBtn) {
            this._bindControls();
         }
         this._container.on('keydown', this._keydownHandler.bind(this));
      },
       /**
        * Возвращает значение, соответствующее установленному режиму работы постраничной навигации.
        * @returns {String}
        * @see mode
        */
      getMode: function() {
         return this._options.mode;
      },
       /**
        * Возвращает число элементов, отображаемых на одном странице.
        * @returns {Number}
        * @see pagesCount
        * @see setPagesCount
        */
      getPagesCount: function() {
         return this._options.pagesCount;
      },

      getZIndex: function(){
        return this._zIndex;
      },
       /**
        * Устанавливает число элементов, отображаемых на одной странице.
        * @param {Number} count
        * @see pagesCount
        * @see getPagesCount
        */
      setPagesCount: function(count) {
         this._options.pagesCount = count;
         this._options.items = null;
         generateItems(this._options);
         this.setItems(this._options.items);
      },

      _onClickHandler: function(e) {
         var $target = $(e.target),
            target = $target.closest('.js-controls-ListView__item'),
            hash, proj, item;

         if (target.length) {
            hash = target.data('hash');
            proj = this._getItemsProjection();
            if (proj) {
               item = proj.getByHash(hash);
               this.setSelectedKey(item.getContents().getId());
            }
         }
      },

      _drawSelectedItem: function(id) {
         var selId = id;
         $(".controls-Paging__item", this._container).removeClass('controls-ListView__item__selected');
         $('.controls-Paging__item[data-id="' + selId + '"]', this._container).addClass('controls-ListView__item__selected');
      },

      setSelectedKey: function() {
         Pager.superclass.setSelectedKey.apply(this, arguments);
         //если страницы рисуются, то набор надо перерисовать, т.к. он зависит от выбранного элемента
         if (this._options.visiblePath.pages) {
            this.redraw();
         }
         else {
            this._toggleItemsEnabled();
         }
      },

      _getItemsContainer: function() {
         return $('.controls-Paging__itemsContainer', this._container.get(0));
      },
      
      _toggleItemsEnabled: function() {
         if (!this._prevBtn) {
            this._bindControls();
         }
         if (this.getSelectedKey() == 1) {
            this._prevBtn.setEnabled(false);
            this._beginBtn.setEnabled(false);
         }
         else {
            this._prevBtn.setEnabled(true);
            this._beginBtn.setEnabled(true);
         }
         if (this.getItems() && (this.getSelectedKey() == this.getItems().getCount())) {
            this._nextBtn.setEnabled(false);
            this._endBtn.setEnabled(false);
         }
         else {
            this._endBtn.setEnabled(true);
            this._nextBtn.setEnabled(true);
         }
      },

      _drawItemsCallback: function() {
         Pager.superclass._drawItemsCallback.apply(this, arguments);
         this._toggleItemsEnabled();
      },

      destroy: function() {
         Pager.superclass.destroy.apply(this, arguments);
         this._prevBtn = null;
         this._nextBtn = null;
         this._beginBtn = null;
         this._endBtn = null;

         this._container.off('keydown');
      },
      _bindControls: function() {
         this._prevBtn = this.getChildControlByName('PagingPrev');
         this._nextBtn = this.getChildControlByName('PagingNext');
         this._beginBtn = this.getChildControlByName('PagingBegin');
         this._endBtn = this.getChildControlByName('PagingEnd');

         this._prevBtn.subscribe('onActivated', this._goToPrev.bind(this));
         this._nextBtn.subscribe('onActivated', this._goToNext.bind(this));
         this._beginBtn.subscribe('onActivated', this._goToBegin.bind(this));
         this._endBtn.subscribe('onActivated', this._goToEnd.bind(this));
      },

      _goToNext: function() {
         this._goToSibling(1);
      },

      _goToPrev: function() {
         this._goToSibling(-1);
      },

      _goToSibling: function(dir) {
         var selKey = parseInt(this.getSelectedKey(), 10);
         this.setSelectedKey(selKey+dir);
      },

      _goToBegin: function() {
         this._notify('onFirstPageSet');
         this.setSelectedKey(1);
      },

      _goToEnd: function() {
         this._notify('onLastPageSet');
         this.setSelectedKey(this.getItems().getCount());
      },
      _keydownHandler: function(e) {
         switch(e.which) {
            case constants.key.pageUp:
               this._goToPrev();
               break;
            case constants.key.pageDown:
               if (this.getPagesCount() > this.getSelectedKey()) {
                  this._goToNext();
               }
               break;
         }
         return false;
      }
   });

   return Pager;

});
