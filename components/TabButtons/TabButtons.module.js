/**
 * Created by iv.cheremushkin on 13.08.2014.
 */

define('js!SBIS3.CONTROLS.TabButtons', ['js!SBIS3.CONTROLS.RadioGroupBase', 'js!SBIS3.CONTROLS.TabButton', 'css!SBIS3.CONTROLS.TabButtons'], function (RadioGroupBase, TabButton) {

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

      $constructor: function () {
         this._publish('onItemAdded', 'onItemRemoved', 'onBeforeShowFirstItem');

         if (!this._options.hasMarker) {
            this.getContainer().addClass('controls-TabButton__whithout-marker');
         }
         this.subscribe('onInit', this._beforeShowFirstItem);
      },
      appendItem: function (item) {
         this._options.items.push(item);
         this.reload();
         this._notify('onItemAdded', item.id, item);
      },
      applyEmptyState: function () {
         this.setSelectedKey(this.getCurrentItem());
      },
      disableItem: function (id) {
         this.setItemEnabled(id, false);
      },
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
      enableItem: function (id) {
         this.setItemEnabled(id, true);
      },
      getCurrentItem: function () {
         return this._options.selectedItem;
      },
      getCurrentItemControl: function () {
         var currentTabId = this.getCurrentItem();
         if (currentTabId) {
            return this._getItemById(currentTabId);
         }
      },
      getItemContainer: function (id) {
         var tabButton = this._getItemById(id);
         if (tabButton) {
            return tabButton.getContainer();
         }
      },
      getItems: function () {
         return this._options.items;
      },
      hideItem: function (id) {
         this.setItemVisible(id, false);
      },
      /**
       * Добавляет вкладку после указанной вкладки
       * @param {Object} newTab Конфигурация новой вкладки
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
      prependItem: function (tab) {
         this._options.items.unshift(tab);
         this.reload();
         this._notify('onItemAdded', tab.id, tab);
      },
      removeItem: function (id) {
         var tabPosition = this._getItemPosition(id);
         if (tabPosition < 0) {
            return;
         }
         this._options.items.splice(tabPosition, 1);
         this.reload();
         this._notify('onItemRemoved', id);
      },
      setCurrentItem: function(id, pushState, skipInvisibility, noActive){
         var tabButton = this._getItemById(id);
         if (!tabButton){
            return;
         }
         if (tabButton.isVisible() || skipInvisibility){
            this.setSelectedKey(id);
            tabButton.setEnabled(!noActive);
         }
      },
      setItemAlignment: function (id, align) {
         var itemPosition = this._getItemPosition(id);
         if (itemPosition < 0) {
            return;
         }
         this._options.items[itemPosition].align = align;
         this.reload();
      },
      setItemEnabled: function (tabId, enabled) {
         var tabButton = this._getItemById(tabId);
         if (tabButton) {
            tabButton.setEnabled(enabled);
         }
      },
      setItemId: function (oldId, newId) {
         var itemPosition = this._getItemPosition(oldId);
         if (itemPosition < 0) {
            return;
         }
         this._options.items[itemPosition].id = newId;
         this.reload();
      },
      setItemVisible: function (id, visible) {
         var tabButton = this._getItemById(id);
         if (tabButton) {
            tabButton.setVisible(visible);
         }
      },
      showItem: function (id) {
         this.setItemVisible(id, true);
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

      _getItemTemplate: function () {
         return '<component data-component="SBIS3.CONTROLS.TabButton">' +
            '<option name="caption" value="{{=it.item.get(\"' + this._options.displayField + '\")}}"></option>' +
            '<option name="additionalText" value="{{=it.item.get(\'additionalText\')}}"></option>' +
            '{{?it.item.get(\'size\')}}<option name="size" value="{{=it.item.get(\'size\')}}"></option>{{?}}' +
            '{{?it.item.get(\'align\')}}<option name="align" value="{{=it.item.get(\'align\')}}"></option>{{?}}' +
            '{{?it.item.get(\'name\')}}<option name="name" value="{{=it.item.get(\'name\')}}"></option>{{?}}' +
            '</component>';
      }
   });
   return TabButtons;
});