define('js!SBIS3.CORE.DateRange/design/DesignPlugin',
   [
      "js!SBIS3.CORE.DateRange",
      'js!SBIS3.CORE.FieldDate/design/DesignPlugin',
      'js!SBIS3.CORE.FieldFormatAbstract/design/DesignPlugin'
   ],
   function(DateRange){
      
      //endregion

   /**
    * @class $ws.proto.DateRange.DesignPlugin
    * @extends $ws.proto.DateRange
    * нужен, чтобы менять режим отображения через textView
    * @plugin
    */
   $ws.proto.DateRange.DesignPlugin = DateRange.extendPlugin({
      setTextView: function(textView) {
         if(this._options.textView !== textView) {
            this._container.toggleClass('ws-date-range-text-view', textView);
            if(this._textField) {
               this._textField.toggleClass('ws-hidden', !textView);
            // если текстовое отображение не было создано и нужно создать
            } else if(textView) {
               this._createTextField();
            }
            if(this._movingControlsBlock) {
               this._movingControlsBlock.toggleClass('ws-hidden', textView);
            // если отображение через поля даты не было создано и нужно создать
            } else if(!textView) {
               this._createControlsBlock();
            }
            this._options.textView = textView;
         }
      },
      setMask: function(mask) {
         this._dateControls[0].setMask(mask);
         this._dateControls[1].setMask(mask);
         this._changeWidthMovingControlsBlock();
      },
      _hideMenu: function() {
         if(this._options.textView) {
            this._movingControlsBlock.addClass('ws-hidden').prependTo(this._container);
         }
      },
      _showMenu: function(controlNumber) {
         this._movingControlsBlock.removeClass('ws-hidden');
      }
   });
});