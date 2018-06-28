/**
 * Created by as.suhoruchkin on 02.04.2015.
 */
define('SBIS3.CONTROLS/OperationsPanel/Mark', [
   'SBIS3.CONTROLS/CompoundControl',
   'Core/core-instance',
   'Core/helpers/Function/forAliveOnly',
   'tmpl!SBIS3.CONTROLS/OperationsPanel/Mark/OperationsMark',
   'SBIS3.CONTROLS/Menu/MenuLink',
   'SBIS3.CONTROLS/CheckBox',
   'css!SBIS3.CONTROLS/OperationsPanel/Mark/OperationsMark'
], function(CompoundControl, cInstance, forAliveOnly, template) {
   /**
    * Операции выделения.
    *
    * SBIS3.CONTROLS/OperationsPanel/Mark
    * @class SBIS3.CONTROLS/OperationsPanel/Mark
    * @extends SBIS3.CONTROLS/Menu/MenuLink
    * @author Сухоручкин А.С.
    * @public
    */
   var OperationsMark = CompoundControl.extend(/** @lends SBIS3.CONTROLS/OperationsPanel/Mark.prototype */{
      _dotTplFn: template,
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
             * @cfg {Boolean} Показывать кнопку выбора отмеченных записей
             */
            useShowSelected: false,
            /**
             * @cfg {Boolean} При отметке всех записей, выделять записи из открытых папок
             * @deprecated
             */
            deepReload: false,
            idProperty: 'name',
            allowChangeEnable: false
         },
         _showSelected: false,
         _markCheckBox: undefined,
         _isInternalCheckedChange: false
      },

      _modifyOptions: function() {
         var opts = OperationsMark.superclass._modifyOptions.apply(this, arguments);
         if (opts.useShowSelected) {
            opts.items.push({
               name: 'showSelection',
               title: rk('Выбрать отмеченные')
            });
         }
         return opts;
      },

      init: function() {
         OperationsMark.superclass.init.call(this);
         this._markCheckBox = this.getChildControlByName('controls-OperationsMark__checkBox');
         this._menuButton = this.getChildControlByName('controls-OperationsMark__menu');
         this.subscribeTo(this._markCheckBox, 'onCheckedChange', this._onCheckedChange.bind(this));
         this.subscribeTo(this._menuButton, 'onMenuItemActivate', this._onMenuItemActivate.bind(this));
      },
      /**
       * Добавление операции
       * @param {Object} item Операция.
       */
      addItem: function(item) {
         this._menuButton.addItem.apply(this, [item]);
      },
      /**
       * Метод установки или замены связанного представления данных.
       * @param {SBIS3.CONTROLS/ListView} linkedView
       */
      setLinkedView: function(linkedView) {
         var self = this;
         if (linkedView && cInstance.instanceOfMixin(linkedView, 'SBIS3.CONTROLS/Mixins/MultiSelectable')) {
            this._options.linkedView = linkedView;
            //Если включен режим массового выделения, отлючим режим выделения 1000 записей.
            if (linkedView._options.useSelectAll) {
               this._options.useSelectAll = false;
            }
            this._menuButton.once('onPickerOpen', function() {
               var
                  infiniteScroll = linkedView._options.infiniteScroll,
                  selectAll = self._menuButton.getItemInstance('selectAll'),
                  selectCurrentPage = self._menuButton.getItemInstance('selectCurrentPage');
               //Если есть бесконечный скролл то показываем кнопку "Все", иначе показываем кнопку "Всю страницу"
               if (selectCurrentPage) {
                  selectCurrentPage.toggle(!infiniteScroll);
               }
               if (selectAll) {
                  selectAll.toggle(infiniteScroll);
               }
               self._menuButton.getPicker().getContainer().find('.controls-MenuLink__header').toggleClass('ws-hidden', !self._options.caption);
            });
            //Обычно ПМО сама прокидывает onSelectedItemsChange, но люди используют OperationsMark вне ПМО
            //Так что подписываемся на событие onSelectedItemsChange у linkedView
            this.subscribeTo(this._options.linkedView, 'onSelectedItemsChange', this._updateMark.bind(this));
            this._updateMark();
         }
      },

      _onMenuItemActivate: function(e, id) {
         var
            item = this._menuButton.getItems().getRecordById(id),
            handler = item.get('handler') || this[id];
         if (handler) {
            handler.apply(this);
         }
      },
      _onCheckedChange: function(e, checked) {
         if (!this._isInternalCheckedChange) {
            this._setSelectionOnCheckedChange(checked);
         }
      },

      _setSelectionOnCheckedChange: function(checked) {
         if (checked) {
            this._menuButton.getItems().getRecordById('selectAll') ? this.selectAll() : this.selectCurrentPage();
         } else {
            this.removeSelection();
         }
      },

      //Необходимо разграничивать изменение состояния CheckBox из кода и при клике по нему, т.к. изменение состояния CheckBox
      //приводит к изменению набора выделенных записей, а изменение набора выделенных записей приводит к изменению состояния CheckBox.
      //Чтобы не получить зацикливание, при изменении состояния CheckBox из кода, поставим флаг, что это изменение не дожно привести
      //к изменению набора выделенных записей.
      _setCheckedInternal: function(checked) {
         this._isInternalCheckedChange = true;
         this._markCheckBox.setChecked(checked);
         this._isInternalCheckedChange = false;
      },

      _updateMarkCheckBox: function() {
         var view = this._options.linkedView,
            //TODO Подумать что делать если нет _dataSet
            recordsCount = view.getItems() ? view.getItems().getCount() : 0,
            selectedCount = view.getSelectedKeys().length;
         this._setCheckedInternal(selectedCount >= recordsCount && recordsCount ? true : selectedCount ? null : false);
      },
      _updateMarkButton: function() {
         var onMenuButtonLoad = function() {
            var
               caption,
               selectedCount,
               hasMarkOptions = !!this._menuButton.getItems().getCount(),
               captionRender = this._options.captionRender || this._captionRender;
            if (hasMarkOptions) {
               selectedCount = this._options.linkedView.getSelectedKeys().length;
               caption = typeof this._options.caption === 'string' ? this._options.caption : captionRender.call(this, selectedCount);
               this._menuButton.setCaption(caption);
            }
            this._menuButton.setVisible(hasMarkOptions);
            //Событие обновления, необходимо в ПМО, для перерисовки кнопки меню с операциями
            this._notify('onMarkUpdated');

         }.bind(this);

         if (this._menuButton.getItems()) {
            onMenuButtonLoad();
         } else {
            this._menuButton.reload().addCallback(onMenuButtonLoad);
         }
      },
      _captionRender: function(selectedCount) {
         var
            caption,
            selection = this._options.linkedView.getSelection();
            if (selection && selection.markedAll) {
               caption = selection.excluded.length ? rk('Отмечено') : rk('Отмечено всё')
            } else {
               caption = selectedCount ? rk('Отмечено') + '(' + selectedCount + ')' : rk('Отметить');
            }

         return caption;
      },

      //Метод выполняется при изменении выделения в табличном преставлении данных. На это же выделение, ранее могли подписаться
      //другте обработчики, котрые перестраивают панель, и получится что в момент вызова нашего обработчика, кнопка
      //будет уже разрушена. Чтобы исключить ошибочное поведение, обернём метод в forAliveOnly.
      _updateMark: forAliveOnly(function() {
         this._updateMarkButton();
         this._updateMarkCheckBox();
      }),
      /**
       * Выбрать все элементы.
       */
      selectAll: function() {
         var self = this;
         if (this._options.useSelectAll) {
            //Заблокируем кнопку при отметке 1000 записей, а после выполнения отметки вернём её в исходное состояние.
            this.setAllowChangeEnable(true);
            this.setEnabled(false);
            this._options.linkedView.setSelectedAll(this._options.deepReload).addBoth(function() {
               self.setEnabled(true);
               self.setAllowChangeEnable(false);
            });
         } else {
            this._options.linkedView.setSelectedItemsAll();
         }
      },
      showSelection: function() {
         var item = this._menuButton.getItemInstance('showSelection');

         this._showSelected = !this._showSelected;
         item.setCaption(this._showSelected ? rk('Показать все') : rk('Выбрать отмеченные'));
         this._toggleSelectedItems(this._showSelected);
      },
      _toggleSelectedItems: function(selected) {
         var
            view = this._options.linkedView,
            filter = view.getFilter();
         if (selected) {
            filter[view._options.idProperty] = view.getSelectedKeys();
         } else {
            delete filter[view._options.idProperty];
         }

         view.setFilter(filter);
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
         this._options.linkedView.removeItemsSelectionAll();
      },
      /**
       * Инвертировать выделение всех элементов.
       */
      invertSelection: function() {
         this._options.linkedView.toggleItemsSelectionAll();
      }
   });

   return OperationsMark;
});
