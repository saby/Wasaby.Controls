define('Controls/Input/Date/RangeLink', [
   'Controls/dateRange'/*,
   'Env/Env:IoC'*/
], function(
   dateRangeLib/*,
   IoC*/
) {
   'use strict';

   /**
    * Controls that allows user to select date with start and end values in calendar.
    *
    * @class Controls/Input/Date/RangeLink
    * @extends Core/Control
    * @mixes Controls/_dateRange/interfaces/ILinkView
    * @mixes Controls/_dateRange/interfaces/ISelector
    * @control
    * @public
    * @category Input
    * @author Водолазских А.А.
    * @demo Controls-demo/Input/Date/RangeLink
    *
    */

   /*IoC.resolve('ILogger').error(
      'Controls/Input/Date/Range' +
      'This control is deprecated. Use \'Controls/dateRange:Selector\' instead'
   );*/

   return dateRangeLib.Selector;
});
