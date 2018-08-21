define('SBIS3.CONTROLS/Controllers/CursorListNavigation',
   [
      'Core/Abstract',
      'SBIS3.CONTROLS/Controllers/IListNavigation',
      'SBIS3.CONTROLS/Utils/CursorListNavigation'
   ],
   function (Abstract, IListNavigation, CursorListNavigationUtils) {
      /**
       * Контроллер, позволяющий связывать компоненты осуществляя базовое взаимодейтсие между ними
       * @author Крайнов Д.О.
       * @class SBIS3.CONTROLS/Controllers/CursorListNavigation
       * @extends Core/Abstract
       * @mixes SBIS3.CONTROLS/Controllers/IListNavigation
       * @public
       */
      var CursorListNavigation = Abstract.extend([IListNavigation],/**@lends SBIS3.CONTROLS/Controllers/CursorListNavigation.prototype*/{
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
         prepareQueryParams: function(projection, scrollDirection, position) {
            var edgeRecord, filterValue;

            //TODO при дозагрузке по скроллу вверх вниз мы меняем состояние навигации
            //если после этого вызвать релоад, перезагрузка вызовется с некорректными аргументами
            //(как будто не перезагружаем, а грузим вместо этого еще одну страницу вверх/вниз)
            //поэтому запоним здесь позицию и направление, чтоб потом восстановить
            //возможно можно сделать лучше, это фикс ошибки в 17.20
            var prevPosition = this._options.config.position;
            var prevDirection = this._options.config.direction;

            if (scrollDirection) {
               if (scrollDirection == 'up') {
                  this.setDirection('before');
               }
               else {
                  this.setDirection('after');
               }
            }

            if (projection && projection.getCount() && scrollDirection) {
               var newPos = [];
               if (typeof position !== 'undefined') {
                  newPos.push(position);
               } else {
                  if (scrollDirection == 'up') {
                     edgeRecord = projection.getFirst().getContents();
                  }
                  else {
                     edgeRecord = projection.getLast().getContents();
                  }
                  for (var i = 0; i < this._options.config.field.length; i++) {
                     filterValue = edgeRecord.get(this._options.config.field[i]);
                     newPos.push(filterValue);
                  }
               }
               this.setPosition(newPos);
            }
            var params = CursorListNavigationUtils.getNavigationParams(this._options.config.field, this._options.config.position, this._options.config.direction);

            //TODO см выше, восстанавливаем
            this.setDirection(prevDirection);
            this.setPosition(prevPosition);

            return params;
         },

         analyzeResponseParams: function(dataset, scrollDir) {
            var more = dataset.getMetaData().more;
            if (typeof more == 'boolean') {
               var direction = this._options.config.direction;
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
