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
            this._forceUpdate();
         },

         /**
          * Устанавливает текущее состояние процесса в процентах
          * @param {Number} progress Состояние процесса.
          * @see progress
          * @see getProgress
          */
         setProgress: function(progress) {
            this._options.progress = progress;
            this._forceUpdate();
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
            this._forceUpdate();
         },

         /**
          * Задает минимальное возможное значение
          * @param min {Number}
          */
         setMinimum: function(min) {
            this._options.minimum = min;
            this._forceUpdate();
         }
      }
   }
);