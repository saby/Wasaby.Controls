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
         options = MenuButton.superclass._modifyOptions.apply(this, arguments);
         options.pickerClassName = options.pickerClassName + ' controls-MenuButton__Menu controls-RichEditor__MenuButtonPicker';
         options.pickerClassName = options.withoutHeader ? options.pickerClassName + ' controls-MenuButton__withoutHeader' : options.pickerClassName;
         return options;
      },

      $constructor: function() {
         if (this._options.withoutHeader ){
            this._header = $('<div>').css('display','none');
            this._container.addClass('controls-MenuButton__withoutHeader');
         }
         this.getContainer().on('mouseenter',this._mouseEnterHandler.bind(this));
      },
      _mouseEnterHandler: function(){
         if (this.getItems().getRawData().length) {
            this.getContainer().addClass('controls-Checked__checked');
            this.showPicker();
            this._picker.getContainer().on('mouseleave', this._mouseLeaveHandler.bind(this));
            this.getContainer().on('mouseleave', this._mouseLeaveHandler.bind(this));
            this._header.on('mouseleave', this._mouseLeaveHandler.bind(this));
         }
      },
      _mouseLeaveHandler: function(e) {
         var
            $target = $(e.relatedTarget);
         if (!$target.closest(this._picker.getContainer()).length && !$target.closest(this.getContainer()).length && !$target.closest(this._header).length) {
            this.hidePicker();
            this._header.addClass('ws-hidden');
         }
      },
      _initializePicker: function() {
         MenuButton.superclass._initializePicker.apply(this, arguments);
         this._picker.setOpener(this._options.opener);
      },
      _setWidth: function() {
         var self = this;
         this._picker && this._picker.getContainer().css({'min-width': self.getContainer().outerWidth() - this._border});
         if (this._header) {
            this._header.addClass('controls-RichEditor__MenuButtonHeader');
            $('.controls-MenuButton__headerCenter', this._header).width(this.getContainer().outerWidth() - 26);
         }
      },
      _clickHandler: function(){
         return false;
      },
      _dotTplFn: dotTplFn
   });
   return RichEditorMenuButton;
});