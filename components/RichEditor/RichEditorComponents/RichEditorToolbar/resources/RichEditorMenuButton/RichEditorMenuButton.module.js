/**
 * Created by ps.borisov on 27.11.2015.
 */
define('js!SBIS3.CONTROLS.RichEditor.RichEditorMenuButton', ['js!SBIS3.CONTROLS.MenuButton', 'html!SBIS3.CONTROLS.RichEditor.RichEditorMenuButton'], function(MenuButton, dotTplFn) {
   'use strict';
   var
      RichEditorMenuButton = MenuButton.extend(/** @lends $ws.proto.FieldRichEditorMenuButton.prototype */{
      $protected: {
         _options: {
            /**
             * @cfg {Boolean} Скрывать ли "header" (блок соединяющийц кнопку и сам список)
             * <wiTag group="Управление">
             * @example
             * <pre>
             *     <option name="withoutHeader">true</option>
             * </pre>
             */
            withoutHeader: false
         }
      },
      _modifyOptions: function (options) {
         options = RichEditorMenuButton.superclass._modifyOptions.apply(this, arguments);
         options.pickerClassName = options.pickerClassName + ' controls-MenuButton__Menu controls-RichEditorToolbar__menuButtonPicker controls-Menu__hide-menu-header';
         options.pickerClassName = options.withoutHeader ? options.pickerClassName + ' controls-MenuButton__withoutHeader' : options.pickerClassName;
         return options;
      },

      $constructor: function() {
         if (this._options.withoutHeader ){
            this._header = $('<div>').css('display','none');
            this._container.addClass('controls-MenuButton__withoutHeader');
         }
      },
      _initializePicker: function() {
         RichEditorMenuButton.superclass._initializePicker.apply(this, arguments);
         this._picker.setOpener(this._options.opener);
         this._picker.getContainer().on('mousedown focus', function(event) {
            event.preventDefault();
            event.stopPropagation();
         });
      },
      _setPickerSizes: function() {
         this._picker && this._picker.getContainer().css({'min-width': this.getContainer().outerWidth() - this._border});
      },

      _setHeaderSizes: function() {
         RichEditorMenuButton.superclass._setHeaderSizes.apply(this, arguments);
         if (this._header) {
            this._header.addClass('controls-RichEditorToolbar__menuButtonHeader');
         }
      },
      _dotTplFn: dotTplFn
   });
   return RichEditorMenuButton;
});