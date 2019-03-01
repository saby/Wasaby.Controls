define('Controls/Indicator/Progress/Bar', [
   'Controls/progress',
   'Env/Env'
], function(progressLib, Env) {
   'use strict';

   /**
   * Control that renders progress bar
   *
   * @class Controls/Indicator/Progress/Bar
   * @extends Core/Control
   *
   * @public
   *
   * @author Baranov M.A.
   *
   * @demo Controls-demo/Indicator/ProgressBar/ProgressBar
   *
   * @css @color-ProgressBar__bar Progress bar background color
   * @css @height-ProgressBar_bar Progress bar height
   * @css @color-ProgressBar__progress Progress bar fill color
   */

   /**
   * @name Controls/Indicator/Progress/Bar#value
   * @cfg {Number} Progress in percents (ratio of the filled part)
   */

   Env.IoC.resolve('ILogger').error(
      'Controls/Indicator/Progress/Bar',
      'This control is deprecated. Use \'Controls/progress:Bar\' instead'
   );

   return progressLib.Bar;
});
