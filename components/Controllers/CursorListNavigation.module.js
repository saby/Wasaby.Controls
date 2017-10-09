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
            _hasMore: {
               'before' : false,
               'after' : false
            },
            _options: {
               type: 'cursor',
               config: {
                  field: '',
                  position: '',
                  direction: ''
               }
            }
         },
         $constructor: function() {
            if (!(this._options.config.field instanceof Array)) {
               this._options.config.field = [this._options.config.field];
            }
            if (!(this._options.config.position instanceof Array)) {
               this._options.config.position = [this._options.config.position];
            }
         },
         _getCalculatedParams: function() {
            var sign = '', additionalFilter = {};
            switch(this._options.config.direction) {
               case 'after': sign = '>='; break;
               case 'before': sign = '<='; break;
               case 'both': sign = '~'; break;
            }

            for (var i = 0; i < this._options.config.field.length; i++) {
               additionalFilter[this._options.config.field[i] + sign] = this._options.config.position[i];
            }

            return {
               filter : additionalFilter
            }
         },

         prepareQueryParams: function(projection, scrollDirection) {
            var edgeRecord, filterValue;

            //TODO при дозагрузке по скроллу вверх вниз мы меняем состояние навигации
            //если после этого вызвать релоад, перезагрузка вызовется с некорректными аргументами
            //(как будто не перезагружаем, а грузим вместо этого еще одну страницу вверх/вниз)
            //поэтому запоним здесь позицию и направление, чтоб потом восстановить
            //возможно можно сделать лучше, это фикс ошибки в 17.20
            var prevPosition = this._options.config.position;
            var prevDirection = this._options.config.direction;


            if (projection && projection.getCount() && scrollDirection) {
               if (scrollDirection == 'up') {
                  this.setDirection('before');
                  edgeRecord = projection.getFirst().getContents();
               }
               else {
                  this.setDirection('after');
                  edgeRecord = projection.getLast().getContents();
               }
               var newPos = [];
               for (var i = 0; i < this._options.config.field.length; i++) {
                  filterValue = edgeRecord.get(this._options.config.field[i]);
                  newPos.push(filterValue);
               }
               this.setPosition(newPos);
            }
            var params = this._getCalculatedParams();

            //TODO см выше, восстанавливаем
            this.setDirection(prevDirection);
            this.setPosition(prevPosition);

            return params;
         },

         analyzeResponseParams: function(dataset, scrollDir) {
            var more = dataset.getMetaData().more;
            if (typeof more == 'boolean') {
               var direction;
               if (scrollDir == 'up') {
                  direction = 'before';
               }
               else if (scrollDir == 'down') {
                  direction = 'after';
               }

               this._hasMore[direction] = more;
            }
            else {
               if (more instanceof Object) {
                  this._hasMore = more;
               }
            }
         },

         setPosition: function(pos) {
            if (!(pos instanceof Array)) {
               pos = [pos];
            }
            this._options.config.position = pos;
         },

         setDirection: function(dir) {
            this._options.config.direction = dir;
         },

         hasNextPage: function(scrollDir) {
            var direction;
            if (scrollDir == 'up') {
               direction = 'before';
            }
            else if (scrollDir == 'down') {
               direction = 'after';
            }
            return this._hasMore[direction];
         }

      });

      return CursorListNavigation;
   });
