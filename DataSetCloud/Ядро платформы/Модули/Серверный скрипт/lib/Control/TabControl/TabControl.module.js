define('js!SBIS3.CORE.TabControl',
   [
      'js!SBIS3.CORE.CompoundControl',
      'js!SBIS3.CORE.TabControl/TabItem',
      'html!SBIS3.CORE.TabControl',
      'js!SBIS3.CORE.TabButtons',
      'js!SBIS3.CORE.SwitchableArea',
      'css!SBIS3.CORE.TabControl'
   ],
   function( CompoundControl, TabItem, dotTplFn ) {
   'use strict';

   /**
    * Закладки.
    * TabControl является композицией двух контролов TabButtons и SwitchableArea.
    * <wiTag page=2>
    * @class $ws.proto.TabControl
    * @extends $ws.proto.CompoundControl
    * @control
    * @category Containers
    * @initial
    * <component data-component='SBIS3.CORE.TabControl'>
    *    <options name='items' type='array'>
    *       <options>
    *          <option name='title' value='Вкладка 1'></option>
    *       </options>
    *       <options>
    *          <option name='title' value='Вкладка 2'></option>
    *       </options>
    *       <options>
    *          <option name='title' value='Вкладка 3'></option>
    *       </options>
    *    </options>
    * </component>
    * @designTime actions /design/design
    * @designTime plugin /design/DesignPlugin
    * @icon tabsIcon.png
    */
   $ws.proto.TabControl = CompoundControl.extend(/** @lends $ws.proto.TabControl.prototype */{
      /**
       * @event onBeforeShowFirstTab Выбор активной закладки
       * Происходит перед показом закладок, может быть использовано для смены закладки, открытой первой.
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       * @param {String} id Идентификатор закладки, с которой нужно открыть контрол.
       * @return {String} Можно заменить пришедший в аргумент идентификатор на другой, и активировать нужную закладку.
       * Если вернуть '', то активной будет закладка, либо указанная в опции {@link defaultTab}, либо первая при незаполненной опции.
       * @example
       * <pre>
       *     var doc = this.getDocument();
       *     tabs.subscribe('onBeforeShowFirstTab', function(event) {
       *        if (doc.hasRecords()) {
       *           event.setResult('recordList');
       *        } else {
       *           event.setResult('people');
       *        }
       *     });
       * </pre>
       * @see onTabChange
       * @see defaultTab
       */
      /**
       * @event onTabChange При клике на блок с закладками
       * Событие срабатывает по смене закладки (в том числе и при загрузке первой).
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       * @param {String} id Идентификатор закладки.
       * @example
       * При открытой закладке "Расчётные счета" скрыть тулбар, иначе показать.
       * <pre>
       * var paymentsToolbar =  this.getTopParent ().getChildControlByName ('PaymentsToolbar');
       * this.getChildControlByName ('BankTabControl').subscribe ('onTabChange', function (event, value) {
       *     if (value === 'Расчетные счета'){
       *        paymentsToolbar.hide ();
       *     }
       *     else {
       *        paymentsToolbar.show ();
       *     }
       *  });
       * </pre>
       * @see onBeforeShowFirstTab
       */
      _dotTplFn  : dotTplFn,
      $protected: {
         _options: {
            /**
             * @cfg {TabItem[]} Массив с закладками
             * <wiTag group="Данные">
             * @example
             * <pre>
             *    <options name="items" type="array">
             *       <options>
             *          // содержимое для отображения внутри закладки - на листе
             *          <option name="content"><div class="demoCode-tabs">Корпуса</div></option>
             *          // содержимое для отображения в корешке закладки
             *          <option name="tabContent">
             *             <component data-component="SBIS3.CORE.FieldString" style="width: 150px;" name="Корпуса">
             *                 //задаём текст начального значения
             *                <option name="value">Корпуса</option>
             *                <option name="tabindex">1</option>
             *             </component>
             *          </option>
             *          //задаём положение корешка закладки слева - по умолчанию корешки справа
             *          <option name="align">left</option>
             *          // идентификатор для внутреннего использования - к этой вкладке можно обращаться по нему
             *          // идентификатор для внутреннего использования - к этой вкладке можно обращаться по нему
             *          <option name="id">Корпуса</option>
             *          // разрешаем редактирование по месту корешка закладки, шаблон редактирования задаётся в tabContent
             *          <option name="editable">true</option>
             *       </options>
             *       <options>
             *          // задаём текст корешка закладки
             *          <option name="title">Процессоры</option>
             *          <option name="content"><div class="demoCode-tabs">Процессоры</div></option>
             *          <option name="id">Процессоры</option>
             *          // путь к иконке
             *          <option name="icon">sprite:icon-16 icon-sprite:icon-16 icon-Truck icon-primary icon-primary</option>
             *       </options>
             *    </options>
             * </pre>
             * @see getItems
             */
            items : [],
            /**
             * @cfg {Boolean} Загружать ли содержимое всех закладок при построении контрола
             * <wiTag group="Данные">
             * Возможные значения:
             * <ul>
             *    <li>true  - содержимое всех закладок будет подгружаться при создании контрола;</li>
             *    <li>false - содержимое закладки подгружается при первом клике по ней.</li>
             * </ul>
             * @example
             * <pre>
             *     //задаём подгрузку всего содержимого закладок при построении контрола
             *     <option name="instantLoad">true</option>
             * </pre>
             */
            instantLoad : false,
            /**
             * @cfg {String} Идентификатор закладки по умолчанию
             * <wiTag group="Данные">
             * Идентификатор закладки, которая будет активирована при инициализации контрола.
             * При незаполненной опции контрол откроется с активной первой закладкой.
             * @example
             * <pre>
             *     //задаём открытие контрола с закладки "Корпуса"
             *     <option name="defaultTab">Корпуса</option>
             * </pre>
             * @see onBeforeShowFirstTab
             */
            defaultTab: ''
         },
         _body : undefined,       // jQuery-объект с ссылкой на блок, в котором лежат листы с содержимым вкладок
         _currentTab : undefined, // Индекс текущей вкладки
         _defaultTabIndex: 0,     // Индекс вкладки по-умолчанию. Её мы можем поменять с помощью setCurrentTab до построения табов
                                  // Это число - индекс в коллекции _options.items
         _tabButtons: null,       // ссылка на вложенный контрол "Корешки закладок"
         _switchableArea: null    // ссылка на вложенный контрол "Переключаемые области",
      },

      $constructor: function() {
         this._publish('onReady', 'onTabChange', 'onBeforeShowFirstTab');

         // конвертируем элементы массива items в коллекцию TabItem-ов
         for (var i = 0; i < this._options.items.length; i++) {
            this._options.items[i] = new TabItem(this._options.items[i]);
            this._options.items[i].subscribe('onOptionChanged', this._optionChangedHandler.bind(this));
         }
         this._options.items = $ws.helpers.collection(this._options.items);

         if (this._options.defaultTab) {
            this._defaultTabIndex = this._getTabIndexById(this._options.defaultTab) || 0;
         }

         var self = this;

         this.once('onInit', function(){
            self._tabButtons = this.getChildControlByName('tab-buttons');
            self._switchableArea = this.getChildControlByName('tabs-switchableArea');
            //self._tabButtons = tabButtons;
            var tabId = self._notify('onBeforeShowFirstTab', self._options.defaultTab);
            if (typeof tabId === 'string') {
               if (tabId === '') {
                  tabId = self._options.defaultTab = '';
               }
            } else {
               tabId = self._options.defaultTab === '' ? self._getFirstAvailableTab() : self._options.defaultTab;
            }
            self._tabButtons.setCurrentTab(tabId, true);
            self._tabButtons.setDefaultTab(self._tabButtons.getCurrentTab(tabId));
            for (var i = 0, l = self._options.items.length; i < l; i++) {
               var buttonContainer = self._tabButtons.getTabButton(self._options.items[i].getId());
               self._options.items[i].setHeadContainer(buttonContainer);
            }
            var block = $('.ws-tabControl', this.getContainer().get(0));
            block.get(0).onscroll = function() { block.scrollTop(0).scrollLeft(0); };
            this._container.get(0).onscroll = function() { self._container.scrollTop(0).scrollLeft(0); };

            this._body = $('.ws-tabControl-body', this.getContainer().get(0));

            this._options.defaultTab = this._tabButtons.getDefaultTab();
            this._defaultTabIndex = this._getTabIndexById(this._options.defaultTab);
            this._build();
            this._notify('onTabChange', this._options.defaultTab, '');

            // Подписка на событие клика на корешок вкладки
            this._tabButtons.subscribe('onTabChange', function(event, tabId, currentId) {
               self._isControlActive = true;
               var ind = self._getTabIndexById(tabId);
               self._setCurrentTabContent(ind);
               self._notify('onTabChange', tabId, currentId);
            });

            this._container.scrollTop(0).scrollLeft(0);
         }.bind(this));
      },

      init: function() {
         $ws.proto.TabControl.superclass.init.apply(this, arguments);
      },

      /**
       * Обработчик, подписанный на изменение опции в элементе закладок
       * @param {Event} e - событие
       * @param {String} tabId - Id закладки
       * @param {String} optionName - имя изменяемой опции
       * @param {String} value - новое значение опции
       * @private
       */
      _optionChangedHandler: function(e, tabId, optionName, value){
         /* jshint maxcomplexity:11 */
         switch (optionName) {
            case 'title':
               this._tabButtons.renameTab(tabId, value);
               break;
            case 'id':
               this._tabButtons.setTabId(tabId, value);
               this._switchableArea.getItemById(tabId).setId(value);
               break;
            case 'icon':
               this._tabButtons.setTabIcon(tabId, value);
               break;
            case 'enabled':
               this._updateTabs();
               if (!value) {
                  this._tabButtons.disableTab(tabId);
                  this._switchableArea.getItemById(tabId).setEnabled(false);
               }
               else {
                  this._tabButtons.enableTab(tabId);
                  this._switchableArea.getItemById(tabId).setEnabled(true);
               }
               break;
            case 'visible':
               // если скрываем, то скрываем и корешок и область, если же показываем, то только корешок
               if (!value) {
                  if(this._currentId === tabId){
                     this._currentId = null;
                  }
                  this._tabButtons.hideTab(tabId);
                  this._switchableArea.getItemById(tabId).setVisible(value);
               }
               else {
                  this._tabButtons.showTab(tabId);
               }
               this._updateTabs();
               break;
            case 'align':
               this._tabButtons.setTabAlignment(tabId, value);
               break;
            case 'content':
               this._switchableArea.getItemById(tabId).setContent(value);
               break;
         }
      },

      /**
       * <wiTag group="Данные">
       * Возвращает массив с закладками.
       * @return {$ws.helpers.collection} Коллекция элементов TabItem, содержащих информацию о закладке.
       * @see items
       */
      getItems: function() {
         return this._options.items;
      },

      /**
       * <wiTag group="Данные">
       * Получает область закладки по идентификатору.
       * @param {String} id Идентификатор закладки.
       * @returns {SwitchableAreaItem} Элемент области из переключаемых областей внутри закладок.
       * @example
       * <pre>
       *     floatArea.subscribe('onBeforeShow', function() {
       *        var tabControl = floatArea.getChildControlByName('testTabControl');
       *        //Если документ проведен, то:
       *        if (documentPassed) {
       *           //Отключаем поле с описанием документа
       *           tabControl.getTabArea(tabControl.getCurrentId()).getChildControlByName('ОписаниеДокумента').setEnabled(false);
       *        } else {
       *           //Включаем поле с описанием документа
       *           tabControl.getTabArea(tabControl.getCurrentId()).getChildControlByName('ОписаниеДокумента').setEnabled(true);
       *        }
       *     });
       * </pre>
       */
      getTabArea: function(id){
         return this._switchableArea.getItemById(id);
      },

      /**
       * Возвращает индекс закладки в коллекции по Id этой закладки
       * @param {String} id Идентификатор закладки
       * @return {Number|null} индекс закладки в коллекции items
       */
      _getTabIndexById: function(id) {
         var tabCollection = this.getItems();
         for (var i = 0; i < tabCollection.length; i++) {
            if (tabCollection[i].getId() === id){
               return i;
            }
         }
         return null;
      },

      /**
       * <wiTag noShow>
       * @noShow
       */
      applyState : function(id){
         this.setCurrentTab(id);
      },

      /**
       * Возвращает полный id блока по короткому
       * @private
       * @param {String} id
       * @returns {String}
       */
      _getBlockId : function(id){
         return 'ws-tabControl-' + this.getId() + '-' + id;
      },

      /**
       * <wiTag group="Управление">
       * Установка текущей вкладки по идентификатору.
       * Происходит смена закладки в корешках, от контрола TabButtons идёт {@link $ws.proto.TabButtons#onTabChange событие}, на которое подписан данный компонент закладок.
       * @param {String} id Идентификатор закладки.
       * @example
       * <pre>
       *     floatArea.subscribe('onBeforeShow', function() {
       *        var
       *           tabControl = floatArea.getChildControlByName('testTabControl');
       *        //устанавливаем текущей закладку с идентификатором "Корпуса"
       *        tabControl.setCurrentTab('Корпуса');
       *        }
       *     });
       * </pre>
       * @see getCurrentId
       * @see onTabChange
       */
      setCurrentTab : function(id){
         this._tabButtons.setCurrentTab(id || '');
      },

      /**
       * Установка контента для текущей вкладки по индексу вкладки
       * @param {Number} index Индекс вкладки
       */
      _setCurrentTabContent : function(index){
         var newTab = this.getItems()[index];
         if(this._currentTab == index || !newTab || !newTab.getEnabled()){
            return;
         }

         this._body.scrollTop(0).scrollLeft(0);

         this._switchableArea.setActiveArea(newTab.getId());
         this._currentTab = index;
         this.setActive(true, false);
      },

      _getFirstAvailableTab: function() {
         var tabId;
         $.each(this.getItems(), function(pos, tab) {
            if (tab.getEnabled() && tab.getVisible()) {
               tabId = tab.getId();
               return false;
            };
         });
         return tabId;
      },

      /**
       * Строит закладки
       * @private
       */
      _build : function() {
         var tabCollection = this.getItems(),
            len = tabCollection.length,
            i;

         var tab = tabCollection[this._defaultTabIndex];
         for (i = 0; i < len; i++){
            this._buildTab(tabCollection[i]);
         }
         //если активная по умолчанию вкладка не доступна
         if (tab && (!tab.getEnabled() || !tab.getVisible())){
            for (i = 1; i <= len; i++){
               var index = (this._defaultTabIndex + i) % tabCollection.length;
               if (tabCollection[index].getEnabled() && tabCollection[index].getVisible()){
                  this._defaultTabIndex = index;
                  break;
               }
            }
         }

         this._setCurrentTabContent(this._defaultTabIndex);
      },

      /**
       * Строит один таб
       * @param {Object}   tabItem  Объект с информацией о вкладке
       * @returns {String} Идентификатор получившейся вкладки
       */
      _buildTab: function(tabItem) {
         var self = this,
            tabId = tabItem.getId();

         if (!tabItem.getTabSheet()) {
            var areaContainer = self._switchableArea.getItemById(tabId).getContainer();
            areaContainer.attr('id', self._getBlockId(tabId));
            tabItem.setTabSheet(areaContainer);
         }

         return tabId;
      },

      setActive: function(active, isShiftKey) {
         this._isControlActive = active;
         if(this._currentTab !== undefined) {
            var childControls = this._getCurrentChildControls();
            if (active && !this.detectNextActiveChildControl(isShiftKey, isShiftKey ? childControls.length : -1)) {
               this._moveFocusToSelf();
            }
         }
      },
      _getCurrentChildControls: function () {
         var result = [];
         if (this._currentTab !== undefined) {
            result.push(this._tabButtons);
            var item = this.getItems()[this._currentTab];
            if (item) {
               result.push(this._switchableArea.getItemById(item.getId()));
            }
         }
         return result;
      },
      /**
       * <wiTag group="Управление">
       * Находит следующий активный контрол в зависимости от выбранной закладки
       * @param isShiftKey Направление перехода фокуса - при нажатой клавиши Shift происходит обратный порядок.
       * @param searchFrom Tabindex контрола, с которого следует искать следующий активный.
       * @returns {Boolean} Результат поиска и перемещения фокуса. Возможные значения:
       * <ol>
       *    <li>true - следующий/предыдущий дочерний контрол найден и на него переведён фокус.</li>
       *    <li>false - следующий/предыдущий дочерний контрол не найден или он не может принимать фокус. Фокус остаётся в прежней позиции.</li>
       * </ol>
       * @example
       * При нажатии клавиши "n" перевести фокус на следующий дочерний контрол, который является полем ввода.
       * <pre>
       *    var tabIndex = 0;
       *    control.subscribe('onKeyPressed', function(eventObject, event) {
       *       if (event.which == $ws._const.key.n) {
       *          this.detectNextActiveChildControl(false, tabIndex);
       *       }
       *    });
       * </pre>
       */
      detectNextActiveChildControl: function(isShiftKey, searchFrom) {
         var act = searchFrom,
            childControls = this._getCurrentChildControls(),
            controlCount = childControls.length,
            curr,
            res = true,
            delta = isShiftKey ? -1 : 1;
         if(act === undefined) {
            for (var n = 0; n < controlCount; n++) {
               if (childControls[n] && childControls[n].getTabindex() == this._activeChildControl) {
                  act = n;
                  break;
               }
            }
         }
         if (act === undefined) {
            act = isShiftKey ? childControls.length : -1;
         }
         curr = act + delta;
         while (curr >= 0 && curr < controlCount) {
            if (childControls[curr] && childControls[curr].canAcceptFocus()) {
               break;
            }
            curr += delta;
         }
         if (curr >= 0 && curr < controlCount) {
            childControls[curr].setActive(true, isShiftKey);
         } else {
            res = false;
         }
         return res;
      },

      /**
       * <wiTag group="Данные">
       * Возвращает страницу текущей закладки.
       * @returns {jQuery} jQuery-объект, ссылающийся на область текущей закладки.
       * @example
       * <pre>
       *     floatArea.subscribe('onBeforeShow', function() {
       *        var
       *           tabControl = floatArea.getChildControlByName('testTabControl'),
       *           currentTab = tabControl.getCurrentTab();
       *        //Если документ проведен, то:
       *        if (documentPassed) {
       *           //Скрыть картинку, отображающую новый документ
       *           currentTab.find('.document-no-passed').hide();
       *        } else {
       *           //Показать картинку, отображающую новый документ
       *           currentTab.find('.document-no-passed').show();
       *        }
       *     });
       * </pre>
       * @see setCurrentTab
       */
      getCurrentTab : function(){
         return this.getItems()[this._currentTab] ? this.getItems()[this._currentTab].getTabSheet() : null;
      },

      /**
       * <wiTag group="Данные">
       * Возвращает идентификатор текущей закладки.
       * @returns {String} id Идентификатор текущей закладки.
       * @example
       * <pre>
       *     floatArea.subscribe('onBeforeShow', function() {
       *        var
       *           tabControl = floatArea.getChildControlByName('testTabControl'),
       *           currentTabId = tabControl.getCurrentId();
       *        //Если документ проведен, то:
       *        if (documentPassed) {
       *           //Сменим иконку у текущей закладки
       *           tabControl.setTabIcon(currentTabId, 'sprite:icon-16 icon-Groups icon-primary');
       *        } else {
       *           //Сменим иконку у текущей закладки
       *           tabControl.setTabIcon(currentTabId, 'sprite:icon-16 icon-Sent icon-primary');
       *        }
       *     });
       * </pre>
       */
      getCurrentId : function(){
         return this.getItems()[this._currentTab] ? this.getItems()[this._currentTab].getId() : '';
      },

      /**
       * Обновляет текущую вкладку - её могли удалить, скрыть, и т.д.
       */
      _updateTabs: function() {
         var tabCollection = this.getItems();
         if (this._currentTab === null ||
            !tabCollection[this._currentTab] ||
            !tabCollection[this._currentTab].getVisible() ||
            !tabCollection[this._currentTab].getEnabled())
         {
            for (var i = 0, l = tabCollection.length; i < l; i++) {
               if(tabCollection[i].getVisible() && tabCollection[i].getEnabled()){
                  this.setCurrentTab(tabCollection[i].getId());
                  return;
               }
            }
            this.setCurrentTab();
         }
      },

      /**
       * <wiTag group="Данные">
       * Возвращает идентификатор закладки по контролу, который лежит внутри неё.
       * В случае неуспешного поиска возвращает  undefined.
       * @param {$ws.proto.Control} control Дочерний контрол.
       * @return {Number|undefined} Идентификатор закладки.
       * @example
       * <pre>
       *     floatArea.subscribe('onBeforeShow', function() {
       *        var
       *           tabControl = floatArea.getChildControlByName('testTabControl'),
       *           //Находим ID закладки с контролом "Приложение"
       *           tabWithAttachment = tabControl.getTabIndexByControl(documentAttachment);
       *        //Если документ проведен, то:
       *        if (documentPassed) {
       *           //Отключим закладку с котролом "Приложение"
       *           tabControl.disableTab(tabWithAttachment);
       *        } else {
       *           //Включим закладку с котролом "Приложение"
       *           tabControl.enableTab(tabWithAttachment);
       *        }
       *     });
       * </pre>
       */
      getTabIndexByControl: function(control){
         var closestArea = control.getContainer().closest('.ws-SwitchableArea__item'),
            index;
         if (closestArea.length){
            var closestAreaId = closestArea.data('for');
            index = this._getTabIndexById(closestAreaId);
         }
         return index;
      },

      /**
       * <wiTag group="Данные">
       * <a href='http://wi.sbis.ru/dokuwiki/doku.php/api:validator'>Валидация</a> контролов в закладках.
       * !Важно: если значение контрола на какой-либо закладке не проходит валидацию, то произойдёт переключение на эту закладку.
       * @return {Boolean} Результат валидации.
       * Возможные значения:
       * <ol>
       *    <li>true - валидация пройдена успешно.</li>
       *    <li>false - ошибка при прохождении валидации.</li>
       * </ol>
       */
      validate: function(){
         // корешки закладок сами переключат на невалидную вкладку
         var validateTabButtonsResult = this._tabButtons.validate();

         // результат - Id невалидной области, либо undefined, если всё валидно
         var switchableAreaInvalidAreaId = this._switchableArea.validateAreas();
         if (switchableAreaInvalidAreaId !== undefined){
            this.setCurrentTab(switchableAreaInvalidAreaId);
            this._moveFailValidatedToFocus();
         }

         return validateTabButtonsResult && (switchableAreaInvalidAreaId === undefined);
      },

      /**
       * <wiTag group="Отображение">
       * Скрывает закладку по переданному идентификатору.
       * Скрывается корешок закладки, если скрываемая закладка активна в данный момент, то идёт переключение на другую закладку.
       * @param {String} tabId Идентификатор закладки, которую нужно скрыть.
       * @example
       * <pre>
       *     floatArea.subscribe('onBeforeShow', function() {
       *        var tabControl = floatArea.getChildControlByName('testTabControl');
       *        //Если документ проведен, то:
       *        if (documentPassed) {
       *           //Покажем закладку "Корпуса"
       *           tabControl.showTab('Корпуса');
       *        } else {
       *           //Скроем закладку "Корпуса"
       *           tabControl.hideTab('Корпуса');
       *        }
       *     });
       * </pre>
       * @see showTab
       */
      hideTab: function(tabId){
         var tabIndex = this._getTabIndexById(tabId);
         if (tabIndex !== null){
            this.getItems()[tabIndex].setVisible(false);
         }
      },
      /**
       * <wiTag group="Отображение">
       * Показывает закладку по переданному идентификатору. Показывает корешок закладки.
       * @param {String} tabId - идентификатор закладки, которую нужно показать.
       * @example
       * <pre>
       *     floatArea.subscribe('onBeforeShow', function() {
       *        var tabControl = floatArea.getChildControlByName('testTabControl');
       *        //Если документ проведен, то:
       *        if (documentPassed) {
       *           //Покажем закладку "Корпуса"
       *           tabControl.showTab('Корпуса');
       *        } else {
       *           //Скроем закладку "Корпуса"
       *           tabControl.hideTab('Корпуса');
       *        }
       *     });
       * </pre>
       * @see hideTab
       */
      showTab: function(tabId){
         var tabIndex = this._getTabIndexById(tabId);
         if (tabIndex !== null){
            this.getItems()[tabIndex].setVisible(true);
         }
      },
      /**
       * <wiTag group="Отображение">
       * Меняет текст заголовка закладки.
       * @param {String} tabId Идентификатор закладки.
       * @param {String} title Новый текст заголовка.
       * @example
       * <pre>
       *     floatArea.subscribe('onBeforeShow', function() {
       *        var tabControl = floatArea.getChildControlByName('testTabControl');
       *        //Если документ проведен, то:
       *        if (documentPassed) {
       *           //Переименуем закладку "Получатели"
       *           tabControl.renameTab('Recipients', 'Получившие документ');
       *        } else {
       *           tabControl.renameTab('Recipients', 'Получатели документа');
       *        }
       *     });
       * </pre>
       * @see items
       * @see getItems
       */
      renameTab: function(tabId, title){
         var tabIndex = this._getTabIndexById(tabId);
         if (tabIndex !== null){
            this.getItems()[tabIndex].setTitle(title);
         }
      },
      /**
       * <wiTag group="Отображение">
       * Меняет иконку в корешке закладки.
       * @param {String} tabId Идентификатор закладки.
       * @param {String} icon Новый путь до иконки.
       * @example
       * <pre>
       *     floatArea.subscribe('onBeforeShow', function() {
       *        var tabControl = floatArea.getChildControlByName('testTabControl');
       *        //Если документ проведен, то:
       *        if (documentPassed) {
       *           //Сменим иконку у текущей закладки
       *           tabControl.setTabIcon(currentTabId, 'sprite:icon-16 icon-Groups icon-primary');
       *        } else {
       *           //Сменим иконку у текущей закладки
       *           tabControl.setTabIcon(currentTabId, 'sprite:icon-16 icon-Sent icon-primary');
       *        }
       *     });
       * </pre>
       * @see items
       * @see getItems
       */
      setTabIcon: function(tabId, icon){
         var tabIndex = this._getTabIndexById(tabId);
         if (tabIndex !== null){
            this.getItems()[tabIndex].setIcon(icon);
         }
      },
      /**
       * <wiTag group="Отображение">
       * Меняет позиционирование корешка закладки относительно границ контейнера контрола.
       * @param {String} tabId Идентификатор закладки.
       * @param {String} align Возможное выравнивание: 'left' или 'right'.
       * @example
       * <pre>
       *     floatArea.subscribe('onBeforeShow', function() {
       *        var tabControl = floatArea.getChildControlByName('testTabControl'),
       *            currentTabId = tabControl.getCurrentId();
       *        //устанавливаем выравнивание корешка слева
       *        tabControl.setTabAlignment(currentTabId, 'left');
       *     });
       * </pre>
       * @see items
       * @see getItems
       */
      setTabAlignment: function(tabId, align){
         var tabIndex = this._getTabIndexById(tabId);
         if (tabIndex !== null && (align === 'left' || align === 'right')){
            this.getItems()[tabIndex].setAlign(align);
         }
      },
      /**
       * <wiTag group="Данные">
       * Устанавливает новый контент для области.
       * @param {String} tabId Идентификатор закладки.
       * @param {String} newContent Новый контент - html-вёрстка.
       * @see items
       * @see getItems
       */
      setContent: function(tabId, newContent){
         var tabIndex = this._getTabIndexById(tabId);
         if (tabIndex !== null){
            this.getItems()[tabIndex].setContent(newContent);
         }
      },
      /**
       * <wiTag group="Управление">
       * Включить закладку. Сделать закладку доступной для взаимодействия с ней пользователем.
       * @param {String} tabId Идентификатор закладки.
       * @example
       * <pre>
       *     floatArea.subscribe('onBeforeShow', function() {
       *        var
       *           tabControl = floatArea.getChildControlByName('testTabControl'),
       *           //Находим ID закладки с контролом "Приложение"
       *           tabWithAttachment = tabControl.getTabIndexByControl(documentAttachment);
       *        //Если документ проведен, то:
       *        if (documentPassed) {
       *           //Отключим закладку с котролом "Приложение"
       *           tabControl.disableTab(tabWithAttachment);
       *        } else {
       *           //Включим закладку с котролом "Приложение"
       *           tabControl.enableTab(tabWithAttachment);
       *        }
       *     });
       * </pre>
       */
      enableTab: function(tabId){
         var tabIndex = this._getTabIndexById(tabId);
         if (tabIndex !== null){
            this.getItems()[tabIndex].setEnabled(true);
         }
      },
      /**
       * <wiTag group="Управление">
       * Выключить закладку. Сделать закладку недоступной для взаимодействия с ней пользователем.
       * @param {String} tabId Идентификатор закладки.
       * @example
       * <pre>
       *     floatArea.subscribe('onBeforeShow', function() {
       *        var
       *           tabControl = floatArea.getChildControlByName('testTabControl'),
       *           //Находим ID закладки с контролом "Приложение"
       *           tabWithAttachment = tabControl.getTabIndexByControl(documentAttachment);
       *        //Если документ проведен, то:
       *        if (documentPassed) {
       *           //Отключим закладку с котролом "Приложение"
       *           tabControl.disableTab(tabWithAttachment);
       *        } else {
       *           //Включим закладку с котролом "Приложение"
       *           tabControl.enableTab(tabWithAttachment);
       *        }
       *     });
       * </pre>
       */
      disableTab: function(tabId){
         var tabIndex = this._getTabIndexById(tabId);
         if (tabIndex !== null){
            this.getItems()[tabIndex].setEnabled(false);
         }
      },
      destroy: function(){
         for (var i = 0; i < this._options.items.length; i++) {
            this._options.items[i].unbind('onOptionChanged');
         }
         this._switchableArea.destroy();
         this._tabButtons.destroy();
         $ws.proto.TabControl.superclass.destroy.apply(this, arguments);
      }
   });

   return $ws.proto.TabControl;
});