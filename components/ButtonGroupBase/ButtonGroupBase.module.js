/**
 * Created by iv.cheremushkin on 13.08.2014.
 */

define('js!SBIS3.CONTROLS.ButtonGroupBase', ['js!SBIS3.CORE.CompoundControl', 'js!SBIS3.CONTROLS.CollectionMixin',   'js!SBIS3.CONTROLS.DataBindMixin'], function(CompoundControl, CollectionMixin, DataBindMixin) {

   'use strict';

   /**
    * Контрол, реализующий поведение выбора одного из нескольких значений при помощи набора радиокнопок.
    * Отображения не имеет.
    * @class SBIS3.CONTROLS.ButtonGroupBase
    * @public
    * @mixes SBIS3.CONTROLS.CollectionMixin
    * @mixes SBIS3.CONTROLS.Selectable
    * @extends $ws.proto.CompoundControl
    * @author Крайнов Дмитрий Олегович
    */

   var ButtonGroupBase = CompoundControl.extend([CollectionMixin, DataBindMixin], /** @lends SBIS3.CONTROLS.ButtonGroupBase.prototype */ {
      $protected: {
         _options: {

         }
      },

      $constructor: function() {
         this._container.removeClass('ws-area');
      },

      setEnabled: function (enabled) {
         ButtonGroupBase.superclass.setEnabled.call(this, enabled);
         var itemsInstances = this.getItemsInstances();
         for (var i in itemsInstances) {
            if (itemsInstances.hasOwnProperty(i)) {
               itemsInstances[i].setEnabled(enabled);
            }
         }
      },      

      _getItemClass : function(config) {
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

         if (config.handlers.onActivated) {
            config.handlers.onActivated = [config.handlers.onActivated];
            Array.insert(config.handlers.onActivated, 0, function() {
               self._itemActivatedHandler(this);
            })
         }
         else {
            config.handlers.onActivated = function () {
               self._itemActivatedHandler(this);
            };
         }

         return function() {
            return {
               componentType : self._getItemClass(config),
               config : config
            };
         }
      }
   });

   return ButtonGroupBase;

});