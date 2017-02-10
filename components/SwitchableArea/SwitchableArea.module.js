/* На основе SBIS3.CORE.SwitchableArea */
define('js!SBIS3.CONTROLS.SwitchableArea', [
   'js!SBIS3.CORE.SwitchableArea'], function (CoreSwitchableArea) {

   'use strict';

   /**
    * Контрол, содержащий несколько областей содержащих контент.
    * В каждый момент времени отображается только одна область.
    * Отображаемая область может переключаться при помощи команд.
    * @class SBIS3.CONTROLS.SwitchableArea
    * @extends $ws.proto.SwitchableArea
    * @author Авраменко Алексей Сергеевич
    * @public
    */

   var SwitchableAreaOld = CoreSwitchableArea.extend(/** @lends SBIS3.CONTROLS.SwitchableArea.prototype */ {
      setItems: function (items) {
         var tabControl = this.getParent();
         for (var id in this._areaHashMap){
            if (this._areaHashMap.hasOwnProperty(id)){
               this.removeArea(id);
            }
         }
         for (var i = 0, l = items.length; i < l; i++){
            this.addArea(items[i].id, items[i].content);
         }
         tabControl.setSelectedKey(tabControl.getSelectedKey());
      }
   });
   return SwitchableAreaOld;
});
