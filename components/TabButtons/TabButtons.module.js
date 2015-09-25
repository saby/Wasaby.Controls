/**
 * Created by iv.cheremushkin on 13.08.2014.
 */

define('js!SBIS3.CONTROLS.TabButtons', ['js!SBIS3.CONTROLS.RadioGroupBase', 'html!SBIS3.CONTROLS.TabButtons', 'css!SBIS3.CONTROLS.TabButtons', 'js!SBIS3.CONTROLS.TabButton'], function (RadioGroupBase, TabButtonTpl) {

   'use strict';

   /**
    * Контрол, отображающий корешки закладок
    * @class SBIS3.CONTROLS.TabButtons
    * @extends SBIS3.CONTROLS.RadioGroupBase
    * @author Крайнов Дмитрий Олегович
    */

   var TabButtons = RadioGroupBase.extend(/** @lends SBIS3.CONTROLS.TabButtons.prototype */ {
      /**
       * @event onItemAdded При добавлении вкладки
       * Присходит при добавлении вкладки одним из методов {@link appendItem}, {@link prependItem}, {@link insertItemAfter}.
       * @param {$ws.proto.EventObject} event Дескриптор события.
       * @param {String} id Идентификатор добавленной закладки.
       * @param {Object} spec Описание закладки.
       * @see appendItem
       * @see prependItem
       * @see insertItemAfter
       */
      /**
       * @event onItemRemoved При удалении закладки
       * Присоходит при удалении закладки методом {@link removeItem}.
       * @param {$ws.proto.EventObject} event Дескриптор события
       * @param {String} id Идентификатор удаленной закладки.
       * @see removeItem
       */
      /**
       * @event onBeforeShowFirstItem Выбор активной закладки
       * Происходит перед показом закладок, может быть использовано для смены закладки, открытой по умолчанию.
       * @param {$ws.proto.EventObject} event Дескриптор события.
       * @param {String} id Идентификатор текущей закладки по умолчанию.
       * @return {String} Результат рассматривается как заголовок закладки, которую нужно показать текущей открытой.
       * Если вернуть '', то активной будет закладка, либо указанная в опции {@link selectedItem}, либо первая при незаполненной опции.
       * @example
       * <pre>
       *     var doc = this.getDocument();
       *     tabs.subscribe('onBeforeShowFirstItem', function(event) {
       *        if (doc.hasRecords()) {
       *           event.setResult('recordList');
       *        } else {
       *           event.setResult('people');
       *        }
       *     });
       * </pre>
       * @see onItemChange
       * @see selectedItem
       */
      $protected: {
         _options: {
            type: 'normal',
            hasMarker: true
         }
      },
      _dotTplFn: TabButtonTpl,

      $constructor: function () {
         this._publish('onItemAdded', 'onItemRemoved', 'onBeforeShowFirstItem');

         this.subscribe('onInit', function(){
            this._beforeShowFirstItem();
            this._findSideItems();
            this._toggleMarker(!this._options.hasMarker);
         }.bind(this));
      },
      /**
       * <wiTag group="Управление">
       * Добавляет вкладку в конец списка
       * @param item
       */
      appendItem: function (item) {
         this._options.items.push(item);
         this.reload();
         this._notify('onItemAdded', item.id, item);
      },
      /**
       * Применение пустого состояния. Поставил закладку по-умолчанию или никакую (если не была задана)
       */
      applyEmptyState: function () {
         this.setSelectedKey(this.getCurrentItem());
      },
      /**
       * <wiTag group="Управление">
       * @param {String} id Идентификатор вкладки
       */
      disableItem: function (id) {
         this.setItemEnabled(id, false);
      },

      //TODO нужен ли этот метод?
      /**
       * <wiTag group="Управление">
       * Метод редактирования контента
       * @param {Function} mutator Функция с одним аргументом - контейнером контрола
       *
       * @example
       * tabs.editContent(function(container) {
       *    container.addClass('ws-some-class');
       * });
       */
      editContent: function(mutator) {
         if (typeof mutator == 'function') {
            try {
               mutator(this.getContainer());
            }
            catch (e){
            }
         }
      },
      /**
       * <wiTag group="Управление">
       * @param {String} id Идентификатор вкладки
       */
      enableItem: function (id) {
         this.setItemEnabled(id, true);
      },
      /**
       * <wiTag group="Управление">
       * Возвращает идентификатор текущей вкладки
       * @returns {String} Идентификатор текущей вкладки.
       */
      getCurrentItem: function () {
         return this._options.selectedItem;
      },
      /**
       * Возвращает контрол в активной закладке, если есть.
       * @returns {Object}
       */
      getCurrentItemControl: function () {
         var currentTabId = this.getCurrentItem();
         if (currentTabId) {
            return this._getItemById(currentTabId);
         }
      },
      /**
       * Возвращает контейнер вкладки
       * @param {String} id Идентификатор вкладки
       * @returns {JQuery}
       */
      getItemContainer: function (id) {
         var tabButton = this._getItemById(id);
         if (tabButton) {
            return tabButton.getContainer();
         }
      },
      /**
       * Возвращает конфигурацию вкладок
       * @returns {Object}
       */
      getItems: function () {
         return this._options.items;
      },
      /**
       * Скрыть вкладку
       * @param {String} id Идентификатор вкладки
       */
      hideItem: function (id) {
         this.setItemVisible(id, false);
      },
      /**
       * Добавляет вкладку после указанной вкладки
       * @param {Object} tab Конфигурация новой вкладки
       * @param {String} tabId ID вкладки после которой вставлять
       * @example
       * <pre>
       *     tabButtons.insertItemAfter({id: 'id1', title: 'Tab 1'}, 'id2');
       * </pre>
       */
      insertItemAfter: function (tab, tabId) {
         var items = this.getItems(),
             afterTabPosition = this._getItemPosition(tabId);
         if (afterTabPosition < 0) {
            return;
         }
         items.splice(afterTabPosition, 0, tab);
         this.reload();
         this._notify('onItemAdded', tab.id, tab);
      },
      /**
       * <wiTag group="Управление">
       * Добавляет вкладку в начало списка
       * @param item
       */
      prependItem: function (item) {
         this._options.items.unshift(item);
         this.reload();
         this._notify('onItemAdded', item.id, item);
      },
      /**
       * <wiTag group="Управление">
       * Удаляет вкладку
       * @param id
       */
      removeItem: function (id) {
         var tabPosition = this._getItemPosition(id);
         if (tabPosition < 0) {
            return;
         }
         this._options.items.splice(tabPosition, 1);
         this.reload();
         this._notify('onItemRemoved', id);
      },
      /**
       * <wiTag group="Управление">
       * Установить текущую вкладку
       * @param {String} id Идентификатор вкладки
       * @param {Boolean} [pushState=false] Записать состояние в историю браузера
       * @param {Boolean} [skipInvisibility=false] Дает возможность установить активной невидимую вкладку
       * @param {Boolean} [noActive] Активировать или нет контрол на установленной вкладке. По-умолчанию активируется.
       */
      setCurrentItem: function(id, pushState, skipInvisibility, noActive){
         //TODO  нужен ли pushState?

         var tabButton = this._getItemById(id);
         if (!tabButton){
            return;
         }
         if (tabButton.isVisible() || skipInvisibility){
            this.setSelectedKey(id);
            tabButton.setEnabled(!noActive);
         }
      },
      /**
       * <wiTag group="Управление">
       * Удаляет вкладку
       * @param id Идентификатор вкладки
       * @param align расположение вкладки. Значения 'left' или 'right'
       */
      setItemAlignment: function (id, align) {
         this._changeItemConfig(id, 'align', align);
      },
      /**
       * <wiTag group="Управление">
       * Включает или выключает вкладку. Она видима но не может быть переключена.
       * @param {String} id Идентификатор вкладки
       * @param {Boolean} state Состояние
       */
      setItemEnabled: function (id, state) {
         var tabButton = this._getItemById(id);
         if (tabButton) {
            tabButton.setEnabled(state);
         }
      },
      /* Устанавливает id закладки
       * @param {String} oldId старый id
       * @param {String} newId новый id
       */
      setItemId: function (oldId, newId) {
         this._changeItemConfig(oldId, 'id', newId);
      },
      /**
       * <wiTag group="Управление">
       * Скрывает или показывает вкладку в зависимости от параметра state
       * @param {String} id Идентификатор вкладки
       * @param {Boolean} state Состояние
       */
      setItemVisible: function (id, state) {
         var tabButton = this._getItemById(id);
         if (tabButton) {
            tabButton.setVisible(state);
         }
      },
      /**
       * <wiTag group="Управление">
       * Установить текст закладки
       * @param {String} id ID закладки, которую надо переименовать
       * @param {String} title Новое имя
       */
      setItemTitle: function(id, title){
         this._changeItemConfig(id, this._options.displayField, title);
      },
      /**
       * <wiTag group="Управление">
       * Установить иконку
       * @param {String} id ID закладки, которую надо переименовать
       * @param {String} iconClass css класс иконки
       */
      setItemIcon: function(id, iconClass){
         this._changeItemConfig(id, 'iconClass', iconClass);
      },
      /**
       * <wiTag group="Управление">
       * Установить шаблон вкладки
       * @param {String} id ID закладки, которую надо переименовать
       * @param {String} tpl шаблон
       * @param {String} config конфигурация шаблона
       */
      setItemTemplate: function(id, tpl, config){
         var item = this._getItemById(id),
            tplContainer = item && item.getContainer().find('.controls-TabButton__inner');
         if (!item){
            return;
         }
         tplContainer.html(tpl(config));
      },
      /**
       * Показать вкладку
       * @param {String} id Идентификатор вкладки
       */
      showItem: function (id) {
         this.setItemVisible(id, true);
      },
      //TODO возможно ненужные методы
      showMarker: function(){
         this._toggleMarker(false);
      },
      hideMarker: function(){
         this._toggleMarker(true);
      },
      _changeItemConfig: function(id, field, value){
         var itemPosition = this._getItemPosition(id),
            itemConfig;
         if (itemPosition < 0) {
            return;
         }
         itemConfig = this.getItems()[itemPosition];
         itemConfig[field] = value;
         this.reload();
      },
      _getItemById: function (id) {
         var controls = this.getChildControls();
         for (var i in controls) {
            if (controls.hasOwnProperty(i) && controls[i].getContainer().data('id') == id) {
               return controls[i];
            }
         }
      },
      _getItemPosition: function (tabId) {
         var position;
         $.each(this.getItems(), function (i, tab) {
            if (tab.id == tabId) {
               position = i;
            }
         });
         return position;
      },

      _beforeShowFirstItem: function () {
         var newSelectedTabId = this._notify('onBeforeShowFirstItem', this._options.selectedItem);
         if (newSelectedTabId && this._getItemPosition(newSelectedTabId) > -1) {
            this.setSelectedKey(newSelectedTabId);
         }
      },

      _findSideItems: function(){
         this.getContainer().find('.controls-TabButton__left-align:first, .controls-TabButton__right-align:first').addClass('controls-TabButton__side-item');
      },

      _toggleMarker: function(toggle){
         this.getContainer().toggleClass('controls-TabButton__whithout-marker', toggle)
      },

      _getItemTemplate: function () {
         return '<component data-component="SBIS3.CONTROLS.TabButton">' +
            '<option name="caption" value="{{=it.item.get(\"' + this._options.displayField + '\")}}"></option>' +
            '<option name="additionalText" value="{{=it.item.get(\'additionalText\')}}"></option>' +
            '{{?it.item.get(\'iconClass\')}}<option name="iconClass" value="{{=it.item.get(\'iconClass\')}}"></option>{{?}}' +
            '{{?it.item.get(\'size\')}}<option name="size" value="{{=it.item.get(\'size\')}}"></option>{{?}}' +
            '{{?it.item.get(\'align\')}}<option name="align" value="{{=it.item.get(\'align\')}}"></option>{{?}}' +
            '{{?it.item.get(\'name\')}}<option name="name" value="{{=it.item.get(\'name\')}}"></option>{{?}}' +
            '</component>';
      }
   });
   return TabButtons;
});