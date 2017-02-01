/**
 * Created by iv.cheremushkin on 13.08.2014.
 */

define('js!SBIS3.CONTROLS.ButtonGroupBaseDS', [
   "Core/IoC",
   "Core/ConsoleLogger",
   "js!SBIS3.CORE.CompoundControl",
   "js!SBIS3.CONTROLS.DSMixin",
   "js!SBIS3.CONTROLS.DataBindMixin"
], function( IoC, ConsoleLogger,CompoundControl, DSMixin, DataBindMixin) {

   'use strict';

   /**
    * Класс, реализующий поведение выбора одного из нескольких значений при помощи набора радиокнопок. Отображения не имеет.
    * @class SBIS3.CONTROLS.ButtonGroupBaseDS
    * @extends $ws.proto.CompoundControl
    *
    * @mixes SBIS3.CONTROLS.DSMixin
    * @mixes SBIS3.CONTROLS.DataBindMixin
    *
    * @ignoreEvents onAfterLoad onChange onStateChange
    * @ignoreEvents onDragStop onDragIn onDragOut onDragStart
    *
    * @public
    *
    * @author Крайнов Дмитрий Олегович
    */

   var ButtonGroupBase = CompoundControl.extend([DSMixin, DataBindMixin], /** @lends SBIS3.CONTROLS.ButtonGroupBaseDS.prototype */ {
      $protected: {
         _options: {
            displayProperty : ''
         },
         /**
          * Элементы были заданы в верстке
          */
         _hasItems: null
      },

      $constructor: function() {
         

         if (this._options.displayField) {
            this._options.displayProperty = this._options.displayField;
            IoC.resolve('ILogger').log('ButtonGroupBase', 'Опция "captionField" устарела. Используйте опцию "displayProperty".');
         }

         this._hasItems = this._container.hasClass('hasItems');
      },

      init : function() {
         ButtonGroupBase.superclass.init.call(this);
         //чтобы items построить
         this.reload();
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

      //TODO заплатка из-за отрисовки на сервере
      redraw: function(){
         if ( ! this._hasItems) {
            this._redraw();
         } else {
            this._drawItemsCallback();
         }
         this._hasItems = false;
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