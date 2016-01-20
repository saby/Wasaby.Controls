/**
 * Created by as.suhoruchkin on 02.04.2015.
 */
define('js!SBIS3.CONTROLS.OperationsMark', [
   'js!SBIS3.CONTROLS.MenuLink',
   'js!SBIS3.CONTROLS.CheckBox'
], function(MenuLink, CheckBox) {
   /**
    * Операции выделения.
    *
    * SBIS3.CONTROLS.OperationsMark
    * @class SBIS3.CONTROLS.OperationsMark
    * @extends SBIS3.CONTROLS.MenuLink
    * @control
    * @public
    * @author Крайнов Дмитрий Олегович
    * @initial
    * <component data-component='SBIS3.CONTROLS.OperationsMark'>
    *
    * </component>
    */
   /*TODO Пока что динамическое создание CheckBox, пока не слиты Control и CompaundControl!!!*/
   var OperationsMark = MenuLink.extend({
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
              */
             /**
              * @cfg {OperationsMarkItems[]} Операции отметки.
              */
            items: [
               { name: 'selectCurrentPage', title: 'Всю страницу' },
               { name: 'removeSelection', title: 'Снять' },
               { name: 'invertSelection', title: 'Инвертировать' }
            ]
         },
         _markCheckBox: undefined
      },
      $constructor: function() {
         this._createMarkCheckBox();
         this._setCaptionRender();
         this.setLinkedView(this._options.linkedView);
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
         if (linkedView && $ws.helpers.instanceOfMixin(linkedView, 'SBIS3.CONTROLS.MultiSelectable')) {
            this._options.linkedView = linkedView;
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
         this._markCheckBox.isChecked() === true ? this.selectCurrentPage() : this.removeSelection();
      },
      _updateMarkCheckBox: function() {
         var view = this._options.linkedView,
            //TODO Подумать что делать если нет _dataSet
            recordsCount = view._dataSet ? view._dataSet.getCount() : 0,
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
         return selectedCount ? 'Отмечено(' + selectedCount + ')' : 'Отметить';
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
      selectCurrentPage: function() {
         this._options.linkedView.setSelectedItemsAll()
      },
      /**
       * Снять выделение со всех элементов.
       */
      removeSelection: function() {
         this._options.linkedView.setSelectedKeys([]);
      },
      /**
       * Инвертировать выделение всех элементов.
       */
      invertSelection: function() {
         this._options.linkedView.toggleItemsSelectionAll();
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
