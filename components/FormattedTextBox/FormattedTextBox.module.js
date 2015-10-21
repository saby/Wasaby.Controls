define('js!SBIS3.CONTROLS.FormattedTextBox', ['js!SBIS3.CONTROLS.FormattedTextBoxBase', 'html!SBIS3.CONTROLS.FormattedTextBox'], function (FormattedTextBoxBase, dotTplFn) {

   'use strict';

   /**
    * Можно вводить только значения особого формата.
    * В поле ввода уже заранее будут введены символы, определяющие формат (например, скобки и тире для телефона)
    * и останется ввести только недостающие символы.
    * @class SBIS3.CONTROLS.FormattedTextBox
    * @extends SBIS3.CONTROLS.FormattedTextBoxBase
    * @control
    * @demo SBIS3.CONTROLS.Demo.MyFormattedTextBox
    * @public
    * @initial
    * <component data-component='SBIS3.CONTROLS.FormattedTextBox' style="width:150px;">
    * </component>
    * @category Inputs
    * @author Крайнов Дмитрий Олегович
    *
    * @ignoreOptions independentContext contextRestriction extendedTooltip
    * @ignoreOptions element linkedContext handlers parent autoHeight autoWidth horizontalAlignment
    * @ignoreOptions isContainerInsideParent owner stateKey subcontrol verticalAlignment
    *
    * @ignoreMethods applyEmptyState applyState findParent getAlignment getEventHandlers getEvents getExtendedTooltip
    * @ignoreMethods getId getLinkedContext getMinHeight getMinSize getMinWidth getOwner getOwnerId getParentByClass
    * @ignoreMethods getParentByName getParentByWindow getStateKey getTopParent getUserData hasEvent hasEventHandlers
    * @ignoreMethods isDestroyed isSubControl makeOwnerName once sendCommand setOwner setStateKey setUserData setValue
    * @ignoreMethods subscribe unbind unsubscribe unsubscribeFrom
    *
    * @ignoreEvents onDragIn onDragMove onDragOut onDragStart onDragStop onStateChanged onTooltipContentRequest onChange
    * @ignoreEvents onReady
    */

   var FormattedTextBox = FormattedTextBoxBase.extend(/** @lends SBIS3.CONTROLS.FormattedTextBox.prototype */{
      $protected: {
         _dotTplFn: dotTplFn,
         /**
          * Опции создаваемого контролла
          */
         _options: {
            /**
             * @cfg {String} Маска, на базе которой будет создана html-разметка и в соответствии с которой
             * будет определён весь функционал.
             * Маска вида: "Lll:xdd", где
             * <ul>
             *    <li>L - заглавная буква (русский/английский алфавит),</li>
             *    <li>l - строчная буква,</li>
             *    <li>d - цифра,</li>
             *    <li>x - буква или цифра,</li>
             *    <li>все остальные символы являются разделителями.</li>
             * </ul>
             * @example
             * <pre>
             *     mask: 'dd ddd dddd/dd'
             * </pre>
             */
            mask: ''
         }
      },

      $constructor: function () {

      },

      /**
       * Получить маску. Переопределённый метод
       * Работа с опцией вынесена была из FormattedTextBoxBase, для того,
       * чтобы при желании в детях нельзя было переопределить маску.
       * Например в поле email, или телефон. Если мы это выносим в Base, то эта опция будет доступна везде.
       * Нам это не нужно. (Бегунов А.В.)
       * @returns {*}
       * @private
       */
      _getMask: function () {
         return this._options.mask;
      }
   });

   return FormattedTextBox;
});