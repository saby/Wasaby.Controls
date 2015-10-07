/* global define, $ws */

/**
 * Created by iv.cheremushkin on 13.08.2014.
 */

define('js!SBIS3.CONTROLS.ButtonGroupBaseDSNew', [
   'js!SBIS3.CORE.CompoundControl',
   'js!SBIS3.CONTROLS.ButtonGroupBaseDSView',
   'js!SBIS3.CONTROLS.CollectionControlMixin',
   'js!SBIS3.CONTROLS.ListControlMixin',
   'js!SBIS3.CONTROLS.DisplayFieldMixin',
   'js!SBIS3.CONTROLS.DataBindMixin'
], function(CompoundControl, ButtonGroupBaseView, CollectionControlMixin, ListControlMixin, DisplayFieldMixin, DataBindMixin) {

   'use strict';

   /**
    * Контрол, реализующий поведение выбора одного из нескольких значений при помощи набора кнопок. Отображения не имеет.
    * @class SBIS3.CONTROLS.ButtonGroupBaseDSNew
    * @public
    * @mixes SBIS3.CONTROLS.CollectionControlMixin
    * @mixes SBIS3.CONTROLS.ListControlMixin
    * @mixes SBIS3.CONTROLS.DisplayFieldMixin
    * @mixes SBIS3.CONTROLS.DataBindMixin
    * @extends $ws.proto.CompoundControl
    * @author Крайнов Дмитрий Олегович
    */

   var ButtonGroupBase = CompoundControl.extend([CollectionControlMixin, ListControlMixin, DisplayFieldMixin, DataBindMixin], /** @lends SBIS3.CONTROLS.ButtonGroupBase.prototype */ {
      $protected: {
         _options: {
            captionField: ''
         },
         _viewConstructor: ButtonGroupBaseView
      },

      $constructor: function() {
         this._container.removeClass('ws-area');

         if (this._options.captionField) {
            this._options.displayField = this._options.captionField;
            $ws.single.ioc.resolve('ILogger').log('ButtonGroupBase', 'Опция "captionField" устарела. Используйте опцию "displayField".');
         }
      },

      init: function () {
         this._initView();

         var self = this,
            onItemActivated = function() {
               self._itemActivatedHandler(
                  Array.indexOf(
                     self._getView().getComponents(),
                     this
                  )
               );
            },
            presenter = this._getPresenter();

         $ws.helpers.forEach(this._getView().getComponents(),function(component){
            component.subscribe('onActivated', onItemActivated);
         });
         presenter.onAddComponents(function(components) {
               for (var i = 0; i < components.length; i ++) {
                  components[i].subscribe('onActivated', onItemActivated);
               }
            }, this)
            .onRemoveComponents(function(components) {
               for (var i = 0; i < components.length; i ++) {
                  components[i].unsubscribe('onActivated', onItemActivated);
               }
            }, this);
         /*$ws.helpers.forEach(this._getView().getComponents(), function(control) {
          control.subscribe('onActivated', onItemActivated);
          });*/
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


      _itemActivatedHandler : function(index) {
         /*метод должен быть перегружен*/
      }
   });

   return ButtonGroupBase;

});