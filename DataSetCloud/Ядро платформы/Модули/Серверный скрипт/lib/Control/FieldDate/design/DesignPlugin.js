define('js!SBIS3.CORE.FieldDate/design/DesignPlugin',
   [
      'js!SBIS3.CORE.FieldDate',
      'js!SBIS3.CORE.FieldFormatAbstract/design/DesignPlugin'
   ],
   function(FieldDate){
      $ws.proto.FieldDate.DesignPlugin = FieldDate.extendPlugin({
         /**
          * <wiTag group="Отображение">
          * Устанавливает опцию arrows
          * @param {Boolean} arrows значение опции
          * @see arrows
          * @public
          */
         setArrows: function(arrows) {
            this._options.arrows = arrows;
            if (arrows) {
               this._initArrows();
            } else {
               this._removeArrows();
            }
         },
         /**
          * <wiTag group="Отображение">
          * Устанавливает опцию calendar
          * @param {Boolean} calendar значение опции
          * @see calendar
          * @see isCalendar
          * @public
          */
         setCalendar: function(calendar) {
            calendar = !!calendar;
            this._options.calendar = calendar;
            if (calendar) {
               this._initCalendar();
            } else {
               this._removeCalendar();
            }
         },
         /**
          * <wiTag group="Управление">
          * Устанавливает опцию mask
          * @param {string} mask Маска отображения данных
          * @see mask
          * @public
          */
         setMask: function(mask) {
            FieldDate.superclass.setMask.call(this, mask);
            this._removeCalendar();
            this._initCalendar();
         },
         _removeArrows: function() {
            this._container.children('.ws-field-date-arrow').remove();
         },
         _removeCalendar: function() {
            $('.calendar-container', this._container.get(0)).remove();
         }
      });
   });