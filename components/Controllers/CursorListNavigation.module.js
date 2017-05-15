define('js!SBIS3.CONTROLS.CursorListNavigation',
   [
      'Core/Abstract',
      'js!SBIS3.CONTROLS.IListNavigation'
   ],
   function (Abstract, IListNavigation) {
      /**
       * Контроллер, позволяющий связывать компоненты осуществляя базовое взаимодейтсие между ними
       * @author Крайнов Дмитрий
       * @class SBIS3.CONTROLS.CursorListNavigation
       * @extends Core/Abstract
       * @mixes SBIS3.CONTROLS.IListNavigation
       * @public
       */
      var CursorListNavigation = Abstract.extend([IListNavigation],/**@lends SBIS3.CONTROLS.CursorListNavigation.prototype*/{
         $protected: {
            _options: {
               type: 'cursor',
               config: {
                  field: '',
                  position: '',
                  direction: ''
               }
            }
         },
         _getCalculatedParams: function() {
            var sign = '', additionalFilter = {};
            switch(this._options.config.direction) {
               case 'desc': sign = '>='; break;
               case 'asc': sign = '<='; break;
               case 'both': sign = '~'; break;
            }

            additionalFilter[this._options.config.field+'>='] = this._options.config.position;
            return {
               filter : additionalFilter
            }
         },

         prepareQueryParams: function(projection, scrollDirection) {
            var edgeRecord, filterValue;
            if (scrollDirection == 'up') {
               this.setDirection('desc');
               edgeRecord = projection.at(0).getContents();
            }
            else {
               this.setDirection('asc');
               edgeRecord = projection.at(projection.getCount() - 1).getContents();
            }
            filterValue = edgeRecord.get(this._options.config.field);
            this.setPosition(filterValue);

            return this._getCalculatedParams();
         },

         analizeResponceParams: function(dataset) {

         },

         setPosition: function(pos) {
            this._options.config.position = pos;
         },

         setDirection: function(dir) {
            this._options.config.direction = dir;
         }

      });

      return CursorListNavigation;
   });
