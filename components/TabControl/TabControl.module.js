define('js!SBIS3.CONTROLS.TabControl', [
   'js!SBIS3.CORE.CompoundControl',
   'html!SBIS3.CONTROLS.TabControl',
   "Core/IoC",
   'js!SBIS3.CONTROLS.SwitchableArea',
   'js!SBIS3.CONTROLS.TabButtons',
   'css!SBIS3.CONTROLS.TabControl'
], function(CompoundControl, dotTplFn, IoC) {

   'use strict';

   /**
    * Контрол, содержащий несколько областей содержащих контент.
    * В каждый момент времени отображается только одна область. Отображаемая область может переключаться при клике на корешки вкладок.
    * @class SBIS3.CONTROLS.TabControl
    * @extends $ws.proto.CompoundControl
    *
    * @control
    * @author Красильников Андрей Сергеевич
    * @public
    * @demo SBIS3.CONTROLS.Demo.MyTabControl
    */

   var TabControl = CompoundControl.extend( /** @lends SBIS3.CONTROLS.TabControl.prototype */ {
      /**
       * @event onSelectedItemChange Происходит при измении выбранной вкладки.
       * @param {String|Number} id Идентификатор выбранной вкладки (см. {@link selectedKey}).
       * @param {Number} index Порядковый номер из набора данных (см. {@link items}), который соответствует выбранной вкладке.
       */
      _dotTplFn : dotTplFn,
      $protected: {
         _tabButtons: null,
         _switchableArea: null,
         _options: {
            /**
             * @typedef {object} Item
             * @property {String} align Устанавливает выравнивание вкладки. Доступные значения:
             * <ul>
             *     <li>'' - выравнивание вкладки справа (значение по умолчанию);</li>
             *     <li>left - выравнивание вкладки слева;</li>
             * </ul>
             * @property {Content} content Устанавливает xhtml-вёрстку заголовка вкладки при редактировании по месту.
             * @property {String} title Устанавливает текст вкладки.
             * @translatable title
             */
            /**
             * @cfg {Item[]} Устанавливает набор элементов, который описывает закладки и связанные с ними области.
             * @remark
             * Для настройки содержимого вкладок и областей нужно учитывать, что задано в опциях {@link tabsDisplayProperty} и {@link selectedKey}.
             * Например, если задали &lt;opt name=&quot;tabsDisplayProperty&quot;&gt;title&lt;/opt&gt;, то и для текста вкладки задаем опцию &lt;opt name=&quot;title&quot;&gt;Текст вкладки&lt;/opt&gt;
             * Если задали &lt;opt name=&quot;idProperty&quot;&gt;id&lt;/opt&gt;, то и для вкладки задаем ключ опцией &lt;opt name=&quot;id&quot;&gt;id1&lt;/opt&gt;
             */
            items: null,
            /**
             * @cfg {String} Устанавливает идентификатор выбранного элемента.
             * @remark
             * Для задания выбранного элемента необходимо указать значение {@link SBIS3.CONTROLS.DSMixin#idProperty ключевого поля} элемента коллекции.
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
             * @cfg {String} Устанавливает поле элемента коллекции, которое является идентификатором записи.
             * @remark
             * Выбранный элемент в коллекции задаётся указанием ключа элемента {@link selectedKey}.
             * @example
             * <pre class="brush:xml">
             *     <option name="idProperty">id</option>
             * </pre>
             * @see items
             * @see displayProperty
             */
            idProperty: null,
            /**
             * @cfg {Content} Устанавливает содержимое между вкладками.
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
             * @example
             * <pre>
             *     <option name="loadType">all</option>
             * </pre>
             * @variant all Инстанцировать все области сразу;
             * @variant cached Инстанцировать только 1 область, при смене предыдущую не уничтожать (кэширование областей).
             */
            loadType: 'cached',
            /**
             * @cfg {Boolean} Устанавливает фиксацию / прилипание корешков закладок к шапке страницы / всплывающей панели.
             * @remark
             * Подробнее о данном функционале читайте <a href='https://wi.sbis.ru/doc/platform/developmentapl/interfacedev/fixed-header/'>здесь</a>.
             * @example
             * <pre>
             *     <option name="stickyHeader">true</option>
             * </pre>
             */
            stickyHeader: false,
            /**
             * @cfg {String} Устанавливает дополнительный класс, который будет установлен на корешки вкладок.
             * @remark
             * Нужен, например, для того, чтобы однозначно определить корешки вкладок после их фиксации в заголовке страницы.
             */
            tabButtonsExtraClass: ''
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
         this._tabButtons.setItems(items);
         this._switchableArea.setItems(items);
      },

      //TODO может сделать метод getTabButtons, позволяющий напрямую работать с вкладками,
      //чтобы не инкапсулировать подобные методы?
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
         this._options.selectedKey = id;
         this._switchableArea._options.defaultArea = id;
         this._switchableArea.setActiveArea(id).addCallback(function(){
            this._notify('onSelectedItemChange', id, index);
         }.bind(this));
      }
   });

   return TabControl;

});