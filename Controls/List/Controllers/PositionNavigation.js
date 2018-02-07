/**
 * Created by kraynovdo on 29.08.2017.
 */
define('Controls/List/Controllers/PositionNavigation',
   [
      'Controls/Controllers/QueryParamsController/Page',
      'WS.Data/Source/SbisService'
   ],
   function(PageNavigation, SbisService) {
      /**
       *
       * @author Крайнов Дмитрий
       * @public
       */
      var OffsetNavigation = PageNavigation.extend({
         prepareSource: function(source) {
            var options = source.getOptions();
            options.navigationType = SbisService.prototype.NAVIGATION_TYPE.POSITION;
            source.setOptions(options);
         }
      });

      return OffsetNavigation;
   });
