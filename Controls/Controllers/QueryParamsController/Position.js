define('Controls/Controllers/QueryParamsController/Position',
   ['Core/core-simpleExtend', 'WS.Data/Source/SbisService'],
   function(cExtend, SbisService) {
      /**
       *
       * @author Крайнов Дмитрий
       * @public
       */
      var PositionNavigation = cExtend.extend({
         constructor: function(cfg) {
            this._options = cfg;
            PositionNavigation.superclass.constructor.apply(this, arguments);

            if (!this._options.pageSize) {
               throw new Error('Option pageSize is undefined in PositionNavigation');
            }
         },

         prepareQueryParams: function(direction) {

         },

         calculateState: function(list, direction) {

         },

         hasMoreData: function(direction) {

         },

         prepareSource: function(source) {
            var options = source.getOptions();
            options.navigationType = SbisService.prototype.NAVIGATION_TYPE.POSITION;
            source.setOptions(options);
         },

         setEdgeState: function(direction) {

         },

         destroy: function() {
            this._options = null;
         }
      });

      return PositionNavigation;
   });


