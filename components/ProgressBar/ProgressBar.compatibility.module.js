define('js!SBIS3.CONTROLS.ProgressBar.compatibility',
   [],
   function() {

      'use strict';

      return {
         /**
          * Устанавливает текущее состояние расропожения текста процесса.
          * @param {String} progress Позиция текст на шкале прогресса.
          * @see progress
          * @see getProgress
          */
         setProgressPosition: function(progressPosition) {
            this._options.progressPosition = progressPosition;
            this._setDirty();
         },

         /**
          * Устанавливает текущее состояние процесса в процентах
          * @param {Number} progress Состояние процесса.
          * @see progress
          * @see getProgress
          */
         setProgress: function(progress) {
            this._options.progress = progress;
            this._calcProgressPercent()
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
            this._calcProgressPercent()
         },

         /**
          * Задает минимальное возможное значение
          * @param min {Number}
          */
         setMinimum: function(min) {
            this._options.minimum = min;
            this._calcProgressPercent();
         },

         _calcProgressPercent: function() {
            var options = this._options;
            this._checkRanges(options);
            this.progressPercent = this._getProgressPercent(options);
            this._setDirty();
         },

         _beforeUpdate: function(newOptions) {
            var defaultOptions = {
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
            this._mergeDefaultOptions(newOptions, defaultOptions);
         },

         _mergeDefaultOptions: function(options, defaultOptions) {
            var defaultOptionName;
            for (defaultOptionName in defaultOptions) {
               if (!(defaultOptionName in options)) {
                  options[defaultOptionName] = defaultOptions[defaultOptionName];
               }
            }
         }
      }
   }
);