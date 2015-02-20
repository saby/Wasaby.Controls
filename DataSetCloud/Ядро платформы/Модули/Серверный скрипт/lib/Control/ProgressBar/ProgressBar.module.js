/**
 * Created with JetBrains PhpStorm.
 * User: tm.baeva
 * Date: 16.04.13
 * Time: 14:48
 * To change this template use File | Settings | File Templates.
 */
define('js!SBIS3.CORE.ProgressBar', ['js!SBIS3.CORE.Control', 'html!SBIS3.CORE.ProgressBar', 'css!SBIS3.CORE.ProgressBar'], function( Control, dotTplFn ) {

   'use strict';

   /**
    * @fileoverview Файл содержит классы:
    *    - ProgressBar
    * @author koshelevav
    */
   /**
    * @class $ws.proto.ProgressBar
    * @extends $ws.proto.Control
    * @cfgOld {String} bgColor цвет подложки прогрессбара
    * @cfgOld {String} color цвет прогресса
    * @cfgOld {String} fontColor цвет текста внутри прогрессбарв
    * @cfgOld {Number} height высота прогрессбара в пикселях
    * @cfgOld {Number} width ширина прогрессбара в пикселях
    * @control
    * @category Decorate
    */
   $ws.proto.ProgressBar = Control.Control.extend(/** @lends $ws.proto.ProgressBar.prototype */{
      $protected: {
         _border: null,
         _progress: null,
         _progressValue: null,
         _options: {
            width: 'auto',
            align: 'center',
            showPercent: true
         }
      },
      $constructor: function(){
         this._progress = this._container.find('.ws-progressbar-indicator');
         this._border = this._container.find('.ws-progressbar-border');
         this._progressValue = this._container.find('.ws-progressbar-progress-value');
      },
      /**
       * Устанавливает шкалу прогрессбара в заданный процент
       * @param {Number} percent процент выполнения
       * @return {Boolean} успешность выполнения операции
       */
      setProgress: function(percent){
         percent = parseInt(percent, 10);
         if(percent <= 100 && percent >=0){
            this._progress.find('.ws-progressbar-indicator-left, .ws-progressbar-indicator-right').toggleClass('ws-hidden', percent === 0);
            this._progress.width(percent + '%');
            this._progressValue.text(percent + '%');
            return true;
         }
         else {
            return false;
         }
      },
      _dotTplFn: dotTplFn
   });

   return $ws.proto.ProgressBar;

});