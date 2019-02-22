define('Controls/Input/Date/RangeLinkLite', [
   'Controls/dateRange'/*,
   'Env/Env:IoC'*/
], function(
   dateRangeLib/*,
   IoC*/
) {
   'use strict';

   /**
    * A link button that displays the period. Supports the change of periods to adjacent.
    *
    * @class Controls/Input/Date/RangeLinkLite
    * @extends Core/Control
    * @mixes Controls/_dateRange/interfaces/ILinkView
    * @mixes Controls/_dateRange/interfaces/IPeriodLiteDialog
    * @control
    * @public
    * @category Input
    * @author Миронов А.Ю.
    * @demo Controls-demo/Input/Date/RangeLinkLite
    *
    */

   /*IoC.resolve('ILogger').error(
      'Controls/Input/Date/Range' +
      'This control is deprecated. Use \'Controls/dateRange:LiteSelector\' instead'
   );*/

   return dateRangeLib.LiteSelector;
});
