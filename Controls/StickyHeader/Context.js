define('Controls/StickyHeader/Context',
   [
      'Core/DataContext'
   ],
   function(DataContext) {
      return DataContext.extend({

         /**
          * The position of the fixed header content relative to the top of the container.
          * @public
          * @type {Number}
          */
         position: null,

         /**
          * Determines whether shadow should be shown.
          * @public
          * @type {Boolean}
          */
         shadowVisible: null,

         constructor: function(config) {
            this.shadowVisible = config.shadowVisible;
         }
      });
   }
);
