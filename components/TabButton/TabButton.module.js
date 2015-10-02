/**
 * Модуль 'Компонент кнопка'.
 *
 * @description
 */
define('js!SBIS3.CONTROLS.TabButton',
   ['js!SBIS3.CONTROLS.RadioButtonBase', 'html!SBIS3.CONTROLS.TabButton', 'js!SBIS3.CONTROLS.EditAtPlace'], function (RadioButtonBase, dotTplFn, EditAtPlace) {

   'use strict';
   /**
    * Контрол, отображающий корешок закладки. Работает только в составе группы. В джине не вытаскивается
    * @class SBIS3.CONTROLS.TabButton
    * @extends SBIS3.CONTROLS.RadioButtonBase
    * @author Крайнов Дмитрий Олегович
    */
   var TabButton = RadioButtonBase.extend(/** @lends SBIS3.CONTROLS.TabButton.prototype */ {
      $protected: {
         _options: {
            align: 'right',
            additionalText: '',
            editable: false,
            template: undefined
         }
      },
      _dotTplFn: dotTplFn,

      $constructor: function () {
         this._setTabButtonTemplate();
         this.getLinkedContext().setValue('contextfield', this._options.caption);
      },
       _setTabButtonTemplate: function(){
          if (!this._options.template){
             return;
          }
          var element = this.getContainer().find('.controls-TabButton__inner'),
              tpl = this.getParent()._buildTplItem({}, this._options.template);
          element.html(tpl);
       }

   });

   return TabButton;

});