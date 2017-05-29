/* global define, require */
define('js!WS.Data/Chain', [
   'Core/core-instance',
   'js!WS.Data/Chain/Abstract',
   'js!WS.Data/Chain/Array',
   'js!WS.Data/Chain/Object',
   'js!WS.Data/Chain/Generator',
   'js!WS.Data/Chain/Enumerable',
   'js!WS.Data/Chain/Mapped',
   'js!WS.Data/Chain/Zipped',
   'js!WS.Data/Chain/Filtered',
   'js!WS.Data/Chain/Sliced',
   'js!WS.Data/Chain/Reversed',
   'js!WS.Data/Chain/Sorted',
   'js!WS.Data/Chain/Flattened',
   'js!WS.Data/Chain/Concatenated',
   'js!WS.Data/Chain/Uniquely'
], function (
   CoreInstance,
   AbstractChain,
   ArrayChain,
   ObjectChain,
   GeneratorChain,
   EnumerableChain
) {
   'use strict';

   /**
    * Создает последовательную цепочку вызовов, обрабатывающих коллекции различных типов.
    *
    * Выберем из массива имена персонажей женского пола, отсортированные по имени:
    * <pre>
    * requirejs(['js!WS.Data/Chain'], function(Chain) {
    *    Chain([
    *       {name: 'Philip J. Fry', gender: 'M'},
    *       {name: 'Turanga Leela', gender: 'F'},
    *       {name: 'Professor Farnsworth', gender: 'M'},
    *       {name: 'Amy Wong', gender: 'F'},
    *       {name: 'Bender Bending Rodríguez', gender: 'R'}
    *    ]).filter(function(item) {
    *       return item.gender === 'F';
    *    }).map(function(item) {
    *       return item.name;
    *    }).sort(function(a, b) {
    *       return a > b;
    *    }).value();
    *    //['Amy Wong', 'Turanga Leela']
    * });
    * </pre>
    * Выберем из рекордсета персонажей женского пола, отсортированных по имени:
    * <pre>
    * requirejs([
    *    'js!WS.Data/Chain',
    *    'js!WS.Data/Collection/RecordSet'
    * ], function(
    *    Chain,
    *    RecordSet
    * ) {
    *    Chain(new RecordSet({rawData: [
    *       {name: 'Philip J. Fry', gender: 'M'},
    *       {name: 'Turanga Leela', gender: 'F'},
    *       {name: 'Professor Farnsworth', gender: 'M'},
    *       {name: 'Amy Wong', gender: 'F'},
    *       {name: 'Bender Bending Rodríguez', gender: 'R'}
    *    ]})).filter(function(item) {
    *       return item.get('gender') === 'F';
    *    }).sort(function(a, b) {
    *       return a.get('name') > b.get('name');
    *    }).value();
    *    //[Model(Amy Wong), Model(Turanga Leela)]
    * });
    * </pre>
    * Другие примеры смотрите в описании методов класса {@link WS.Data/Chain/Abstract}.
    *
    * @class WS.Data/Chain
    * @public
    * @author Мальцев Алексей
    */

   /**
    * @alias WS.Data/Chain
    * @param {Array|Object|WS.Data/Collection/IEnumerable|WS.Data/Chain/Abstract|Function} source Коллекция, обрабатываемая цепочкой
    * @return {WS.Data/Chain/Abstract}
    */
   var Chain = function $Chain(source) {
      if (source instanceof AbstractChain) {
         return source;
      } else if (CoreInstance.instanceOfMixin(source, 'WS.Data/Collection/IEnumerable')) {
         return new EnumerableChain(source);
      } else if (source instanceof Array) {
         return new ArrayChain(source);
      } else if (source instanceof Function) {
         return new GeneratorChain(source);
      } else if (source instanceof Object) {
         return new ObjectChain(source);
      }
      throw new TypeError('Unsupported source type "' + source + '": only Array, Function or Object are supported');
   };

   return Chain;
});
