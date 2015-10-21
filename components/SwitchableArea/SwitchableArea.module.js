/**
 * Created by iv.cheremushkin on 14.08.2014.
 */

define('js!SBIS3.CONTROLS.SwitchableArea', ['js!SBIS3.CORE.Control'], function(Control) {

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

   var SwitchableArea = Control.Control.extend( /** @lends SBIS3.CONTROLS.SwitchableArea.prototype */ {
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
            loadType : 'cached'
         }
      },

      $constructor: function() {

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
