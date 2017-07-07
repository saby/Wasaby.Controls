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
            this.maximum = max;
            this._calcProgressPercent()
         },

         /**
          * Задает минимальное возможное значение
          * @param min {Number}
          */
         setMinimum: function(min) {
            this.minimum = min;
            this._calcProgressPercent();
         },

         _calcProgressPercent: function() {
            this._checkRanges();
            this.progressPercent = this._getProgressPercent();
            this._setDirty();
         }
      }
   }
);