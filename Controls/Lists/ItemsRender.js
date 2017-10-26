/**
 * Created by kraynovdo on 18.10.2017.
 */
/**
 * Created by kraynovdo on 22.09.2017.
 */
define('js!Controls/Lists/ItemsRender', [
   'Core/core-extend',
   'Core/Control',
   'tmpl!Controls/Lists/ItemsRender',
   'js!Controls/Lists/resources/utils/ItemsUtil',
   'WS.Data/Type/descriptor'
], function (extend,
             BaseControl,
             ItemsRenderTpl,
             ItemsUtil,
             Types
   ) {
   'use strict';

   var ItemsRender = BaseControl.extend(
      {
         _controlName: 'Controls/Lists/ItemsRender',
         _startIndex: 0,
         _stopIndex: 0,
         _curIndex: 0,
         iWantVDOM: true,
         _isActiveByClick: false,
         _template: ItemsRenderTpl,

         constructor: function (cfg) {
            ItemsRender.superclass.constructor.apply(this, arguments);
            this._display = cfg.display;
            this._initIndices();
         },


         _initIndices: function() {
            this._startIndex = 0;
            this._stopIndex = this._display.getCount();
         },


         _beforeMount: function() {
            this._initIndices();
         },

         _beforeUpdate: function(newOptions) {
            this._initIndices();
         },


         _getStartEnumerationPosition: function() {
            this._curIndex = this._startIndex;
         },

         _getNextEnumerationPosition: function() {
            this._curIndex++;
         },

         _checkConditionForEnumeration: function() {
            return this._curIndex < this._stopIndex;
         },

         _getPropertyValue: function(itemContents, field) {
            return ItemsUtil.getPropertyValue(itemContents, field);
         }
      });
   return ItemsRender;
});