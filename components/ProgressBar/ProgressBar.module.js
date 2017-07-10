/**
 * Модуль 'Индикатор процесса'.
 */
define('js!SBIS3.CONTROLS.ProgressBar',
   [
      'js!WSControls/Control/Base',
      'templ!SBIS3.CONTROLS.ProgressBar',
      'js!SBIS3.CONTROLS.ProgressBar.compatibility',
      'css!SBIS3.CONTROLS.ProgressBar'
   ],
   function(LightControl, template, Compatibility) {
      /**
       * Контрол, индикатор прохождения процесса
       * @class SBIS3.CONTROLS.ProgressBar
       * @extends WSControls/Control/Base
       * @demo SBIS3.CONTROLS.Demo.MyProgressBar
       *
       * @control
       * @author Журавлев Максим Сергеевич
       *
       * @initial
       * <pre>
       *    <ws:SBIS3.CONTROLS.ProgressBar
       *       progress="{{50}}"
       *       minimum="{{-100}}"
       *       maximum="{{100}}"
       *    />
       * </pre>
       *
       * @public
       *
       * @cssModifier controls-ProgressBar_align-left отображение процентов слева.
       * @cssModifier controls-ProgressBar_align-right отображение процентов справа.
       * @cssModifier controls-ProgressBar_align-center отображение процентов в центре. Установлен по default.
       *
       * @ignoreOptions validators independentContext contextRestriction extendedTooltip element linkedContext handlers parent
       * @ignoreOptions autoHeight autoWidth context horizontalAlignment isContainerInsideParent modal owner record stateKey
       * @ignoreOptions subcontrol verticalAlignment
       */
      var ProgressBar = LightControl.extend([Compatibility], {
         _template: template,

         _controlName: 'SBIS3.CONTROLS.ProgressBar',

         _applyOptions: function() {
            var options = this._options;
            /**
             * @cfg {Number} Минимальное значение прогресса.
             */
            this.minimum = options.minimum || 0;
            /**
             * @cfg {Number} Максимальное значение прогресса.
             */
            this.maximum = options.maximum || 100;
            /**
             * @cfg {Number} Шаг между ближайшими возможными значениями прогресса в процентах.
             */
            this.step = options.step || 1;
            /**
             * @cfg {Number}  Текущее состояние прогресса.
             */
            this.progress = options.progress || 0;
            /**
             * @cfg {String} Текущее состояние расропожения текста процесса.
             * 1.center;
             * 2.left;
             * 3.right;
             */
            this.progressPosition = options.progressPosition || 'center';

            this._checkRanges();
            /**
             * @cfg {Number} Текущее состояние прогресса в процентах.
             */
            this.progressPercent = this._getProgressPercent();
         },

         _checkRanges: function() {
            var temp;
            this.progress = parseFloat(this.progress);
            // Если нельзя привести
            if (isNaN(this.progress)) {
               options.progress = 0;
            }
            if (this.progress < this.minimum) {
               this.progress = this.minimum;
            }
            if (this.progress > this.maximum) {
               this.progress = this.maximum;
            }
            if (this.maximum < this.minimum) {
               temp = options.minimum;
               this.minimum = this.maximum;
               this.maximum = temp;
            }
         },

         _getProgressPercent: function() {
            var
               progress = this.progress,
               minimum = this.minimum,
               maximum = this.maximum,
               step = this.step,
               length = maximum - minimum;

            if (progress !== length) {
               progress = Math.floor(progress / step) * step;
            }
            return Math.round((progress - minimum) / length * 100);
         }
      });
   return ProgressBar;
});