
define('js!SBIS3.CONTROLS.CheckBox', ['js!SBIS3.CONTROLS.ButtonBase', 'js!SBIS3.CONTROLS.Checkable', 'html!SBIS3.CONTROLS.CheckBox'], function(ButtonBase, Checkable, dotTplFn) {

   'use strict';

   /**
    * Контрол, отображающий стандартный флаг.
    * При необходимости создания нескольких флагов используйте {@link SBIS3.CONTROLS.CheckBoxGroup CheckBoxGroup}.
    * @class SBIS3.CONTROLS.CheckBox
    * @extends SBIS3.CONTROLS.ButtonBase
    * @mixes SBIS3.CONTROLS.Checkable
    * @control
    * @demo SBIS3.Demo.Control.MyCheckbox
    * @initial
    * <component data-component='SBIS3.CONTROLS.CheckBox'>
    *     <option name="caption">CheckBox</option>
    * </component>
    * @public
    * @category Inputs
    * @ignoreOptions icon extendedTooltip independentContext contextRestriction isContainerInsideParent stateKey subcontrol
    * @ignoreOptions element linkedContext handlers parent autoHeight autoWidth horizontalAlignment verticalAlignment owner
    */

   var CheckBox = ButtonBase.extend([Checkable], /** @lends SBIS3.CONTROLS.CheckBox.prototype */ {
      $protected: {
         _dotTplFn : dotTplFn,
         _checkBoxCaption: null,
         _options: {
            /**
             * @cfg {Boolean} Наличие неопределённого значения
             * Возможные значения:
             * <ul>
             *    <li>true - есть неопределённое значение;</li>
             *    <li>false - нет неопределённого значения.</li>
             * </ul>
             */
            threeState: false
         }
      },

      $constructor: function() {
         this._checkBoxCaption = $('.js-controls-CheckBox__caption', this._container);
         if (!this._options.threeState) {
            this._options.checked = !!(this._options.checked);
         } else {
            this._options.checked = (this._options.checked === false || this._options.checked === true) ? this._options.checked : null;
         }
      },
     /**
      * Установить текст подписи флага.
      * @param {String} captionTxt Текст подписи флага.
      * @example
      * Из массива names установить подписи каждому флагу.
      * <pre>
      *    //names - массив с названиями товаров
      *    //flags - массив объектов-флагов
      *    $ws.helpers.forEach(names, function(name, index) {
      *       flags[index].setCaption(name);
      *    });
      * </pre>
      */
      setCaption: function(captionTxt){
         CheckBox.superclass.setCaption.call(this,captionTxt);
         if (captionTxt) {
            this._checkBoxCaption.html(captionTxt).removeClass('ws-hidden');
         }
         else {
            this._checkBoxCaption.empty().addClass('ws-hidden');
         }
      },

      /**
       * Устанавливает состояние кнопки.
       * @param {Boolean} flag Признак состояния кнопки: true/false, и возможно null при включённой опции {@link threeState}.
       * @example
       * <pre>
       *     var btn = this.getChildControlByName(("myButton");
       *        btn.setChecked(true);
       * </pre>
       * @see threeState
       * @see checked
       * @see isChecked
       * @see setValue
       */
      setChecked: function(flag) {
         if (flag === true) {
            this._container.addClass('controls-Checked__checked');
            this._container.removeClass('controls-ToggleButton__null');
            this._options.checked = true;
         } else
         if (flag === false) {
            this._container.removeClass('controls-Checked__checked');
            this._container.removeClass('controls-ToggleButton__null');
            this._options.checked = false;
         } else {
            if (this._options.threeState) {
               this._container.removeClass('controls-Checked__checked');
               this._container.addClass('controls-ToggleButton__null');
               this._options.checked = null;
            }
         }
         this.saveToContext('Checked', this._options.checked);
         this._notify('onCheckedChange', this._options.checked);
      },

      _clickHandler: function() {
         if (!this._options.threeState) {
            this.setChecked(!(this.isChecked()));
         } else {
            if (this._options.checked === false){
               this.setChecked(true);
            } else
            if (this._options.checked === true){
               this.setChecked(null);
            } else  {
               this.setChecked(false);
            }
         }
      }

   });

   return CheckBox;

});