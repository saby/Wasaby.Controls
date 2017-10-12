/**
 * Created by kraynovdo on 29.08.2017.
 */
define('js!WSControls/Lists/Controllers/PositionNavigation',
   [
      'js!WSControls/Lists/Controllers/PageNavigation',
      'WS.Data/Source/SbisService',
      'js!WSControls/Lists/Controllers/INavigation'
   ],
   function (PageNavigation, SbisService, INavigation) {
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
