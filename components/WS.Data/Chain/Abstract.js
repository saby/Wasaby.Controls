/* global define, require */
define('js!WS.Data/Chain/Abstract', [
   'js!WS.Data/Collection/IEnumerable',
   'js!WS.Data/Entity/Abstract',
   'js!WS.Data/Utils',
   'js!WS.Data/Di'
], function (
   IEnumerable,
   AbstractEntity,
   Utils,
   Di
) {
   'use strict';

   /**
    * Абстрактная цепочка.
    * Это абстрактный класс, не предназначенный для создания самостоятельных экземпляров.
    * @class WS.Data/Chain/Abstract
    * @extends WS.Data/Entity/Abstract
    * @implements WS.Data/Collection/IEnumerable
    * @public
    * @author Мальцев Алексей
    */

   var Abstract = AbstractEntity.extend([IEnumerable], /** @lends WS.Data/Chain/Abstract.prototype */{
      _moduleName: 'WS.Data/Chain/Abstract',

      /**
       * @member {Object>} Данные, обрабатываемые цепочкой
       */
      _source: null,

      /**
       * @member {WS.Data/Chain/Abstract>} Начальная цепочка
       */
      _start: null,

      /**
       * @member {WS.Data/Chain/Abstract>} Предыдующая цепочка
       */
      _previous: null,

      /**
       * Конструктор цепочки
       * @param {Array|Object|Function} items Данные, обрабатываемые цепочкой
       */
      constructor: function $Abstract(source) {
         if (!(source instanceof Object)) {
            throw new TypeError('Unsupported source must be an instance of Object');
         }
         Abstract.superclass.constructor.call(this);
         this._source = source;
      },

      destroy: function() {
         this._source = null;
         this._start = null;
         this._previous = null;
         Abstract.superclass.destroy.call(this);
      },

      //region WS.Data/Collection/IEnumerable

      /**
       * Перебирает все элементы коллекции, начиная с первого.
       * @param {Function(*, *)} callback Ф-я обратного вызова для каждого элемента коллекции (аргументами придут элемент коллекции и его индекс)
       * @param {Object} [context] Контекст вызова callback
       * @example
       * Получим элементы коллекции:
       * <pre>
       * requirejs(['js!WS.Data/Chain',], function(Chain) {
       *    Chain({foo: 'Foo', bar: 'Bar'}).each(function(value, key) {
       *       console.log('key: ' + key + ', value: ' + value);
       *    });
       * });
       * //'key: foo, value: Foo', 'key: bar, value: Bar'
       * </pre>
       */
      each: function (callback, context) {
         var enumerator = this.getEnumerator();
         while (enumerator.moveNext()) {
            callback.call(
               context || this,
               enumerator.getCurrent(),
               enumerator.getCurrentIndex()
            );
         }
      },

      //endregion WS.Data/Collection/IEnumerable

      //region Public methods

      //region Summary

      /**
       * Запускает вычисление цепочки и возвращает полученное значение. Большинство цепочек возвращает массив, но некоторые могут вернуть другой тип, в зависимости от вида исходной коллекции.
       * При передаче аргумента factory вернется тип значения, сконструированный фабрикой. Доступные стандартные фабрики можно посмотреть в разделе {@link WS.Data/Collection/Factory}.
       * @param {Function(WS.Data/Collection/IEnumerable): *} [factory] Фабрика для преобразования коллекции, первым аргументов придет полученная коллекция.
       * @param {...*} [args] Дополнительные аргументы фабрики, придут в factory вторым, третьим и т.д аргументами.
       * @return {*}
       * @example
       * Получим четные отрицательные числа в виде массива:
       * <pre>
       * requirejs(['js!WS.Data/Chain',], function(Chain) {
       *    Chain([1, 2, 3, 4, 5]).map(function(item) {
       *       return -1 * item;
       *    }.filter(function(item) {
       *       return item % 2 === 0;
       *    }).value();//[-2, -4]
       * });
       * </pre>
       * Получим рекордсет из персонажей женского пола, отсортированных по имени:
       * <pre>
       * requirejs([
       *    'js!WS.Data/Chain',
       *    'js!WS.Data/Collection/RecordSet',
       *    'js!WS.Data/Collection/Factory/RecordSet'
       * ], function(
       *    Chain,
       *    RecordSet,
       *    recordSetFactory
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
       *    }).value(recordSetFactory);
       *    //RecordSet([Model(Amy Wong), Model(Turanga Leela)])
       * });
       * </pre>
       */
      value: function (factory) {
         if (factory instanceof Function) {
            var args = [this],
               i;
            for (i = 1; i < arguments.length; i++) {
               args.push(arguments[i]);
            }
            return factory.apply(undefined, args);

         }

         return this.toArray();
      },

      /**
       * Запускает вычисление цепочки и возвращает полученное значение в виде массива.
       * @return {Array}
       * @example
       * Получим значения полей объекта в виде массива:
       * <pre>
       * requirejs(['js!WS.Data/Chain',], function(Chain) {
       *    Chain({
       *       email: 'root@server.name',
       *       login: 'root'
       *    }).toArray();//['root@server.name', 'root']
       * });
       * </pre>
       * Представим рекордсет в виде массива записей:
       * <pre>
       * requirejs([
       *    'js!WS.Data/Chain',
       *    'js!WS.Data/Collection/RecordSet'
       * ], function(
       *    Chain,
       *    RecordSet
       * ) {
       *    Chain(new RecordSet({
       *       rawData: [
       *          {id: 1, name: 'SpongeBob SquarePants'},
       *          {id: 2, name: 'Patrick Star'}
       *       ]
       *    })).toArray();//[Model({id: 1, name: 'SpongeBob SquarePants'}), Model({id: 2, name: 'Patrick Star'})]
       * });
       * </pre>
       */
      toArray: function () {
         var result = [];
         this.each(function(item) {
            result.push(item);
         });
         return result;
      },

      /**
       * Запускает вычисление цепочки и возвращает полученное значение в виде объекта.
       * @return {Object}
       * @example
       * Трансформируем массив в объект индекс->значение:
       * <pre>
       * requirejs(['js!WS.Data/Chain',], function(Chain) {
       *    Chain(['root@server.name', 'root']).toObject();//{0: 'root@server.name', 1: 'root']}
       * });
       * </pre>
       * Представим запись в виде объекта:
       * <pre>
       * requirejs([
       *    'js!WS.Data/Chain',
       *    'js!WS.Data/Entity/Record'
       * ], function(
       *    Chain,
       *    Record
       * ) {
       *    var record = new Record({
       *          rawData: {id: 1, title: 'New One'}
       *       }),
       *       chain = new Chain(record);
       *
       *    chain.toObject();//{id: 1, title: 'New One'}
       * });
       * </pre>
       */
      toObject: function () {
         var result = {},
            enumerator = this.getEnumerator();
         while (enumerator.moveNext()) {
            result[enumerator.getCurrentIndex()] = enumerator.getCurrent();
         }
         return result;
      },

      /**
       * Сводит коллекцию к одному значению.
       * @param {Function(*, *, Number): *} callback Функция, вычисляющая очередное значение. Принимает аргументы: предыдущее вычисленное значение, текущий элемент, индекс текущего элемента.
       * @param {*} [initialValue] Значение первого аргумента callback, передаваемое в первый вызов. Если не указано, то в первый вызов первым аргументом будет передан первый элемент коллекции.
       * @return {*}
       * @example
       * Просуммируем массив:
       * <pre>
       * requirejs([
       *    'js!WS.Data/Chain'
       * ], function(
       *    Chain
       * ) {
       *    Chain([1, 2, 3, 4, 5]).reduce(function(previousValue, currentValue) {
       *       return previousValue + currentValue;
       *    });//15
       * });
       * </pre>
       */
      reduce: function (callback, initialValue) {
         var result = initialValue,
            skipFirst = arguments.length < 2;

         this.each(function(item, index) {
            if (skipFirst) {
               result = item;
               skipFirst = false;
               return;
            }
            result = callback(result, item, index);
         });

         return result;
      },

      /**
       * Сводит коллекцию к одному значению, проходя ее справа-налево.
       * @param {Function(*, *, Number): *} callback Функция, вычисляющая очередное значение. Принимает аргументы: предыдущее вычисленное значение, текущий элемент, индекс текущего элемента.
       * @param {*} [initialValue] Значение первого аргумента callback, передаваемое в первый вызов. Если не указано, то в первый вызов первым аргументом будет передан последний элемент коллекции.
       * @return {*}
       * @example
       * Поделим элементы массива, проходя их справа-налево:
       * <pre>
       * requirejs([
       *    'js!WS.Data/Chain'
       * ], function(
       *    Chain
       * ) {
       *    Chain([2, 5, 2, 100]).reduceRight(function(previousValue, currentValue) {
       *       return previousValue / currentValue;
       *    });//5
       * });
       * </pre>
       */
      reduceRight: function (callback, initialValue) {
         if (arguments.length < 2) {
            return this.reverse().reduce(callback);
         }
         return this.reverse().reduce(callback, initialValue);
      },

      //endregion Summary

      //region Transformation

      /**
       * Преобразует коллекцию с использованием вызова функции-преобразователя для каждого элемента.
       * @param {Function(*, Number): *} callback Функция, возвращающая новый элемент. Принимает аргументы: элемент коллекции и его порядковый номер.
       * @param {Object} [thisArg] Контекст вызова callback.
       * @return {WS.Data/Chain/Mapped}
       * @example
       * Преобразуем массив в записи:
       * <pre>
       * requirejs([
       *    'js!WS.Data/Chain',
       *    'js!WS.Data/Entity/Record'
       * ], function(
       *    Chain,
       *    Record
       * ) {
       *    Chain([
       *       {id: 1, name: 'SpongeBob SquarePants'},
       *       {id: 2, name: 'Patrick Star'}
       *    ]).map(function(item) {
       *       return new Record({rawData: item});
       *    }).value();//[Record({id: 1, name: 'SpongeBob SquarePants'}), Record({id: 2, name: 'Patrick Star'})]
       * });
       * </pre>
       */
      map: function (callback, thisArg) {
         var Next = Di.resolve('chain.$mapped');
         return new Next(
            this,
            callback,
            thisArg
         );
      },

      /**
       * Перекомбинирует коллекцию, каждый n-ый элемент которой является массивом, первым элементом которого является n-ый элемент исходной коллекции, вторым - n-ый элемент второй коллекции и т.д.
       * @param {...Array} [args] Коллекции для комбинирования.
       * @return {WS.Data/Chain/Zipped}
       * @example
       * Скомбинируем массивы:
       * <pre>
       * requirejs(['js!WS.Data/Chain'], function(Chain) {
       *    Chain(
       *       [1, 2, 3]
       *    ).zip(
       *       ['one', 'two', 'three'],
       *       [true, true, false]
       *    ).value();//[[1, 'one', true], [2, 'two', true], [3, 'three', false]]
       * });
       * </pre>
       */
      zip: function () {
         var Next = Di.resolve('chain.$zipped'),
            args = [],
            i;

         for (i = 0; i < arguments.length; i++) {
            args.push(arguments[i]);
         }

         return new Next(
            this,
            args
         );
      },

      /**
       * Преобразует коллекцию в объект, используя исходную коллекцию в качестве названий свойств, а вторую - в качестве значений свойств
       * @param {Array.<*>} values Значения свойств.
       * @return {Object}
       * @example
       * Получим данные учетной записи:
       * <pre>
       * requirejs(['js!WS.Data/Chain'], function(Chain) {
       *    Chain(
       *       ['login', 'password', 'email']
       *    ).zipObject(
       *       ['root', '123', 'root@localhost']
       *    );//{login: 'root', password: '123', email: 'root@localhost'}
       * });
       * </pre>
       */
      zipObject: function (values) {
         var result = Object.create(null);
         this.zip(values).each(function(item) {
            result[item[0]] = item[1];
         });
         return result;
      },

      /**
       * Преобразует коллекцию, возвращая значение свойства для каждого элемента.
       * @param {String} propertyName Название свойства.
       * @return {WS.Data/Chain/Mapped}
       * @example
       * Получим имена персонажей из массива:
       * <pre>
       * requirejs([
       *    'js!WS.Data/Chain'
       * ], function(
       *    Chain
       * ) {
       *    Chain([
       *       {id: 1, name: 'SpongeBob SquarePants'},
       *       {id: 2, name: 'Patrick Star'}
       *    ]).pluck('name').value();//['SpongeBob SquarePants', 'Patrick Star']
       * });
       * </pre>
       * Получим имена персонажей из рекордсета:
       * <pre>
       * requirejs([
       *    'js!WS.Data/Chain',
       *    'js!WS.Data/Collection/RecordSet'
       * ], function(
       *    Chain,
       *    RecordSet
       * ) {
       *    Chain(new RecordSet({
       *       rawData: [
       *          {id: 1, name: 'SpongeBob SquarePants'},
       *          {id: 2, name: 'Patrick Star'}
       *       ]
       *    })).pluck('name').value();//['SpongeBob SquarePants', 'Patrick Star']
       * });
       * </pre>
       */
      pluck: function (propertyName) {
         return this.map(function(item) {
            return Utils.getItemPropertyValue(item, propertyName);
         });
      },

      /**
       * Преобразует коллекцию, вызывая метод каждого элемента.
       * @param {String} methodName Название метода.
       * @param {...*} [args] Аргументы метода.
       * @return {WS.Data/Chain/Mapped}
       * @example
       * Получим список названий фруктов в верхнем регистре:
       * <pre>
       * requirejs([
       *    'js!WS.Data/Chain'
       * ], function(
       *    Chain
       * ) {
       *    Chain([
       *       'apple',
       *       'cherry',
       *       'banana'
       *    ]).invoke('toUpperCase').value();//['APPLE', 'CHERRY', 'BANANA']
       * });
       * </pre>
       * Получим аббревиатуру из слов:
       * <pre>
       * requirejs([
       *    'js!WS.Data/Chain'
       * ], function(
       *    Chain
       * ) {
       *    Chain(['What', 'you', 'see', 'is', 'what', 'you', 'get'])
       *       .invoke('substr', 0, 1)
       *       .invoke('toUpperCase')
       *       .value()
       *       .join('');//['WYSIWYG']
       * });
       * </pre>
       */
      invoke: function (methodName) {
         var args = [],
            i;
         for (i = 1; i < arguments.length; i++) {
            args.push(arguments[i]);
         }

         return this.map(function(item) {
            return item[methodName].apply(item, args);
         });
      },

      /**
       * Соединяет коллекцию с другими коллекциями, добавляя их элементы в конец.
       * @param {...Array.<Array>|Array.<WS.Data/Collection/IEnumerable>} [args] Коллекции, с которыми объединить.
       * @return {WS.Data/Chain/Concatenated}
       * @example
       * Объединим коллекцию с двумя массивами:
       * <pre>
       * requirejs(['js!WS.Data/Chain'], function(Chain) {
       *    Chain([1, 2]).concat([3, 4], [5]).value();//[1, 2, 3, 4, 5]
       * });
       * </pre>
       */
      concat: function () {
         var Next = Di.resolve('chain.$concatenated'),
            args = [],
            i;

         for (i = 0; i < arguments.length; i++) {
            args.push(arguments[i]);
         }

         return new Next(
            this,
            args
         );
      },

      /**
       * Разворачивает иерархическую коллекцию в плоскую: каждый итерируемый элемент коллекции рекрурсивно вставляется в виде коллекции.
       * @return {WS.Data/Chain/Flattened}
       * @example
       * Развернем массив:
       * <pre>
       * requirejs(['js!WS.Data/Chain'], function(Chain) {
       *    Chain([1, [2], [3, [[4, [5]]]]]).flatten().value();//[1, 2, 3, 4, 5]
       * });
       * </pre>
       */
      flatten: function () {
         var Next = Di.resolve('chain.$flattened');
         return new Next(
            this
         );
      },

      /**
       * Преобразует коллекцию, удаляя из нее повторяющиеся элементы (используется строгое сравнение ===).
       * @param {Function(*): String|Number>} [idExtractor] Функция, возвращающий уникальный идентификатор для каждого элемента коллекции.
       * @return {WS.Data/Chain/Uniquely}
       * @example
       * Оставим уникальные значения массива:
       * <pre>
       * requirejs(['js!WS.Data/Chain'], function(Chain) {
       *    Chain([1, 2, 3, 2, 1, 0]).uniq().value();//[1, 2, 3, 0]
       * });
       * </pre>
       * Оставим элементы с уникальным значением поля kind:
       * <pre>
       * requirejs(['js!WS.Data/Chain'], function(Chain) {
       *    Chain([
       *       {title: 'Apple', kind: 'fruit'},
       *       {title: 'Cherry', kind: 'fruit'},
       *       {title: 'Cucumber', kind: 'vegetable'},
       *       {title: 'Pear', kind: 'fruit'},
       *       {title: 'Potato', kind: 'vegetable'}
       *    ]).uniq(function(item) {
       *       return item.kind;
       *    }).value();//[{title: 'Apple', kind: 'fruit'}, {title: 'Cucumber', kind: 'vegetable'}]
       * });
       * </pre>
       */
      uniq: function (idExtractor) {
         var Next = Di.resolve('chain.$uniquely');
         return new Next(
            this,
            idExtractor
         );
      },

      /**
       * Преобразует коллекцию, добавляя в нее элементы других коллекций, которых в ней еще нет.
       * @param {...Array.<Array>|Array.<WS.Data/Collection/IEnumerable>} [args] Коллекции, элементы которых надо добавить.
       * @return {WS.Data/Chain/Uniquely}
       * @example
       * Оставим уникальные значения массива:
       * <pre>
       * requirejs(['js!WS.Data/Chain'], function(Chain) {
       *    Chain([1, 2, 3]).union([0, 1, 2, 3, 4, 5]).value();//[1, 2, 3, 0, 4, 5]
       * });
       * </pre>
       */
      union: function () {
         return this
            .concat.apply(this, arguments)
            .uniq();
      },

      //endregion Transformation

      //region Filtering

      /**
       * Фильтрует коллекцию, оставляя в ней те элементы, которые прошли фильтр.
       * @param {Function(*, Number): Boolean} callback Функция-фильтр, принимает аргументы: элемент коллекции и его порядковый номер.
       * @param {Object} [thisArg] Контекст вызова callback.
       * @return {WS.Data/Chain/Filtered}
       * @example
       * Выберем четные значения массива:
       * <pre>
       * requirejs(['js!WS.Data/Chain'], function(Chain) {
       *    Chain([1, 2, 3, 4, 5]).filter(function(item) {
       *       return item % 2 === 0;
       *    }).value();//[2, 4]
       * });
       * </pre>
       */
      filter: function (callback, thisArg) {
         var Next = Di.resolve('chain.$filtered');
         return new Next(
            this,
            callback,
            thisArg
         );
      },

      /**
       * Фильтрует коллекцию, исключая из нее те элементы, которые прошли фильтр.
       * @param {Function(*, Number): Boolean} callback Функция-фильтр, принимает аргументы: элемент коллекции и его порядковый номер.
       * @param {Object} [thisArg] Контекст вызова callback.
       * @return {WS.Data/Chain/Filtered}
       * @example
       * Исключим значения от 2 до 4:
       * <pre>
       * requirejs(['js!WS.Data/Chain'], function(Chain) {
       *    Chain([1, 2, 3, 4, 5]).reject(function(item) {
       *       return item >= 2 && item <= 4;
       *    }).value();//[1, 5]
       * });
       * </pre>
       */
      reject: function (callback, thisArg) {
         return this.filter(function() {
            return !callback.apply(thisArg, arguments);
         });
      },

      /**
       * Фильтрует коллекцию, оставляя в ней элементы, имеющие указанный набор значений свойств.
       * @param {Object} properties Объект, с набором проверяемых свойств и их значений.
       * @return {WS.Data/Chain/Filtered}
       * @example
       * Получим персонажей мужского пола из дома Старков:
       * <pre>
       * requirejs([
       *    'js!WS.Data/Chain'
       * ], function(
       *    Chain
       * ) {
       *    var stillAliveOrNot = [
       *       {name: 'Eddard Stark', house: 'House Stark', gender: 'm'},
       *       {name: 'Catelyn Stark', house: 'House Stark', gender: 'f'},
       *       {name: 'Jon Snow', house: 'House Stark', gender: 'm'},
       *       {name: 'Sansa Stark', house: 'House Stark', gender: 'f'},
       *       {name: 'Arya Stark', house: 'House Stark', gender: 'f'},
       *       {name: 'Daenerys Targaryen', house: 'House Targaryen', gender: 'f'},
       *       {name: 'Viserys Targaryen', house: 'House Targaryen', gender: 'm'},
       *       {name: 'Jorah Mormont', house: 'House Targaryen', gender: 'm'}
       *    ];
       *    Chain(stillAliveOrNot).where({
       *       house: 'House Stark',
       *       gender: 'm'
       *    }).value();//[{name: 'Eddard Stark', house: 'House Stark', gender: 'm'}, {name: 'Jon Snow', house: 'House Stark', gender: 'm'}]
       * });
       * </pre>
       */
      where: function (properties) {
         var keys = Object.keys(properties);
         return this.filter(function(item) {
            return keys.reduce(function(prev, key) {
               return prev && Utils.getItemPropertyValue(item, key) === properties[key];
            }, true);
         });
      },

      /**
       * Возвращает первый элемент коллекции или фильтрует ее, оставляя в ней первые n элементов.
       * @param {Number} [n] Количество элементов, которые нужно выбрать. Если не указан, то возвращается первый элемент.
       * @return {*|WS.Data/Chain/Sliced}
       * @example
       * Выберем первый элемент:
       * <pre>
       * requirejs(['js!WS.Data/Chain'], function(Chain) {
       *    Chain([1, 2, 3, 4, 5]).first();//1
       * });
       * </pre>
       * Выберем первые 3 элемента:
       * <pre>
       * requirejs(['js!WS.Data/Chain'], function(Chain) {
       *    Chain([1, 2, 3, 4, 5]).first(3).value();//[1, 2, 3]
       * });
       * </pre>
       */
      first: function (n) {
         if (n === undefined) {
            var enumerator = this.getEnumerator();
            return enumerator.moveNext() ? enumerator.getCurrent() : undefined;
         }

         var Next = Di.resolve('chain.$sliced');
         return new Next(this, 0, n);
      },

      /**
       * Возвращает последний элемент коллекции или фильтрует ее, оставляя в ней последние n элементов.
       * @param {Number} [n] Количество элементов, которые нужно выбрать. Если не указан, то возвращается последний элемент.
       * @return {*|WS.Data/Chain/Reversed}
       * @example
       * Выберем последний элемент:
       * <pre>
       * requirejs(['js!WS.Data/Chain'], function(Chain) {
       *    Chain([1, 2, 3, 4, 5]).last();//5
       * });
       * </pre>
       * Выберем последние 3 элемента:
       * <pre>
       * requirejs(['js!WS.Data/Chain'], function(Chain) {
       *    Chain([1, 2, 3, 4, 5]).last(3).value();//[3, 4, 5]
       * });
       * </pre>
       */
      last: function (n) {
         if (n === undefined) {
            return this.reverse().first();
         }

         return this.reverse()
            .first(n)
            .reverse();
      },

      //endregion Filtering

      //region Ordering

      /**
       * Меняет порядок элементов коллекции на обратный
       * @return {WS.Data/Chain/Reversed}
       * @example
       * Изменим порядок элементов:
       * <pre>
       * requirejs(['js!WS.Data/Chain'], function(Chain) {
       *    Chain(['one', 'two', 'three']).reverse().value();//['three', 'two', 'one']
       * });
       * </pre>
       */
      reverse: function () {
         var Next = Di.resolve('chain.$reversed');
         return new Next(this);
      },

      /**
       * Сортирует коллекцию с использованием функции сортировки, алгоритм работы и сигнатура которой аналогичны методу {@link https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Array/sort Array.prototype.sort}.
       * @param {Function(*, *): Number} [compareFunction] Функция сортировки, принимает аргументами два элемента коллекции, которые нужно сравнить.
       * @return {WS.Data/Chain/Sorted}
       * @example
       * Отсортируем массив чисел по возрастанию:
       * <pre>
       * requirejs(['js!WS.Data/Chain'], function(Chain) {
       *    Chain([2, 4, 3, 1, 5]).sort(function(a, b) {
       *       return a - b;
       *    }).value();//[1, 2, 3, 4, 5]
       * });
       * </pre>
       */
      sort: function (compareFunction) {
         var Next = Di.resolve('chain.$sorted');
         return new Next(
            this,
            compareFunction
         );
      }

      //endregion Ordering

      //region Public methods
   });

   return Abstract;
});
