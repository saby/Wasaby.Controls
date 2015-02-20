define('js!SBIS3.CORE.TabButtons', [ 'js!SBIS3.CORE.CompoundControl', 'html!SBIS3.CORE.TabButtons', 'html!SBIS3.CORE.TabButtons/TabButtons_button', 'html!SBIS3.CORE.TabButtons/TabButtons_icon', 'js!SBIS3.CORE.FieldEditAtPlace', 'css!SBIS3.CORE.TabButtons' ],
      function( control, mainTplFn, buttonTplFn, iconTplFn, FEditAtPlace ) {
   'use strict';
   var TabEditAtPlace = FEditAtPlace.extend({
      canAcceptFocus: function () {
         return TabEditAtPlace.superclass.canAcceptFocus.apply(this, arguments) && (this._container.parents('.ws-TabButtons__button__state-inactive').length === 0);
      }
   });
   /**
    * Ярлыки закладок
    *
    * @class $ws.proto.TabButtons
    * @extends $ws.proto.Control
    * @control
    * @designTime actions /design/design
    * @designTime plugin /design/DesignPlugin
    * @category Navigation
    * @initial
    * <component data-component="SBIS3.CORE.TabButtons">
    *    <options name="tabs" type="array">
    *       <options>
    *          <option name="title" value="Корешок 1"></option>
    *          <option name="id" value="tab_1"></option>
    *       </options>
    *       <options>
    *          <option name="title" value="Корешок 2"></option>
    *          <option name="id" value="tab_2"></option>
    *       </options>
    *       <options>
    *          <option name="title" value="Корешок 3"></option>
    *          <option name="id" value="tab_3"></option>
    *       </options>
    *    </options>
    * </component>
    * @icon tabButtonsIcon.png
    * @apilevel 1 - Experimental
    */
   $ws.proto.TabButtons = control.extend(/** @lends $ws.proto.TabButtons.prototype */{
      /**
       * @event onTabChange При смене активной закладки
       * Событие срабатывает по смене закладки (в том числе и при загрузке первой).
       * @param {$ws.proto.EventObject} event Дескриптор события.
       * @param {String} id Идентификатор открытой закладки.
       * @example
       * <pre>
       *    tab.subscribe('onTabChange', function(event, id) {
       *        alert('Выбрана закладка с идентификатором ' + id);
       *    });
       * </pre>
       * @see onBeforeShowFirstTab
       */
      /**
       * @event onTabAdded При добавлении вкладки
       * Присходит при добавлении вкладки одним из методов {@link appendTab}, {@link prependTab], {@link insertTabAfter}.
       * @param {$ws.proto.EventObject} event Дескриптор события.
       * @param {String} id Идентификатор добавленной закладки.
       * @param {Object} spec Описание закладки.
       * @see appendTab
       * @see prependTab
       * @see insertTabAfter
       */
      /**
       * @event onTabRemoved При удалении закладки
       * Присоходит при удалении закладки методом {@link removeTab}.
       * @param {$ws.proto.EventObject} event Дескриптор события
       * @param {String} id Идентификатор добавленной закладки.
       * @see removeTab
       */
      /**
       * @event onBeforeShowFirstTab Выбор активной закладки
       * Происходит перед показом закладок, может быть использовано для смены закладки, открытой по умолчанию.
       * @param {$ws.proto.EventObject} event Дескриптор события.
       * @param {String} id Идентификатор текущей закладки по умолчанию.
       * @return {String} Результат рассматривается как заголовок закладки, которую нужно показать текущей открытой.
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
      $protected: {
         _options: {
            buttonTemplate: buttonTplFn,
            iconTemplate: iconTplFn,
            /**
             * @cfg {Number} Максимальная высота
             */
            maxHeight: 28,
            /**
             * @typedef {String} HorizontalAlign
             * @variant left влево
             * @variant right вправо
             */
            /**
             * @typedef {object} TabElement
             * @property {String} title Заголовок
             * @property {String} [id] Идентификатор. Если не указан - будет взят порядковый номер
             * @property {Boolean} [enabled=true] Доступна ли закладка для выбора
             * @property {Boolean} [visible=true] Видима ли закладка
             * @property {String} [icon] Иконка. Либо прямой путь, либо путь через 'ws:/' (иконка из ws), либо спрайт (sprite:класс класс класс)
             * @property {HorizontalAlign} [align=right] Выравнивание закладки. 'left' - влево, 'right' - вправо
             * @property {String} [cssClass] CSS-класс, который будет размещен на закладке
             * @property {Boolean} editable Редактируется ли заголовок закладки по месту
             * @property {Content} content Xhtml-вёрстка заголовка закладки при редактировании по месту
             *
             * @editor icon ImageEditor
             * @translatable title
             */
            /**
             * @cfg {TabElement[]} Массив с описанием закладок
             * <wiTag group="Отображение">
             * Свойства:
             *    {String} title Заголовок
             *    {String} [id] Идентификатор. Если не указан - будет взят порядковый номер
             *    {Boolean} [enabled=true] Доступна ли вкладка для выбора
             *    {Boolean} [visible=true] Видима ли вкладка
             *    {String} [icon] Иконка. Либо прямой путь, либо путь через 'ws:/' (иконка из ws), либо спрайт (sprite:класс класс класс)
             *    {String} [align='right'] Выравнивание закладки. 'left' - влево, 'right' - вправо
             *    {String} [cssClass] CSS-класс, который будет размещен на закладке
             * Пример:
             * <pre>
             *    tabs: [
             *       {
             *          title: 'Один таб',          // имя таба, которое отображается на кнопке
             *          id: 'someId',               // айди для внутреннего использования - к этой вкладке можно обращаться по нему,
             *          enabled: false,
             *          icon: 'sprite:icon-16 icon-Admin icon-disabled',
             *          cssClass: 'my-class'
             *       },
             *       {
             *          visible: false,
             *          title: 'Другой таб',        // имя таба, которое отображается на кнопке
             *          id: 'anotherId',            // айди для внутреннего использования - к этой вкладке можно обращаться по нему
             *          icon : 'someicon.png',      // путь к иконке
             *          align: 'left'
             *       }
             *    ]
             * </pre>
             */
            tabs: [],
            /**
             * @cfg {String} Идентификатор закладки по умолчанию
             * <wiTag group="Отображение">
             * Указанная закладка будет показана первой.
             * @see onBeforeShowFirstTab
             */
            defaultTab: ''
         },
         _$activeTab: null,
         _tabEditors: {},               //Редакторы по месту во вкладках
         _button_active_classes: 'ws-TabButtons__button__state-active'
      },
      _dotTplFn: mainTplFn,
      $constructor: function() {

         var self = this,
             $tabCtr, $activateTab, newDefTab;

         this._publish('onTabChange', 'onTabAdded', 'onTabRemoved', 'onBeforeShowFirstTab');

         if ($ws._const.browser.isMobileSafari) self._button_active_classes += ' ws-TabButtons__button__state-active-ios-bg-hack';

         if(this._isCorrectContainer()) {

            $tabCtr = this._getTabContainer();
            $tabCtr.delegate('.ws-TabButtons__button__state-inactive', 'click', this._tabLabelClick.bind(this));
            $tabCtr.delegate('.ws-TabButtons__button', 'mouseenter mouseleave', this._tabHoverHandler.bind(this));
            this.once('onInit', function(){

               // Показываем что контрол готов к приему состояния
               // Если сохранение состояния включено и есть стейт - будет синхронный вызов applyState и установтся текущая вкладка
               this._notify('onStateChanged');

               // Если _$activeTab не задан - значит надо выяснить текущую вкладку и поставить ее
               // (например не включено сохранение состояния или состояния небыло)
               if (!this._$activeTab) {
                  var currDefaultTab = this._options.defaultTab || '';
                  newDefTab = this._notify('onBeforeShowFirstTab', this._options.defaultTab);
                  if (newDefTab && typeof newDefTab === 'string') {
                     $ws.helpers.forEach(this._options.tabs, function (tab) {
                        if (tab.id === newDefTab) {
                           self._options.defaultTab = tab.id;
                        }
                     });
                  } else if (newDefTab === '') {
                     // отключили вкладку по-умолчанию
                     this._options.defaultTab = '';
                  }

                  if (this._options.defaultTab !== currDefaultTab) {
                     // задизейблить текущую активную вкладку, т.к. установили новую из обработчика.
                     this._unselectTab(this.getTabButton(currDefaultTab));
                  }

                  if(this._options.defaultTab !== '') {
                     $activateTab = this.getTabButton(this._options.defaultTab);
                     if(!this._canSelect($activateTab) || $activateTab.length === 0) {
                        $activateTab = $tabCtr.find('.ws-TabButtons__button').filter(function(){
                           return self._canSelect($(this));
                        }).eq(0);
                     }

                     // Если не удалось найти вкладку для выбора (например все скрыты/задизаблены)
                     // Выберем никакую (и сообщим через событие)
                     this.setCurrentTab($activateTab.data('tab-id') || '', true);
                  } else {
                     // Если дефолтная закладка не задана - выбираем первую
                     // Нужно для того, чтобы сработал onTabChange
                     this.setCurrentTab(this._getFirstAvailableTab() || '', true);
                  }

               } else if (this._options.defaultTab !== this.getCurrentTab()) {
                  // задизейблить закладку по умолчанию, т.к. в applyState установили новую
                  this._unselectTab(this.getTabButton(this._options.defaultTab));
               }

               self.editContent(function(){
                  return true;
               });

            });
         }
         for (var i = 0, l = this._options.tabs.length; i < l; i++) {
            var tab = this._options.tabs[i];
            if (tab.editable) {
               this._processEditableTabButton(tab);
            }
         }
      },
      getDefaultTab: function() {
         return this._options.defaultTab;
      },
      setDefaultTab: function(tab) {
         this._options.defaultTab = tab;
      },
      /**
       * Обработка заголовка закладки в режиме редактирования по месту
       * @param tab {Object} конфигурация заголовка закладки
       * @private
       */
      _processEditableTabButton: function (tab) {
         var self = this,
            tabButton = this.getTabButton(tab.id);
         self._tabEditors[tab.id] = new TabEditAtPlace({
            name: self._options.name + '_edit' + (tab.id),
            element: tabButton.find('.ws-TabButtons__editor'),
            content: tab.content,
            context: self._context,
            isTabEditor: true,
            inPlaceEditMode: true,
            parent: self,
            handlers: $ws.core.clone(tab.handlers)
         });
      },
      _tabLabelClick: function(event) {
         var tabId;

         if(this.isEnabled()) {
            tabId = $(event.target).closest('.ws-TabButtons__button__state-inactive').data('tab-id');
            this.setCurrentTab(tabId, true);
         }

         return false;
      },
      _tabHoverHandler: function(event){
         switch(event.type) {
            case 'mouseenter':
               $(event.target).closest('.ws-TabButtons__button').addClass('hover');
               break;
            case 'mouseleave':
               $(event.target).closest('.ws-TabButtons__button').removeClass('hover');
               break;
            default:
         }
      },
      _canSelect: function($btn, skipInvisibility) {
         return  !($btn.hasClass('ws-TabButtons__button__state-disabled') || ($btn.hasClass('ws-TabButtons__button__state-hidden') && !skipInvisibility));
      },
      _getTabContainer: function() {
         return this.getContainer().find('.ws-TabButtons__container');
      },
      _mkTabHtml: function(spec) {
         return buttonTplFn({ value: spec, index: -1, outer: this._options });
      },
      _mkId: function(spec) {
         if(!('id' in spec)) {
            spec.id = $ws.helpers.randomId('tab-');
         }
         return spec;
      },
      /**
       * <wiTag group="Управление">
       * Добавляет вкладку после указанной вкладки
       * @param {Object} spec
       * @param {String} [afterId] ID вкладки после которой вставлять
       * @returns {String} ID добавленной вкладки (сгенерирует случайный если не передан в настройках таба)
       */
      insertTabAfter: function(spec, afterId) {
         var self = this;
         spec = this._mkId(spec);

         this.editContent(function(){
            self.getTabButton(afterId).after(self._mkTabHtml(spec));
            if (spec.editable) {
               self._processEditableTabButton(spec);
            }
            self._notify('onTabAdded', spec);
            return true;
         });

         return spec.id;
      },
      /**
       * <wiTag group="Управление">
       * Добавляет вкладку в начало списка
       * @param spec
       * @returns {String} ID добавленной вкладки (сгенерирует случайный если не передан в настройках таба)
       */
      prependTab: function(spec) {
         var self = this;
         spec = this._mkId(spec);

         this.editContent(function(){
            self._getTabContainer().prepend(self._mkTabHtml(spec));
            if (spec.editable) {
               self._processEditableTabButton(spec);
            }
            self._notify('onTabAdded', spec);
            return true;
         });

         return spec.id;
      },
      /**
       * <wiTag group="Управление">
       * Добавляет вкладку в конец списка
       * @param spec
       * @returns {String} ID добавленной вкладки (сгенерирует случайный если не передан в настройках таба)
       */
      appendTab: function(spec){
         var self = this;
         spec = this._mkId(spec);

         this.editContent(function(){
            self._getTabContainer().append(self._mkTabHtml(spec));
            if (spec.editable) {
               self._processEditableTabButton(spec);
            }
            self._notify('onTabAdded', spec.id, spec);
            return true;
         });

         return spec.id;
      },
      /**
       * <wiTag group="Управление">
       * Удаляет вкладку с указанным идентификатором
       * @param {String} id Вкладка, которую надо удалить
       */
      removeTab: function(id) {
         var self = this;
         this.editContent(function(){
            self.getTabButton(id).empty().remove();
            if(self._tabEditors[id]) {
               self._tabEditors[id].destroy();
               delete self._tabEditors[id];
            }
            self._notify('onTabRemoved', id);
            return true;
         });
      },
      /**
       * <wiTag group="Управление">
       * Включает или выключает вкладку. Она видима но не может быть переключена.
       * @param {String} id Идентификатор вкладки
       * @param {Boolean} state Состояние
       */
      setTabEnabled: function(id, state) {
         this.getTabButton(id).toggleClass('ws-TabButtons__button__state-disabled', !state);
      },
      /**
       * <wiTag group="Управление">
       * @param {String} id Идентификатор вкладки
       */
      enableTab: function(id) {
         this.setTabEnabled(id, true);
      },
      /**
       * <wiTag group="Управление">
       * @param {String} id Идентификатор вкладки
       */
      disableTab: function(id) {
         this.setTabEnabled(id, false);
      },
      /**
       * <wiTag group="Управление">
       * Возвращает идентификатор текущей вкладки
       * @returns {String} Идентификатор текущей вкладки.
       */
      getCurrentTab: function() {
         return this._getCurrentTab() || '';
      },
      /**
       * Возвращает контрол в активной закладке, если есть.
       * @returns {Object|Boolean}
       */
      getCurrentTabControl: function () {
         var id = this._getCurrentTab();
         if (id) {
            return this._tabEditors[id];
         }
         return false;
      },
      /**
       * Возвращает текущую вкладку, но если _$activeTab не задан - вернет undefined
       * @returns {String|undefined}
       * @private
       */
      _getCurrentTab: function() {
         return this._$activeTab ? (this._$activeTab.data('tab-id') || '') : undefined;
      },
      /**
       * <wiTag group="Управление">
       * Возвращает текущий набор вкладок в виде массива объектов
       * @returns {Array}
       */
      getTabs: function() {
         return $ws.core.clone(this._options.tabs);
      },
      _getFirstAvailableTab: function() {
         var tabId;
         $.each(this.getTabs(), function(pos, tab) {
            if (this._canSelect(this.getTabButton(tab.id))) {
               tabId = tab.id;
               return false;
            };
         }.bind(this));
         return tabId;
      },
      /**
       * Устанавливает id закладки
       * @param {String} oldId старый id
       * @param {String} newId новый id
       */
      setTabId: function (oldId, newId) {
         this.getTabButton(oldId).attr('data-tab-id', newId);
      },

      /**
       * <wiTag group="Управление">
       * @param {String} id Идентификатор вкладки
       * @param {Boolean} [pushState=false] Записать состояние в историю браузера
       * @param {Boolean} [skipInvisibility=false] Дает возможность установить активной невидимую вкладку
       * @param {Boolean} [noActivate] Активировать или нет контрол на установленной вкладке. По-умолчанию активируется.
       */
      setCurrentTab: function(id, pushState, skipInvisibility, noActivate) {
         var
            $activeTab,
            currentId = this._getCurrentTab();

         if (currentId === id) {
            return;
         }

         $activeTab = this.getTabButton(id);

         if (this._canSelect($activeTab, skipInvisibility)) {
            // Если вкладку, которую просят, можно выбрать...
            this._unselectCurrentTab();
            this._$activeTab = $activeTab.addClass(this._button_active_classes).removeClass('ws-TabButtons__button__state-inactive');
            $activeTab.find('.ws-TabButtons__overlay').toggleClass('ws-hidden', true);
            if (noActivate !== true) {
               this.setActive(true, false);
            }
            this._notifyTabChange(id, currentId, pushState);
         } else {
            // То что просят, выбрать нельзя. Возможно это переход в состояние "ничего не выбрано"
            if (id === '') {
               // Если это так - снимем выделение вообще
               // Пустой jQuery-объект
               this._unselectCurrentTab();
               this._$activeTab = $();
               this._notifyTabChange(id, currentId, pushState);
            }
         }
      },
      /**
       * Снять выделение с закладки
       * @param {jQuery} $tab - закладка, с которой нужно снять выделение
       * @protected
       */
      _unselectTab: function ($tab) {
         if ($tab) {
            $tab.find('.ws-TabButtons__overlay').toggleClass('ws-hidden', false);
            $tab.removeClass(this._button_active_classes).addClass('ws-TabButtons__button__state-inactive');
         }
      },
      _unselectCurrentTab: function () {
         this._unselectTab(this._$activeTab);
      },
      _notifyTabChange: function(id, currentId, pushState) {
         var cont = this.getContainer();
         this._notify('onTabChange', id, currentId);
         //Костыль для хрома - он не вовремя пересчитывает размеры контейнера
         if ($ws._const.browser.chrome) {
            cont.css('height', '30px');
            setTimeout(function () {
               cont.css('height', '');
            }, 0);
         }
         this._notify('onStateChanged', !!id ? id : undefined, !pushState);
      },
      _resizeEditors : function () {
         for (var id in this._tabEditors) {
            if (this._tabEditors.hasOwnProperty(id)) {
               if (this._tabEditors[id]) {
                  this._tabEditors[id]._onResizeHandler();
               }
            }
         }
      },
      _onResizeHandler: function () {
         $ws.proto.TabButtons.superclass._onResizeHandler.apply(this, arguments);
         this._resizeEditors();
      },

      /**
       * Перестраивание порядка заголовков закладок
       * @private
       */
      _rebuildTabs: function () {
         var tabs = this.getTabs(),
            len = tabs.length,
            tabContainer = this._getTabContainer();
         // left alignment
         for (var i = 0; i < len; i++) {
            if (tabs[i].align === "left") {
               tabContainer.append(this.getTabButton(tabs[i].id));
            }
         }
         // right|auto alignment
         for (i = len - 1; i >= 0; i--) {
            if (tabs[i].align !== "left") {
               tabContainer.append(this.getTabButton(tabs[i].id));
            }
         }
      },

      /**
       * Получить закладку с нужным id.
       * @param id - идентификатор закладки
       * @returns {TabElement|false} таб с указанным id или false
       * @private
       */
      _getTabById: function (id) {
         var i = 0,
            l = this._options.tabs.length;
         for (; i < l; i++) {
            if (this._options.tabs[i].id === id) {
               return this._options.tabs[i];
            }
         }
         return false;
      },

      /**
       * <wiTag group="Управление">
       * Скрывает или показывает вкладку в зависимости от параметра state
       * @param {String} id Идентификатор вкладки
       * @param {Boolean} state Состояние
       */
      setTabVisible: function(id, state) {
         var self = this;
         this.editContent(function(){
            self.getTabButton(id).toggleClass('ws-TabButtons__button__state-hidden', !state)
               .toggleClass('ws-TabButtons__button__state-visible', state);
            return true;
         });
      },
      /**
       * Меняет выравнивание вкладки
       * @param {String} id ID вкладки
       * @param {String} align Желаемое выравнивание. 'left' или 'right'.
       */
      setTabAlignment: function(id, align) {
         var self = this,
             alignClass = 'ws-TabButtons__button__align-' + align,
             contrAlign = {
                left: 'ws-TabButtons__button__align-right',
                right: 'ws-TabButtons__button__align-left'
             };
         if (align in contrAlign) {
            this.editContent(function(){
               var
                  tabBtn = self.getTabButton(id),
                  tab = self._getTabById(id),
                  contrClass = contrAlign[align];
               if (tab) {
                  tab.align = align;
               }
               if (tabBtn.hasClass(contrClass)) {
                  tabBtn.removeClass(contrClass).addClass(alignClass);
                  self._rebuildTabs();
                  return true;
               } else {
                  return false;
               }
            });
         }
      },
      /**
       * <wiTag group="Управление">
       * Скрыть вкладку
       * @param {String} id Идентификатор вкладки
       */
      hideTab: function(id) {
         this.setTabVisible(id, false);
      },
      /**
       * <wiTag group="Управление">
       * Показать вкладку
       * @param id
       */
      showTab: function(id) {
         this.setTabVisible(id, true);
      },
      /**
       * <wiTag group="Управление">
       * Добавляет или удаляет иконку с указанной вкладки
       * @param {String} id ID вкладки
       * @param {String} [icon] Иконка вкладки. Если не передать - уберет текущую. Можно передать путь внутри ws (ws:/...) или спрайт через 'sprite:' (@see http://ws.web-dev.tensor.ru/docs/3.6/#icons)
       *
       * @example
       * <pre>
       *    // Удалим иконку
       *    tabs.setTabIcon('x');
       *
       *    // Добавим иконку из спрайта
       *    tabs.setTabIcon('y', 'sprite:icon-16 icon-AddData icon-error');
       *
       *    // Добавим иконку по полному пути
       *    tabs.setTabIcon('z', '/path/to/file.png');
       *
       *    // Иконка из WS
       *    tabs.setTabIcon('bar', 'ws:/add_folder_ico.png');
       * </pre>
       */
      setTabIcon: function(id, icon) {
         var self = this;
         this.editContent(function(){
            var tabBtn = self.getTabButton(id);
            tabBtn.find('.ws-TabButtons__icon').remove();
            if(icon) {
               tabBtn.find('.ws-TabButtons__buttonInside').prepend(self._options.iconTemplate({ icon: icon }));
            }
            return true;
         });
      },
      /**
       * <wiTag group="Управление">
       * Переименовать закладку
       * @param {String} id ID закладки, которую надо переименовать
       * @param {String} newName Новое имя
       */
      renameTab: function(id, newName) {
         var self = this;
         this.editContent(function(){
            self.getTabButton(id).find('.ws-TabButtons__buttonTitle').text($ws.helpers.escapeTagsFromStr(newName));
            return true;
         });
      },
      /**
       * Восстанавливает состояние
       * @param {String} id Идентификатор состояния.
       */
      applyState : function(id){
         var state = $ws.single.NavigationController.getStateByKey(this.getStateKey()) || {};
         this.setCurrentTab(id, !(state.state === id), true);
      },
      /**
       * Применение пустого состояния. Поставил закладку по-умолчанию или никакую (если не была задана)
       */
      applyEmptyState: function() {
         this.setCurrentTab(this._options.defaultTab || '', true);
      },
      /**
       * Получаем DOM-элемент конкретной вкладки по ID
       * @param {String} id ID желаемой вкладки
       * @returns {jQuery} jQuery-элемент, соответствующий указанной вкладке
       */
      getTabButton: function(id) {
         return this._getTabContainer().find('.ws-TabButtons__button[data-tab-id="' + id + '"]');
      },
      getMinHeight: function() {
         return 28;
      },
      /**
       * <wiTag group="Управление">
       * Метод асинхронного редактирования контента закладок
       * @param {Function} mutator Функция с двумя аргументами:
       *  - контейнер элемента
       *  - функция-колбэк, которую нужно позвать по окончании изменения с аргументом true - если содержимое изменилось и false в противном случае
       *
       * @example
       * tabs.editContentAsync(function(container, done) {
       *    someAsyncProcess().addCallback(function(){
       *       container.addClass('ws-some-class');
       *       done(true);
       *    });
       * });
       */
      editContentAsync: function(mutator) {
         var self = this;
         if (typeof mutator == 'function') {
            try {
               mutator(this.getContainer(), function (changed) {
                  self.getContainer().find('.ws-TabButtons__button.first-child').removeClass('first-child');
                  self.getContainer().find('.ws-TabButtons__button__align-left.ws-TabButtons__button__state-visible').first().addClass('first-child');
                  if (changed) {
                     self.getContainer().css('min-width',
                        $ws.helpers.reduce(
                           self.getContainer().find('.ws-TabButtons__button'),
                           function(data, element) {
                              var $element = $(element);
                              if (!$element.hasClass('ws-TabButtons__button__state-hidden')) {
                                 data.width += $element.outerWidth(data.flag);
                                 if (!data.flag) {
                                    data.flag = true;
                                 }
                              }
                              return data;
                           }, {
                              width: 0,
                              flag: false
                           }
                        ).width
                     );
                     self._notifyOnSizeChanged(self, self);
                  }
               });
            } catch (e) {
               // ignore
            }
         }
      },
      /**
       * <wiTag group="Управление">
       * Метод синхронного редактирования контента
       * @param {Function} mutator Функция с одним аргументом - контейнером контрола. Должна вернуть true если произведены изменения и false в противном случае
       *
       * @example
       * tabs.editContent(function(container) {
       *    container.addClass('ws-some-class');
       *    return true;
       * });
       */
      editContent: function(mutator) {
         this.editContentAsync(function(container, done){
            done(mutator(container));
         });
      },
      /**
       * <wiTag group="Данные">
       * Валидация контролов в корешках закладок
       * @returns {Boolean} Успешность валидации.
       */
      validate: function () {
         var tabsList = this._options.tabs,
            tabEdit,
            tabId;
         for (var i = 0, l = tabsList.length; i < l; i++) {
            tabId = tabsList[i].id || i;
            tabEdit = this._tabEditors[tabId];
            if (tabEdit && tabEdit.validate(false, true) === false) {
               this.setCurrentTab(tabId, true);
               tabEdit._moveFailValidatedToFocus();
               return false;
            }
         }
         return true;
      },
      destroy: function () {
         for (var id in this._tabEditors) {
            if (this._tabEditors.hasOwnProperty(id)) {
               this._tabEditors[id].destroy();
               delete this._tabEditors[id];
            }
         }
         $ws.proto.TabButtons.superclass.destroy.call(this);
      }
   });

   return $ws.proto.TabButtons;

});