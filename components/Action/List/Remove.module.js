/*global $ws, define*/
define('js!SBIS3.CONTROLS.List.Remove', [
      'js!SBIS3.CONTROLS.Action.Action',
      'js!SBIS3.CONTROLS.Action.List.ListMixin',
      'Core/helpers/fast-control-helpers',
      'Core/core-instance'
   ],
   function (ActionBase, ListMixin, fcHelpers, cInstance) {
      'use strict';
      /**
       * Акшен удаления записей
       * @class SBIS3.CONTROLS.List.Remove
       * @public
       * @extends SBIS3.CONTROLS.Action.Action
       * @mixes SBIS3.CONTROLS.Action.List.ListMixin
       * @author Крайнов Дмитрий Олегович
       * <pre>
       *    var remove = new Remove({
       *       linkedObject : myListView
       *    });
       *    remove.execute();//удалит выделенные записи
       *
       *    remove.execute({items:[myListView.getItems().at(0)]});// удалит переданные записи
       * </pre>
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
      var Remove = ActionBase.extend([ListMixin], /** @lends SBIS3.CONTROLS.List.Remove.prototype */{
         /**
          * @event onRemove Срабатывает перед удалением
          * @param {$ws.proto.EventObject} eventObject Дескриптор события.
          * @param {Array} items Массив моделей которые надо удалить
          * @see execute
          */
         $protected: {
            _options: {
               /**
                * @cfg {string|function} текст показываемый при удалении
                * <pre>
                *    new Remove({
                *       linkedObject : myListView,
                *       confirmText: 'Подтвердите удаление'
                *    })
                * </pre>
                * <pre>
                *    var getConfirmText = function(items){
                *       return items.length > 1 ? 'Удалить выбранные записи?' : 'Удалить текущую запись?';
                *    }
                *    new Remove({
                *       linkedObject : myListView,
                *       confirmText: getConfirmText
                *    })
                * </pre>
                */
               confirmText: undefined
            }
         },
         $constructor: function () {
            this._publish(['onRemove']);
         },
         _doExecute: function (meta) {
            var
               items,
               confirmText = this._options.confirmText || this._getDefaultConfirmText;
            if (meta.hasOwnProperty('items')) {
               items = Array.isArray(meta.items) ? meta.items : [meta.items];
            } else {
               items = this.getSelectedItems();
            }
            if (items) {
               if (typeof confirmText === 'function') {
                  confirmText = confirmText.call(this, items);
               }
               var self = this;
               return fcHelpers.question(confirmText).addCallback(function (res) {
                  if (!res) {
                     return;
                  }
                  return self._callHandlerMethod([items], 'onRemove', '_remove');
               });
            }
         },
         /**
          * Удаляет переданные записи
          * @param {Array} items
          * @returns {CORE/Deferred}
          * @private
          */
         _remove: function(items) {
            var  self = this,
               keys = [];
            for (var i = 0; i < items.length; i++) {
               keys.push(items[i].getId());
            }
            return this.getDataSource().destroy(keys).addCallback(function() {
               var list = self._getItems();
               for (var i = 0; i < items.length; i++) {
                  var item = items[i];
                  list.remove(item);
               }
               self._removeSelection(items);
            });
         },
         _handleError: function (error) {
            fcHelpers.alert(error);
         },
         _getDefaultConfirmText: function(items) {
            return items.length > 1 ? 'Удалить записи?' : 'Удалить текущую запись?';
         },

         _removeSelection: function(items) {
            var linkedObject = this.getLinkedObject();
            if (cInstance.instanceOfMixin(linkedObject, 'SBIS3.CONTROLS.MultiSelectable')) {
               var ids = [];
               for (var i = 0; i < items.length; i++) {
                  ids.push(items[i].getId());
               }
               linkedObject.removeItemsSelection(ids);
            }
         }
      });
      return Remove;
   });