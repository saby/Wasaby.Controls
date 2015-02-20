define('js!SBIS3.CORE.TabButtons/design/DesignPlugin',
   [
      'js!SBIS3.CORE.TabButtons'
   ],
   function(){

      $ws.proto.TabButtons.prototype.getTabs = function() {
         return this._options.tabs;
      };

      function _addGettersAndSetters(tabObj, ind, self) {
         tabObj.id  = tabObj.id || ind;
         tabObj.getTitle = function(){
            return tabObj.title;
         };
         tabObj.setTitle = function(title){
            tabObj.title = title;
            self.renameTab(tabObj.id, title);
         };
         tabObj.getId = function(){
            return tabObj.id;
         };
         tabObj.setId = function(id){
            self.setTabId(tabObj.id, id);

         };
         tabObj.getEnabled = function(){
            return tabObj.enabled;
         };
         tabObj.setEnabled = function(enabled){
            tabObj.enabled = enabled;
            self.setTabEnabled(tabObj.id, enabled);
         };
         tabObj.getVisible = function(){
            return tabObj.visible;
         };
         tabObj.setVisible = function(visible){
            tabObj.visible = visible;
            self.setTabVisible(tabObj.id, visible);
         };
         tabObj.getIcon = function(){
            return tabObj.icon;
         };
         tabObj.setIcon = function(icon){
            tabObj.icon = icon;
            self.setTabIcon(tabObj.id, icon);
         };
         tabObj.getAlign = function(){
            return tabObj.align;
         };
         tabObj.setAlign = function(align){
            tabObj.align = align;
            self.setTabAlignment(tabObj.id, align);
         };
         tabObj.getCssClass = function(){
            return tabObj.cssClass;
         };
         tabObj.setCssClass = function(cssClass){
            tabObj.cssClass = cssClass;
         };
         tabObj.setEditable = function (editable) {
            var id = tabObj.id,
               tabIndex = self.getTabIndexById(id),
               tab = self._options.tabs[tabIndex],
               tabButton = self.getTabButton(id);
            if(tab.editable === editable) {
               return;
            }

            tab.editable = editable;

            if (editable) {
               tabButton.find('.ws-TabButtons__editor').removeClass('ws-hidden');
               tabButton.find('.ws-TabButtons__buttonTitle').addClass('ws-hidden');
               if (!self._tabEditors[id]) { // включаем редактирование в первый раз, нужна инициализация
                  tab.content = '';
                  self._processEditableTabButton(tab);
               }
            } else {
               tabButton.find('.ws-TabButtons__buttonTitle').removeClass('ws-hidden');
               tabButton.find('.ws-TabButtons__editor').addClass('ws-hidden');
            }
         };
      }

      function _onInsertItemFunc(event, items, indexes) {
         var tabsCollection = this.getTabs();
         for (var i = 0; i < items.length; i++) {
            items[i] = items[i] || {};

            // генерим ID для вкладки, если у неё ещё нет
            if (!items[i].id) {
               var tabId = 'tab-' + indexes[i];
               for (var j = 0; j < tabsCollection.length; j++) {
                  var curTabId = tabsCollection[j].id;
                  if (tabId === curTabId) {
                     tabId = $ws.helpers.randomId('tab-');
                     break;
                  }
               }
               items[i].id = tabId;
            }

            var tabObj = $ws.core.clone(items[i]);
            _addGettersAndSetters(items[i], indexes[i], this);

            if (indexes[i] >= tabsCollection.length - 1)
               this.prependTab(tabObj);
            else
               this.insertTabAfter(tabObj, tabsCollection[indexes[i] + 1].getId());
         }
      }
      function _onRemoveItemFunc(event, items, indexes) {
         for (var i = 0; i < items.length; i++) {
            this.removeTab(items[i].id);
         }
      }
      function _onMoveItemFunc(event, indexFrom, indexTo) {
         this._rebuildTabs();
      }

      /**
       * @class $ws.proto.TabButtons.DesignPlugin
       * @extends $ws.proto.TabButtons
       * @plugin
       */
      $ws.proto.TabButtons.DesignPlugin = $ws.proto.TabButtons.extendPlugin({
         $constructor: function(){
            var self = this;

            this._options.tabs = $ws.helpers.collection(this._options.tabs);
            for (var i = 0; i < this._options.tabs.length; i++) {
               if (!this._options.tabs[i].id) {
                  this._options.tabs[i].id = i;
               }
               _addGettersAndSetters(this._options.tabs[i], i, self);
            }

            this.getTabs().subscribe("onInsertItem", _onInsertItemFunc.bind(self));
            this.getTabs().subscribe("onRemoveItem", _onRemoveItemFunc.bind(self));
            this.getTabs().subscribe("onMove", _onMoveItemFunc.bind(self));
         },

         /**
          * Обработка заголовка закладки в режиме редактирования по месту
          * @param tab {Object} конфигурация заголовка закладки
          * @private
          */
         _processEditableTabButton: function (tab) {
            var self = this,
               tabButton = this.getTabButton(tab.id),
               tabIndex = self.getTabIndexById(tab.id);
            // Предполагается, что область быстрого редактирования создалась синхронно и контролы внутри неё готовы.
            tabButton.find('.ws-FieldEditAtPlace .ws-FieldEditAtPlace__placeholder').attr({
               'data-name': 'tabs[' + tabIndex + '].content'
            }).addClass('genie-dragdrop');
         },

         registerChildControl: function (inst, areaName) {// areaName looks like tabs[%d].content
            if (areaName && areaName.indexOf('tabs[') !== -1) {
               var tabIndex = areaName.match(/tabs\[(.*)\]/)[1]; // get index
               if (tabIndex && this._options.tabs[tabIndex]) {
                  var tab = this._options.tabs[tabIndex];
                  if (!this._tabEditors[tab.id]) {
                     tab.content = '';
                     this._processEditableTabButton(tab);
                  }
                  this.unregisterChildControl(inst);
                  inst._parent = this._tabEditors[tab.id];
                  this._tabEditors[tab.id].registerChildControl(inst);
               }
            }
         },

         getTabIndexById: function(id) {
            var tabCollection = this._options.tabs;
            for (var i = 0; i < tabCollection.length; i++) {
               if (tabCollection[i].id === id)
                  return i;
            }
            return id;
         },

         /**
          * Ф-ция расширена, чтобы при установке id в TabControl-е можно было вызвать setTabId() у TabButtons
          */
         setTabId: function(oldId, newId){
            var tabs = this.getTabs(),
               index = this.getTabIndexById(oldId);
            if(tabs[index]) {
               tabs[index].id = newId;
            }
         }
      });
   }
);