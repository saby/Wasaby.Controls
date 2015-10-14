/**
 * Created by iv.cheremushkin on 13.08.2014.
 */

define('js!SBIS3.CONTROLS.CheckBoxGroupBaseNew', [
   'js!SBIS3.CONTROLS.ButtonGroupBaseDSNew',
   'js!SBIS3.CONTROLS.MultiSelectableNew',
   'js!SBIS3.CONTROLS.Data.Utils'
], function(ButtonGroupBase, MultiSelectable, Utils) {

   'use strict';

   /**
    * Контрол, реализующий поведение выбора одного или нескольких значений из набора. Отображения не имеет.
    * *Это экспериментальный модуль, API будет меняться!*
    * @class SBIS3.CONTROLS.CheckBoxGroupBaseNew
    * @public
    * @state mutable
    * @mixes SBIS3.CONTROLS.CollectionMixin
    * @mixes SBIS3.CONTROLS.MultiSelectable
    * @extends SBIS3.CONTROLS.ButtonGroupBaseDSNew
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

   var CheckBoxGroupBaseNew = ButtonGroupBase.extend([MultiSelectable], /** @lends SBIS3.CONTROLS.CheckBoxGroupBaseNew.prototype */ {
      $protected: {
         _options: {

         }
      },

      $constructor: function() {
      },

      getGroupControls: function() {
         return CheckBoxGroupBaseNew.superclass.getGroupControls.call(this).filter(function(control) {
            return $ws.helpers.instanceOfModule(control, 'SBIS3.CONTROLS.CheckBox');
         });
      },

      _itemActivatedHandler : function(index) {
         var item = this.getItems().at(index);
         this.toggleItemsSelection([Utils.getItemPropertyValue(item,this._options.keyField)]);
      },

      _drawSelectedItems : function() {
         var selectedKeys = this.getSelectedKeys(),
            components = this.getGroupControls(),
            items = this.getItems(),
            self = this;
         items.each(function(item, index){
            var key = Utils.getItemPropertyValue(item ,self._options.keyField),
               control = components[index];
            if(Array.indexOf(selectedKeys,key) !== -1){
               control.setChecked(true);
            } else {
               control.setChecked(false);
            }
         });

      }

   });
   return CheckBoxGroupBaseNew;

});