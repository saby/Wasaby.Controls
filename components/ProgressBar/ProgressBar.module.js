/**
 * Модуль 'Индикатор процесса'.
 */
define('js!SBIS3.CONTROLS.ProgressBar',
   [
      'js!WSControls/Control/Base',
      'tmpl!SBIS3.CONTROLS.ProgressBar',
      'css!SBIS3.CONTROLS.ProgressBar'
   ],
   function(LightControl, template){
      /**
       * Контрол, индикатор прохождения процесса
       * @class SBIS3.CONTROLS.ProgressBar
       * @extends WSControls/Control/Base
       * @control
       * @author Крайнов Дмитрий Олегович
       * @initial
       * <pre>
       *    <ws:SBIS3.CONTROLS.ProgressBar
       *       progress="50"
       *    />
       * </pre>
       *
       * @public
       * @category Buttons
       *
       * @cssModifier controls-ProgressBar_align-left отображение процентов слева.
       * @cssModifier controls-ProgressBar_align-right отображение процентов справа.
       * @cssModifier controls-ProgressBar_align-center отображение процентов в центре. Установлен по default.
       *
       * @ignoreOptions validators independentContext contextRestriction extendedTooltip element linkedContext handlers parent
       * @ignoreOptions autoHeight autoWidth context horizontalAlignment isContainerInsideParent modal owner record stateKey
       * @ignoreOptions subcontrol verticalAlignment
       */
      var ProgressBar = LightControl.extend({
         _template: template,

         _controlName: 'SBIS3.CONTROLS.ProgressBar',

         applyOptions: function() {
            /**
             * @cfg {Number} Минимальное значение, которое можно задать в прогресс бар, может быть отрицательным
             * @see setMinimum
             */
            this.minimum = 0;
            /**
             * @cfg {Number} Максимальное значение, которое можно задать в прогресс бар
             * @see setMaximum
             */
            this.maximum = 100;
            /**
             * @cfg {Number} Шаг между ближайшими значениями.
             * @see setMaximum
             */
            this.step = 'step' in this._options ? this._options.step : 1;
            /**
             * @cfg {Number}  Текущее состояние процесса в процентах
             * Данный текст должен отображать смысл действия клика по кнопке или побуждать к действию.
             * @example
             * <pre>
             *     <ws:progress>
             *        <ws:Number>30</ws:Number>
             *     </ws:progress>
             * </pre>
             * @see setProgress
             * @see getProgress
             */
            this.progress = 0;
            /**
             * @cfg {String} Текущее состояние расропожения текста процесса.
             * 1.center;
             * 2.left;
             * 3.right;
             * @example
             * <pre>
             *     <ws:progressPosition>
             *        <ws:Srting>left</ws:String>
             *     </ws:progressPosition>
             * </pre>
             * @see setProgressPosition
             */
            this.progressPosition = this._options.progressPosition || 'center';

            if ('minimum' in this._options) {
               this.setMinimum(this._options.minimum);
            }

            if ('maximum' in this._options) {
               this.setMaximum(this._options.maximum);
            }

            this.step = 'step' in this._options ? this._options.step : 1;

            if ('progress' in this._options) {
               this.setProgress(this._options.progress);
            }

            this._errorText = null;

            this._calcProgressPercent();
         },

         _checkRanges: function() {
            this.progress = parseFloat(this.progress);
            if (isNaN(this.progress)) {
               this._errorText = 'Значение прогресса не является числом';
               return false;
            }
            if (this.progress < this.minimum) {
               this._errorText = 'Значение прогресса меньше минимума';
               return false;
            }
            if (this.maximum < this.minimum) {
               this._errorText = 'Значение максимума меньше минимума';
               return false;
            }
            if (this.progress > this.maximum) {
               this._errorText = 'Значение прогресса превышает максимальное значение';
               return false;
            }
            return true;
         },

         /**
          * Устанавливает текущее состояние расропожения текста процесса.
          * @param {String} progress Позиция текст на шкале прогресса.
          * @see progress
          * @see getProgress
          */
         setProgressPosition: function(progressPosition) {
            this.progressPosition = progressPosition;
            this._setDirty();
         },

         /**
          * Устанавливает текущее состояние процесса в процентах
          * @param {Number} progress Состояние процесса.
          * @see progress
          * @see getProgress
          */
         setProgress: function(progress) {
            this.progress = progress;
            if (!this._checkRanges()) {
               throw new Error('setProgress. ' + this._errorText);
            }
            this._calcProgressPercent()
         },

         /**
          * Получает текущее состояние процесса в процентах
          * @returns {Number} текущее состояние процесса в процентах
          * @see progress
          * @see setProgress
          */
         getProgress: function() {
            return this.progress;
         },

         /**
          * Задает максимальное значение
          * @param max {Number}
          */
         setMaximum: function(max) {
            this.maximum = max;
            if (!this._checkRanges()) {
               throw new Error('setMaximum. ' + this._errorText);
            }
            this._calcProgressPercent()
         },

         /**
          * Задает минимальное возможное значение
          * @param min {Number}
          */
         setMinimum: function(min) {
            this.minimum = min;
            if (!this._checkRanges()) {
               throw new Error('setMinimum. ' + this._errorText);
            }
            this._calcProgressPercent();
         },

         _calcProgressPercent: function() {
            var
               progress = this.progress,
               minimum = this.minimum,
               maximum = this.maximum,
               step = this.step,
               length = maximum - minimum;

            if (progress !== length) {
               progress = Math.floor(progress / step) * step;
               this.progress = progress;
            }
            this.progressPercent = Math.round((progress - minimum) / length * 100) + '%';
            this._setDirty();
         }
   });
   return ProgressBar;
});