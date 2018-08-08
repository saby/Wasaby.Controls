define('Controls/Controllers/QueryParamsController/Position',
   ['Core/core-simpleExtend', 'WS.Data/Source/SbisService'],
   function(cExtend, SbisService) {
      var _private = {
         resolveDirection: function(loadDirection, optDirection) {
            var navDirection;
            if (loadDirection === 'down') {
               navDirection = 'after';
            } else if (loadDirection === 'up') {
               navDirection = 'before';
            } else {
               navDirection = optDirection;
            }
            return navDirection;
         },

         resolvePosition: function(item, optField) {
            var field, navPosition, fieldValue;
            if (optField instanceof Array) {
               field = optField;
            } else {
               field = [optField];
            }

            navPosition = [];
            for (var i = 0; i < field.length; i++) {
               fieldValue = item.get(field[i]);
               navPosition.push(fieldValue);
            }
            return navPosition;
         }
      };

      /**
       *
       * @author Крайнов Дмитрий
       * @public
       */
      var PositionNavigation = cExtend.extend({
         _more: null,
         _beforePosition: null,
         _afterPosition: null,
         constructor: function(cfg) {
            this._options = cfg;
            PositionNavigation.superclass.constructor.apply(this, arguments);

            if (!this._options.field) {
               throw new Error('Option field is undefined in PositionNavigation');
            }
            if (!this._options.position) {
               throw new Error('Option position is undefined in PositionNavigation');
            }
            if (!this._options.direction) {
               throw new Error('Option direction is undefined in PositionNavigation');
            }

            this._more = {
               before: false,
               after: false
            };
         },

         prepareQueryParams: function(loadDirection) {
            var navPosition, navDirection;
            navDirection = _private.resolveDirection(loadDirection, this._options.direction);

            if (loadDirection === 'up') {


            } else if (loadDirection === 'down') {

            } else {

            }

         },

         calculateState: function(list, loadDirection) {
            var more, navDirection, edgeElem, navPosition;
            more = list.getMetaData().more;
            if (typeof more === 'boolean') {
               navDirection = _private.resolveDirection(loadDirection, this._options.direction);
               this._more[navDirection] = more;
            } else {
               if (more instanceof Object) {
                  this._more = more;
               }
            }

            if (list.getCount()) {
               if (loadDirection !== 'down') {
                  edgeElem = list.at(0);
                  this._beforePosition = _private.resolvePosition(edgeElem, this._options.field);
               }
               if (loadDirection === 'up') {
                  edgeElem = list.at(list.getCount() - 1);
                  this._afterPosition = _private.resolvePosition(edgeElem, this._options.field);
               }
            }
         },

         hasMoreData: function(loadDirection) {
            var navDirection;
            if (loadDirection === 'up') {
               navDirection = 'before';
            } else if (loadDirection === 'down') {
               navDirection = 'after';
            }
            return this._more[navDirection];
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
            this._more = null;
         }
      });

      return PositionNavigation;
   });


