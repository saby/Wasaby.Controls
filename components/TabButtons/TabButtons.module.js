/**
 * Created by iv.cheremushkin on 13.08.2014.
 */
define(
   'js!SBIS3.CONTROLS.TabButtons',
   [
      'js!SBIS3.CONTROLS.RadioGroupBase',
      'html!SBIS3.CONTROLS.TabButtons',
      'html!SBIS3.CONTROLS.TabButtons/itemTpl',
      'js!SBIS3.CONTROLS.TabButton'
   ],
   function (RadioGroupBase, TabButtonsTpl, itemTpl) {

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
            hasMarker: false,
            defaultKey: undefined,
            itemTemplate: itemTpl
         }
      },
      _dotTplFn: TabButtonsTpl,

      $constructor: function () {
         this._publish('onBeforeShowFirstItem');

         this._options.defaultKey = this._options.selectedKey;

         this.subscribe('onInit', function(){
            this._beforeShowFirstItem();
            this.toggleMarker(this._options.hasMarker);
         }.bind(this));
         this.subscribe('onDrawItems', this._findSideItems);
      },
      /**
       * <wiTag group="Управление">
       * Применение пустого состояния. Поставил закладку по-умолчанию или никакую (если не была задана)
       */
      applyEmptyState: function () {
         this.setSelectedKey(this._options.defaultKey);
      },
      /**
       * <wiTag group="Управление">
       * Включает или выключает маркер.
       * @param {Boolean} toggle Состояние
       */
      toggleMarker: function(toggle){
         this.getContainer().toggleClass('controls-TabButton__has-marker', toggle)
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
         var displayField = this._options.displayField;
         return this._options.itemTemplate.call(this,
            {
               item: item,
               caption: item.get(displayField)
            }
         );
      }
   });
   return TabButtons;
});