/**
 * Created by as.suhoruchkin on 02.04.2015.
 */
define('js!SBIS3.CONTROLS.OperationsMark', [
   'js!SBIS3.CONTROLS.MenuLink',
   'js!SBIS3.CONTROLS.CheckBox',
   'Core/core-instance',
   'i18n!SBIS3.CONTROLS.OperationsMark',
   'css!SBIS3.CONTROLS.OperationsMark'
], function(MenuLink, CheckBox, cInstance) {
   /**
    * Операции выделения.
    *
    * SBIS3.CONTROLS.OperationsMark
    * @class SBIS3.CONTROLS.OperationsMark
    * @extends SBIS3.CONTROLS.MenuLink
    * @author Сухоручкин Андрей Сергеевич
    * @public
    */
   /*TODO Пока что динамическое создание CheckBox, пока не слиты Control и CompaundControl!!!*/
   var OperationsMark = MenuLink.extend(/** @lends SBIS3.CONTROLS.OperationsMark.prototype */{
      $protected: {
         _options: {
             /**
              * @cfg {String} Текст на кнопке
              * @example
              * <pre>
              *     <option name="caption">Операции отметки</option>
              * </pre>
              * @translatable
              */
            caption: undefined,
            /**
             * @cfg {Function} Функция рендеринга заголовка кнопки, которой аргументом приходит
             * количество выделенных записей в связанном представлении данных
             */
            captionRender: undefined,
             /**
              * @noShow
              */
            linkedView: undefined,
             /**
              * @typedef {Object} OperationsMarkItems
              * @property {String} name Имя кнопки операции.
              * @property {String} title Заголовок кнопки операции.
              * @property {String} handler Имя функции обработчика клика по пункту меню операций отметки.
              * @translatable title
              */
             /**
              * @cfg {OperationsMarkItems[]} Операции отметки.
              */
            items: [
               { name: 'selectAll', title: rk('Все') },
               { name: 'selectCurrentPage', title: rk('Всю страницу') },
               { name: 'removeSelection', title: rk('Снять') },
               { name: 'invertSelection', title: rk('Инвертировать') }
            ],
            /**
             * @cfg {Boolean} Использовать функционал выбора всех записей
             */
            useSelectAll: true,
            /**
             * @cfg {Boolean} При отметке всех записей, выделять записи из открытых папок
             * @deprecated
             */
            deepReload: false,
            idProperty: 'name'
         },
         _useSelectAll: false,
         _markCheckBox: undefined
      },
      $constructor: function() {
         this._createMarkCheckBox();
         this._setCaptionRender();
      },
      _initItems: function(items) {
         var self = this;
         $.each(items, function(key, val) {
            self._parseItem(val);
         });
         OperationsMark.superclass._initItems.apply(this, [items]);
      },
      _parseItem: function(item) {
         if (item.handler) {
            this[item.name] = item.handler;
         }
      },
      /**
       * Добавление операции
       * @param {Object} item Операция.
       */
      addItem: function(item) {
         this._parseItem(item);
         OperationsMark.superclass.addItem.apply(this, [item]);
      },
      _bindEvents: function() {
         this._options.linkedView.subscribe('onSelectedItemsChange', this._updateMark.bind(this));
         this.subscribe('onMenuItemActivate', this._onMenuItemActivate.bind(this));
      },
      /**
       * Метод установки или замены связанного представления данных.
       * @param {SBIS3.CONTROLS.ListView} linkedView
       */
      setLinkedView: function(linkedView) {
         if (linkedView && cInstance.instanceOfMixin(linkedView, 'SBIS3.CONTROLS.MultiSelectable')) {
            this._options.linkedView = linkedView;
            this._useSelectAll = linkedView._options.useSelectAll;
            //Если есть бесконечный скролл то показываем кнопку "Все", иначе показываем кнопку "Всю страницу"
            this.getItemInstance('selectCurrentPage').toggle(!linkedView._options.infiniteScroll);
            this.getItemInstance('selectAll').toggle(linkedView._options.infiniteScroll);
            this._bindEvents();
            this._updateMark();
         }
      },
      //TODO: вынести данную логику в MenuLink
      showPicker: function() {
         OperationsMark.superclass.showPicker.apply(this);
         this._picker._container.find('.controls-MenuLink__header').toggleClass('ws-hidden', !this._options.caption);
      },
      _onMenuItemActivate: function(e, id) {
         if (this[id]) {
            this[id].apply(this);
         }
      },
      _onCheckBoxActivated: function() {
         if (this._markCheckBox.isChecked()){
            this.getItems().getRecordById('selectAll') ? this.selectAll() : this.selectCurrentPage();
         } else {
            this.removeSelection();
         }   
      },
      _updateMarkCheckBox: function() {
         var view = this._options.linkedView,
            //TODO Подумать что делать если нет _dataSet
            recordsCount = view.getItems() ? view.getItems().getCount() : 0,
            selectedCount = view.getSelectedKeys().length;
         this._markCheckBox.setChecked(selectedCount === recordsCount && recordsCount ? true : selectedCount ? null : false);
      },
      _updateMarkButton: function() {
         if (!this._dataSet) {
            this.reload();
         }
         var hasMarkOptions = !!this._dataSet.getCount(),
            selectedCount,
            caption;
         if (hasMarkOptions) {
            selectedCount = this._options.linkedView.getSelectedKeys().length;
            caption = this._options.captionRender ? this._options.captionRender(selectedCount) : this._options.caption;
            this.setCaption(caption);
         }
         this.setVisible(hasMarkOptions);
      },
      _captionRender: function(selectedCount) {
         return selectedCount ? rk('Отмечено') + '(' + selectedCount + ')' : rk('Отметить');
      },
      _setCaptionRender: function() {
         if (typeof this._options.caption !== 'string' && !this._options.captionRender) {
            this._options.captionRender = this._captionRender;
         }
      },
      _updateMark: function() {
         this._updateMarkButton();
         this._updateMarkCheckBox();
      },
      /**
       * Выбрать все элементы.
       */
      selectAll: function() {
         if (this._useSelectAll) {
            this._options.linkedView.setSelectedAllNew(true);
         } else if (this._options.useSelectAll) {
            this._options.linkedView.setSelectedAll(this._options.deepReload);
         } else {
            this._options.linkedView.setSelectedItemsAll();
         }
      },
      /**
       * Выбрать все видимые элементы.
       */
      selectCurrentPage: function() {
         this._options.linkedView.setSelectedItemsAll();
      },
      /**
       * Снять выделение со всех элементов.
       */
      removeSelection: function() {
         if (this._useSelectAll) {
            this._options.linkedView.setSelectedAllNew(false);
         } else {
            this._options.linkedView.setSelectedKeys([]);
         }
      },
      /**
       * Инвертировать выделение всех элементов.
       */
      invertSelection: function() {
         if (this._useSelectAll) {
            this._options.linkedView.toggleSelectedAll();
         } else {
            this._options.linkedView.toggleItemsSelectionAll();
         }
      },
      _createMarkCheckBox: function() {
         if (!this._markCheckBox) {//TODO костыль для ЭДО, чтоб не создавалось 2 раза
            this._markCheckBox = new CheckBox({
               threeState: true,
               parent: this,
               element: $('<span>').insertBefore(this._container),
               className: 'controls-OperationsMark-checkBox',
               handlers: {
                  onActivated: this._onCheckBoxActivated.bind(this)
               }
            });
         }
      }
   });

   return OperationsMark;
});
