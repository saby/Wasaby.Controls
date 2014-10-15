/**
 * Created by iv.cheremushkin on 13.08.2014.
 */

define('js!SBIS3.CONTROLS.ButtonGroupBase', ['js!SBIS3.CORE.CompoundControl', 'js!SBIS3.CONTROLS._CollectionMixin', 'css!SBIS3.CONTROLS.ButtonGroupBase'], function(CompoundControl, _CollectionMixin) {

   'use strict';

   /**
    * Контрол, реализующий поведение выбора одного из нескольких значений при помощи набора радиокнопок. Отображения не имеет.
    * @class SBIS3.CONTROLS.ButtonGroupBase
    * @mixes SBIS3.CONTROLS._CollectionMixin
    * @mixes SBIS3.CONTROLS._SelectorMixin
    * @extends SBIS3.CORE.CompoundControl
    */

   var ButtonGroupBase = CompoundControl.extend([_CollectionMixin], /** @lends SBIS3.CONTROLS.ButtonGroupBase.prototype */ {
      $protected: {
         _options: {

         }
      },

      $constructor: function() {

      },

      /*_drawItems : function() {
         this._container.empty();
         var self = this;

         this._items.iterate(function (item, key) {
            var
               insContainer = $('<div></div>').attr('data-key', key).appendTo(self._container),
               ins = self._createInstance(item, insContainer);
            if (ins) {
               ins.subscribe('onActivated', function(){
                  self._itemActivatedHandler(this);
               });
            }
         });
      },*/

      _getItemClass : function() {
         /*метод должен быть перегружен*/
         return false;
      },

      _itemActivatedHandler : function() {
         /*метод должен быть перегружен*/
      },

      _getAddOptions : function() {
         return {};
      },

      _getItemTemplate : function(item) {
         var
            self = this,
            config = this._getAddOptions(item);

         config.handlers = config.handlers || {};
         config.handlers.onActivated = function() {
            self._itemActivatedHandler(this);
         };

         return function() {
            return {
               componentType : self._getItemClass(),
               config : config
            };
         }
      }
   });

   return ButtonGroupBase;

});