/**
 * Created by am.gerasimov on 10.12.2015.
 */
define('SBIS3.CONTROLS/Filter/Button/History',
    [
   "Core/CommandDispatcher",
   "Lib/Control/CompoundControl/CompoundControl",
   "tmpl!SBIS3.CONTROLS/Filter/Button/History/FilterHistory",
   "tmpl!SBIS3.CONTROLS/Filter/Button/History/ItemContentTpl",
   "tmpl!SBIS3.CONTROLS/Filter/Button/History/ItemContentTplFM",
   "SBIS3.CONTROLS/Filter/FavoriteEditDialog",
   "SBIS3.CONTROLS/Commands/CommandsSeparator",
   "SBIS3.CONTROLS/ListView",
   'css!SBIS3.CONTROLS/Commands/CommandsSeparator',
   'css!SBIS3.CONTROLS/Filter/Button/History/FilterButtonHistory',
   "i18n!SBIS3.CONTROLS/Filter/Button"
],
    function( CommandDispatcher, CompoundControl, dotTpl, ItemContentTpl, ItemContentTplFM) {

   'use strict';

    var MAX_MINIMIZE_HISTORY_ITEMS = 5;

   /**
    * Контрол, отображающий историю фильтров в кнопке фильтров
    * @class SBIS3.CONTROLS/Filter/Button/History
    * @extends Lib/Control/CompoundControl/CompoundControl
    */

   var FilterHistory = CompoundControl.extend([], /** @lends SBIS3.CONTROLS/Filter/Button/History.prototype*/ {
      _dotTplFn : dotTpl,
      $protected: {
         _options: {
            /**
             * @cfg {String} Устанавливает режим отображения истории.
             * @variant pinMode Режим отображения с закрепелнием.
             * @variant favoritesMode Режим отображения с добавлением в избранное.
             */
            viewMode: 'pinMode'
         },
         _historyView: undefined,
         _historyController: undefined,
         _toggleHistoryButton: undefined
      },

      $constructor: function() {

         CommandDispatcher.declareCommand(this, 'toggleHistory', this.toggleHistoryBlock);
      },

      _modifyOptions: function() {
         var opts = FilterHistory.superclass._modifyOptions.apply(this, arguments);
         opts._itemContentTpl = opts.viewMode === 'favoritesMode' ? ItemContentTplFM : ItemContentTpl;
         return opts;
      },

      init: function() {
         FilterHistory.superclass.init.apply(this, arguments);

         this._historyView = this.getChildControlByName('historyView');
         this._toggleHistoryButton = this.getChildControlByName('toggleHistory');

         /* Проинициализируем список: подпишемся на события, проставим операции над записью */
         this._initHistoryView();
      },

      /**
       * Устанавливает контроллер для работы с историей
       * @param {SBIS3.CONTROLS/Filter/HistoryController} controller
       */
      setHistoryController: function(controller) {
         this._historyController = controller;
         this.updateHistoryViewItems();
      },

      _initHistoryView: function() {
         var
            self = this,
            itemsActions = this._options.viewMode === 'favoritesMode' ? [/*{
               name: 'favourite',
               icon: 'icon-24 icon-Unfavourite icon-disabled',
               isMainAction: true,
               onActivated: function(target, key, item) {
                  self._addToFavorites(item);
               }
            }*/] : [{
               name: 'pin',
               icon: 'icon-16 icon-Pin icon-disabled',
               tooltip: rk('Отметить'),
               isMainAction: true,
               onActivated: function(target, key) {
                  self._historyController.toggleMarkFilter(key);
                  self.updateHistoryViewItems();
               }
            }];

         /* Установка операции отметки записи маркером */
         self._historyView.setItemsActions(itemsActions);

         /* При клике по строке списка фильтров - применим фильтр из истории */
         self.subscribeTo(self._historyView,'onItemActivate', function(e, itemObj) {
            self._historyController.activateFilterByKey(itemObj.id);
         });

         self.subscribeTo(self._historyView, 'onDrawItems', function(e) {
            var dsCount = self._historyView.getItems().getCount();

            /* Если записей в истории нет - скроем историю */
            self._container.toggleClass('ws-hidden', !dsCount);
            /* Если записей < 3, то выключим кнопку разворота истории */
            self._toggleHistoryButton[dsCount > MAX_MINIMIZE_HISTORY_ITEMS ? 'show' : 'hide']();
         });

         if (self._options.viewMode === 'pinMode') {
            self.subscribeTo(self._historyView, 'onChangeHoveredItem', self._onChangeHoverHistoryItem);
         }
      },

      _addToFavorites: function(item) {
         var
            toEditItem = item.clone(),
            action = this._getEditFavoriteAction();

         /* Подготавливаем запись к редктированию */
         toEditItem.set('toSaveFields', {});
         toEditItem.set('editedTextValue', '');

         action.execute({
            item: toEditItem,
            componentOptions: {
               textValue: toEditItem.get('linkText'),
               handlers: {
                  onBeforeUpdateModel: function (event, record) {

                  }
               }
            },
            dialogOptions: { resizable : false }
         });

      },

      _getEditFavoriteAction: function () {
         if (!this._editFavoriteAction) {
            this._editFavoriteAction = this.getChildControlByName('editFavorite');
         }
         return this._editFavoriteAction;
      },

      /**
       * Обновляет список истории
       */
      updateHistoryViewItems: function() {
         if(this._historyController) {
            this._historyView.setItems(this._historyController.getHistory() || []);
         }
      },

      /**
       * Сворачивает/разворачивает блок с историей
       * @param {Boolean} closed
       * @private
       */
      toggleHistoryBlock: function(closed) {
         var isBooleanArg = typeof closed === 'boolean';

         this._container.find('.controls-filterButton__footerAreas-wrapper')
                        .toggleClass('controls-filterButton__footerAreas-maxHeight', isBooleanArg ? closed : undefined);

         if(isBooleanArg) {
            this._toggleHistoryButton.setChecked(!closed);
         }

         this._notifyOnSizeChanged(this, this);
      },

      /**
       * Обработчик на смену выделенного элемента, меняет состояние маркера
       * @private
       */
      _onChangeHoverHistoryItem: function(event, item) {
         if(!item.record) return;

         var actions = this.getItemsActions().getItemsInstances(),
             isMarked = item.record.get('isMarked');

         for(var action in actions) {
            if(actions.hasOwnProperty(action)) {
               actions[action].getContainer().toggleClass('controls-filterButton__historyView-hiddenMarker', isMarked);
            }
         }
      }
   });

   return FilterHistory;

});
