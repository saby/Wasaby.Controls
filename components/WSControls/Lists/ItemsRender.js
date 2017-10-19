/**
 * Created by kraynovdo on 18.10.2017.
 */
/**
 * Created by kraynovdo on 22.09.2017.
 */
define('js!WSControls/Lists/ItemsRender', [
   'Core/core-extend',
   'Core/Control',
   'tmpl!WSControls/Lists/ItemsRender',
   'js!WSControls/Lists/resources/utils/ItemsUtil',
   'js!WS.Data/Type/descriptor'
], function (extend,
             BaseControl,
             ItemsRenderTpl,
             ItemsUtil,
             Types
   ) {
   'use strict';

   var ItemsRender = BaseControl.extend(
      {
         _controlName: 'WSControls/Lists/ItemsRender',
         _startIndex: 0,
         _stopIndex: 0,
         _curIndex: 0,
         iWantVDOM: true,
         _isActiveByClick: false,
         _template: ItemsRenderTpl,
         _display: null,

         constructor: function (cfg) {
            ItemsRender.superclass.constructor.apply(this, arguments);
            this._onCollectionChangeFnc = this._onCollectionChange.bind(this);

            this._display = cfg.display;
            this._initIndices();
         },


         _initIndices: function() {
            this._startIndex = 0;
            this._stopIndex = this._display.getCount();
         },


         _beforeUpdate: function(newOptions) {
            if (newOptions.display != this._options.display) {
               this._display = newOptions.display;
               this._initIndices();
            }
         },


         _onCollectionChange: function() {
            //TODO где должно быть это? в itemsView или здесь?
            this._initIndices();
            this._forceUpdate();
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
         },

         _getItemData: function(dispItem, index) {
            return {};
         }
      });
   return ItemsRender;
});