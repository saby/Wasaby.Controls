define('js!SBIS3.CONTROLS.TabControl', [
   'js!SBIS3.CORE.CompoundControl',
   'tmpl!SBIS3.CONTROLS.TabControl',
   'js!SBIS3.CORE.HasItemsMixin',
   "Core/IoC",
   'js!SBIS3.CONTROLS.SwitchableArea',
   'js!SBIS3.CONTROLS.TabButtons',
   'css!SBIS3.CONTROLS.TabControl'
], function(CompoundControl, dotTplFn, HasItemsMixin, IoC) {

   'use strict';

   /**
    * Класс контрола "Вкладки", содержащий несколько областей с контентом. <a href='http://axure.tensor.ru/standarts/v7/%D0%B2%D0%BA%D0%BB%D0%B0%D0%B4%D0%BA%D0%B8__%D0%B2%D0%B5%D1%80%D1%81%D0%B8%D1%8F_05_.html'>Стандарт контрола</a>.
    * В каждый момент времени отображается только одна область.
    * Отображаемая область может переключаться при клике на корешки вкладок.
    * @class SBIS3.CONTROLS.TabControl
    * @extends SBIS3.CORE.CompoundControl
    *
    * @mixes SBIS3.CORE.HasItemsMixin
    *
    * @control
    * @author Красильников Андрей Сергеевич
    * @public
    * @demo SBIS3.CONTROLS.Demo.MyTabControl
    */

   var TabControl = CompoundControl.extend([HasItemsMixin], /** @lends SBIS3.CONTROLS.TabControl.prototype */ {
      /**
       * @event onSelectedItemChange Происходит при измении выбранной вкладки.
       * @param {String|Number} id Идентификатор выбранной вкладки (см. {@link selectedKey}).
       * @param {Number} index Порядковый номер выбранной вкладке из набора данных (см. {@link items}).
       */
      _dotTplFn : dotTplFn,
      $protected: {
         _tabButtons: null,
         _switchableArea: null,
         _changingAreaDeferred: null,
         _options: {
            /**
             * @typedef {object} Item
             * @property {String} align Устанавливает выравнивание вкладки. Доступные значения:
             * <ul>
             *     <li>'' - выравнивание вкладки справа (значение по умолчанию);</li>
             *     <li>left - выравнивание вкладки слева;</li>
             * </ul>
             * @property {Content} content Устанавливает xhtml-вёрстку заголовка вкладки при редактировании по месту.
             * @property {Content} title Устанавливает подпись вкладки.
             * @translatable title
             */
            /**
             * @cfg {Item[]} Устанавливает набор элементов, который описывает вкладки и связанные с ними области.
             * @remark
             * Для настройки содержимого вкладок и областей нужно учитывать, что задано в опциях {@link tabsDisplayProperty} и {@link selectedKey}.
             * Например, если задали &lt;opt name=&quot;tabsDisplayProperty&quot;&gt;title&lt;/opt&gt;, то и для текста вкладки задаем опцию &lt;opt name=&quot;title&quot;&gt;Текст вкладки&lt;/opt&gt;
             * Если задали &lt;opt name=&quot;idProperty&quot;&gt;id&lt;/opt&gt;, то и для вкладки задаем ключ опцией &lt;opt name=&quot;id&quot;&gt;id1&lt;/opt&gt;
             */
            items: null,
            /**
             * @cfg {String} Устанавливает идентификатор вкладки, выбранной по умолчанию.
             * @remark
             * Обязательная для установки опция.
             * @see SBIS3.CONTROLS.DSMixin#idProperty
             */
            selectedKey: null,
            /**
             * @cfg {String} Устанавливает поле элемента коллекции, из которого отображать данные.
             * @deprecated
             */
            tabsDisplayField: null,
            /**
             * @cfg {String} Устанавливает поле элемента коллекции, из которого отображать данные.
             * @example
             * <pre class="brush:xml">
             *     <option name="tabsDisplayProperty">caption</option>
             * </pre>
             * @see idProperty
             * @see items
             */
            tabsDisplayProperty: null,
            /**
             * @cfg {String} Устанавливает поле элемента коллекции, которое является идентификатором записи.
             * @deprecated
             */
            keyField: null,
            /**
             * @cfg {String} Устанавливает поле элемента коллекции, в котором хранятся идентификаторы записей.
             * @remark
             * Чтобы установить вкладку, выбранную по умолчанию, установите значение в опции {@link selectedKey}.
             * @example
             * <pre class="brush:xml">
             *     <option name="idProperty">id</option>
             * </pre>
             * @see items
             * @see displayProperty
             */
            idProperty: null,
            /**
             * @cfg {Content} Устанавливает шаблон, отображаемый между вкладками.
             * @example
             * <pre>
             *     <option name="tabSpaceTemplate">
             *        <component data-component="SBIS3.CONTROLS.Button" name="Button 1">
             *           <option name="caption">Кнопка между вкладками</option>
             *        </component>
             *     </option>
             * </pre>
             */
            tabSpaceTemplate: undefined,
            /**
             * @cfg {String} Устанавливает режим загрузки дочерних контролов в области под вкладками.
             * @variant all Инстанцировать все области сразу.
             * @variant cached Инстанцировать только 1 область, при смене предыдущую не уничтожать (кэширование областей).
             */
            loadType: 'cached',
            /**
             * @cfg {Boolean} Устанавливает фиксацию / прилипание корешков закладок к шапке страницы / всплывающей панели.
             * @remark
             * Подробнее о данном функционале читайте <a href='https://wi.sbis.ru/doc/platform/developmentapl/interface-development/fixed-header/'>здесь</a>.
             * @example
             * <pre>
             *     <option name="stickyHeader">true</option>
             * </pre>
             */
            stickyHeader: false,
            /**
             * @cfg {String} Устанавливает CSS-класс, который будет установлен на корешки вкладок.
             * @remark
             * Нужен, например, для того, чтобы однозначно определить корешки вкладок после их фиксации в заголовке страницы.
             */
            tabButtonsExtraClass: '',
            observeVisibleProperty: false //опция tabButtons
         }
      },

      _modifyOptions: function(cfg){
         if (cfg.keyField) {
            IoC.resolve('ILogger').log('TabControl', 'Опция keyField является устаревшей, используйте idProperty');
            cfg.idProperty = cfg.keyField;
         }
         if (cfg.tabsDisplayField) {
            IoC.resolve('ILogger').log('TabControl', 'Опция tabsDisplayField является устаревшей, используйте tabsDisplayProperty');
            cfg.tabsDisplayProperty = cfg.tabsDisplayField;
         }
         return TabControl.superclass._modifyOptions.apply(this, arguments);
      },

      $constructor: function() {
      },

      init: function() {
         TabControl.superclass.init.call(this);
         this._publish('onSelectedItemChange');
         this._switchableArea = this.getChildControlByName('SwitchableArea');
         this._switchableArea.setActiveArea(this._options.selectedKey);
         this._tabButtons = this.getChildControlByName('TabButtons');
         this._tabButtons.subscribe('onSelectedItemChange', this._onSelectedItemChange.bind(this));
         /*для ситуации когда в корешках не задан ключ, и он автоматически ставится первым*/
         if (this._options.selectedKey != this._tabButtons.getSelectedKey()) {
            this._onSelectedItemChange(undefined, this._tabButtons.getSelectedKey(), this._tabButtons.getSelectedIndex());
         }
      },
      /**
       * Устанавливает набор элементов, который описывает закладки и связанные с ними области.
       * @param {Item[]} items
       * @see items
       */
      setItems: function(items) {
         this._options.items = items;
         this._tabButtons.setItems(items);
         this._switchableArea.setItems(items);
      },

      /**
       * Устанавливает выбранным элемент коллекции по переданному идентификатору.
       * @remark
       * При использовании метода происходит событие {@link onSelectedItemChange}.
       * @param {String|Number} key Ключ элемента, который нужно установить в качестве выбранного.
       * @see getSelectedKey
       */
      setSelectedKey: function(key){
         this._tabButtons.setSelectedKey(key);
      },
      /**
       * Возвращает идентификатор выбранной вкладки.
       * @returns {|String|Number}
       * @see selectedKey
       */
      getSelectedKey: function(){
         return this._tabButtons.getSelectedKey();
      },

      _onSelectedItemChange: function(event, id, index) {
         this._setActiveArea(id).addCallback(function(){
            this._notifyOnPropertyChanged('selectedKey');
            this._notify('onSelectedItemChange', id, index);
         }.bind(this));
      },
      _setActiveArea: function(id){
         this._options.selectedKey = id;
         this._switchableArea._options.defaultArea = id;
         /* Чтобе не возникало гонок, если вкладку сменили ещё до загрузки текущей. */
         if (this._changingAreaDeferred && !this._changingAreaDeferred.isReady()) {
            this._changingAreaDeferred.cancel();
         }
         this._changingAreaDeferred = this._switchableArea.setActiveArea(id);
         return this._changingAreaDeferred;
      }
   });

   return TabControl;

});