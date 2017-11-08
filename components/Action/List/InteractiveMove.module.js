/*global define, $ws, rk*/
define('js!SBIS3.CONTROLS.Action.List.InteractiveMove',[
      'js!SBIS3.CONTROLS.Action.List.Move',
      'js!SBIS3.CONTROLS.Action.DialogMixin',
      'Core/helpers/string-helpers',
      'Core/Indicator',
      'Core/core-merge',
      'Core/IoC',
      'Core/core-instance',
      'Core/constants',
      'js!SBIS3.CONTROLS.Utils.InformationPopupManager'
   ],
   function (ListMove, DialogMixin, strHelpers, Indicator, cMerge, IoC, cInstance, constants, InformationPopupManager) {
      'use strict';
      /**
       * Класс, описывающий действие перемещения записей по иерархии с возможностью выбора позиции перемещения через диалог. По умолчанию переносит выделенные записи.
       * @class SBIS3.CONTROLS.Action.List.InteractiveMove
       * @public
       * @extends SBIS3.CONTROLS.Action.List.Move
       * @mixes SBIS3.CONTROLS.Action.DialogMixin
       * @author Ганшин Ярослав Олегович
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
       * Когда для списка установлена прикладная стратегия (см. {@link WS.Data/MoveStrategy/Base}) перемещения, тогда ее необходимо передать в action:
       * <pre>
       *    ...
       *    move = new InteractiveMove({
       *       linkedObject: this.getChildControlByName('MyListView')
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
                /**
                 * @cfg {String} Шаблон.
                 */
               template : 'js!SBIS3.CONTROLS.SelectionDialog',
                /**
                 * @cfg {String} Устанавливает имя поля иерархии, по которому будут установлены иерархические связи записей списка.
                 */
               parentProperty: undefined,
                /**
                 * @cfg {String} Устанавливает имя поле, в котором хранится признак типа записи в иерархии.
                 */
               nodeProperty: undefined,
               /**
                * @cfg {componentOptions} Набор опций, передаваемых в компонент, отображающий список.
                */
               componentOptions: null
            }
         },

         _modifyOptions: function (cfg) {
            if (cfg.hierField) {
               IoC.resolve('ILogger').log('InteractiveMove', 'Опция hierField является устаревшей, используйте parentProperty');
               cfg.parentProperty = cfg.hierField;
            }
            if (cfg.parentProperty && !cfg.nodeProperty) {
               cfg.nodeProperty = cfg.parentProperty + '@';
            }
            if (cfg.componentOptions && cfg.componentOptions.keyField) {
               IoC.resolve('ILogger').log('InteractiveMove', 'Опция componentOptions.keyField является устаревшей, используйте componentOptions.idProperty');
               cfg.componentOptions.idProperty = cfg.componentOptions.keyField;
            }
            if (cfg.componentOptions && cfg.componentOptions.displayField) {
               IoC.resolve('ILogger').log('InteractiveMove', 'Опция componentOptions.displayField является устаревшей, используйте componentOptions.displayProperty');
               cfg.componentOptions.displayProperty = cfg.componentOptions.displayField;
            }
            return InteractiveMove.superclass._modifyOptions.apply(this, arguments);
         },

         _doExecute: function(meta) {
            meta = meta || {};
            meta.movedItems = meta.movedItems || meta.records || this.getSelectedItems();
            if (!meta.movedItems || meta.movedItems instanceof Array && meta.movedItems.length == 0) {
               InformationPopupManager.showMessageDialog(
                  {
                     message: rk('Не выбрано ни одной записи для перемещения.'),
                     status: 'default'
                  }
               );
               return;
            }
            return InteractiveMove.superclass._doExecute.call(this, meta);
         },

         _buildComponentConfig: function(meta) {
            var
               options = cMerge(meta.componentOptions||{}, this._getComponentOptions()),
               movedItems = meta.movedItems;
            cMerge(options, {
               linkedView: this._getListView(),
               dataSource: this.getDataSource(),
               parentProperty: this._options.parentProperty,
               nodeProperty: this._options.nodeProperty,
               records: movedItems,
               handlers: {
                  onSelectComplete: function(event, list) {
                     this.sendCommand('close', list.at(0));
                  }
               }
            });
            options.filter = options.filter || {};
            if (!options.filter.hasOwnProperty('ВидДерева')) {
               options.filter['ВидДерева'] = "Только узлы";
            }
            if (options.pageSize) {
               //todo пейджинг нормально выглядит только с кнопкой еще, догрузка по скроллу не работает, потому что окно может не скролится, а обычный педжинг не отображает корень только на первой странице
               //нужен стандарт на пейджинг в окне перемещения.
               options.infiniteScroll = 'demand';
            }
            return options;
         },

         init: function () {
            InteractiveMove.superclass.init.call(this);
            this._syncOptions();

         },

         _move: function(movedItems, target) {
            Indicator.show();
            if (target && target.getId() == null) {
               target = null; //selectorwrapper возвращает корень как модель с идентификатором null
            }

            return this._getMover().move(movedItems, target, 'on').addCallback(function (result) {
               if (result !== false && this._getListView()) {
                  this._getListView().removeItemsSelectionAll();
               }
            }.bind(this)).addBoth(function () {
               Indicator.hide();
            });
         },

         _getDialogConfig: function (meta) {
            var config = InteractiveMove.superclass._getDialogConfig.call(this, meta),
               movedItems = meta.movedItems;
            cMerge(config, {
               title: rk('Перенести') + ' ' + movedItems.length + strHelpers.wordCaseByNumber(movedItems.length, ' ' + rk('записей'), ' ' + rk('запись'), ' ' + rk('записи')) + ' ' + rk('в'),
               opener: this._getListView()
            }, {preferSource: true});
            return config;
         },

         _getComponentOptions: function() {
            var options = ['displayField', 'partialyReload', 'keyField', 'idProperty', 'hierField', 'displayProperty'],
               listView = this._getListView(),
               result = this._options.componentOptions || {};
            if (listView) {
               options.forEach(function (name) {
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
         },

         _notifyOnExecuted: function (meta, result) {
            if (result !== undefined) { //если ни чего не выбрали то не надо вызывать move
               this._move(meta.movedItems, result).addBoth(function () {
                  InteractiveMove.superclass._notifyOnExecuted.call(this, meta, result);
               }.bind(this));
            } else {
               InteractiveMove.superclass._notifyOnExecuted.call(this, meta, result);
            }
         },
         _syncOptions: function () {
            if (cInstance.instanceOfMixin(this._options.linkedObject, 'SBIS3.CONTROLS.TreeMixin')) {
               cMerge(this._options, {
                  parentProperty: this._options.linkedObject.getParentProperty(),
                  nodeProperty: this._options.linkedObject.getNodeProperty()
               }, {preferSource: true});
               this.subscribeTo(this._options.linkedObject, 'onKeyPressed', this._keyPressHandler.bind(this));
            }
         },
         setLinkedObject: function (value) {
            InteractiveMove.superclass.setLinkedObject.call(this, value);
            this._syncOptions();
         },

         _keyPressHandler: function(busE, e){
            switch (e.which) {
               case constants.key.m:
                  e.ctrlKey && this.execute();
                  busE.setResult(false);
                  break;
            }
         }
      });
      return InteractiveMove;
   }
);

