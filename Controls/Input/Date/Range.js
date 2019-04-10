define('Controls/Input/Date/Range', [
   'Controls/dateRange'/*,
   'Env/Env:IoC'*/
], function(
   dateRangeLib/*,
   IoC*/
) {
   'use strict';

   /**
    * Control for entering date range.
    * <a href="/materials/demo-ws4-input-daterange">Demo examples.</a>.
    * @class Controls/Input/Date/Range
    * @extends Core/Control
    * @mixes Controls/_input/interface/IInputBase
    * @mixes Controls/_dateRange/interfaces/IRange
    * @mixes Controls/_dateRange/interfaces/IInput
    * @mixes Controls/_dateRange/interfaces/IInputDateTag
    * @mixes Controls/Input/interface/IDateMask
    * @mixes Controls/Input/interface/IValidation
    *
    * @css @width_DateRange-dash Width of dash between input fields.
    * @css @spacing_DateRange-between-dash-date Spacing between dash and input fields.
    * @css @thickness_DateRange-dash Thickness of dash between input fields.
    * @css @color_DateRange-dash Color of dash between input fields.
    * @css @spacing_DateRange-between-input-button Spacing between input field and button.
    *
    * @control
    * @public
    * @demo Controls-demo/Input/Date/RangePG
    * @category Input
    * @author Миронов А.Ю.
    */

   /*IoC.resolve('ILogger').error(
      'Controls/Input/Date/Range' +
      'This control is deprecated. Use \'Controls/dateRange:Input\' instead'
   );*/

   return dateRangeLib.Input;
});
