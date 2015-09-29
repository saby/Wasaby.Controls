/**
 * Created by iv.cheremushkin on 13.08.2014.
 */
define(
   'js!SBIS3.CONTROLS.TabButtons',
   [
      'js!SBIS3.CONTROLS.RadioGroupBase',
      'html!SBIS3.CONTROLS.TabButtons',
      'html!SBIS3.CONTROLS.TabButtons/ItemTpl',
      'js!SBIS3.CONTROLS.EditAtPlace',
      'css!SBIS3.CONTROLS.TabButtons',
      'js!SBIS3.CONTROLS.TabButton'
   ],
   function (RadioGroupBase, TabButtonsTpl, ItemTpl, EditAtPlace) {

   'use strict';

   /**
    * Контрол, отображающий корешки закладок
    * @class SBIS3.CONTROLS.TabButtons
    * @extends SBIS3.CONTROLS.RadioGroupBase
    * @author Крайнов Дмитрий Олегович
    */

   var TabButtons = RadioGroupBase.extend(/** @lends SBIS3.CONTROLS.TabButtons.prototype */ {
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
       */
      $protected: {
         _options: {
            type: 'normal',
            hasMarker: true,
            defaultKey: undefined,
            itemTemplate: ItemTpl
         }
      },
      _dotTplFn: TabButtonsTpl,

      $constructor: function () {
         this._publish('onBeforeShowFirstItem');

         this._options.defaultKey = this._options.selectedKey;

         this.subscribe('onInit', function(){
            this._beforeShowFirstItem();
            this.toggleMarker(!this._options.hasMarker);
         }.bind(this));
         this.subscribe('onDrawItems', this._findSideItems);
      },
      /**
       * Применение пустого состояния. Поставил закладку по-умолчанию или никакую (если не была задана)
       */
      applyEmptyState: function () {
         this.setSelectedKey(this._options.defaultKey);
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
         var tabButton = this.getItemInstance(id);
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
         var tabButton = this.getItemInstance(id);
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
         var item = this.getItemInstance(id),
            tplContainer = item && item.getContainer().find('.controls-TabButton__inner');
         if (!item){
            return;
         }
         tplContainer.html(tpl(config));
      },
      toggleMarker: function(toggle){
         this.getContainer().toggleClass('controls-TabButton__whithout-marker', toggle)
      },
      _changeItemConfig: function(id, field, value){
         var itemPosition = this._getItemPosition(id),
            itemConfig;
         if (~itemPosition) {
            return;
         }
         itemConfig = this._options.items[itemPosition];
         itemConfig[field] = value;
         this.reload();
      },
      _getItemPosition: function (tabId) {
         var position = -1;
         $.each(this._options.items, function (i, tab) {
            if (tab.id == tabId) {
               position = i;
            }
         });
         return position;
      },

      _beforeShowFirstItem: function () {
         var newSelectedTabId = this._notify('onBeforeShowFirstItem', this._options.selectedItem);
         if (this.getItemInstance(newSelectedTabId)) {
            this.setSelectedKey(newSelectedTabId);
         }
      },

      _findSideItems: function(){
         this.getContainer().find('.controls-TabButton__left-align:first, .controls-TabButton__right-align:first').addClass('controls-TabButton__side-item');
      },

      _getItemTemplate: function (item) {
         var displayField = this._options.displayField,
            caption = item.get(displayField);
         return this._options.itemTemplate.call(this, {item: item, displayField: caption})
      }
   });
   return TabButtons;
});