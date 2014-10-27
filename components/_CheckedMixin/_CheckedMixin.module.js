define('js!SBIS3.CONTROLS._CheckedMixin', [], function() {

   /**
    * Миксин, добавляющий поведение хранения выбранного элемента. Всегда только одного
    * @mixin SBIS3.CONTROLS._CheckedMixin
    */

   var _CheckedMixin = /**@lends SBIS3.CONTROLS._CheckedMixin.prototype  */{
      $protected: {
         _options: {
            /**
             * @cfg {Boolean} Наличие неопределённого значения
             * Возможные значения:
             * <ul>
             *    <li>true - есть неопределённое значение;</li>
             *    <li>false - нет неопределённого значения.</li>
             * </ul>
             */
            threeState: false,
            /**
             * @cfg {Boolean} Признак активности кнопки в начальном состоянии
             * Возмозможные значения:
             * <ul>
             *    <li>true - кнопка нажата/ чекбокс с галочкой/ радиокнопка выбрана;</li>
             *    <li>false - кнопка не нажата/ чекбокс пустой/ радиокнопка пустая.</li>
             * </ul>
             * @see setChecked
             */
            checked: false
         }
      },

      $constructor: function() {
         this._publish('onChange');
         if (!this._options.threeState) {
            this._options.checked = !!(this._options.checked);
         } else {
            this._options.checked = (this._options.checked === false || this._options.checked === true) ? this._options.checked : null;
         }
      },

      /**
       * Устанавливает состояние кнопки.
       * @param {Boolean} flag Признак состояния кнопки true/false.
       * @example
       * <pre>
       *     var btn = this.getChildControlByName(("myButton");
       *        btn.setChecked(true);
       * </pre>
       * @see checked
       * @see isChecked
       * @see setValue
       */
      setChecked: function(flag) {
         if (flag === true) {
            this._container.addClass('controls-ToggleButton__checked');
            this._container.removeClass('controls-ToggleButton__null');
            this._options.checked = true;
         } else
         if (flag === false) {
            this._container.removeClass('controls-ToggleButton__checked');
            this._container.removeClass('controls-ToggleButton__null');
            this._options.checked = false;
         } else {
            if (this._options.threeState) {
               this._container.removeClass('controls-ToggleButton__checked');
               this._container.addClass('controls-ToggleButton__null');
               this._options.checked = null;
            }
         }
         this.saveToContext('Checked', this._checked);
         this._notify('onChange', this._checked);
      },

      /**
       * Признак текущего состояния кнопки.
       * Возможные значения:
       * <ul>
       *    <li>true - кнопка нажата/ чекбокс с галочкой/ радиокнопка выбрана;</li>
       *    <li>false - кнопка не нажата/ чекбокс пустой/ радиокнопка пустая.</li>
       * </ul>
       * @see checked
       * @see setChecked
       * @see getValue
       */
      isChecked: function() {
         return this._options.checked;
      },

      /**
       * Изменить текущее состояние кнопки.
       * @param {Boolean} value Новое состояние.
       * @example
       * <pre>
       *     var btn = this.getChildControlByName("myButton");
       *        btn.setValue(true)
       * </pre>
       * @see setChecked
       * @see getValue
       * @see isChecked
       */
      setValue: function(value){
         this.setChecked(value);
      },

      /**
       * Возвращает текущее состояние кнопки.
       * @returns {Boolean}
       * @example
       * <pre>
       *     var btn = this.getChildControlByName("myButton");
       *        btn.getValue();
       * </pre>
       * @see isChecked
       * @see checked
       * @see setChecked
       * @see setValue
       */
      getValue: function(){
         return this.isChecked();
      },

      _clickHandler : function() {
         if (!this._options.threeState) {
            this.setChecked(!(this.isChecked()));
         } else {
            if (this._options.checked === true){
               this.setChecked(false);
            } else
            if (this._options.checked === false){
               this.setChecked(null);
            } else  {
               this.setChecked(true);
            }
         }
      }
   };

   return _CheckedMixin;

});/**
 * Created by kraynovdo on 27.10.2014.
 */
