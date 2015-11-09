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
      $protected: {
         _options: {
            /**
             * @cfg {Boolean} Включить выделение активной вкладки
             * @example
             * <pre>
             *     <option name="hasMarker">true</option>
             * </pre>
             */
            hasMarker: false,
            /**
             * @cfg {String} Шаблон отображения каждого элемента коллекции
             * @example
             * <pre>
             *     <div class="tabButton">
             *        {{=it.item.get("caption")}}
             *     </div>
             * </pre>
             */
            itemTemplate: itemTpl
         },
         /**
          * {String} Ключ первоначального активного элемента
          */
         defaultKey: undefined
      },
      _dotTplFn: TabButtonsTpl,

      $constructor: function () {
         this.defaultKey = this._options.selectedKey;
      },
      /**
       * <wiTag group="Управление">
       * Применение первоначального состояния. Восстанавливает первоначальную активную вкладку.
       */
      resetToDefaultState: function () {
         this.setSelectedKey(this.defaultKey);
      },
      /**
       * <wiTag group="Управление">
       * Включает или выключает выделение активного элемента.
       * @param {Boolean} toggle Состояние
       */
      toggleMarker: function(toggle){
         this.getContainer().toggleClass('controls-TabButton__has-marker', toggle)
      },
      _findSideItems: function(){
         this.getContainer().find('.controls-TabButton__left-align:first, .controls-TabButton__right-align:first').addClass('controls-TabButton__side-item');
      },
      _drawItemsCallback: function(){
         TabButtons.superclass._drawItemsCallback.call(this);
         this._findSideItems();
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