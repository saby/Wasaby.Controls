/**
 * Created by iv.cheremushkin on 13.08.2014.
 */

define('js!SBIS3.CONTROLS.ButtonGroupBaseDS', ['js!SBIS3.CORE.CompoundControl', 'js!SBIS3.CONTROLS.DSMixin',   'js!SBIS3.CONTROLS.DataBindMixin'], function(CompoundControl, DSMixin, DataBindMixin) {

   'use strict';

   /**
    * Контрол, реализующий поведение выбора одного из нескольких значений при помощи набора радиокнопок. Отображения не имеет.
    * @class SBIS3.CONTROLS.ButtonGroupBaseDS
    * @public
    * @mixes SBIS3.CONTROLS.DSMixin
    * @mixes SBIS3.CONTROLS.DataBindMixin
    * @extends $ws.proto.CompoundControl
    * @author Крайнов Дмитрий Олегович
    */

   var ButtonGroupBase = CompoundControl.extend([DSMixin, DataBindMixin], /** @lends SBIS3.CONTROLS.ButtonGroupBaseDS.prototype */ {
      $protected: {
         _options: {
            captionField : ''
         },
         /**
          * Элементы были задаты в верстке
          */
         _hasItems: null
      },

      $constructor: function() {
         this._container.removeClass('ws-area');

         if (this._options.captionField) {
            this._options.displayField = this._options.captionField;
            $ws.single.ioc.resolve('ILogger').log('ButtonGroupBase', 'Опция "captionField" устарела. Используйте опцию "displayField".');
         }

         this._hasItems = this._container.hasClass('hasItems');
      },

      init : function() {
         ButtonGroupBase.superclass.init.call(this);
         //TODO Временно сделали reload безусловно, т.к. getItems() не возвращал элементы. Но теперь есть перерисовка лишняя.
         //Если элементы были заданы в верстке (используем в CONTROLS.TabButtons), то не перезагружаем
         /*if (this._hasItems) {
          this._drawItemsCallback();
          } else {*/
            this.reload();
         /*}*/
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
                  var id = this.getContainer().data('id');
                  self._itemActivatedHandler(id, event);
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