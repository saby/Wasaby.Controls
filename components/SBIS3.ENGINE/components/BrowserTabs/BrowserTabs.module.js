/* global define, $ws */
define('js!SBIS3.Engine.BrowserTabs',
   [
      'js!SBIS3.CORE.CompoundControl',
      'html!SBIS3.Engine.BrowserTabs',
      'js!SBIS3.CONTROLS.TabButtons',
      'js!SBIS3.CORE.SwitchableArea',
      'js!SBIS3.CONTROLS.OperationsPanelButton',
      'css!SBIS3.Engine.BrowserTabs'
   ],
   function (CompoundControl, dotTplFn) {
      'use strict';
      /**
       * @class SBIS3.Engine.BrowserTabs
       * @extends $ws.proto.CompoundControl
       * @control
       * @public
       * @demo SBIS3.Engine.Demo.MyBrowserTabs
       * @designTime actions /design/design
       * @designTime plugin /design/DesignPlugin
       * @ignoreOptions className independentContext
       * @initial
       * <component data-component="SBIS3.Engine.BrowserTabs">
       *    <options name="mainArea" type="array">
       *       <options>
       *          <option name="id">group-1</option>
       *       </options>
       *    </options>
       *    <options name="tabsArea" type="array">
       *       <options>
       *          <option name="id">group-1</option>
       *       </options>
       *    </options>
       *    <options name="tabs" type="array">
       *       <options>
       *          <option name="mainArea">group-1</option>
       *          <option name="tabsArea">group-1</option>
       *          <option name="title">title</option>
       *          <option name="id">id-1</option>
       *       </options>
       *    </options>
       * </component>
       */
      var BrowserTabs = CompoundControl.extend(/** @lends SBIS3.Engine.BrowserTabs.prototype */{
         /**
          * @event onTabChange Событие при смене закладки
          * @param {Object} eventObject описание в классе {@link $ws.proto.Abstract}
          * @param {string} tabId идентификатор новой закладки
          */
         /**
          * @event onBeforeShowFirstTab Событие при показе первой закладки
          * @param {Object} eventObject описание в классе {@link $ws.proto.Abstract}
          * @param {string} defaultTab id закладки по умолчанию, можно вернуть новую закладку через event.setResult()
          */
         /**
          * @event onTabLoaded Событие при загрузке закладки в основной области
          * @param {Object} eventObject описание в классе {@link $ws.proto.Abstract}
          * @param {string} currentTabId id закладки
          */
         _dotTplFn: dotTplFn,
         $protected: {
            _options: {
               /**
                * @typedef {object} RegistryTabItem
                * @property {String} id Имя закладки
                * @property {String} title Заголовок закладки
                * @property {String} icon Иконка. Либо прямой путь, либо путь через 'ws:/' (иконка из ws), либо спрайт (sprite:класс класс класс)
                * @property {String} [cssClass] CSS-класс, который будет размещен на закладке
                * @property {Boolean} [enabled=true] Доступна ли вкладка для выбора
                * @property {Boolean} [visible=true] Видима ли вкладка
                * @property {String} tabsArea Группа средней панели
                * @property {String} mainArea Группа главной панели
                * @group tabsArea areas
                * @group mainArea areas
                * @editor icon genie.ImageEditor
                * @editor tabsArea genie.TabItemAreaSelector
                * @editor mainArea genie.TabItemAreaSelector
                */
               /**
                * @typedef {object} AreaOpts
                * @property {String} id имя области
                * @property {Content} content контент
                */
               /**
                * @typedef {object} MainAreaOpts
                * @property {String} id имя области
                * @property {Content} content контент
                * @property {String} linkedView связаное представление данных
                * @editor linkedView genie.InternalComponentChooserEditable
                */

               /**
                * @cfg {RegistryTabItem[]} Вкладки реестра
                * @editor genie.RegistryTabsArray
                * @group tabs
                */
               tabs: [],
               /**
                * @cfg {String} Имя вкладки
                * @group tabs
                */
               tabsName: '',
               /**
                * @cfg {String} Id вкладки по умолчанию
                * @editor genie.RegistryDefaultTab
                * @group tabs
                */
               defaultTab: '',
               /**
                * @cfg {AreaOpts[]} Опции средней области
                * @editor genie.EmptyEditor
                */
               tabsArea: [],
               /**
                * @cfg {MainAreaOpts[]} Опции главной области
                * @editor genie.EmptyEditor
                */
               mainArea: [],
               /**
                * @noshow
                */
               tabindex: 0,
               /**
                * @cfg {Boolean} Видимость кнопки управления панелью массовых операций
                */
               operationsButtonVisibility: true
            },
            /**
             * SwitchableArea для области tabs
             */
            _tabsArea:null,
            /**
             * SwitchableArea для области main (под вкладками)
             */
            _mainArea:null,
            /**
             * статус tabsArea может быть AREA_READY и AREA_READY_LOADED)
             */
            _tabsAreaStatus: null,
            /**
             * статус mainArea может быть AREA_READY и AREA_READY_LOADED)
             */
            _mainAreaStatus: null,
            /**
             * Область готова (компоненты были загружены ранее)
             */
            AREA_READY: 'ready',
            /**
             * Область готова после загрузки компонентов
             */
            AREA_READY_LOADED: 'ready_loaded'
         },

         $constructor: function () {
            this._publish('onBeforeShowFirstTab', 'onTabChange', 'onTabLoaded', 'onTabAndMainLoaded');
            this._craftedContext = false;
            this._context = this._context.getPrevious();
            var self = this;

            this._activeTabId = this._options.defaultTab || this._options.tabs[0] && this._options.tabs[0].id;

            $ws.single.CommandDispatcher.declareCommand(this, 'loadChildControls', this._loadChildControls);

            this.once('onInit', function () {
               var tabId = self._notify('onBeforeShowFirstTab', self._options.defaultTab);
               if (typeof tabId === 'string') {
                  if (tabId === '') {
                     tabId = self._options.defaultTab = '';
                  }
               } else {
                  tabId = self._options.defaultTab;
               }

               self._tabButtons.setSelectedKey(tabId);

               // Подписка на смену активной вкладки
               this._tabButtons.subscribe('onSelectedItemChange', self._onTabChange.bind(self));
               this._onTabChange(undefined, tabId || this._options.defaultTab || (this._options.tabs.length ? this._options.tabs[0].id : ''));
            });
         },

         init: function () {
            BrowserTabs.superclass.init.call(this);
            this._tabButtons = this.getChildControlByName(this._options.tabsName || 'tab-buttons');
            this._tabsArea = this.getChildControlByName('tabsArea');
            this._mainArea = this.getChildControlByName('mainArea');
            this._panelsButton = this.getChildControlByName('operationsButton');
         },

         _onTabChange: function (event, tabId) {
            var self = this;
            this._activeTabId = tabId;
            if (tabId === '') {
               self._tabsArea.hide();
               self._mainArea.hide();
            } else {
               var tab = this._getTabById(tabId);
               if (!tab) {
                  return;
               }
               if (event) {
                  this._tabsAreaStatus = false;
                  this._mainAreaStatus = false;
               }
               if (tab.tabsArea) {
                  self._tabsArea.setActiveArea(tab.tabsArea).addCallback(function () {
                     self._updateAreaStatus('tabsArea', tab.tabsArea, self.AREA_READY);
                  });
                  self._tabsArea.show();
               } else {
                  self._tabsArea.hide();
               }
               if (tab.mainArea) {
                  self._mainArea.setActiveArea(tab.mainArea).addCallback(function () {
                     self._updateAreaStatus('mainArea', tab.mainArea, self.AREA_READY);
                     self._notify('onTabLoaded', tab.mainArea);
                  });
                  self._mainArea.show();
               } else {
                  self._mainArea.hide();
               }
               self._panelsButton.setLinkedPanel(self._findOperationsPanel());
            }
            event && this._notify('onTabChange', tabId);
         },

         _loadChildControls: function(swAreaId, areaId) {
            this._updateAreaStatus(swAreaId, areaId, this.AREA_READY_LOADED);
         },

         /**
          * Задает статус для SwitchableArea и если нужно вызывает событие о готовности областей
          * @param {String} swAreaName имя области
          * @param {String} areaId идентификатор выбранной области
          * @param {String} status loaded или active
          * @private
          */
         _updateAreaStatus: function(swAreaName, areaId, status) {
            switch (swAreaName) {
               case 'tabsArea':
                  this._tabsAreaStatus = (this._tabsAreaStatus !== this.AREA_READY_LOADED) ? status : this._tabsAreaStatus;
                  break;
               case 'mainArea':
                  this._mainAreaStatus = (this._mainAreaStatus !== this.AREA_READY_LOADED) ? status : this._mainAreaStatus;
                  break;
            }
            if (this._tabsAreaStatus && this._mainAreaStatus &&
               (this._tabsAreaStatus === this.AREA_READY_LOADED || this._mainAreaStatus === this.AREA_READY_LOADED)) {
               this._notify('onTabAndMainLoaded', this._activeTabId);
               //сбрасываем статус, чтобы не стрелять событием повторно
               this._tabsAreaStatus = false;
               this._mainAreaStatus = false;
            }
         },

         /**
          * ищет вкладку в _options.tabs по id
          */
         _getTabById: function(tabId) {
            var tab = null,
                found = false,
                i = 0,
                len = this._options.tabs.length;
            while (!found  &&  i < len) {
               tab = this._options.tabs[i];
               if (tab.id === tabId) {
                  found = true;
               }
               i++;
            }
            return tab;
         },

         _findOperationsPanel: function() {
            var mainArea = this.getTabArea(this._activeTabId),
                childs = mainArea.getChildControls();

            for (var i = 0; i < childs.length; i++) {
               if ($ws.helpers.instanceOfModule(childs[i], 'SBIS3.CONTROLS.OperationsPanel') ||
                   $ws.helpers.instanceOfModule(childs[i], 'SBIS3.CORE.OperationsPanel')) {
                  return childs[i];
               }
            }
         },
         setOperationsButtonVisibility: function(show) {
            this._options.operationsButtonVisibility = show;
            this._panelsButton.toggle(show);
         },
         /**
          * Аналог ф-ции из TabControl. Получить связанную с корешком закладок область
          * @param {String} tabId идентификатор закладки
          * @param {String} [areaName] Тип области.
          * Одно из возможных значений:
          * - "main"
          * - "tabs"
          * По умолчанию (если параметр не указан), возвращается "main".
          */
         getTabArea: function (tabId, areaName) {
            for (var i = 0; i < this._options.tabs.length; i++) {
               var tab = this._options.tabs[i];
               if (tab.id === tabId) {
                  var area;
                  switch (areaName) {
                     case 'tabs':
                        area = this._tabsArea.getItemById(tab.tabsArea);
                        break;
                     case 'main':
                     default:
                        area = this._mainArea.getItemById(tab.mainArea);
                  }
                  return area;
               }
            }
            return null;
         },
         getCurrentTabArea: function (areaName) {
            return this.getTabArea(this._activeTabId, areaName);
         },
         /**
          * Получить текущий Browser для текущей области
          * @return {*} Возвращает Browser, если он есть для текущей вкладки. Если не найден вернет null.
          */
         //TODO по-идее нужно заменить
         getCurrentBrowser: function() {
            var currentTabArea = this.getCurrentTabArea('main');
            var children = currentTabArea.getChildControls();
            var i = 0,
                len = children.length,
                browser = null;
            while (i < len  &&  ! browser) {
               if ($ws.helpers.instanceOfModule(children[i], 'SBIS3.CONTROLS.Browser')) {
                  browser = children[i];
               }
               i++;
            }
            return browser;
         },

         getTabButtons: function () {
            return this._tabButtons;
         }
      });
      return BrowserTabs;
   }
);