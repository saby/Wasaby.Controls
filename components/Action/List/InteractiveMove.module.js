/*global define, $ws, rk*/
define('js!SBIS3.CONTROLS.Action.List.InteractiveMove',[
      'js!SBIS3.CONTROLS.Action.List.Move',
      'js!SBIS3.CONTROLS.Action.List.HierarchicalMoveMixin',
      'js!SBIS3.CONTROLS.Action.DialogMixin'
   ],
   function (ListMove, HierarchicalMoveMixin, DialogMixin) {
      'use strict';
      /**
       * Действие перемещения по иерархии с выбором места перемещения через диалог
       * @class SBIS3.CONTROLS.Action.List.InteractiveMove
       * @public
       * @extends SBIS3.CONTROLS.Action.List.Move
       * @mixes SBIS3.CONTROLS.Action.List.HierarchicalMoveMixin
       * @mixes SBIS3.CONTROLS.Action.DialogMixin
       * @author Крайнов Дмитрий Олегович
       * <pre>
       *    var move = new InteractiveMove({
       *       linkedObject : myListView
       *    });
       *
       *    move.execute();//покажет диалог выбора папки, в которую надо переместить, после выбора выделенные записи будут перемещены
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

      var InteractiveMove = ListMove.extend([HierarchicalMoveMixin, DialogMixin],/** @lends SBIS3.CONTROLS.Action.List.InteractiveMove.prototype */{
         $protected:{
            _options : {
               template : 'js!SBIS3.CONTROLS.MoveDialogTemplate'
            },
            _canExecute: true
         },

         _doExecute: function() {
            var records = this.getSelectedItems();
            this._opendEditComponent({
               title: rk('Перенести') + ' ' + records.length + $ws.helpers.wordCaseByNumber(records.length, ' ' + rk('записей'), ' ' + rk('запись', 'множественное'), ' ' + rk('записи')) + ' ' + rk('в'),
               cssClassName: 'controls-moveDialog',
               opener: this._options.linkedObject
            }, this._options.template);
         },

         _buildComponentConfig: function() {
            var self = this;
            var records = this.getSelectedItems();
            return {
               linkedView: this._options.linkedObject,
               records: records,
               handlers: {
                  onPrepareFilterOnMove: function(event, rec) {
                     event.setResult(self._options.linkedObject._notify('onPrepareFilterOnMove', rec));
                  }
               }
            };
         }
      });
      return InteractiveMove;
   }
);

