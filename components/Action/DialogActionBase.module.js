define('js!SBIS3.CONTROLS.DialogActionBase', ['js!SBIS3.CONTROLS.Action.DialogMixin','js!SBIS3.CONTROLS.ActionBase'], function(DialogMixin, ActionBase) {
   'use strict';

   /**
    * Действие открытия окна с заданным шаблоном
    * @class SBIS3.CONTROLS.DialogActionBase
    * @public
    * @extends SBIS3.CONTROLS.ActionBase
    * @author Крайнов Дмитрий Олегович
    *
    * @ignoreOptions validators independentContext contextRestriction extendedTooltip
    *
    * @ignoreMethods activateFirstControl activateLastControl addPendingOperation applyEmptyState applyState clearMark
    * @ignoreMethods changeControlTabIndex destroyChild detectNextActiveChildControl disableActiveCtrl findParent
    * @ignoreMethods focusCatch getActiveChildControl getChildControlById getChildControlByName getChildControls
    * @ignoreMethods getClassName getContext getEventBusOf getEventHandlers getEvents getExtendedTooltip getOpener
    * @ignoreMethods getImmediateChildControls getLinkedContext getNearestChildControlByName getOwner getOwnerId
    * @ignoreMethods getReadyDeferred getStateKey getTabindex getUserData getValue hasActiveChildControl hasChildControlByName
    * @ignoreMethods hasEventHandlers isActive isAllReady isDestroyed isMarked isReady makeOwnerName setOwner setSize
    * @ignoreMethods markControl moveFocus moveToTop once registerChildControl registerDefaultButton saveToContext
    * @ignoreMethods sendCommand setActive setChildActive setClassName setExtendedTooltip setOpener setStateKey activate
    * @ignoreMethods setTabindex setTooltip setUserData setValidators setValue storeActiveChild subscribe unregisterChildControl
    * @ignoreMethods unregisterDefaultButton unsubscribe validate waitAllPendingOperations waitChildControlById waitChildControlByName
    *
    * @ignoreEvents onActivate onAfterLoad onAfterShow onBeforeControlsLoad onBeforeLoad onBeforeShow onChange onClick
    * @ignoreEvents onFocusIn onFocusOut onKeyPressed onReady onResize onStateChanged onTooltipContentRequest
    */
   var OpenDialogAction = ActionBase.extend([DialogMixin],/** @lends SBIS3.CONTROLS.DialogActionBase.prototype */{

      execute : function(meta) {
         return this._opendEditComponent(meta);
      },

      _opendEditComponent: function(meta, template, mode){
         var self = this;
         OpenDialogAction.superclass._opendEditComponent.call(this, meta, template, mode).addCallback(function(meta){
            self._notifyOnExecuted(meta);
         });
      },

      /*на время переходного периода нужно для DialogMixin, в 374,100 надо перейти на SBIS3.CONTROLS.Action.Action */
      _callHandlerMethod: function (args, event, method) {
         var evenResult = this._notify.apply(this, [event].concat(args)),
            call = typeof this[evenResult] === 'function' ? this[evenResult] : this[method];
         if (evenResult !== false && evenResult !== 'custom') {
            var def = evenResult instanceof $ws.proto.Deferred ? evenResult : new $ws.proto.Deferred().callback(),
               self = this;
            return def.addCallback(function (defResult) {
               if (defResult !== false && defResult !== 'custom') {
                  call = typeof self[defResult] === 'function' ? self[defResult] : call;
                  if (typeof call === 'function') {
                     return call.apply(self, args);
                  }
               }
            });
         }
         return new $ws.proto.Deferred().callback(evenResult);
      }

   });
   return OpenDialogAction;
});