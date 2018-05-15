define('SBIS3.CONTROLS/Utils/CursorListNavigation', [],
   function() {
      return {
         getNavigationParams: function(field, position, direction) {
            var
               sign = '',
               additionalFilter = {};
            switch (direction) {
               case 'after': sign = '>='; break;
               case 'before': sign = '<='; break;
               case 'both': sign = '~'; break;
            }

            for (var i = 0; i < field.length; i++) {
               additionalFilter[field[i] + sign] = position[i];
            }

            return {
               filter: additionalFilter
            };
         }
      };
   });
