/**
 * Created by am.gerasimov on 10.12.2015.
 */
define('js!SBIS3.CONTROLS.FilterHistory',
    [
       'js!SBIS3.CORE.CompoundControl',
       'html!SBIS3.CONTROLS.FilterHistory',
       'html!SBIS3.CONTROLS.FilterHistory/historyItemTpl',
       'js!SBIS3.CONTROLS.ToggleButton'
    ],
    function(CompoundControl, dotTpl, dotTplForItem) {

   'use strict';

    var MAX_MINIMIZE_HISTORY_ITEMS = 3;

   /**
    * Контрол, отображающий историю фильтров в кнопке фильтров
    * @class SBIS3.CONTROLS.FilterHistory
    * @extends $ws.proto.CompoundControl
    */

   var FilterHistory = CompoundControl.extend([], /** @lends SBIS3.CONTROLS.FilterHistory.prototype*/ {
      _dotTplFn : dotTpl,
      $protected: {
         _options: {
         },
         _filterButton: undefined,
         _historyView: undefined,
         _historyController: undefined,
         _toggleHistoryButton: undefined
      },

      $constructor: function() {
         this._container.removeClass('ws-area');
      },

      _historyItemTpl: dotTplForItem,

      init: function() {
         FilterHistory.superclass.init.apply(this, arguments);

         this._historyView = this.getChildControlByName('historyView');
         this._toggleHistoryButton = this.getChildControlByName('toggleHistory');
         this._filterButton = this.getParentByClass('SBIS3.CONTROLS.FilterButton');

         /* Если применили фильтр - сохраним в историю */
         this._filterButton.subscribe('onApplyFilter', this._onApplyFilterHandler.bind(this));

         /* Если сбросили фильтр - сбросим активный */
         this._filterButton.subscribe('onResetFilter', this._onResetFilterHandler.bind(this));

         /* При нажатии развернём/свернём список истории */
         this._toggleHistoryButton.subscribe('onActivated', this._toggleHistoryBlock.bind(this));

         /* Проинициализируем список: подпишемся на события, проставим операции над записью */
         this._initHistoryView();
      },

      /**
       * Устанавливает контроллер для работы с историей
       * @param {SBIS3.CONTROLS.FilterHistoryController} controller
       */
      setHistoryController: function(controller) {
         this._historyController = controller;
         this.updateHistoryViewItems();
      },

      /**
       * Обработчик на применение фильтра в кнопке фильтров
       * @private
       */
      _onApplyFilterHandler: function() {
         var structure = this._filterButton.getFilterStructure(),
             hc =  this._historyController,
             linkTextArr = [];

         /* Если это дефолтный фильтр, то сохранять в историю не надо */
         if(!this._filterButton.getLinkedContext().getValue('filterChanged')) {
            /* Если применили дефолтный фильтр, то надо сбросить текущий активный */
            hc.clearActiveFilter();
            return;
         }

         /* Из структуры соберём строку */
         for(var i = 0, len = structure.length; i < len; i++) {
            if(structure[i].caption && !$ws.helpers.isEqualObject(structure[i].value, structure[i].resetValue)) {
               linkTextArr.push(structure[i].caption);
            }
         }

         hc.saveToHistory({
            linkText: linkTextArr.join(', '),
            filter: structure
         });

         this.updateHistoryViewItems();
         this._toggleHistoryBlock(true);
      },

      _onResetFilterHandler: function() {
         this._historyController.clearActiveFilter();
      },

      _initHistoryView: function() {
         var self = this;

         /* Установка операции отметки записи маркером */
         self._historyView.setItemsActions([{
            name: 'pin',
            icon: 'icon-16 icon-Pin',
            tooltip: 'Отметить',
            isMainAction: true,
            onActivated: function(target, key) {
               self._historyController.toggleMarkFilter(key);
               self.updateHistoryViewItems();
            }
         }]);

         /* При клике по строке списка фильтров - применим фильтр из истории */
         self._historyView.subscribe('onItemActivate', function(e, itemObj) {
            self._filterButton.setFilterStructure(self._historyController.getFilterFromHistory(itemObj.id));
            self._filterButton.applyFilter();
         });

         self._historyView.subscribe('onDrawItems', function(e) {
            var dsCount = self._historyView.getDataSet().getCount();

            /* Если записей в истории нет - скроем историю */
            self._container.toggleClass('ws-hidden', !dsCount);
            /* Если записей < 3, то выключим кнопку разворота истории */
            self._toggleHistoryButton.setEnabled(dsCount > MAX_MINIMIZE_HISTORY_ITEMS);
         });
      },

      /**
       * Обновляет список истории
       */
      updateHistoryViewItems: function() {
         var self = this;
         if(this._historyController) {
            this._historyController.getHistory(false).addCallback(function (res) {
               self._historyView.setItems(res);
            });
         }
      },

      /**
       * Сворачивает/разворачивает блок с историей
       * @param {Boolean} closed
       * @private
       */
      _toggleHistoryBlock: function(closed) {
         this._container.find('.controls-filterButton__historyView-wrapper')
                        .toggleClass('controls-filterButton__historyView-maxHeight', typeof closed === 'boolean' ? closed : undefined);
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
               actions[action].getContainer().toggleClass('icon-primary', isMarked)
                                             .toggleClass('icon-disabled',!isMarked);
            }
         }
      }
   });

   return FilterHistory;

});