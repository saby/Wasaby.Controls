define('js!SBIS3.CONTROLS.TabControl', [
   'js!SBIS3.CORE.CompoundControl',
   'html!SBIS3.CONTROLS.TabControl',
   'js!SBIS3.CORE.SwitchableArea',
   'js!SBIS3.CONTROLS.TabButtons'
], function(CompoundControl, dotTplFn) {

   'use strict';

   /**
    * Контрол, содержащий несколько областей содержащих контент.
    * В каждый момент времени отображается только одна область. Отображаемая область может переключаться при клике на корешки закладок.
    * @class SBIS3.CONTROLS.TabControl
    * @extends $ws.proto.CompoundControl
    * @control
    * @author Крайнов Дмитрий Олегович
    * @public
    */

   var TabControl = CompoundControl.extend( /** @lends SBIS3.CONTROLS.TabControl.prototype */ {
      _dotTplFn : dotTplFn,
      $protected: {
         _tabButtons: null,
         _switchableArea: null,
         _options: {
            /**
             * @typedef {String} AlignType
             * @variant '' выравнивание вкладки по умолчанию (справа)
             * @variant left выравнивание вкладки слева
             */
            /**
             * @typedef {object} Item
             * @property {AlignType} [align=''] Выравнивание вкладки
             * @property {Content} content Xhtml-вёрстка заголовка закладки при редактировании по месту
             * @property {String} title Текст вкладки
             * @translatable title
             */
            /**
             * @cfg {Item[]} Массив с элементами, отображающими закладки и области, связанные с ним
             * Для настройки содержимого вкладок и областей нужно учитывать что задано в опциях tabsDisplayField и selectedKey.
             * Например, если задали &lt;opt name=&quot;tabsDisplayField&quot;&gt;title&lt;/opt&gt;, то и для текста вкладки задаем опцию &lt;opt name=&quot;title&quot;&gt;Текст вкладки&lt;/opt&gt;
             * Если задали &lt;opt name=&quot;keyField&quot;&gt;id&lt;/opt&gt;, то и для вкладки задаем ключ опцией &lt;opt name=&quot;id&quot;&gt;id1&lt;/opt&gt;
             */
            items: null,
            /**
             * @cfg {String} Идентификатор выбранного элемента
             * @remark
             * Для задания выбранного элемента необходимо указать значение {@link SBIS3.CONTROLS.DSMixin#keyField ключевого поля} элемента коллекции.
             * @see SBIS3.CONTROLS.DSMixin#keyField
             */
            selectedKey: null,
            /**
             * @cfg {String} Поле элемента коллекции, из которого отображать данные
             * @example
             * <pre class="brush:xml">
             *     <option name="tabsDisplayField">caption</option>
             * </pre>
             * @see keyField
             * @see items
             */
            tabsDisplayField: null,
            /**
             * @cfg {String} Поле элемента коллекции, которое является идентификатором записи
             * @remark
             * Выбранный элемент в коллекции задаётся указанием ключа элемента selectedKey.
             * @example
             * <pre class="brush:xml">
             *     <option name="keyField">id</option>
             * </pre>
             * @see items
             * @see displayField
             */
            keyField: null,
            /**
             * @cfg {Content} содержимое между вкладками
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
             * @cfg {String} Режим загрузки дочерних контролов в области под вкладками
             * @example
             * <pre>
             *     <option name="loadType">all</option>
             * </pre>
             * @variant all инстанцировать все области сразу;
             * @variant cached инстанцировать только 1 область, при смене предыдущую не уничтожать (кэширование областей).
             */
            loadType: 'cached'
         }
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
         if (this._options.selectedKey != this._tabButtons.getSelectedKey()) {
            this._onSelectedItemChange(undefined, this._tabButtons.getSelectedKey(), this._tabButtons.getSelectedIndex());
         }
      },

      setItems: function(items) {
         this._tabButtons.setItems(items);
         this._switchableArea.setItems(items);
      },

      //TODO может сделать метод getTabButtons, позволяющий напрямую работать с вкладками,
      //чтобы не инкапсулировать подобные методы?
      setSelectedKey: function(key){
         this._tabButtons.setSelectedKey(key);
      },

      getSelectedKey: function(){
         return this._tabButtons.getSelectedKey();
      },

      _onSelectedItemChange: function(event, id, index) {
         this._options.selectedKey = id;
         this._switchableArea._options.defaultArea = id;
         this._switchableArea.setActiveArea(id);
         this._notify('onSelectedItemChange', id, index);
      }
   });

   return TabControl;

});