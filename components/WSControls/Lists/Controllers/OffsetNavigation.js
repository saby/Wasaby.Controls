define('js!WSControls/Lists/Controllers/OffsetNavigation',
   [
      'js!WSControls/Lists/Controllers/PageNavigation',
      'WS.Data/Source/SbisService'
   ],
function (PageNavigation, SbisService) {
   /**
    *
    * @author Крайнов Дмитрий
    * @public
    */
   var OffsetNavigation = PageNavigation.extend({
      prepareSource: function(source) {
         var options = source.getOptions();
         options.navigationType = SbisService.prototype.NAVIGATION_TYPE.OFFSET;
         source.setOptions(options);
      }
   });

   return OffsetNavigation;
});
