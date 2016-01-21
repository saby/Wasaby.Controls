define('js!SBIS3.CONTROLS.TabControl', [
   'js!SBIS3.CORE.CompoundControl',
   'html!SBIS3.CONTROLS.TabControl',
   'js!SBIS3.CONTROLS.SwitchableArea',
   'js!SBIS3.CONTROLS.TabButtons'
], function(CompoundControl, dotTplFn) {

   'use strict';

   /**
    * Контрол, содержащий несколько областей содержащих контент.
    * В каждый момент времени отображается только одна область. Отображаемая область может переключаться при клике на корешки закладок.
    * @class SBIS3.CONTROLS.TabControl
    * @extends SBIS3.CORE.CompoundControl
    * @control
    * @author Крайнов Дмитрий Олегович
    */

   var TabControl = CompoundControl.extend( /** @lends SBIS3.CONTROLS.TabControl.prototype */ {
      _dotTplFn : dotTplFn,
      $protected: {
         _tabButtons: null,
         _switchableArea: null,
         _options: {
            /**
             * @cfg {String} Ключ выбранной записи.
             * @see keyField
             */
            selectedKey: null,
            /**
             * @cfg {String} Наименование поля из которого будет браться содержимое вкладки (корешка)
             */
            tabsDisplayField: null,
            /**
             * @cfg {String} Название поля-идентификатора записи. Например 'id'
             * @see selectedKey
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
      },

      init: function() {
         TabControl.superclass.init.call(this);
         this._switchableArea = this.getChildControlByName('SwitchableArea');
         this._switchableArea.setActiveArea(this._options.selectedKey);
         this._tabButtons = this.getChildControlByName('TabButtons');
         this._tabButtons.subscribe('onSelectedItemChange', this._onSelectedItemChange.bind(this));

         //передаем элементы заданные TabControl-у
         this.setItems(this._options.items);
      },

      setItems: function(items) {
         this._tabButtons.setItems(items);
         this._switchableArea.setItems(items);
      },

      _onSelectedItemChange: function(event, id) {
         this._options.selectedKey = id;
         this._switchableArea._options.defaultArea = id;
         this._switchableArea.setActiveArea(id);
      }
   });

   return TabControl;

});