/* global define, $ws */

/**
 * Created by iv.cheremushkin on 13.08.2014.
 */

define('js!SBIS3.CONTROLS.ButtonGroupBaseDSNew', [
   'js!SBIS3.CORE.CompoundControl',
   'js!SBIS3.CONTROLS.ButtonGroupBaseDSView',
   'js!SBIS3.CONTROLS.ListControlMixin',
   'js!SBIS3.CONTROLS.DisplayFieldMixin',
   'js!SBIS3.CONTROLS.DataBindMixin'
], function(CompoundControl, ButtonGroupBaseView, ListControlMixin, DisplayFieldMixin, DataBindMixin) {

   'use strict';

   /**
    * Контрол, реализующий поведение выбора одного из нескольких значений при помощи набора кнопок. Отображения не имеет.
    * *Это экспериментальный модуль, API будет меняться!*
    * @class SBIS3.CONTROLS.ButtonGroupBaseDSNew
    * @state mutable
    * @mixes SBIS3.CONTROLS.ListControlMixin
    * @mixes SBIS3.CONTROLS.DisplayFieldMixin
    * @mixes SBIS3.CONTROLS.DataBindMixin
    * @extends $ws.proto.CompoundControl
    * @author Крайнов Дмитрий Олегович
    */

   var ButtonGroupBase = CompoundControl.extend([ListControlMixin, DisplayFieldMixin, DataBindMixin], /** @lends SBIS3.CONTROLS.ButtonGroupBaseDSNew.prototype */ {
      $protected: {
         _viewConstructor: ButtonGroupBaseView
      },

      $constructor: function() {
         this._container.removeClass('ws-area');
      },

      init: function () {
         ButtonGroupBase.superclass.init.call(this);

         this._initView();

         var self = this,
            onItemActivated = function() {
               self._itemActivatedHandler(
                  Array.indexOf(
                     self.getGroupControls(),
                     this
                  )
               );
            };

         $ws.helpers.forEach(this.getGroupControls(), function(component){
            component.subscribe('onActivated', onItemActivated);
         });
         
         //FIXME: допилить механизм отслеживания изменений в DOM
         /*presenter.onAddComponents(function(components) {
               for (var i = 0; i < components.length; i ++) {
                  components[i].subscribe('onActivated', onItemActivated);
               }
            }, this)
            .onRemoveComponents(function(components) {
               for (var i = 0; i < components.length; i ++) {
                  components[i].unsubscribe('onActivated', onItemActivated);
               }
            }, this);*/
      },

      getGroupControls: function() {
         return ButtonGroupBase.superclass.getChildControls.call(this);
      },

      setEnabled: function (enabled) {
         ButtonGroupBase.superclass.setEnabled.call(this, enabled);
         $ws.helpers.forEach(this.getGroupControls(), function(component){
            component.setEnabled(enabled);
         });
      },


      _itemActivatedHandler : function(index) {
         /*метод должен быть перегружен*/
      }
   });

   return ButtonGroupBase;

});