define('js!SBIS3.CORE.TabControl/design/DesignPlugin',
   [
      'js!SBIS3.CORE.TabControl',
      'js!SBIS3.CORE.TabControl/TabItem',
      'js!SBIS3.CORE.TabButtons/design/DesignPlugin',
      'css!SBIS3.CORE.TabControl/design/DesignPlugin'
   ],
   function(TabControl, TabItem){
   /**
    * @class $ws.proto.TabControl.DesignPlugin
    * @extends $ws.proto.TabControl
    * @plugin
    */
   $ws.proto.TabControl.DesignPlugin = TabControl.extendPlugin({
      $constructor: function(){
         this.getContainer().find('.ws-SwitchableArea__item').addClass('genie-Placeholder');
         var self = this,
            items = this.getItems();
         items.subscribe('onInsertItem', this._onInsertItemFunc.bind(self));
         items.subscribe('onRemoveItem', this._onRemoveItemFunc.bind(self));
         items.subscribe('onMove', this._onMoveItemFunc.bind(self));

         for (var i = 0; i < items.length; i++) {
            this._addGettersAndSetters(items[i], i);
         }
      },

      // возвращает имя плейсхолдера для вставки компонента по умолчанию (при копипасте компонентов)
      getActiveContentAreaName: function() {
         return this._switchableArea.getContainer().children('.ws-SwitchableArea__item:not(.ws-hidden)').attr('data-name');
      },
      setAlign :function(align) {
         this._options.align = align;
         var tabCollection = this.getItems();
         for (var i = 0 ; i < tabCollection.length; i++) {
            tabCollection[i].setAlign(align);
         }
      },

      genieHandlerAfterCreation : function() {

         // в джине контент закладок прогружается в начале. при клике на вкладку его не нужно перегружать
         var self = this,
            setTabsLoaded = function(){
               var tabCollection = self.getItems();
               for (var i = 0; i < tabCollection.length; i++) {
                  tabCollection[i].setLoaded(true);
               }
            };

         /**
          * нам надо отловить ситуацию, когда готов контрол закладок
          * по непонятным причинам функция genieHandlerAfterCreation иногда выполнятеся до события onReady закладок, а иногда после
          * поэтому вставлена проверка. Если закладки готовы, то выполняем действия сразу. Иначе подписываемся на onReady
          */
         if (this._isReady){
            setTabsLoaded();
         }
         else {
            this.subscribe('onReady', function(){
               setTabsLoaded();
            });
         }
      },

      _correctDivIndexes: function() {
         var tabCollection = this.getItems();
         for (var i = 0, l = tabCollection.length; i < l; i++){
            tabCollection[i].getTabSheet().attr('data-name', 'items[' + i + '].content');
         }
      },

      _addGettersAndSetters: function(tabObj, ind) {
         var self = this;
         tabObj.setEditable = function (value) {
            tabObj._options.editable = value;
            self._tabButtons.getTabs()[ind].setEditable(value);
         };
         tabObj.getEditable = function () {
            return tabObj._options.editable;
         };
      },

      _onInsertItemFunc: function(event, items, indexes) {
         for (var i = 0; i < items.length; i++) {
            if (!items[i].id){
               items[i].id = $ws.helpers.randomId('tab-' + indexes[i] + '-');
            }
            this._tabButtons._options.tabs.splice(indexes[i], 0, items[i]);
            this._switchableArea.addArea(items[i].id);
            // если вставили не в конец, то переместим область, чтобы все области шли по порядку в вёрстке
            if (indexes[i] < this.getItems().length - 1){
               this._switchableArea.getItems().move(this._switchableArea.getItems().length - 1, indexes[i]);
            }

            var tabItem = this.getItems()[indexes[i]];
            if (!(tabItem instanceof TabItem)) {
               tabItem = this.getItems()[indexes[i]] = new TabItem($ws.core.clone(tabItem));
            }
            tabItem.subscribe('onOptionChanged', this._optionChangedHandler.bind(this));

            this._buildTab(tabItem);
            tabItem.getTabSheet().addClass('genie-dragdrop genie-Placeholder');
            if (indexes[i] <= this._currentTab){
               this._setCurrentTabContent(this._currentTab + 1);
            }
            this._updateTabs();

            this._correctDivIndexes();
            this._addGettersAndSetters(tabItem, indexes[i]);
         }
      },
      _onRemoveItemFunc: function(event, items, indexes) {
         for (var i = 0; i < items.length; i++) {
            this._tabButtons._options.tabs.splice(indexes[i], 1);
            this._tabButtons.removeTab(items[i].getId());
            this._switchableArea.removeArea(items[i].getId());

            if (this._currentTab === indexes[i]){
               this._currentTab = null;
            }
            else if (indexes[i] < this._currentTab){
               this._setCurrentTabContent(this._currentTab - 1);
            }
            this._updateTabs();

            this._correctDivIndexes();
         }
      },
      _onMoveItemFunc: function(event, indexFrom, indexTo) {
         this._tabButtons._options.tabs.move(indexFrom, indexTo);

         var indexToCorrected = indexTo > indexFrom ? indexTo + 1 : indexTo,
            areaContainer = this._switchableArea.getContainer(),
            bodyFrom = areaContainer.children('.ws-SwitchableArea__item').eq(indexFrom),
            bodyTo = areaContainer.children('.ws-SwitchableArea__item').eq(indexToCorrected);
         //Положение дива роли не играет, но удобней в FireBug видеть кнопки и дивы в одном порядке.
         if (indexTo >= this.getItems().length - 1) {
            areaContainer.append(bodyFrom);
         } else {
            bodyFrom.insertBefore(bodyTo);
         }

         if (indexFrom === this._currentTab){
            this._setCurrentTabContent(indexTo);
         }
         else if (indexFrom < this._currentTab && indexTo >= this._currentTab){
            this._setCurrentTabContent(this._currentTab - 1);
         }
         else if (indexFrom > this._currentTab && indexTo <= this._currentTab){
            this._setCurrentTabContent(this._currentTab + 1);
         }
         this._updateTabs();

         this._correctDivIndexes();
      }
   });
});