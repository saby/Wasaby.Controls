/*global define, $ws*/
define('js!SBIS3.CONTROLS.Action.List.Move', [
      'js!SBIS3.CONTROLS.Action.Action',
      'js!SBIS3.CONTROLS.Action.List.ListMixin',
      'js!WS.Data/Di'
   ],
   function (ActionBase, ListMixin, Di) {
      'use strict';
      /**
       * Базовый класс перемещения элементов в списке
       * @class SBIS3.CONTROLS.Action.List.Move
       * @public
       * @extends SBIS3.CONTROLS.Action.Action
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
      var Move = ActionBase.extend([ListMixin], /** @lends SBIS3.CONTROLS.Action.List.Move.prototype */{
         $protected: {
            _options:{
               moveStrategy: 'movestrategy.base'
            }
         },
         /**
          * Перемещает елементы. Должен быть реализован в наследниках
          * @private
          */
         _move: function(){

         },

         /**
          * Возвращает стратегию перемещения
          * @see WS.Data/MoveStrategy/IMoveStrategy
          * @returns {WS.Data/MoveStrategy/IMoveStrategy}
          */
         getMoveStrategy: function () {
            return this._moveStrategy || (this._moveStrategy = this._makeMoveStrategy());
         },

         /**
          * Устанавливает стратегию перемещения
          * @see WS.Data/MoveStrategy/IMoveStrategy
          * @param {WS.Data/MoveStrategy/IMoveStrategy} strategy - стратегия перемещения
          */
         setMoveStrategy: function (strategy){
            if(!cInstance.instanceOfMixin(strategy,'WS.Data/MoveStrategy/IMoveStrategy')){
               throw new Error('The strategy must implemented interfaces the WS.Data/MoveStrategy/IMoveStrategy.')
            }
            this._moveStrategy = strategy;
         },
         /**
          * Создает стратегию перемещения в зависимости от источника данных
          * @returns {WS.Data/MoveStrategy/IMoveStrategy}
          * @private
          */
         _makeMoveStrategy: function () {
            return Di.resolve(this._options.moveStrategy, {
               dataSource: this.getDataSource(),
               listView: this._getListView()
            });
         }

      });
      return Move;
   });