/**
 * Created by iv.cheremushkin on 28.08.2014.
 */

define('SBIS3.CONTROLS/PasswordTextBox', [
   'SBIS3.CONTROLS/TextBox',
   'tmpl!SBIS3.CONTROLS/PasswordTextBox/resources/showPasswordTemplate',
   'Core/CommandDispatcher',
   'SBIS3.CONTROLS/WSControls/Buttons/Button',
    'css!Controls/Input/Password/Password'
], function (TextBox, showPasswordTemplate, CommandDispatcher) {

   'use strict';
   /**
    * Поле ввода пароля.
    * @class SBIS3.CONTROLS/PasswordTextBox
    * @extends SBIS3.CONTROLS/TextBox
    * @mixes Controls/Input/interface/PasswordDocs
    * @author Крайнов Д.О.
    * @demo Examples/PasswordTextBox/MyPasswordTextBox/MyPasswordTextBox
    *
    * @ignoreOptions independentContext contextRestriction isContainerInsideParent owner stateKey subcontrol textTransform
    * @ignoreOptions element linkedContext handlers parent autoHeight autoWidth horizontalAlignment verticalAlignment
    *
    * @ignoreMethods applyEmptyState applyState findParent getAlignment getEventHandlers getEvents getExtendedTooltip
    * @ignoreMethods getId getLinkedContext getMinHeight getMinSize getMinWidth getOwner getOwnerId getParentByClass
    * @ignoreMethods getParentByName getParentByWindow getStateKey getTopParent getUserData hasEvent hasEventHandlers
    * @ignoreMethods isDestroyed isSubControl makeOwnerName once sendCommand setOwner setStateKey setUserData setValue
    * @ignoreMethods subscribe unbind unsubscribe
    *
    * @ignoreEvents onDragIn onDragMove onDragOut onDragStart onDragStop onStateChanged onTooltipContentRequest onChange
    * @ignoreEvents onReady
    *
    * @public
    * @category Input
    * @control
    */
   var PasswordTextBox;
   PasswordTextBox = TextBox.extend(/** @lends SBIS3.CONTROLS/PasswordTextBox.prototype */ {
      $protected: {
         _options: {
            afterFieldWrapper: showPasswordTemplate,
            type: "password",
            /**
             * @cfg {Boolean} Определяет режим просмотра введенного пароля
             * * true Показать иконку просмотра пароля.
             * * false Скрыть иконку просмотра пароля.
             */
            showPassword: false
         }
      },

      $constructor: function() {
         CommandDispatcher.declareCommand(this, 'togglePasswordVisibility', this._togglePasswordVisibility.bind(this));
      },

      init: function() {
         PasswordTextBox.superclass.init.apply(this, arguments);
         if (this._options.showPassword) {
            this._passwordIcon = $('.controls-PasswordTextBox__showPassword', this.getContainer());
         }
      },

      /**
       * Изменяет тип поля с password на text и обратно 
       */
      _togglePasswordVisibility: function () {
         this._options.type = this._options.type === "password" ? "text" : "password";
         this._inputField.attr("type", this._options.type);
         this._passwordIcon.attr('title', this._options.type === 'password' ? rk('Показать') : rk('Скрыть'));
         this._passwordIcon.toggleClass('icon-Show', this._options.type === 'password');
         this._passwordIcon.toggleClass('icon-Hide', this._options.type === 'text');
      },
   
      // Заглушка, у поля пароля не должна показываться подсказка
      _applyTooltip: function() {}
   });

   return PasswordTextBox;

});
