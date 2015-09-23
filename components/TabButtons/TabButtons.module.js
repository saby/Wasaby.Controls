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
       * @event onTabChange При смене активной закладки
       * Событие срабатывает по смене закладки (в том числе и при загрузке первой).
       * @param {$ws.proto.EventObject} event Дескриптор события.
       * @param {String} id Идентификатор открытой закладки.
       * @example
       * <pre>
       *    tab.subscribe('onTabChange', function(event, id) {
       *        alert('Выбрана закладка с идентификатором ' + id);
       *    });
       * </pre>
       * @see onBeforeShowFirstTab
       */
      /**
       * @event onTabAdded При добавлении вкладки
       * Присходит при добавлении вкладки одним из методов {@link appendTab}, {@link prependTab}, {@link insertTabAfter}.
       * @param {$ws.proto.EventObject} event Дескриптор события.
       * @param {String} id Идентификатор добавленной закладки.
       * @param {Object} spec Описание закладки.
       * @see appendTab
       * @see prependTab
       * @see insertTabAfter
       */
      /**
       * @event onTabRemoved При удалении закладки
       * Присоходит при удалении закладки методом {@link removeTab}.
       * @param {$ws.proto.EventObject} event Дескриптор события
       * @param {String} id Идентификатор удаленной закладки.
       * @see removeTab
       */
      /**
       * @event onBeforeShowFirstTab Выбор активной закладки
       * Происходит перед показом закладок, может быть использовано для смены закладки, открытой по умолчанию.
       * @param {$ws.proto.EventObject} event Дескриптор события.
       * @param {String} id Идентификатор текущей закладки по умолчанию.
       * @return {String} Результат рассматривается как заголовок закладки, которую нужно показать текущей открытой.
       * Если вернуть '', то активной будет закладка, либо указанная в опции {@link defaultTab}, либо первая при незаполненной опции.
       * @example
       * <pre>
       *     var doc = this.getDocument();
       *     tabs.subscribe('onBeforeShowFirstTab', function(event) {
       *        if (doc.hasRecords()) {
       *           event.setResult('recordList');
       *        } else {
       *           event.setResult('people');
       *        }
       *     });
       * </pre>
       * @see onTabChange
       * @see defaultTab
       */
      $protected: {
         _options: {
            type: 'normal',
            hasMarker: true,
            allowChangeEnable: true
         }
      },

      $constructor: function () {
         this._publish('onTabChange', 'onTabAdded', 'onTabRemoved', 'onBeforeShowFirstTab');

         if (!this._options.hasMarker) {
            this.getContainer().addClass('controls-TabButton__whithout-marker');
         }
         this.subscribe('onInit', this._beforeShowFirstTab);
         this.subscribe('onSelectedItemChange', function (event, id) {
            this._notify('onTabChange', id);
         }.bind(this));
      },

      isAllowChangeEnable: function () {
         return this._options.allowChangeEnable;
      },
      appendTab: function (tab) {
         this._options.items.push(tab);
         this.reload();
         this._notify('onTabAdded', tab.id, tab);
      },
      applyEmptyState: function () {
         this.setSelectedKey(this.getCurrentTab());
      },
      disableTab: function (id) {
         this.setTabEnabled(id, false);
      },
      enableTab: function (id) {
         this.setTabEnabled(id, true);
      },
      getCurrentTab: function () {
         return this._options.selectedItem;
      },
      getCurrentTabControl: function () {
         var currentTabId = this.getCurrentTab();
         if (currentTabId) {
            return this._getTabButtonById(currentTabId);
         }
      },
      getTabButton: function (id) {
         var tabButton = this._getTabButtonById(id);
         if (tabButton) {
            return tabButton.getContainer();
         }
      },
      getTabs: function () {
         return this._options.items;
      },
      hideTab: function (id) {
         this.setTabVisible(id, false);
      },
      /**
       * Добавляет вкладку после указанной вкладки
       * @param {Object} newTab Конфигурация новой вкладки
       * @param {String} tabId ID вкладки после которой вставлять
       * @example
       * <pre>
       *     tabButtons.insertTabAfter({id: 'id1', title: 'Tab 1'}, 'id2');
       * </pre>
       */
      insertTabAfter: function (newTab, tabId) {
         var items = this.getTabs(),
             afterTabPosition = this._getTabButtonPosition(tabId);
         if (!afterTabPosition) {
            return;
         }
         items.splice(afterTabPosition, 0, newTab);
         this.reload();
         this._notify('onTabAdded', tab.id, tab);
      },
      prependTab: function (tab) {
         this._options.items.unshift(tab);
         this.reload();
         this._notify('onTabAdded', tab.id, tab);
      },
      removeTab: function (id) {
         var tabPosition = this._getTabButtonPosition(id);
         if (!tabPosition) {
            return;
         }
         this._options.items.splice(tabPosition, 1);
         this.reload();
         this._notify('onTabRemoved', id);
      },
      setAllowChangeEnable: function (allowChangeEnable) {
         this._options.allowChangeEnable = allowChangeEnable;
      },
      setCurrentTab: function(id, pushState, skipInvisibility, noActive){
         var tabButton = this._getTabButtonById(id);
         if (!tabButton){
            return;
         }
         if (tabButton.isVisible() || skipInvisibility){
            this.setSelectedItem(id);
            tabButton.setEnabled(!noActive);
         }
      },
      setTabAlignment: function (id, align) {
         var tabPosition = this._getTabButtonPosition(id);
         if (tabPosition) {
            this._options.items[tabPosition].align = align;
         }
         this.reload();
      },
      setTabEnabled: function (tabId, enabled) {
         var tabButton = this._getTabButtonById(tabId);
         if (tabButton) {
            tabButton.setEnabled(enabled);
         }
      },
      setTabId: function (oldId, newId) {
         var tabPosition = this._getTabButtonPosition(oldId);
         if (tabPosition) {
            this._options.items[tabPosition].id = newId;
         }
         this.reload();
      },
      setTabVisible: function (id, visible) {
         var tabButton = this._getTabButtonById(id);
         if (tabButton) {
            tabButton.setVisible(visible);
         }
      },
      showTab: function (id) {
         this.setTabVisible(id, true);
      },
      _getTabButtonById: function (id) {
         var controls = this.getChildControls();
         for (var i in controls) {
            if (controls.hasOwnProperty(i) && controls[i].getContainer().data('id') == id) {
               return controls[i];
            }
         }
      },
      _getTabButtonPosition: function (tabId) {
         var position;
         $.each(this.getTabs(), function (i, tab) {
            if (tab.id == tabId) {
               position = i;
            }
         });
         return position;
      },

      _beforeShowFirstTab: function () {
         var newSelectedTabId = this._notify('onBeforeShowFirstTab', this._options.selectedItem);
         if (newSelectedTabId && this._getTabButtonPosition(newSelectedTabId) > -1) {
            this.setSelectedItem(newSelectedTabId);
         }
      },

      _getItemTemplate: function () {
         return '<component data-component="SBIS3.CONTROLS.TabButton">' +
             '<option name="caption" value="{{=it.item.get(\"' + this._options.captionField + '\")}}"></option>' +
             '<option name="additionalText" value="{{=it.item.get(\'additionalText\')}}"></option>' +
             '{{?it.item.get(\'size\')}}<option name="size" value="{{=it.item.get(\'size\')}}"></option>{{?}}' +
             '{{?it.item.get(\'align\')}}<option name="align" value="{{=it.item.get(\'align\')}}"></option>{{?}}' +
             '</component>';
      }
   });
   return TabButtons;
});