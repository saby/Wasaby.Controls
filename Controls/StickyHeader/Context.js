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
         top: 0,

         /**
          * The position of the fixed header content relative to the bottom of the container.
          * @public
          * @type {Number}
          */
         bottom: 0,

         /**
          * Determines whether shadow should be shown.
          * @public
          * @type {String}
          */
         shadowPosition: '',

         constructor: function(config) {
            this.shadowPosition = config.shadowPosition || '';
         }
      });
   }
);
