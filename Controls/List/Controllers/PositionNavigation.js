/**
 * Created by kraynovdo on 29.08.2017.
 */
define('Controls/List/Controllers/PositionNavigation',
   [
      'Controls/Controllers/PageNavigation',
      'WS.Data/Source/SbisService',
      'Controls/List/Controllers/INavigation'
   ],
   function(PageNavigation, SbisService, INavigation) {
      /**
       *
       * @author Крайнов Дмитрий
       * @public
       */
      var OffsetNavigation = PageNavigation.extend([INavigation], {
         prepareSource: function(source) {
            var options = source.getOptions();
            options.navigationType = SbisService.prototype.NAVIGATION_TYPE.POSITION;
            source.setOptions(options);
         }
      });

      return OffsetNavigation;
   });
