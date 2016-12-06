/*global define, $ws, rk*/
define('js!SBIS3.CONTROLS.Action.List.InteractiveMove',[
      'js!SBIS3.CONTROLS.Action.List.Move',
      'js!SBIS3.CONTROLS.Action.DialogMixin',
      'Core/helpers/string-helpers',
      'js!WS.Data/Di',
      'Core/Indicator',
      'Core/core-merge',
      "Core/helpers/collection-helpers"
   ],
   function (ListMove, DialogMixin, strHelpers, Di, Indicator, cMerge, colHelpers) {
      'use strict';
      /**
       * Действие перемещения по иерархии с выбором места перемещения через диалог.
       * По умолчанию переносит выделенные записи.
       * @class SBIS3.CONTROLS.Action.List.InteractiveMove
       * @public
       * @extends SBIS3.CONTROLS.Action.List.Move
       * @mixes SBIS3.CONTROLS.Action.DialogMixin
       * @author Крайнов Дмитрий Олегович
       * @example
       * Пример использования InteractiveMove:
       * <pre>
       *    define('js!SBIS3.Demo.InteractiveMove', ['js!SBIS3.CORE.CompoundControl', 'js!SBIS3.CONTROLS.Action.List.InteractiveMove'],
       *    function(CompoundControl, InteractiveMove){
       *       var move;
       *       return CompoundControl.extend({
       *          _onInintHandler: function(){
       *             //создаем action
       *             move = new InteractiveMove({
       *                linkedObject: this.getChildControlByName('MyListView')
       *             });
       *          },
       *          interactiveMove: function(el, key, record) {
       *             //переместить только переданные записи
       *             move.execute({movedItems: [record]});
       *          },
       *          buttonInteractiveMove: function(){
       *             //переместить выбранные в ListView записи
       *             move.execute();
       *          }
       *       }
       *    })
       * </pre>
       * В xhtml навесим обработчик:
       * <pre>
       *    <div class="MyListView">
       *    <component data-component="SBIS3.CONTROLS.Button" name="ButtonHierMove" class="Button">
       *       <option name="caption">Переместить</option>
       *       <options name="handlers">
       *          <option name="onActivated" type="function">js!SBIS3.Demo.InteractiveMove:prototype.buttonInteractiveMove
       *       </option>
       *       </options>
       *    </component>
       *    <component data-component="SBIS3.CONTROLS.ListView" name="MyListView">
       *       <options name="itemsActions" type="Array">
       *          <options>
       *             <option name="name" value="moveUp"></option>
       *             <option name="icon" value="sprite:icon-16 icon-folder icon-primary"></option>
       *             <option name="title" value="Interactive move"></option>
       *             <option name="isMainAction" value="true" type="boolean"></option>
       *             <option name="onActivated" type="function">js!SBIS3.Demo.InteractiveMove:prototype.interactiveMove</option>
       *          </options>
       *       </options>
       *    </component>
       *    </div>
       * </pre>
       * Если на спике для перемещения используется своя стратегия, тогда ее надо передать в екшен.
       * Подробнее про стратегии {@link WS.Data/MoveStrategy/Base}
       * <pre>
       *    ...
       *    move = new InteractiveMove({
       *       linkedObject: this.getChildControlByName('MyListView')
       *       moveStrategy: 'movestrategy.base'
       *    });
       *    ...
       * </pre>
       * @see WS.Data/MoveStrategy/Base
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

      var InteractiveMove = ListMove.extend([DialogMixin],/** @lends SBIS3.CONTROLS.Action.List.InteractiveMove.prototype */{
         $protected:{
            /**
             * @typedef {Object} componentOptions
             * @property {String} displayField Поле элемента коллекции, из которого отображать данные.
             * @property {Object} filter Фильтр данных.
             * @property {Boolean} partialyReload Устанавливает поведение загрузки дочерних данных для записей типа "Узел" (папка) и "Скрытый узел".
             */
            _options : {
               template : 'js!SBIS3.CONTROLS.MoveDialogTemplate',
               parentProperty: undefined,
               /**
                * @cfg {componentOptions} Набор опций для компонента отображающего список.
                */
               componentOptions: null
            }
         },

         _doExecute: function(meta) {
            meta = meta || {};
            var movedItems = meta.movedItems || meta.records || this.getSelectedItems();
            meta.movedItems = movedItems;
            this._opendEditComponent({
               title: rk('Перенести') + ' ' + movedItems.length + strHelpers.wordCaseByNumber(movedItems.length, ' ' + rk('записей'), ' ' + rk('запись', 'множественное'), ' ' + rk('записи')) + ' ' + rk('в'),
               opener: this._getListView(),
               movedItems: movedItems,
               componentOptions: meta.componentOptions
            }, this._options.template);
         },

         _buildComponentConfig: function(meta) {
            var self = this,
               options = cMerge(meta.componentOptions||{}, this._getComponentOptions());
            return cMerge(options, {
               linkedView: this._getListView(),
               dataSource: this.getDataSource(),
               hierField: this._options.parentProperty,
               records: meta.movedItems,
               handlers: {
                  onMove: function(e, movedItems, target) {
                     self._move(movedItems, target);
                  }
               }
            });
         },

         _move: function(movedItems, target) {
            Indicator.show();
            this.getMoveStrategy().hierarhyMove(movedItems, target).addCallback(function(result){
               if (result !== false && this._getListView()) {
                  this._getListView().removeItemsSelectionAll();
               }
            }.bind(this)).addBoth(function() {
               Indicator.hide();
            });
         },

         _makeMoveStrategy: function () {
            return Di.resolve(this._options.moveStrategy, {
               dataSource: this.getDataSource(),
               hierField: this._options.parentProperty,
               listView: this._getListView()
            });
         },

         _getComponentOptions: function() {
            var options = ['displayField', 'partialyReload', 'keyField', 'hierField'],
               listView = this._getListView(),
               result = this._options.componentOptions || {};
            if (listView) {
               colHelpers.forEach(options, function (name) {
                  if (!result.hasOwnProperty(name)) {
                     try {
                        result[name] = listView.getProperty(name);
                     } catch (e) {
                        result[name] = undefined;
                     }
                  }
               }, this);
            }
            return result;
         }

      });
      return InteractiveMove;
   }
);

