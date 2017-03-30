/* На основе SBIS3.CORE.SwitchableArea */
define('js!SBIS3.CONTROLS.SwitchableArea', [
   'js!SBIS3.CORE.SwitchableArea',
   'Core/core-instance'], function (CoreSwitchableArea, cInstance) {

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
      /**
       * Устанавливает новый набор переключаемых областей.
       * @param {Array.<Object>} items Набор новых областей. Свойства объекта:
       * <ul>
       *     <li>id - идентификатор новой области;</li>
       *     <li>content - разметка контента новой области.</li>
       * </ul>
       */
      setItems: function (items) {
         var tabControl = this.getParent(),
             newItems = cInstance.instanceOfModule(items, 'WS.Data/Collection/RecordSet') ? items.getRawData() : items,
             oldItems = cInstance.instanceOfModule(this.getItems(), 'WS.Data/Collection/RecordSet') ? this.getItems().getRawData() : this.getItems();
         //TODO временное решение. Если бинд был сделан на опцию visible у итема, то не перерисовываю все вкладки. подробности https://inside.tensor.ru/opendoc.html?guid=52beaec0-1f23-4e10-a9ff-b2902e18707a&des=
         //Сделал через доп.опцию observeVisibleProperty, чтобы поведение включили там, где это нужно
         //Подобное решение существует на уровне TabControl'a. Нужен механизм на уровне контекстов, который сможет распознавать изменения в сложных объектах.
         if (tabControl._options.observeVisibleProperty && oldItems.length == newItems.length) {
            for (var i = 0, l = newItems.length; i < l; i++) {
               if (newItems[i]['visible'] !== undefined && oldItems[i].isVisible() !== newItems[i]['visible']) {
                  oldItems[i].setVisible(newItems[i]['visible']);
               }
            }
         }
         else {
            this._currentAreaId = undefined; //Сбрасываю перед установкой новых данных. Заполнится в setActiveArea, когда будут доступны все итемы
            for (var areaId in this._areaHashMap){
               if (this._areaHashMap.hasOwnProperty(areaId)){
                  this.removeArea(areaId);
               }
            }
            for (i = 0, l = items.length; i < l; i++){
               this.addArea(items[i].id, items[i].content);
            }
            tabControl._setActiveArea(tabControl.getSelectedKey()); //После новой установки итемов - делаем активной уже выбранную вкладку
         }
      }
   });
   return SwitchableAreaOld;
});
