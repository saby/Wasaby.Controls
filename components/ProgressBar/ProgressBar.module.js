/**
 * Модуль 'Индикатор процесса'.
 */
define('js!SBIS3.CONTROLS.ProgressBar',
   [
      'js!WSControls/Control/Base',
      'tmpl!SBIS3.CONTROLS.ProgressBar',
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
            if ('maximum' in options) {
               this.maximum = options.maximum;
            } else {
               this.maximum = 100;
            }
            /**
             * @cfg {Number} Шаг между ближайшими возможными значениями прогресса в процентах.
             */
            this.step = options.step || 1;
            /**
             * @cfg {Number} Текущее состояние прогресса.
             */
            this.progress = options.progress || 0;
            /**
             * @cfg {String} Текущее состояние расположения текста процесса.
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
            var
               progress = parseFloat(this.progress),
               minimum = this.minimum,
               maximum = this.maximum;

            // Если нельзя привести
            if (isNaN(progress)) {
               this.progress = 0;
            } else {
               this.progress = progress;
            }
            if (progress < minimum) {
               this.progress = minimum;
            }
            if (progress > maximum) {
               this.progress = maximum;
            }
            if (maximum < minimum) {
               maximum ^= minimum ^= maximum;
               minimum ^= maximum;
               this.minimum = minimum;
               this.maximum = maximum;
            }
         },

         _getProgressPercent: function() {
            var
               progress = this.progress,
               minimum = this.minimum,
               step = this.step,
               length = this.maximum - minimum,
               progressPercent = Math.round((progress - minimum) / length * 100);

            if (progressPercent !== 100) {
               progressPercent = Math.floor(progressPercent / step) * step;
            }
            return progressPercent;
         }
      });
   return ProgressBar;
});