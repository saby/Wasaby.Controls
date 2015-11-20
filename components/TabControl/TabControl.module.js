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
    * @author Крайнов Дмитрий Олегович
    */

   var TabControl = CompoundControl.extend( /** @lends SBIS3.CONTROLS.TabControl.prototype */ {
      _dotTplFn : dotTplFn,
      $protected: {
         _tabButtons: null,
         _switchableArea: null,
         _options: {
            selectedKey: null,
            displayField: null,
            keyField: null,
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
         this._tabButtons = this.getChildControlByName('TabButtons');
         this._tabButtons.subscribe('onSelectedItemChange', this._onSelectedItemChange.bind(this));
      },

      _onSelectedItemChange: function(event, id) {
         this._switchableArea.setActiveArea(id);
      }
   });

   return TabControl;

});