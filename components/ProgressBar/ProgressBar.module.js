/**
 * Модуль 'Индикатор процесса'.
 */
define('js!SBIS3.CONTROLS.ProgressBar',
   [
      'js!SBIS3.CONTROLS.CompoundControl',
      'tmpl!SBIS3.CONTROLS.ProgressBar',
      'css!SBIS3.CONTROLS.ProgressBar'
   ],
   function(CompoundControl, dotTplFn) {
      /**
       * Класс контрола "Индикатор прохождения процесса".
       * @class SBIS3.CONTROLS.ProgressBar
       * @extends SBIS3.CONTROLS.CompoundControl
       * @control
       * @author Журавлев Максим Сергеевич
       * @initial
       * <component data-component='SBIS3.CONTROLS.ProgressBar'>
       * </component>
       * @public
       * @category Button
       *
       * @cssModifier controls-ProgressBar_align-left отображение процентов слева.
       * @cssModifier controls-ProgressBar_align-right отображение процентов справа.
       * @cssModifier controls-ProgressBar_align-center отображение процентов в центре. Установлен по default.
       *
       * @ignoreOptions validators independentContext contextRestriction extendedTooltip element linkedContext handlers parent
       * @ignoreOptions autoHeight autoWidth context horizontalAlignment isContainerInsideParent modal owner record stateKey
       * @ignoreOptions subcontrol verticalAlignment
       */
      var ProgressBar = CompoundControl.extend(/** @lends SBIS3.CONTROLS.ProgressBar.prototype */{
         _dotTplFn: dotTplFn,
         $protected: {
            _errorText: null,
            _options: {
               /**
                * @cfg {Number}  Текущее состояние процесса в процентах
                * Данный текст должен отображать смысл действия клика по кнопке или побуждать к действию.
                * @example
                * <pre>
                *     <option name="progress">30</option>
                * </pre>
                * @see setProgress
                * @see getProgress
                */
               progress: 0,
               /**
                * @cfg {Number} Минимальное значение, которое можно задать в прогресс бар, может быть отрицательным
                * @see setMinimum
                */
               minimum: 0,
               /**
                * @cfg {Number} Максимальное значение, которое можно задать в прогресс бар
                * @see setMaximum
                */
               maximum: 100,
               /**
                * @cfg {Number} Шаг между ближайшими значениями.
                * @see setMaximum
                */
               step: 1
            }
         },
         init: function() {
            ProgressBar.superclass.init.call(this);
            // Работаем через контекст, и в setProgress есть валидация, чтобы не дублировать её в
            // шаблоне вызовем его с текущей опцией.
            this.setProgress(this.getProgress());
         },
         _modifyOptions: function(options) {
            ProgressBar.superclass._modifyOptions.call(this, options);
            if (!/ controls-ProgressBar_align-(left|right) /.test(options.className)) {
               options.className += ' controls-ProgressBar_align-center';
            }
            return options;
         },
         _checkRanges: function(options) {
            options.progress = parseFloat(options.progress);
            if (isNaN(options.progress)) {
               this._errorText = 'Значение прогресса не является числом';
               return false;
            }
            if (options.progress < options.minimum) {
               this._errorText = 'Значение прогресса меньше минимума';
               return false;
            }
            if (options.maximum < options.minimum) {
               this._errorText = 'Значение максимума меньше минимума';
               return false;
            }
            if (options.progress > options.maximum) {
               this._errorText = 'Значение прогресса превышает максимальное значение';
               return false;
            }
            return true;
         },
         /**
          * Устанавливает текущее состояние процесса в процентах
          * @param {String} progress Текст на кнопке.
          * @see progress
          * @see getProgress
          */
         setProgress: function(progress) {
            this._options.progress = progress;
            if (!this._checkRanges(this._options)) {
               throw new Error('setProgress. ' + this._errorText);
            }
            this._drawProgress(this._getPercent());
         },
         /**
          * Получает текущее состояние процесса в процентах
          * @returns {Number} текущее состояние процесса в процентах
          * @see progress
          * @see setProgress
          */
         getProgress: function() {
            return this._options.progress;
         },
         /**
          * Задает максимальное значение
          * @param max {Number}
          */
         setMaximum: function(max) {
            this._options.maximum = max;
            this._drawProgress(this._getPercent());
         },
         /**
          * Задает минимальное возможное значение
          * @param min {Number}
          */
         setMinimum: function(min) {
            this._options.minimum = min;
            this._drawProgress(this._getPercent());
         },
         _getPercent: function() {
            var
               progress = this._options.progress,
               minimum = this._options.minimum,
               maximum = this._options.maximum,
               step = this._options.step,
               length = maximum - minimum;
            if (progress !== length) {
               progress = Math.floor(progress / step) * step;
               this._options.progress = progress;
            }
            return Math.round((progress - minimum) / length * 100);
         },
         _drawProgress: function(progress) {
            this.getLinkedContext().setValueSelf('progress', {
               backgroundSize: progress + '% 100%',
               value: progress + '%'
            });
         }
      });
      return ProgressBar;
   }
);