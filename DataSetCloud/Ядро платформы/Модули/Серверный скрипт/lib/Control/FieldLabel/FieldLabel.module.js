/**
 * Created with JetBrains PhpStorm.
 * User: tm.baeva
 * Date: 21.04.13
 * Time: 18:45
 * To change this template use File | Settings | File Templates.
 */
define("js!SBIS3.CORE.FieldLabel", ["js!SBIS3.CORE.FieldAbstract", "js!SBIS3.CORE.Infobox", "html!SBIS3.CORE.FieldLabel"], function( FieldAbstract, Infobox, dotTplFn ) {

   "use strict";

   /**
    * Простое read-only поле, умеет привязываться к данным
    *
    * @class $ws.proto.FieldLabel
    * @extends $ws.proto.FieldAbstract
    * @control
    * @category Content
    * @initial
    * <component data-component='SBIS3.CORE.FieldLabel'>
    *    <option name='value'>Поле данных</option>
    * </component>
    * @designTime plugin /design/DesignPlugin
    * @ignoreOptions width
    */
   $ws.proto.FieldLabel = FieldAbstract.extend(/** @lends $ws.proto.FieldLabel.prototype */{
      $protected : {
         _options : {
             /**
              * @cfg {Boolean} Многострочный текст
              * <wiTag group="Управление">
              * При использовании многострочного текста необходимо позаботиться о достаточной высоте контрола для
              * отображения всех строк.
              * Возможные значения:
              * <ol>
              *    <li>true - отображать текст в несколько строк;</li>
              *    <li>false - отображать текст в одну сткроку. Т.е. даже при большой высоте контрола переноса текста на
              *    новую строку не будет.</li>
              * </ol>
              */
            multiline : false,
             /**
              * @cfg {Boolean} Использовать расширенное форматирование
              * <wiTag group="Данные">
              * Позволяет отображать значения контролов в заданном формате.
              * Возможные значения:
              * <ol>
              *    <li>true - использовать расширенное форматирование;</li>
              *    <li>false - не использовать.</li>
              * </ol>
              * @see format
              */
            useExtendedFormatting: false,
            /**
             * Позволяет в задизабленном режиме подсвечивать ссылки на файлы и URL
             * @cfg {Boolean} Подсвечивать ссылки
             * <wiTag group="Управление">
             */
            highlightLinks: false,
             /**
              * @cfg {String} Шаблон формата
              * <wiTag group="Данные">
              * Распознаёт следующие типы шаблонов - t, d, f, s:
              * <ul>
              *    <li>$имя поля$<b>t</b>$формат даты$ - дата/время, используется формат функции {@link Date#strftime strftime};</li>
              *    <li>$имя поля$<b>d</b>$ - целое число (D - с разделителями);</li>
              *    <li>$имя поля$<b>f</b>$[точность]$ - вещественное число (F - с разделителями);</li>
              *    <li>$имя поля$<b>s</b>$ - прочее, строки, в т.ч. Enum.</li>
              * </ul>
              * @example
              * Поле данных с изменяемыми значениями: дата и число берутся с соответствующих контролов FieldDate с именем 'date' и FieldMoney с именем 'number'
              * <pre>
              *    format: 'Сегодня $date$t$%e %q %Y года$ и курс доллара составляет $number$f$2$ рублей.';
              * </pre>
              * @see useExtendedFormatting
              * @see {@link Date#strftime strftime}
              */
            format: ''
         }
      },
      $constructor: function(){
         this._infoboxTargetChangeHandler = function(event, prev){
            var me = this._getExtendedTooltipTarget().get(0);
            if(prev == me) {
               this._container.find('.input-field > span').attr('title', this._options.tooltip);
            }
         }.bind(this);
         this._container.find('.ws-field').end().removeAttr('tabindex').css('overflow', 'hidden');
         this._curval = this._options.value;
      },
      _dotTplFn: dotTplFn,
      _bindInternals: function() {
         this._inputControl = this._container.find('.input-field span');
         this._inputControl.attr('title',this._setTooltip(this._options.tooltip ? this._options.tooltip : this._options.value));
      },
      _setValueInternal : function(value) {
         if(this._curval !== value || this._options.useExtendedFormatting === true){
            var fmtVal;
            this._curval = value; /** ToDo теперь при расширенном форматировании не корректно работает setValue()
                                   *  Сначала вызывается обновляется формат (здесь), только потом обновляется контекст */
            if (this._options.useExtendedFormatting) {
               fmtVal = $ws.helpers.format(this.getLinkedContext(), this._options.format);
            }
            else {
               fmtVal = this._formatValue(value);
            }
            //здесь заэкранируем теги
            var escapedVal = $ws.helpers.escapeHtml(fmtVal);
            this._inputControl.html(this._options.highlightLinks ? $ws.helpers.wrapFiles($ws.helpers.wrapURLs(escapedVal)) : escapedVal);
            //а сюда отдадим нормальное значение, чтобы теги вырезались из подсказки
            if(this._options.tooltip === '')
               this._inputControl.attr('title', this._setTooltip(fmtVal));
         }
      },
      _formatValue: function(value) {
         var
               mCtx = this.getLinkedContext(),
               fCtx,
               myName = this.getName(),
               boundRecord,
               type,
               formatted = value;

         if(mCtx) {
            fCtx = mCtx.getFieldOrigin(myName);
            if(fCtx)
               boundRecord = fCtx.getRecord();
         }

         if(boundRecord && boundRecord.hasColumn(myName)) {
            type = boundRecord.getColumnType(myName);
            switch (type){
               case 'Перечисляемое':
                  formatted = $ws.render.defaultColumn.enumType(value);
                  break;
               case "Деньги":
                  formatted = $ws.render.defaultColumn.money(value);
                  break;
               case "Дата":
               case "Дата и время":
                  formatted = $ws.render.defaultColumn.timestamp(value, type); // формат времени
                  break;
               case "Число целое":
                  formatted = $ws.render.defaultColumn.integer(value); // формат числа
                  break;
           }
         }

         return typeof formatted == 'boolean' ? "" + formatted : formatted;
      },
      _setDisableAttr : function(){
         //не выставляем атрибуд disabled для полей данных
      },
      getTabindex : function(){
         return null;
      },
      _getElementToFocus : function(){
         return undefined;
      },
      _setTooltip : function(value){
         var tooltip = value;
         if (tooltip instanceof Object && 'jquery' in tooltip){
            tooltip = tooltip.text();
         }
         if(typeof tooltip == "string") { // режем тэги и размер только для строк
            tooltip = $ws.helpers.escapeTagsFromStr(tooltip, "");//Удалить все теги
            tooltip = $ws.helpers.unEscapeHtmlSpecialChars(tooltip.substring(0, 256));//превращаем html-сущности в символы
         }
         return tooltip;
      },
      /**
       * Переопределяем метод отображения подсказки, чтобы выключить тултип
       * @protected
       */
      _finallyShowInfobox: function () {
         this._container.find('.input-field > span').attr('title', null);
         var
            self = this;
         Infobox.once('onChangeTarget', function() {
            Infobox.once('onChangeTarget', self._infoboxTargetChangeHandler);
         });
         $ws.proto.FieldLabel.superclass._finallyShowInfobox.apply(this, arguments);
      }
   });

   return $ws.proto.FieldLabel;

});