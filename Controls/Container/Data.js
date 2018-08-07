define('Controls/Container/Data',
   [
      'Core/Control',
      'tmpl!Controls/Container/Data/Data',
      'Controls/Container/Data/getPrefetchSource',
      'Controls/Container/Data/ContextOptions'
   ],
   
   function(Control, template, getPrefetchSource, ContextOptions) {

      /**
       * Container component that provides a context field "dataOptions" with necessary data for child containers.
       *
       * Here you can see a <a href="/materials/demo-ws4-filter-search-new">demo</a>.
       *
       * @class Controls/Container/Data
       * @mixes Controls/interface/IFilter
       * @mixes Controls/interface/INavigation
       * @extends Core/Control
       * @control
       * @public
       * @author A.M. Gerasimov
       */
      
      /**
       * @name Controls/Container/Data#source
       * @cfg Object that implements ISource interface for data access.
       */

      /**
       * @name Controls/Container/Data#keyProperty
       * @cfg {String} Name of the item property that uniquely identifies collection item.
       */

      'use strict';
      
      var CONTEXT_OPTIONS = ['filter', 'navigation', 'keyProperty', 'sorting', 'source', 'prefetchSource', 'items'];
      
      var _private = {
         createOptionsObject: function(self) {
            function reducer(result, optName) {
               if (optName === 'source' && self._source) {
                  //TODO: При построении на сервере в сериализованом состоянии в компонент приходят prefetchSource и
                  //source изначально заданный в опциях. prefetchSource содержит в себе source из опций, но так как
                  //это 2 разных парамтра, при десериализации получаем 2 разных source. Один десериализуется внутри
                  //prefetchSource, второй из опций. prefetchSource передаётся в табличные представления данных, а
                  //source из опций распространяется по контексту. Получется тот кто влияет на source из контекста,
                  //не влияет на source из таблицы. Решение: Не будем брать source из опций, а в контекс положим
                  //source, который лежит внутри prefetchSource.
                  //Выписана задача для удаления данного костыля: https://online.sbis.ru/opendoc.html?guid=fb540e42-278c-436c-928b-92e6f72b3abc
                  result.source = self._prefetchSource._$target;
               } else {
                  result[optName] = self['_' + optName];
               }
               return result;
            }
            
            return CONTEXT_OPTIONS.reduce(reducer, {});
         },
   
         createPrefetchSource: function(self, data) {
            return getPrefetchSource({
               source: self._source,
               navigation: self._navigation,
               sorting: self._sorting,
               filter: self._filter,
               keyProperty: self._keyProperty
            }, data);
         },
         
         resolveOptions: function(self, options) {
            self._filter = options.filter;
            self._navigation = options.navigation;
            self._source = options.source;
            self._sorting = options.sorting;
            self._keyProperty = options.keyProperty;
         },
         resolvePrefetchSourceResult: function(self, result) {
            self._items = result.data;
            self._prefetchSource = result.source;
         }
      };
      
      var Data =  Control.extend(/** @lends Controls/Container/Data.prototype */{
         
         _template: template,
         
         _beforeMount: function(options, context, receivedState) {
            var self = this;
            _private.resolveOptions(this, options);
            if (receivedState) {
               _private.resolvePrefetchSourceResult(this, receivedState);
            } else if (self._source) {
               return _private.createPrefetchSource(this).addCallback(function(result) {
                  _private.resolvePrefetchSourceResult(self, result);

                  //TODO: Необходимо чтобы при построении на сервере, prefetchSource сериализовался в правильном состоянии.
                  //При загрузке данных, prefetchSource проставляет у себя сосотояние query = true и в дальнейшем работант
                  //в зависимсти от этого состояния. Сейчас проблема в том, что когда мы возвращаем в _beforeMount
                  //prefetchSource, он сразу сериализуется в строку, а состояние query = true простовляется в дочернем
                  //компоненте, при вызове метода query. Поэтому на клиент прилетает неправильное состояние и
                  //первый вызов query возвращает захэшированные данные, а не пытается загрузить актуальные данные.
                  //Выписана задача для удаления данного костыля: https://online.sbis.ru/opendoc.html?guid=fb540e42-278c-436c-928b-92e6f72b3abc
                  result.source._done.query = true;
                  return result;
               });
            }
         },

         _beforeUpdate: function(newOptions) {
            var self = this;

            _private.resolveOptions(this, newOptions);

            if (this._options.source !== newOptions.source) {
               return _private.createPrefetchSource(this).addCallback(function(result) {
                  _private.resolvePrefetchSourceResult(self, result);
                  self._forceUpdate();
                  return result;
               });
            }
         },

         _filterChanged: function(event, filter) {
            this._filter = filter;
            this._notify('filterChanged', [filter]);
         },
         
         _itemsChanged: function(event, items) {
            var self = this;
            _private.createPrefetchSource(this, items).addCallback(function(result) {
               _private.resolvePrefetchSourceResult(self, result);
               self._forceUpdate();
               return result;
            });
         },
         
         _getChildContext: function() {
            return {
               dataOptions: new ContextOptions(_private.createOptionsObject(this))
            };
         }
      });

      Data._private = _private;
      return Data;
   });
