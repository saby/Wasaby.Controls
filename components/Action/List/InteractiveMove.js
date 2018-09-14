/*global define, $ws, rk*/
define('SBIS3.CONTROLS/Action/List/InteractiveMove',[
   'require',
   'SBIS3.CONTROLS/Action/List/Move',
   'SBIS3.CONTROLS/Action/Mixin/DialogMixin',
   'Core/helpers/String/format',
   'Core/Indicator',
   'Core/core-merge',
   'Core/IoC',
   'Core/core-instance',
   'Core/constants',
   'css!SBIS3.CONTROLS/Action/List/resources/InteractiveMove'
],
function (
   require,
   ListMove,
   DialogMixin,
   format,
   Indicator,
   cMerge,
   IoC,
   cInstance,
   constants
) {
      'use strict';

      /**
       * Класс, описывающий действие перемещения записей по иерархии с возможностью выбора позиции перемещения через диалог. По умолчанию переносит выделенные записи.
       * <br/>
       * Пример использования InteractiveMove:
       * <pre>
       *    define('Examples/MyArea/InteractiveMove', ['Lib/Control/CompoundControl/CompoundControl', 'SBIS3.CONTROLS/Action/List/InteractiveMove'],
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
       * Через метод execute так же можно переопредлять любые опции экшена например, передадим фильтр в список диалога.
       * <pre>
       *     move.execute({movedItems: movedItems, componentOptions: {filter: {demo:'only'}}});
       * </pre>
       * В tmpl навесим обработчик:
       * <pre>
       *    <div class="MyListView">
       *    <SBIS3.CONTROLS.Button
       *       name="ButtonHierMove"
       *       class="Button"
       *       caption="Переместить">
       *       <ws:handlers>
       *          <ws:Object>
       *             <ws:onActivated>
       *                <ws:Function>Examples/MyArea/InteractiveMove:prototype.buttonInteractiveMove</ws:Function>
       *             </ws:onActivated>
       *          </ws:Object>
       *       </ws:handlers>
       *    </SBIS3.CONTROLS.Button>
       *    <SBIS3.CONTROLS.ListView
       *       name="MyListView">
       *       <ws:itemsActions>
       *          <ws:Array>
       *             <ws:Object name="moveUp" title="Interactive move" isMainAction="{{true}}" icon="sprite:icon-16 icon-folder icon-primary">
       *                <ws:onActivated>
       *                   <ws:Function>Examples/MyArea/InteractiveMove:prototype.interactiveMove</ws:Function>
       *                </ws:onActivated>
       *             </ws:Object>
       *          </ws:Array>
       *       </ws:itemsActions>
       *    </SBIS3.CONTROLS.ListView>
       *    </div>
       * </pre>
       *
       * @class SBIS3.CONTROLS/Action/List/InteractiveMove
       * @public
       * @extends SBIS3.CONTROLS/Action/List/Move
       * @mixes SBIS3.CONTROLS/Action/Mixin/DialogMixinл
       * @author Ганшин Я.О.
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

      var InteractiveMove = ListMove.extend([DialogMixin],/** @lends SBIS3.CONTROLS/Action/List/InteractiveMove.prototype */{
         $protected:{
            /**
             * @typedef {Object} componentOptions
             * @property {String} displayField Поле элемента коллекции, из которого отображать данные.
             * @property {Object} filter Фильтр данных.
             * @property {Boolean} partialyReload Устанавливает поведение загрузки дочерних данных для записей типа "Узел" (папка) и "Скрытый узел".
             * @property {Number} pageSize Размер страницы, списка в диалоге выбора, по умолчанию пейджинг выключен
             */
            _options : {
                /**
                 * @cfg {String} Шаблон.
                 */
               template : 'SBIS3.CONTROLS/Action/resources/SelectionDialog',
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
                *
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
               require(['SBIS3.CONTROLS/Utils/InformationPopupManager'], function(InformationPopupManager) {
                  InformationPopupManager.showMessageDialog(
                     {
                        message: rk('Не выбрано ни одной записи для перемещения.'),
                        status: 'default'
                     }
                  );
               }, function(err) {
                  IoC.resolve('ILogger').log('InteractiveMove', err.message)
               });
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
               title: format({count: movedItems.length, records:rk('запись(-и,-ей)', movedItems.length)}, rk('Перенести $count$d$ $records$s$ в')),
               opener: this._getListView()
            }, {preferSource: true});
            config['cssClassName'] = 'InteractiveMove-window';
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
            if (cInstance.instanceOfMixin(this._options.linkedObject, 'SBIS3.CONTROLS/Mixins/TreeMixin')) {
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

