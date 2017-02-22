/**
 * Created by iv.cheremushkin on 13.08.2014.
 */

define('js!SBIS3.CONTROLS.CheckBoxGroupBase', [
   'js!SBIS3.CONTROLS.ButtonGroupBase',
   'js!SBIS3.CONTROLS.MultiSelectable',
   'Core/core-instance'
], function(ButtonGroupBase, MultiSelectable, cInstance) {

   'use strict';

   /**
    * Контрол, реализующий поведение выбора одного или нескольких значений из набора. Отображения не имеет.
    * @class SBIS3.CONTROLS.CheckBoxGroupBase
    * @public
    * @mixes SBIS3.CONTROLS.MultiSelectable
    * @extends SBIS3.CONTROLS.ButtonGroupBase
    * @author Крайнов Дмитрий Олегович
    *
    * @ignoreOptions contextRestriction independentContext
    *
    * @ignoreMethods activate activateFirstControl activateLastControl addPendingOperation changeControlTabIndex
    * @ignoreMethods destroyChild detectNextActiveChildControl disableActiveCtrl findParent focusCatch getActiveChildControl
    * @ignoreMethods getChildControlById getChildControlByName getChildControls getClassName getContext getEventBusOf
    * @ignoreMethods getEventHandlers getEvents getExtendedTooltip getImmediateChildControls getLinkedContext getStateKey
    * @ignoreMethods getNearestChildControlByName getOpener getOwner getOwnerId hasActiveChildControl hasEvent hasEventHandlers
    * @ignoreMethods hasChildControlByName isAllReady isDestroyed isReady moveFocus registerChildControl waitChildControlByName
    * @ignoreMethods registerDefaultButton sendCommand setActive setChildActive setClassName setExtendedTooltip setOpener
    * @ignoreMethods setOwner setSize setStateKey storeActiveChild subscribe subscribeOnceTo unbind unregisterChildControl
    * @ignoreMethods unregisterDefaultButton unsubscribe waitAllPendingOperations waitChildControlById moveToTop
    * @ignoreMethods setProperties setProperty getProperty
    *
    * @ignoreEvents onActivate onAfterLoad onAfterShow onBeforeControlsLoad onBeforeLoad onBeforeShow onDestroy onDragIn
    * @ignoreEvents onDragStop onPropertyChanged
    * @ignoreEvents onDragMove onDragOut onDragStart onKeyPressed onReady onResize onStateChanged onTooltipContentRequest
    */

   var CheckBoxGroupBase = ButtonGroupBase.extend([MultiSelectable], /** @lends SBIS3.CONTROLS.CheckBoxGroupBase.prototype */ {
      $protected: {
         _options: {

         }
      },

      $constructor: function() {

      },

      _itemActivatedHandler : function(hash) {
         var projItem, key;
         projItem = this._getItemsProjection().getByHash(hash);
         //TODO Пока делаем отдельную ветку для Флагов.
         //Леха Мальцев должен решить задачу https://inside.tensor.ru/opendoc.html?guid=566894c5-8384-4a2a-8ea6-df9dc5bd2137&description=
         if (this.getItems() && cInstance.instanceOfModule(this.getItems(), 'WS.Data/Types/Flags')) {
            projItem.setSelected(!projItem.isSelected());
         }
         else {
            key = projItem.getContents().getId();
            this.toggleItemsSelection([key]);
         }
      },

      _drawItemsCallback : function() {
         CheckBoxGroupBase.superclass._drawItemsCallback.call(this);
         if (this._options.selectedKeys && this._options.selectedKeys.length) {
            this._drawSelectedItems(this._options.selectedKeys);
         }
      },

      _drawSelectedItems : function(idArray) {
         var
            controls = this.getItemsInstances(),
            arrLen = idArray.length;

         //TODO Пока делаем отдельную ветку для Флагов.
         //Леха Мальцев должен решить задачу https://inside.tensor.ru/opendoc.html?guid=566894c5-8384-4a2a-8ea6-df9dc5bd2137&description=
         var i, hash;
         if (this.getItems() && cInstance.instanceOfModule(this.getItems(), 'WS.Data/Types/Flags')) {
            for (i in controls) {
               if (controls.hasOwnProperty(i)) {
                  hash = controls[i].getContainer().data('hash');
                  controls[i].setChecked(!!this._getItemsProjection().getByHash(hash).isSelected());
               }
            }
         }
         else {
            for (i in controls) {
               if (controls.hasOwnProperty(i)) {
                  if (!arrLen) {
                     controls[i].setChecked(false);
                  }
                  else {
                     var item, key;
                     hash = controls[i].getContainer().data('hash');
                     item = this._getItemsProjection().getByHash(hash).getContents();
                     key = item.getId();
                     //TODO проверка на строку и число. Избавиться, когда наконец все ключи будут строками
                     if ((idArray.indexOf(key) >= 0) || (idArray.indexOf(key + '') >= 0)) {
                        controls[i].setChecked(true);
                     }
                     else {
                        controls[i].setChecked(false);
                     }
                  }
               }
            }
         }
      }

   });

   return CheckBoxGroupBase;

});