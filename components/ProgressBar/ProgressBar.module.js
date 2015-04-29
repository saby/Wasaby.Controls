define('js!SBIS3.CONTROLS.ProgressBar', ['html!SBIS3.CONTROLS.ProgressBar', 'js!SBIS3.CORE.Control'], function(dotTplFn, Control){
   var ProgressBar = Control.Control.extend({
      _dotTplFn : dotTplFn,
      $protected : {
         _options : {
            progress : 0
         }
      },

      setProgress : function(progress) {
         this._options.progress = progress;
         this._drawProgress(progress);
      },

      getProgress : function() {
         return this._options.progress;
      },

      _drawProgress : function(progress) {
         $('.controls-ProgressBar__progress', this._container.get(0)).width(progress + '%');
         $('.controls-ProgressBar__value', this._container.get(0)).text(progress + '%');
      }
   });
   return ProgressBar;
});