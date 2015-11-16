/**
 * Модуль 'Компонент кнопка'.
 *
 * @description
 */
define('js!SBIS3.CONTROLS.TabButton',
   ['js!SBIS3.CONTROLS.RadioButtonBase', 'html!SBIS3.CONTROLS.TabButton', 'html!SBIS3.CONTROLS.TabButton/TabContentTpl'], function (RadioButtonBase, dotTplFn, tabContentTpl) {

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
            /**
             * @cfg {String} С какой стороны контейнера отображать вкладку
             * @variant right с правой стороы
             * @variant left с левой стороны
             * @example
             * <pre>
             *     <option name="align">left</option>
             * </pre>
             */
            align: 'right',
            /**
             * @cfg {String} css класс иконки
             * @example
             * <pre>
             *     <option name="icon">icon-16 icon-Archive icon-primary action-hover</option>
             * </pre>
             */
            icon: '',
            /**
             * @cfg {HTML} Шаблон, отображаемый внутри вкладки
             * @example
             * <pre>
             *    <option name="template">
             *       <component data-component="SBIS3.CONTROLS.Link" class="controls-BackButton__caption" name="BackButton-caption">\
             *          <option name="caption">Ссылка</option>\
             *          <option name="name">lk</option>\
             *       </component>
             *    </option>
             * </pre>
             */
            template: tabContentTpl
         }
      },
      _dotTplFn: dotTplFn,

      $constructor: function () {
      }
   });

   return TabButton;

});