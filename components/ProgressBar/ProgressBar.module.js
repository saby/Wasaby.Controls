/**
 * Модуль 'Индикатор процесса'.
 */
define('js!SBIS3.CONTROLS.ProgressBar', ['html!SBIS3.CONTROLS.ProgressBar', 'js!SBIS3.CORE.Control'], function(dotTplFn, Control){
   /**
    * Контрол, индикатор прохождения процесса
    * @class SBIS3.CONTROLS.ProgressBar
    * @extends $ws.proto.Control
    * @control
    * @initial
    * <component data-component='SBIS3.CONTROLS.ProgressBar'>
    * </component>
    * @public
    * @category Buttons
    * @cssModifier controls-ProgressBar_align-left отображение процентов слева
    * @cssModifier controls-ProgressBar_align-right отображение процентов справа
    * @ignoreOptions validators independentContext contextRestriction extendedTooltip element linkedContext handlers parent
    * @ignoreOptions autoHeight autoWidth context horizontalAlignment isContainerInsideParent modal owner record stateKey
    * @ignoreOptions subcontrol verticalAlignment
    */
   var ProgressBar = Control.Control.extend({
      _dotTplFn : dotTplFn,
      $protected : {
         _options : {
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
             * @cfg {Number} Максимальное значение, которое можно задать в прогресс бар
             * @see setMaximum
             */
            maximum: 100
         }
      },

      /**
       * Устанавливает текущее состояние процесса в процентах
       * @param {String} progress Текст на кнопке.
       * @see progress
       * @see getProgress
       */
      setProgress: function(progress) {
         progress = parseFloat(progress);
         if (isNaN(progress)) {
            return false;
         }
         this._options.progress = Math.max(Math.min(progress, this._options.maximum),0);
         this._drawProgress(Math.floor(this._options.progress / this._options.maximum * 100));
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
         max = parseFloat(max);
         if (max <= 0  || isNaN(max)) {
            return false;
         }
         this._options.maximum = max;
         this.setProgress(this._options.progress);
      },

      _drawProgress: function(progress) {
         $('.controls-ProgressBar__progress', this._container.get(0)).width(progress + '%');
         $('.controls-ProgressBar__value', this._container.get(0)).text(progress + '%');
      }
   });
   return ProgressBar;
});