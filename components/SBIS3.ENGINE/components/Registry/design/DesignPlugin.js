define('js!SBIS3.Engine.Registry/design/DesignPlugin',
   [
      'js!SBIS3.Engine.Registry',
      'js!SBIS3.CORE.SwitchableArea/design/DesignPlugin',
      'js!SBIS3.CORE.TabButtons/design/DesignPlugin',
      'css!SBIS3.Engine.Registry/design/DesignPlugin',
      'css!SBIS3.CORE.ClipTheme/Шаблоны/css/topInformer',
      'css!SBIS3.CORE.ClipTheme/Шаблоны/css/user_profile'
   ],
   function (Registry, TabControl, TabItem) {

      function _onInsertItemFunc(event, items, indexes) {
         var args = [indexes[0], 0];
         for (var i = 0; i < items.length; i++) {
            args.push(items[i]);
         }
         this.splice.apply(this, args);
      }

      function _onRemoveItemFunc(event, items, indexes) {
         this.splice(indexes[0], indexes.length);
      }

      function _onMoveItemFunc(event, from, to) {
         this.move(from, to);
      }

      function _addTabGettersAndSetters(tabObj, ind, self) {
         tabObj.id = tabObj.id || ind;
         // id
         tabObj.getId = function () {
            return tabObj.id;
         };
         tabObj.setId = function (id) {
            self._tabButtons.setTabId(tabObj.id, id);
            tabObj.id = id;
         };
         // title
         tabObj.getTitle = function () {
            return tabObj.title;
         };
         tabObj.setTitle = function (title) {
            tabObj.title = title;
            self._tabButtons.renameTab(tabObj.id, title);
         };
         // enabled
         tabObj.getEnabled = function () {
            return tabObj.enabled;
         };
         tabObj.setEnabled = function (enabled) {
            tabObj.enabled = enabled;
            self._tabButtons.setTabEnabled(tabObj.id, enabled);
         };
         // visible
         tabObj.getVisible = function () {
            return tabObj.visible;
         };
         tabObj.setVisible = function (visible) {
            tabObj.visible = visible;
            self._tabButtons.setTabVisible(tabObj.id, visible);
         };
         // icon
         tabObj.getIcon = function () {
            return tabObj.icon;
         };
         tabObj.setIcon = function (icon) {
            tabObj.icon = icon;
            self._tabButtons.setTabIcon(tabObj.id, icon);
         };
         // cssClass
         tabObj.getCssClass = function () {
            return tabObj.cssClass;
         };
         tabObj.setCssClass = function (cssClass) {
            tabObj.cssClass = cssClass;
         };
         var areas = ['MainArea', 'TabsArea'/*, 'TopArea'*/];
         $ws.helpers.forEach(areas, function(name) {
            var lName = name[0].toLowerCase() + name.slice(1);
            tabObj['set' + name] = function(areaId) {
               tabObj[lName] = areaId;
               if (tabObj.id === self._activeTabId) {
                  if (areaId === '') {
                     self['_' +lName].hide();
                  } else {
                     self['_' +lName].show();
                     self['_' +lName].setActiveArea(areaId);
                     self._setAreaHints(tabObj.id);
                  }
               }
            }
         });
      }

      function _addAreaGettersAndSetters(areaObj, idx, self, areaName) {
         areaObj.content = ''; ////
         areaObj.setId = function (areaId) {
            if (areaName) {
               self['_' + areaName] && self['_' + areaName].getItemById(areaObj.id).setId(areaId);
               // TODO вынести установку опции в редактор, устанавливать опцию в конфигурацию, а не только в _options.
               for (var i = 0; i < self._options.tabs.length; i++) {
                  if (self._options.tabs[i][areaName] === areaObj.id) {
                     self._options.tabs[i][areaName] = areaId;
                  }
               }
               areaObj.id = areaId;
            }
         };
         if (areaName === 'mainArea') {
            areaObj.operationsPanel = areaObj.operationsPanel || {};
            areaObj.searchString = areaObj.searchString || {};
            areaObj.filterController = areaObj.filterController || {};
            areaObj.operationsPanel.setHasControl = function (value) {
               var areaCnt = self._mainArea.getItemById(areaObj.id).getContainer(),
                  cnt = areaCnt.find('.registry__operationsPanel > *').wsControl(),
                  container = areaCnt.find('.registry__operationsPanel');
               if (value) {
                  cnt && cnt.show();
                  container.removeClass('registry__emptyCell');
                  if (!cnt) {
                     $ws.core.attachInstance('SBIS3.CORE.OperationsPanel', {
                        element: $('<div class="registry-field"></div>').appendTo(container)
                     });
                  }
               } else {
                  cnt && cnt.hide();
                  container.addClass('registry__emptyCell');
               }
               areaObj.operationsPanel.hasControl = value;
            };
            areaObj.searchString.setHasControl = function (value) {
               var areaCnt = self._mainArea.getItemById(areaObj.id).getContainer(),
                  cnt = areaCnt.find('.registry__searchString > *').wsControl(),
                  container = areaCnt.find('.registry__searchString');
               if (value) {
                  cnt && cnt.show();
                  container.removeClass('registry__emptyCell');
                  if (!cnt) {
                     $ws.core.attachInstance('SBIS3.CORE.SearchString', {
                        element: $('<div class="registry-field"></div>').appendTo(container)
                     });
                  }
               } else {
                  cnt && cnt.hide();
                  container.addClass('registry__emptyCell');
               }
               areaObj.searchString.hasControl = value;
            };
            areaObj.filterController.setHasControl = function (value) {
               var areaCnt = self._mainArea.getItemById(areaObj.id).getContainer(),
                  cnt = areaCnt.find('.registry__filterController > *').wsControl(),
                  container = areaCnt.find('.registry__filterController');
               if (value) {
                  cnt && cnt.show();
                  container.removeClass('registry__emptyCell');
                  if (!cnt) {
                     $ws.core.attachInstance('SBIS3.CORE.FilterController', {
                        element: $('<div class="registry-field"></div>').appendTo(container)
                     });
                  }
               } else {
                  cnt && cnt.hide();
                  container.addClass('registry__emptyCell');
               }
               areaObj.filterController.hasControl = value;
            };

            areaObj.searchString.setTooltip = function (value) {
               var areaCnt = self._mainArea.getItemById(areaObj.id).getContainer(),
                  cnt = areaCnt.find('.registry__searchString > *').wsControl();
               if (cnt) {
                  cnt.setTooltip(value);
               }
               areaObj.searchString.tooltip = value;
            };

            areaObj.searchString.setClassName = function (value) {
               var areaCnt = self._mainArea.getItemById(areaObj.id).getContainer(),
                  cnt = areaCnt.find('.registry__searchString > *').wsControl(),
                  container;
               if(cnt) {
                  container = cnt.getContainer();
                  container.removeClass(areaObj.searchString.className);
                  container.addClass(value);
               }
               areaObj.searchString.className = value;
            };
         }
      }

      /**
       * @class SBIS3.Engine.Registry.DesignPlugin
       * @extends SBIS3.Engine.Registry
       * @plugin
       */
      Registry.extendPlugin({
         $protected: {
            _options: {
               design: true
            }
         },
         $constructor: function () {
            var self = this;
            this.getContainer().find('.ws-SwitchableArea__item').addClass('genie-Placeholder');
            this._options.tabs[0] && this._setAreaHints(this._options.tabs[0].id);
            this._tabButtons.subscribe('onTabChange', function (event, tabId) {
               self._setAreaHints(tabId);
            });

            this._initAreaOptions(this._options.mainArea, 'mainArea');
            this._initAreaOptions(this._options.tabsArea, 'tabsArea');
            //this._initAreaOptions(this._options.topArea, 'topArea');

            this._initTabsOptions();
         },

         // добавление сеттеров и подписка на события коллекции для опций закладок.
         _initTabsOptions: function () {
            var self = this;
            this._options.tabs = $ws.helpers.collection(this._options.tabs);

            for (var i = 0; i < this._options.tabs.length; i++) {
               if (!this._options.tabs[i].id) {
                  this._options.tabs[i].id = i;
               }
               _addTabGettersAndSetters(this._options.tabs[i], i, this);
            }

            this._options.tabs.subscribe('onInsertItem', function (event, items, indexes) {
               for (var i = 0; i < items.length; i++) {
                  _addTabGettersAndSetters(items[i], indexes[i], self);
               }
               _onInsertItemFunc.apply(self._tabButtons.getTabs(), arguments);
            });

            this._options.tabs.subscribe('onRemoveItem', _onRemoveItemFunc.bind(this._tabButtons.getTabs()));
            this._options.tabs.subscribe('onMove', _onMoveItemFunc.bind(this._tabButtons.getTabs()));
         },

         // добавление сеттеров и другие действия для опций, управляющих переключаемыми областями
         _initAreaOptions: function (area, areaName) {
            var self = this;
            area = $ws.helpers.collection(area);

            for (var idx = 0; idx < area.length; idx++) {
               _addAreaGettersAndSetters(area[idx], idx, this, areaName);
            }

            self._correctAreaDataName(areaName);

            area.subscribe('onInsertItem', function (event, items, indexes) {
               for (var idx = 0; idx < items.length; idx++) {
                  _addAreaGettersAndSetters(items[idx], indexes[idx], self, areaName);
               }

               _onInsertItemFunc.apply(self['_' + areaName].getItems(), arguments);
               self._correctAreaDataName(areaName);
            });

            area.subscribe('onRemoveItem', function (event, items, indexes) {
               _onRemoveItemFunc.apply(self['_' + areaName].getItems(), arguments);
               self._correctAreaDataName(areaName);
            });

            area.subscribe('onMove', function (event, from, to) {
               _onMoveItemFunc.apply(self['_' + areaName].getItems(), arguments);
               self._correctAreaDataName(areaName);
            });
         },

         // проставляет корректные значения data-name в переключаемые области.
         _correctAreaDataName: function (areaName) {
            for (var idx = 0; idx < this._options[areaName].length; idx++) {
               var areaContainer = this['_' + areaName].getAreaContainer(idx);
               if (areaContainer) {
                  if (areaName === 'mainArea') {
                     if (areaContainer.find('>.registry__filtersContent').length === 0) {
                        areaContainer.html(
                           '<div class="registry__filtersContent">' +
                           '   <div class="registry__filtersArea-component registry__filtersArea-tableCell" style="height:40px;"></div>' +
                           '   <div class="registry__filtersArea-component registry__operationsPanel registry__filtersArea-tableCell"></div>' +
                           '   <div class="registry__filtersArea-component registry__searchString registry__filtersArea-tableCell"></div>' +
                           '   <div class="registry__filtersArea-tableCell" style="width: 100%;">' +
                           '      <div class="filtersArea-customWrapper genie-Placeholder genie-dragdrop"></div>' +
                           '   </div>' +
                           '   <div class="registry__filtersArea-component registry__filterController registry__filtersArea-tableCell"></div>' +
                           '</div>' +
                           '<div class="registry__mainContent genie-Placeholder genie-dragdrop"></div>');
                     }
                     areaContainer.find('>.registry__filtersContent .filtersArea-customWrapper.genie-Placeholder').attr('data-name', areaName + '[' + idx + '].filtersContent');
                     areaContainer.find('>.registry__mainContent').attr('data-name', areaName + '[' + idx + '].content');
                     areaContainer.attr('data-name', '');
                     areaContainer.removeClass('genie-Placeholder genie-dragdrop');
                  } else {
                     areaContainer.attr('data-name', areaName + '[' + idx + '].content');
                  }
               }
            }
         },

         _setAreaHints: function (id) {
            for (var i = 0; i < this._options.tabs.length; i++) {
               if (this._options.tabs[i].id === id) {
                  //this._topArea.getContainer().attr('data-content', this._options.tabs[i].topArea || ' ');
                  this._tabsArea.getContainer().parent().attr('data-content', this._options.tabs[i].tabsArea || ' ');
                  this._mainArea.getContainer().find('.registry__mainContent').attr('data-content', this._options.tabs[i].mainArea || ' ');
               }
            }
         },

         destroy: function () {
            this._options.tabs.unbind('onInsertItem');
            this._options.tabs.unbind('onRemoveItem');
            this._options.tabs.unbind('onMove');

            //this._options._topArea.unbind('onInsertItem');
            //this._options._topArea.unbind('onRemoveItem');
            //this._options._topArea.unbind('onMove');

            this._options._tabsArea.unbind('onInsertItem');
            this._options._tabsArea.unbind('onRemoveItem');
            this._options._tabsArea.unbind('onMove');

            this._options._mainArea.unbind('onInsertItem');
            this._options._mainArea.unbind('onRemoveItem');
            this._options._mainArea.unbind('onMove');
         }
      });
   });