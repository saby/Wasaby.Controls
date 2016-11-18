/**
 * Created by iv.cheremushkin on 13.08.2014.
 */

define('js!SBIS3.CONTROLS.ButtonGroupBase', [
   'js!SBIS3.CORE.CompoundControl',
   'js!SBIS3.CONTROLS.ItemsControlMixin',
   'html!SBIS3.CONTROLS.ButtonGroupBase/resources/ItemTemplate'
], function(CompoundControl, ItemsControlMixin, ItemTemplate) {

   'use strict';

   /**
    * Класс, реализующий поведение выбора одного из нескольких значений при помощи набора радиокнопок. Отображения не имеет.
    * @class SBIS3.CONTROLS.ButtonGroupBase
    * @extends $ws.proto.CompoundControl
    *
    * @mixes SBIS3.CONTROLS.ItemsControlMixin
    *
    * @public
    * @author Крайнов Дмитрий Олегович
    */

   var ButtonGroupBase = CompoundControl.extend([ItemsControlMixin], /** @lends SBIS3.CONTROLS.ButtonGroupBase.prototype */ {
      $protected: {
         _options: {
            _defaultItemTemplate: ItemTemplate
         },
         /**
          * Элементы были заданы в верстке
          */
         _hasItems: null
      },

      $constructor: function() {
         this._container.removeClass('ws-area');
         this._hasItems = this._container.hasClass('hasItems');
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

      _drawItemsCallback : function(){
         var
             controls = this.getItemsInstances(),
             self = this;
         for (var i in controls) {
            if (controls.hasOwnProperty(i)) {
               controls[i].subscribe('onActivated', function (busEvent, event) {
                  var hash = this.getContainer().data('hash');
                  self._itemActivatedHandler(hash, event);
               });
            }
         }
      },

      _itemActivatedHandler : function(id, event) {
         /*метод должен быть перегружен*/
      },

      /**
       * Переопределённый метод из базового Control
       * Нужен, чтобы быстро работало скртие контрола,
       * Не запускались расчёты авторазмеров
       */
      _setVisibility: function(show) {
         this._container.toggleClass('ws-hidden', !show);
         this._isVisible = show;
      }
   });

   return ButtonGroupBase;

});