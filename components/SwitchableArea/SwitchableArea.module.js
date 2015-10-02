/**
 * Created by iv.cheremushkin on 14.08.2014.
 */

define('js!SBIS3.CONTROLS.SwitchableArea', [
   'js!SBIS3.CORE.CompoundControl',
   'html!SBIS3.CONTROLS.SwitchableArea',
   'html!SBIS3.CONTROLS.SwitchableArea/AreaTpl',
   'js!SBIS3.CONTROLS.DSMixin',
   'js!SBIS3.CONTROLS.Selectable'
], function(CompoundControl, dotTplFn, AreaTpl, DSMixin, Selectable) {

   'use strict';

   /**
    * Контрол, содержащий несколько областей содержащих контент.
    * В каждый момент времени отображается только одна область.
    * Отображаемая область может переключаться при помощи команд.
    * @class SBIS3.CONTROLS.SwitchableArea
    * @extends $ws.proto.Control
    * @author Крайнов Дмитрий Олегович
    * @mixes SBIS3.CONTROLS.CollectionMixin
    * @mixes SBIS3.CONTROLS.Selectable
    */

   var SwitchableArea = CompoundControl.extend([DSMixin, Selectable], /** @lends SBIS3.CONTROLS.SwitchableArea.prototype */ {
      _dotTplFn : dotTplFn,
      $protected: {
         _options: {
            /**
             * @cfg {Number} ID области, которая будет открыта первой
             */
            activeAreaId : null,
            /**
             * @typedef {Object} LoadTypeEnum
             * @variant all Инстанцировать все области сразу
             * @variant cached Инстанцировать только одну область, при смене предыдущую не уничтожать
             */
            /**
             * Режим работы компонента
             * @cfg {LoadTypeEnum}
             */
            loadType : 'cached',
            itemTemplate: AreaTpl
         }
      },

      $constructor: function() {

      },

      init: function() {
         SwitchableArea.superclass.init.call(this);
         this.reload();
      },

      _getItemTemplate: function (item) {
         var displayField = this._options.displayField;
         return this._options.itemTemplate.call(this,
            {
               item: item,
               displayField: item.get(displayField)
            }
         );
      },

      /**
       * Получить ID открытой области
       */
      getActiveAreaId: function(){

      },

      /**
       * Установить текущую открытую область
       * @param id номер области
       */
      setActiveArea: function(id){

      },

      /**
       * Очистить кэш и инстанцировать компоненты заново
       */
      clearAreaCache: function(){

      }

   });

   return SwitchableArea;

});
