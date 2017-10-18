/**
 * Модуль 'Индикатор процесса'.
 */
define('js!WSControls/ProgressBars/ProgressBar',
   [
      'Core/Control',
      'tmpl!WSControls/ProgressBars/ProgressBar',
      'js!WS.Data/Type/descriptor',
      'css!SBIS3.CONTROLS.ProgressBar'
   ],
   function(Control, template, types) {
      /**
       * Класс контрола "Индикатор прохождения процесса".
       * @class SBIS3.CONTROLS.ProgressBar
       * @extends Core/Control
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
      var ProgressBar = Control.extend({
         _template: template,

         _controlName: 'WSControls/ProgressBars/ProgressBar',

         _getProgressPercent: function(minimum, maximum, progress, step) {
            var
               length = maximum - minimum,
               progressPercent = Math.round((progress - minimum) / length * 100);

            return progressPercent !== 100 ? Math.floor(progressPercent / step) * step : 100;
         }
      });

      ProgressBar.getDefaultOptions = function() {
         return {
            /**
             * @cfg {Number} Минимальное значение прогресса.
             */
            minimum: 0,
            /**
             * @cfg {Number} Максимальное значение прогресса.
             */
            maximum: 100,
            /**
             * @cfg {Number} Текущей значени прогресс.
             */
            progress: 0,
            /**
             * @cfg {Number} Шаг между ближайшими возможными значениями прогресса в процентах.
             */
            step: 1,
            /**
             * @cfg {String} Расположения текста процесса.
             * 1.center;
             * 2.left;
             * 3.right;
             */
            progressPosition: 'center'
         };
      };
      ProgressBar.getOptionTypes = function getOptionTypes() {
         return {
            minimum: types(Number),
            maximum: types(Number),
            progress: types(Number),
            step: types(Number),
            progressPosition: types(String).oneOf([
               'center',
               'left',
               'right'
            ])
         };
      };
      return ProgressBar;
   }
);