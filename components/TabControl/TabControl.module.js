define('js!SBIS3.CONTROLS.TabControl', [
   'js!SBIS3.CORE.CompoundControl',
   'html!SBIS3.CONTROLS.TabControl',
   'js!SBIS3.CONTROLS.SwitchableArea',
   'js!SBIS3.CONTROLS.TabButtons'
], function(CompoundControl, dotTplFn) {

   'use strict';

   var contextName = 'sbis3-controls-tab-control';

   /**
    * Контрол, содержащий несколько областей содержащих контент.
    * В каждый момент времени отображается только одна область. Отображаемая область может переключаться при клике на корешки закладок.
    * @class SBIS3.CONTROLS.TabControl
    * @extends SBIS3.CORE.CompoundControl
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
             */
            /**
             * @cfg {Item[]} Массив с элементами, отображающими закладки и области, связанные с ним
             * Для настройки содержимого вкладок и областей нужно учитывать что задано в опциях tabsDisplayField и selectedKey.
             * Например, если задали <opt name="tabsDisplayField">title</opt>, то и для текста вкладки задаем опцию <opt name="title">Текст вкладки</opt>
             * Если задали <opt name="keyField">id</opt>, то и для вкладки задаем ключ опцией <opt name="id">id1</opt>
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
         //Задаём items в контекст, чтобы потом TabButtons и SwitchableArea их использовали (в TabControl.xhtml)
         this._context.setValueSelf(contextName+'/items',this._options.items);
      },

      init: function() {
         TabControl.superclass.init.call(this);
         this._switchableArea = this.getChildControlByName('SwitchableArea');
         this._switchableArea.setActiveArea(this._options.selectedKey);
         this._tabButtons = this.getChildControlByName('TabButtons');
         this._tabButtons.subscribe('onSelectedItemChange', this._onSelectedItemChange.bind(this));
      },

      _onSelectedItemChange: function(event, id) {
         this._switchableArea.setActiveArea(id);
      }
   });

   return TabControl;

});