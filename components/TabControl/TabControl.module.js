define('js!SBIS3.CONTROLS.TabControl', [
   'js!SBIS3.CORE.CompoundControl',
   'html!SBIS3.CONTROLS.TabControl',
   'js!SBIS3.CONTROLS.SwitchableArea',
   'js!SBIS3.CONTROLS.TabButtons',
   'js!SBIS3.CONTROLS.Link'
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
         _options: {
            selectedKey: null,
            displayField: null,
            keyField: null,
            loadType: 'cached'
         }
      },

      $constructor: function() {
         this._context.setValueSelf(contextName+'/items',this._options.items);
      },

      init: function() {
         TabControl.superclass.init.call(this);
         this._tabButtons = this.getChildControlByName('TabButtons');
         this._tabButtons.subscribe('onSelectedItemChange', this._onSelectedItemChange);
         this._switchableArea = this.getChildControlByName('SwitchableArea');
      },

      _onSelectedItemChange: function() {
         //console.log('onSelectedItemChange 2');

      }
   });

   return TabControl;

});