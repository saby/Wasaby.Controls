define('Controls/Controllers/QueryParamsController/Offset',
   ['Core/core-simpleExtend', 'Types/source'],
   function(cExtend, sourceLib) {
      /**
       *
       * @author Крайнов Дмитрий
       * @public
       */
      var OffsetNavigation = cExtend.extend({
         constructor: function(cfg) {
            this._options = cfg;
            OffsetNavigation.superclass.constructor.apply(this, arguments);

            if (!this._options.pageSize) {
               throw new Error('Option pageSize is undefined in OffsetNavigation');
            }
         },

         prepareQueryParams: function(direction) {

         },

         calculateState: function(list, direction) {

         },

         getLoadedDataCount: function() {

         },

         getAllDataCount: function() {

         },

         hasMoreData: function(direction) {

         },

         setState: function() {
            //TODO костыль https://online.sbis.ru/opendoc.html?guid=b56324ff-b11f-47f7-a2dc-90fe8e371835
         },

         prepareSource: function(source) {
            var options = source.getOptions();
            options.navigationType = sourceLib.SbisService.NAVIGATION_TYPE.OFFSET;
            source.setOptions(options);
         },

         setEdgeState: function(direction) {

         },

         destroy: function() {
            this._options = null;
         }
      });

      return OffsetNavigation;
   });


