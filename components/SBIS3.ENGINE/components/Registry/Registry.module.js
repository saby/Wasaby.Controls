define('js!SBIS3.Engine.Registry',
   [
      'js!SBIS3.CORE.CompoundControl',
      'html!SBIS3.Engine.Registry',
      'js!SBIS3.CORE.TabButtons',
      'js!SBIS3.CORE.SwitchableArea',
      'js!SBIS3.CORE.OperationsPanelND',
      'js!SBIS3.CORE.SearchString',
      'js!SBIS3.CORE.FilterController',
      'js!SBIS3.CONTROLS.OperationsPanelButton',
      'css!SBIS3.Engine.Registry'
   ],
   function (CompoundControl, dotTplFn) {
      'use strict';
      /**
       * @class SBIS3.Engine.Registry
       * @extends $ws.proto.CompoundControl
       * @control
       * @author Ilya Klepikov
       * @public
       * @designTime actions /design/design
       * @designTime plugin /design/DesignPlugin
       * @ignoreOptions className independentContext
       * @initial
       * <component data-component="SBIS3.Engine.Registry">
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
      var Registry = CompoundControl.extend(/** @lends SBIS3.Engine.Registry.prototype */{
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
                * @property {String} tabsArea Идентификатор связанной области из массива {@link tabsArea} (область слева от закладок)
                * @property {String} mainArea Идентификатор связанной области из массива {@link mainArea} (область под закладками)
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
                * @property {Content} filtersContent контент
                * @property {String} linkedView связаное представление данных
                * @property {SearchStringOptions} searchString строка поиска
                * @property {OperationPanelOptions} operationsPanel панель массовых операций
                * @property {FilterControllerOptions} filterController контролы фильтрации
                * @group searchString controls
                * @group operationsPanel controls
                * @group filterController controls
                * @editor searchString genie.RegistryFilterComponentsEditor
                * @editor operationsPanel genie.RegistryFilterComponentsEditor
                * @editor filterController genie.RegistryFilterComponentsEditor
                * @editor linkedView genie.InternalComponentChooserEditable
                */

               /**
                * @typedef {object} OperationPanelHandlers
                * @property {Function[]} onBeforeShow Перед открытием панели
                * @property {Function[]} onAfterShow После открытия панели
                * @editor onBeforeShow genie.HandlersArrayEditor
                * @editor onAfterShow genie.HandlersArrayEditor
                */

               /**
                * @typedef {Object} MarkOperation
                * @property {String} [caption=''] заголовок
                */

               /**
                * @typedef {Object} SaveButtons
                * @property {OperationElement} saveToPDF Сохранить в PDF
                * @property {OperationElement} saveToExcel Сохранить в Excel
                */
               /**
                * @typedef {Object} MenuForSave
                * @property {SaveButtons} menu Меню кнопок сохранения
                */
               /**
                * @typedef {Object} PrintButtons
                * @property {OperationElement} allRecords Все документы
                * @property {OperationElement} list Список
                */
               /**
                * @typedef {Object} MenuForPrint
                * @property {PrintButtons} menu Меню кнопок печати
                * @editor PrintButtonEditor
                */

               /**
                * @typedef {Object} OperationElement
                * @property {Function} [action=''] действие при выборе/нажатии кнопки.
                * @property {String} [caption=''] Заголовок операции
                * @property {String} img Путь к иконке кнопки. Стандартный размер иконки - 24x24px
                * @property {String} name имя кнопки
                * @property {String} tooltip Текст всплывающей подсказки по наведении курсора
                * @property {Object.<string, OperationElement>} menu меню
                * @editor img ImageEditor
                * @editorConfig img spriteSize 24
                */
               /**
                * @typedef {Object} OperationElementSimple
                * @property {Function} [action=''] действие при выборе/нажатии кнопки.
                * @property {String} caption Заголовок операции
                * @property {String} img Путь к иконке кнопки. Стандартный размер иконки - 24x24px
                * @property {String} name имя кнопки
                * @property {String} tooltip Текст всплывающей подсказки по наведении курсора
                * @editor img ImageEditor
                * @editorConfig img spriteSize 24
                */

               /**
                * @typedef {Object} MassOperations
                * @property {MenuForPrint} print Распечатать, обладает выпадающим меню
                * @property {MenuForSave} save Сохранить, обладает выпадающим меню
                * @property {OperationElement} sum Просуммировать всё
                * @property {OperationElement} delete Удалить всё
                */
               /**
                * @typedef {object} OperationPanelOptions
                * @property {Boolean} [hasControl=false] Есть ли контрол
                * @property {String} className Дополнительные классы
                * @property {String} name Название контрола
                * @property {Boolean} [isUseSaveSelectedColumns=true] Используется ли сохранение выбранных колонок в Excel
                * @property {Boolean} [isUseRecordReportsForExcel=true] Используются ли отчеты записей для сохранения в Excel
                * @property {Object.<string, OperationElement>} markOperations Операции выбора записей
                * @property {Object.<string, OperationElement>} massOperations Операции над выбранными записями
                * @property {Object.<string, OperationElement>} selectedOperations Операции над выбранными записями
                * @property {OperationPanelHandlers} handlers обработчики
                * @group handlers handlers
                * @editor hasControl genie.EmptyEditor
                * @editor markOperations genie.OperationPanelMarkEditor
                * @editor massOperations genie.OperationPanelMassEditor
                * @editor selectedOperations genie.OperationPanelSelectedEditor
                */

               /**
                * @typedef {object} SearchStringHandlers
                * @property {Function[]} onActivated При нажатии клавиши Enter в поле
                * @property {Function[]} onChange При изменении значения пользователем или из контекста
                * @property {Function[]} onClick При клике на контрол
                * @property {Function[]} onDestroy При уничтожении экземпляра класса
                * @property {Function[]} onFocusIn При установке фокуса на контрол
                * @property {Function[]} onFocusOut При потере фокуса
                * @property {Function[]} onInit При инициализации класса
                * @property {Function[]} onKeyPressed При нажатии клавиши
                * @property {Function[]} onPropertyChanged Событие происходит при изменении значения какого-либо свойства контрола
                * @property {Function[]} onReady При готовности класса
                * @property {Function[]} onStateChanged При изменении состояния контрола
                * @property {Function[]} onTooltipContentRequest Получение содержимого расширенной подсказки поля
                * @property {Function[]} onValidate При прохождении валидации
                * @property {Function[]} onValueChange При изменении значения контрола
                * @property {Function[]} onBeforeApplyFilter Перед началом поиска
                * @property {Function[]} onResetFilter При сбросе фильтра
                * @editor onBeforeApplyFilter genie.HandlersArrayEditor
                * @editor onResetFilter genie.HandlersArrayEditor
                * @editor onActivated genie.HandlersArrayEditor
                * @editor onChange genie.HandlersArrayEditor
                * @editor onClick genie.HandlersArrayEditor
                * @editor onDestroy genie.HandlersArrayEditor
                * @editor onFocusIn genie.HandlersArrayEditor
                * @editor onFocusOut genie.HandlersArrayEditor
                * @editor onInit genie.HandlersArrayEditor
                * @editor onKeyPressed genie.HandlersArrayEditor
                * @editor onPropertyChanged genie.HandlersArrayEditor
                * @editor onReady genie.HandlersArrayEditor
                * @editor onStateChanged genie.HandlersArrayEditor
                * @editor onTooltipContentRequest genie.HandlersArrayEditor
                * @editor onValidate genie.HandlersArrayEditor
                * @editor onValueChange genie.HandlersArrayEditor
                */

               /**
                * @typedef {object} SearchStringOptions
                * @property {Boolean} [hasControl=false] Есть ли контрол
                * @property {String} className Дополнительные классы
                * @property {String} name Название контрола
                * @property {Boolean} [resetRoot=false] Сбрасывать корень
                * @property {Boolean} [resetOnOpen=false] Сбрасывать поиск при заходе в папку
                * @property {Boolean} [clearParams=false] Очищать параметры поиска на окне дополнительных параметров после изменения значения в строке поиска
                * @property {String} [tooltip=найти] Текст подсказки
                * @property {String} filterName Имя фильтра, по этому полю будет производиться поиск
                * @property {Number} [startSearch=0] Минимальная длина значения для начала автоматического поиска
                * @property {SearchStringHandlers} handlers обработчики
                * @group handlers handlers
                * @editor hasControl genie.EmptyEditor
                */

               /**
                * @typedef {Object} Filter
                * @property {string} defaultValue значение фильтра по умолчанию
                * @property {string} value начальное значение
                */
               // TODO value сделать тип как в filterParams
               /**
                * @typedef {Object} PathFilterHandlers
                * @property {Function[]} onFilterChange При смене фильтра
                * @property {Function[]} onResetFilter При сбросе фильтра
                * @property {Function[]} onPointClick При клике по элементу фильтра
                * @property {Function[]} onArrowClick При клике на стрелку выбора фильтра
                * @property {Function[]} onDrawPoint При визуализации фильтра
                * @property {Function[]} onPathChange При выборе фильтра
                * @property {Function[]} onVisualizeFilter При отрисовке фильтра
                * @property {Function[]} onCreatePoint При создании выпадающего списка
                * @property {Function[]} onClickMore При клике по "Еще..."
                * @property {Function[]} onSelectValue При выборе элемента из списка
                * @editor onFilterChange genie.HandlersArrayEditor
                * @editor onResetFilter genie.HandlersArrayEditor
                * @editor onPointClick genie.HandlersArrayEditor
                * @editor onArrowClick genie.HandlersArrayEditor
                * @editor onDrawPoint genie.HandlersArrayEditor
                * @editor onPathChange genie.HandlersArrayEditor
                * @editor onVisualizeFilter genie.HandlersArrayEditor
                * @editor onCreatePoint genie.HandlersArrayEditor
                * @editor onClickMore genie.HandlersArrayEditor
                * @editor onSelectValue genie.HandlersArrayEditor
                */

               /**
                * @typedef {Object} FilterButtonHandlers
                * @property {Function[]} onChange При смене фильтра
                * @property {Function[]} onBeforeShow Перед показом панели
                * @property {Function[]} onRestoreFilter Перед восстановлением значений контролов
                * @property {Function[]} onDrawLine Перед показом строки
                * @property {Function[]} onResetFilter При очистке фильтра
                * @property {Function[]} onSetQuery При отправке запроса браузеру
                * @property {Function[]} onControlsReady Событие при готовности контролов панели фильтров
                * @editor onChange genie.HandlersArrayEditor
                * @editor onBeforeShow genie.HandlersArrayEditor
                * @editor onRestoreFilter genie.HandlersArrayEditor
                * @editor onDrawLine genie.HandlersArrayEditor
                * @editor onResetFilter genie.HandlersArrayEditor
                * @editor onSetQuery genie.HandlersArrayEditor
                * @editor onControlsReady genie.HandlersArrayEditor
                */

               /**
                * @typedef {object} FilterControllerOptions
                * @property {Boolean} [hasControl=false] Есть ли контрол
                * @property {String} className Дополнительные классы
                * @property {String} name Название контрола
                * @property {Boolean} [showHistory=true] Отображать ли историю выбора
                * @property {String} template Имя шаблона для всплывающей панели
                * @property {Function} filterLine Функция рендеринга строки кнопки фильтров
                * @property {Boolean} sendDefault Нужно ли кнопке фильтров посылать значения по умолчанию
                * @property {Object.<string, Filter>} filters Параметры фильтрации быстрого фильтра
                * @property {FilterButtonHandlers} filterButtonHandlers Обработчики для кнопки фильтров
                * @property {PathFilterHandlers} pathFilterHandlers Обработчики для быстрого доступа к фильтру
                * @group filterButtonHandlers handlers
                * @group pathFilterHandlers handlers
                * @editor template genie.ExternalComponentChooser
                * @editor hasControl genie.EmptyEditor
                */

               /**
                * @typedef {object} OperationPanelUserOperations
                * @property {Function} action обработчик действия
                * @property {String} caption заголовок
                * @property {String} tooltip подсказка
                * @property {String} img иконка.
                * @editor img genie.ImageEditor
                * @editorConfig img spriteSize 24
                 */
               /**
                * @cfg {RegistryTabItem[]} Массив закладок реестра с настройками привязок областей.
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
                * @cfg {Boolean} Загружать все области одновременно
                */
               loadAll: false
            }
         },

         $constructor: function () {
            this._publish('onBeforeShowFirstTab', 'onTabChange', 'onTabLoaded');
            this._craftedContext = false;
            this._context = this._context.getPrevious();
            var self = this;
            this.once('onInit', function () {
               var tabId = self._notify('onBeforeShowFirstTab', self._options.defaultTab);
               if (typeof tabId === 'string') {
                  if (tabId === '') {
                     tabId = self._options.defaultTab = '';
                  }
               } else {
                  tabId = self._options.defaultTab;
               }
               self._tabButtons.setCurrentTab(tabId, true);
               self._tabButtons.setDefaultTab(self._tabButtons.getCurrentTab(tabId));

               // Подписка на смену активной вкладки
               this._tabButtons.subscribe('onTabChange', self._onTabChange.bind(self));
               this._onTabChange(undefined, tabId || this._options.defaultTab || (this._options.tabs.length ? this._options.tabs[0].id : ''));
            });
         },

         init: function () {
            Registry.superclass.init.call(this);
            this._tabButtons = this.getChildControlByName(this._options.tabsName || 'tab-buttons');
            //this._topArea = this.getChildControlByName('topArea');
            this._tabsArea = this.getChildControlByName('tabsArea');
            this._mainArea = this.getChildControlByName('mainArea');
            this._panelsButton = this.getChildControlByName('panelsButton');
            this._activeTabId = this._options.defaultTab || this._options.tabs[0] && this._options.tabs[0].id;

            $(".big.auth", this.getContainer()).appendTo($(this.getContainer().parent()));
            this._initUserConfig();
         },

         _initUserConfig: function() {
            var currentConfigRegion = null,
               currentConfigInitialItem,
               channel = $ws.single.EventBus.channel('navigation'),
               userConfig = $('.userConfig-icon');
            userConfig.click(function () {
               function setTabTitle(fArea) {
                  fArea.waitChildControlByName('Закладки конфигурации').addCallback(function (tabs) {
                     tabs.renameTab('Конфигурация', 'Настройка');
                     return tabs;
                  });
                  return fArea;
               }

               if (currentConfigRegion) {
                  if (currentConfigInitialItem) {
                     $ws.single.Configuration.select(currentConfigInitialItem, currentConfigRegion).addCallback(setTabTitle);
                  } else {
                     $ws.single.Configuration.open(currentConfigRegion).addCallback(setTabTitle);
                  }
               }
            });
            if (currentConfigRegion) {
               userConfig.show();
            }
            channel.subscribe('onNavigate', function (event, regionId, elementId, data, isIconClick) {
               //если нужно показывать конфигурацию, то прикладники должны положить в data.configRegion имя нужного региона для конфигурации
               if (regionId === 'left' && !isIconClick) {
                  var configRegion,
                     configInitialItem = null,
                     hide = function () {
                        userConfig.hide();
                        currentConfigRegion = null;
                        currentConfigInitialItem = null;
                     };
                  try {
                     var dataParse = JSON.parse(data);
                     if (dataParse.configRegion) {
                        configRegion = dataParse.configRegion;
                     }
                     if (dataParse.configInitialItem) {
                        configInitialItem = dataParse.configInitialItem;
                     }
                  }
                  catch (e) {
                     if (data.configRegion) {
                        configRegion = data.configRegion;
                     }
                     if (data.configInitialItem) {
                        configInitialItem = data.configInitialItem;
                     }
                  }

                  if (configRegion) {
                     $.ajax({
                        url: '/navigation/get-structure/' + configRegion + '/',
                        type: 'POST',
                        dataType: 'json',
                        complete: function (response) {
                           try {
                              var structure = $.parseJSON(response.responseText),
                                 filterFunc = function (item) {
                                    if (!item.forbidden && item.items && item.items.length) {
                                       item.items = $ws.helpers.filter(item.items, filterFunc);
                                    }
                                    return !item.forbidden && (item.event || item.items && item.items.length);
                                 };
                              structure = $ws.helpers.filter(structure, filterFunc);
                              if (structure.length) {
                                 userConfig.show();
                                 currentConfigRegion = configRegion;
                                 currentConfigInitialItem = configInitialItem;
                              } else {
                                 hide();
                              }
                           } catch (e) {
                              hide();
                           }
                        }
                     });
                  } else {
                     hide();
                  }
               }
            });
         },

         _onTabChange: function (event, tabId) {
            var self = this;
            this._activeTabId = tabId;
            if (tabId === '') {
               //self._topArea.hide();
               self._tabsArea.hide();
               self._mainArea.hide();
               self._panelsButton.hide();
            } else {
               for (var i = 0; i < this._options.tabs.length; i++) {
                  var tab = this._options.tabs[i];
                  if (tab.id === tabId) {
                     (function (tab) {
                        //tab.topArea && self._topArea.setActiveArea(tab.topArea);
                        //tab.topArea ? self._topArea.show() : self._topArea.hide();
                        tab.tabsArea && self._tabsArea.setActiveArea(tab.tabsArea);
                        tab.tabsArea ? self._tabsArea.show() : self._tabsArea.hide();
                        tab.mainArea && self._mainArea.setActiveArea(tab.mainArea).addCallback(function () {
                           self._setCurrentPanel(tab.mainArea);
                           self._notify('onTabLoaded', tab.mainArea);
                        });
                        tab.mainArea ? self._mainArea.show() : self._mainArea.hide();
                     })(tab);
                     break;
                  }
               }
            }
            event && this._notify('onTabChange', tabId);
         },
         _setCurrentPanel: function(areaID) {
            var
               self = this,
               operationsPanel,
               area;
            for (var i = 0; i < this._options.mainArea.length; i++) {
               area = this._options.mainArea[i];
               if (area.id === areaID) {
                  (function (area) {
                     operationsPanel = area.operationsPanel;
                     if (operationsPanel && operationsPanel.hasControl) {
                        self._panelsButton.setLinkedPanel(self._mainArea.getChildControlByName(operationsPanel.name || ('OperationsPanel_' + area.id)));
                     }
                     self._panelsButton.toggle(!!operationsPanel && operationsPanel.hasControl);
                  })(area);
               }
            }
         },
         /**
          * Аналог ф-ции из TabControl. Получить связанную с корешком закладок область
          * @param {String} tabId идентификатор закладки
          * @param {String} [areaName] Тип области.
          * Одно из возможных значений:
          * - "main"
          * - "top"
          * - "tabs"
          * По умолчанию (если параметр не указан), возвращается "main".
          */
         getTabArea: function (tabId, areaName) {
            for (var i = 0; i < this._options.tabs.length; i++) {
               var tab = this._options.tabs[i];
               if (tab.id === tabId) {
                  var area;
                  switch (areaName) {
                     case 'top':
                        //area = this._topArea;
                        break;
                     case 'tabs':
                        area = this._tabsArea;
                        break;
                     case 'main':
                     default:
                        area = this._mainArea;
                  }
                  return area.getItemById(tab.mainArea);
               }
            }
            return null;
         },
         getCurrentTabArea: function (areaName) {
            return this.getTabArea(this._activeTabId, areaName);
         },
         getTabButtons: function () {
            return this._tabButtons;
         }
      });
      return Registry;
   }
);