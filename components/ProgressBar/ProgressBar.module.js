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

         _beforeMount: function(options) {
            this._beforeUpdate(options);
         },

         _afterMount: function() {
            this._afterUpdate();
         },

         _beforeUpdate: function(newOptions) {
            // TODO: убрать после согласования опций по умолчанию.
            Compatibility._beforeUpdate.call(this, newOptions);

            this._checkRanges(newOptions);
            /**
             * @cfg {String} Текущее состояние прогресса в процентах на момен рендера.
             */
            this._progressPercent = this._getProgressPercent(newOptions) + '%';
         },

         _afterUpdate: function() {
            delete this._progressPercent;
         },

         _checkRanges: function(options) {
            var
               progress = options.progress,
               minimum = options.minimum,
               maximum = options.maximum;

            if (progress < minimum) {
               options.progress = minimum;
            }
            if (progress > maximum) {
               options.progress = maximum;
            }
            if (maximum < minimum) {
               maximum ^= minimum ^= maximum;
               minimum ^= maximum;
               options.minimum = minimum;
               options.maximum = maximum;
            }
         },

         _getProgressPercent: function(options) {
            var
               progress = options.progress,
               minimum = options.minimum,
               step = options.step,
               length = options.maximum - minimum,
               progressPercent = Math.round((progress - minimum) / length * 100);

            if (progressPercent !== 100) {
               progressPercent = Math.floor(progressPercent / step) * step;
            }
            return progressPercent;
         }
      });
   return ProgressBar;
});