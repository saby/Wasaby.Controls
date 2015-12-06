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
    * Для оформления компонентов внутри вкладки, можно использовать следующие классы:
    * <ol>
    *    <li><strong>controls-TabButton__mainText</strong> - параметры текста, как у главной вкладки</li>
    *    <li><strong>controls-TabButton__additionalText1</strong> - оформление дополнительного текста 1</li>
    *    <li><strong>controls-TabButton__additionalText2</strong> - оформление дополнительного текста 2</li>
    * </ol>
    * Также для отдельных вкладок можно использовать модификаторы:
    * <ol>
    *    <li><strong>controls-TabButton__counter</strong> - оформления вкладок-счётчиков с иконками</li>
    *    <li><strong>controls-TabButton__main-item</strong> - оформления главной вкладки</li>
    * </ol>
    * @class SBIS3.CONTROLS.TabButtons
    * @extends SBIS3.CONTROLS.RadioGroupBase
    * @author Крайнов Дмитрий Олегович
    * @public
    * @demo SBIS3.CONTROLS.Demo.MyTabButtons
    */

   var TabButtons = RadioGroupBase.extend(/** @lends SBIS3.CONTROLS.TabButtons.prototype */ {
      $protected: {
         _options: {
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
         }
      },
      _dotTplFn: TabButtonsTpl,

      $constructor: function () {
         this._leftContainer  = this.getContainer().find('.controls-TabButtons__leftContainer');
         this._rightContainer = this.getContainer().find('.controls-TabButtons__rightContainer');
      },

      /* Переопределяем получение контейнера для элементов */
      _getTargetContainer:function(item){
         return item.get('align') === 'left' ? this._leftContainer : this._rightContainer;
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