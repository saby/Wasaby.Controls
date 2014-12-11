/**
 * Created by iv.cheremushkin on 13.08.2014.
 */

define('js!SBIS3.CONTROLS.ButtonGroupBase', ['js!SBIS3.CORE.CompoundControl', 'js!SBIS3.CONTROLS._CollectionMixin',   'js!SBIS3.CONTROLS._DataBindMixin', 'css!SBIS3.CONTROLS.ButtonGroupBase'], function(CompoundControl, _CollectionMixin, _DataBindMixin) {

   'use strict';

   /**
    * Контрол, реализующий поведение выбора одного из нескольких значений при помощи набора радиокнопок. Отображения не имеет.
    * @class SBIS3.CONTROLS.ButtonGroupBase
    * @mixes SBIS3.CONTROLS._CollectionMixin
    * @mixes SBIS3.CONTROLS._SelectorMixin
    * @extends SBIS3.CORE.CompoundControl
    */

   var ButtonGroupBase = CompoundControl.extend([_CollectionMixin, _DataBindMixin], /** @lends SBIS3.CONTROLS.ButtonGroupBase.prototype */ {
      $protected: {
         _options: {

         }
      },

      $constructor: function() {
         this._container.removeClass('ws-area');
      },

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