define('js!SBIS3.CONTROLS.Checkable', [], function() {

   /**
    * Миксин, добавляющий поведение хранения выбранного элемента. Всегда только одного
    * @mixin SBIS3.CONTROLS.Checkable
    * @public
    * @author Крайнов Дмитрий Олегович
    */

   var Checkable = /**@lends SBIS3.CONTROLS.Checkable.prototype  */{
       /**
        * @event onCheckedChange При изменении состояния кнопки
        * Событие срабатывает при нажатии на кнопку, выставления/снятия флажка, выборе радиокнопки.
        * @param {$ws.proto.EventObject} Дескриптор события.
        * @param {Boolean} checked Признак состояния:
        * <ul>
        *    <li>true - кнопка нажата/ чекбокс с галочкой/ радиокнопка выбрана;</li>
        *    <li>false - кнопка не нажата/ чекбокс пустой/ радиокнопка пустая.</li>
        * </ul>
        * @example
        * <pre>
        *     var checkValue = function() {
        *        if (this.isChecked()) {
        *           buttonSend.setEnabled(true);
        *        } else {
        *           buttonSend.setEnabled(false);
        *        }
        *     }
        *     checkBox.subscribe('onCheckedChange', checkValue);
        * </pre>
        * @see checked
        * @see setChecked
        * @see isChecked
        */
      $protected: {
         _options: {
            /**
             * @cfg {Boolean} Состояние кнопки до взаимодействия с ней пользователем
             * Возмозможные значения:
             * <ul>
             *    <li>true - кнопка нажата/ чекбокс с галочкой/ радиокнопка выбрана;</li>
             *    <li>false - кнопка не нажата/ чекбокс пустой/ радиокнопка пустая.</li>
             * </ul>
             * @example
             * <pre>
             *     <option name="checked">true</option>
             * </pre>
             * @see setChecked
             * @see onCheckedChange
             * @see isChecked
             */
            checked: false
         }
      },

      $constructor: function() {
         this._publish('onCheckedChange');
      },

      /**
       * Устанавливает состояние кнопки.
       * @param {Boolean} flag Признак состояния кнопки true/false.
       * @example
       * <pre>
       *     var btn = this.getChildControlByName("myButton");
       *        btn.setChecked(true);
       * </pre>
       * @see checked
       * @see isChecked
       * @see onCheckedChange
       * @see setValue
       */
      setChecked: function(flag) {
         this._options.checked = !!flag;
         this._container.toggleClass('controls-Checked__checked', this._options.checked);
         this._notify('onCheckedChange', this._options.checked);
      },

      /**
       * Признак текущего состояния кнопки.
       * @remark
       * Возможные значения:
       * <ul>
       *    <li>true - кнопка нажата/ чекбокс с галочкой/ радиокнопка выбрана;</li>
       *    <li>false - кнопка не нажата/ чекбокс пустой/ радиокнопка пустая.</li>
       * </ul>
       * @example
       * <pre>
       *     var checkValue = function() {
       *        if (this.isChecked()) {
       *           buttonSend.setEnabled(true);
       *        } else {
       *           buttonSend.setEnabled(false);
       *        }
       *     }
       *     checkBox.subscribe('onCheckedChange', checkValue);
       * </pre>
       * @see checked
       * @see setChecked
       * @see onCheckedChange
       * @see getValue
       */
      isChecked: function() {
         return this._options.checked;
      },

      _clickHandler : function() {
         this.setChecked(!(this.isChecked()));
      }
   };

   return Checkable;

});/**
 * Created by kraynovdo on 27.10.2014.
 */
