/**
 * Created by am.gerasimov on 01.10.2015.
 */
define('js!SBIS3.CONTROLS.FieldLinkTextBox',
   [
      'js!SBIS3.CONTROLS.TextBox',
      'tmpl!SBIS3.CONTROLS.FieldLinkTextBox/afterFieldWrapper',
      'tmpl!SBIS3.CONTROLS.FieldLinkTextBox/beforeFieldWrapper'
   ], function(TextBox, afterFieldWrapper, beforeFieldWrapper) {

   'use strict';


   var FieldLinkTextBox = TextBox.extend(/** @lends SBIS3.CONTROLS.TextBox.prototype */ {
      $protected: {
         _options: {
            afterFieldWrapper: afterFieldWrapper,
            beforeFieldWrapper: beforeFieldWrapper,
            /**
             * Признак того, что у поля связи включен множественный выбор
             */
            fieldLinkWithMultiSelect: false
         }
      },

      $constructor: function() {
         if(this._options.placeholder && !this._compatPlaceholder) {
            this._inputField[0].removeAttribute('placeholder');
            this._createCompatPlaceholder();
         }

         if(!this._options.fieldLinkWithMultiSelect) {
            this._container.find('.controls-FieldLink__showAllLinks, controls-FieldLink__dropAllLinks').addClass('ws-hidden');
         }
      },
      setInputWidth: function(width) {
         this._inputField[0].style.width = width + 'px';
         if(this._compatPlaceholder) {
            this._compatPlaceholder[0].style.width = width + 'px';
         }
      }
   });

   return FieldLinkTextBox;

});