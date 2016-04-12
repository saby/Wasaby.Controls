/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Core', [], function () {
   /**
    * Ядро системы типов
    * @class SBIS3.CONTROLS.Data.Core
    * @public
    * @author Мальцев Алексей
    */

   var _private = {
      contextualExtend: function(mixins, overrides) {
         return Core.extend(this, mixins, overrides);
      },
      mixinWrappers: {
         $around: 'callAround',
         $after: 'callNext',
         $before: 'callBefore'
      }
   };

   var Core = /** @lends SBIS3.CONTROLS.Data.Core.prototype */{
      _moduleName: 'SBIS3.CONTROLS.Data.Core',

      /**
       * Наследует один класс от другого
       * @remark
       * Наследование осуществляется на основе цепочки прототипов.
       * Защищенные члены класса имеют название, начинающееся с подчеркивания:
       * <pre>
       *    var Account = Core.extend({
       *       _token: '',
       *       _getToken: function () {
       *          return this._token || (this._token = Date.now());
       *       }
       *    });
       * </pre>
       * Для обеспечения возможности использовать свойства и методы родителя, в наследнике определено свойство superclass, которое ссылается на прототип родителя:
       * <pre>
       *    var Account = Core.extend({
       *       _login: '',
       *       getLogin: function () {
       *          return this._login;
       *       },
       *       setLogin: function (login) {
       *          this._login = login;
       *       }
       *    });
       *
       *    var User = Account.extend({
       *       _domain: 'localhost',
       *       getLogin: function() {
       *          return User.superclass.getLogin.call(this) + '@' + this._domain;
       *       }
       *    });
       *
       *    var mike = new User();
       *    mike.setLogin('jessica');
       *    mike.getLogin();//jessica@localhost
       * </pre>
       * Конструктор потомка определяется свойством constructor в overrides.
       * Для того, чтобы цепочка конструкторов не прерывалась, необходимо вызывать конструктор родителя:
       * <pre>
       *    var Account = Core.extend({
       *       _login: '',
       *       constructor: function (login) {
       *          this._login = login;
       *       },
       *       getLogin: function () {
       *          return this._login;
       *       }
       *    });
       *
       *    var User = Account.extend({
       *       _domain: '',
       *       constructor: function(login, domain) {
       *          User.superclass.constructor.call(this, login);
       *          this._domain = domain;
       *       },
       *       getLogin: function() {
       *          return User.superclass.getLogin.call(this) + '@' + this._domain;
       *       }
       *    });
       *
       *    var jess = new User('jessica', 'nigri.name');
       *    jess.getLogin();//jessica@nigri.name
       * </pre>
       * Примеси добавляют определенные в них свойства и методы в прототип. Если родитель имеет те же свойства и методы,
       * то они заменяются свойствами и методами примеси (тоже самое касается свойств и методов примеси, относительно
       * свойств и методов, определенных в overrides):
       * <pre>
       *    var Vehicle = Core.extend({
       *       move: function () {
       *          console.log('I\'m not able to move');
       *       }
       *    });
       *
       *    var WheelMixin = {
       *       _wheels: 0,
       *       move: function () {
       *          console.log('I\'m move with ' + this._wheels + ' wheels');
       *       }
       *    };
       *
       *    var Bike = Vehicle.extend([WheelMixin], {
       *       _wheels: 2
       *    });
       *
       *    var myBike = new Bike();
       *    myBike.move();//I'm move with 2 wheels
       * </pre>
       * Для набора примесей свойства и методы последующих примесей перетирают свойтва и методы предыдущих:
       * <pre>
       *    var Vehicle = Core.extend({
       *       move: function () {
       *          console.log('I\'m not able to move');
       *       }
       *    });
       *
       *    var WheelMixin = {
       *       _wheels: 0,
       *       move: function () {
       *          console.log('I\'m move with ' + this._wheels + ' wheels');
       *       }
       *    };
       *
       *    var ReactionMixin = {
       *       _engines: 0,
       *       move: function () {
       *          console.log('I\'m move with ' + this._engines + ' reaction engines');
       *       }
       *    };
       *
       *    var OnlyFlyingTurboJet = Vehicle.extend([WheelMixin, ReactionMixin], {
       *       _wheels: 4,
       *       _engines: 2
       *    });
       *
       *    var myJet = new OnlyFlyingTurboJet();
       *    myJet.move();//I'm move with 2 reaction engines
       * </pre>
       * Чтобы задействовать поведение всех примесей, необхдимо вызывать методы  каждой из них в требуемой
       * последовательности и с требуемыми аргументами:
       * <pre>
       *    var Vehicle = Core.extend({
       *       move: function () {
       *          console.log('I\'m not able to move');
       *       }
       *    });
       *
       *    var WheelMixin = {
       *       _wheels: 0,
       *       move: function () {
       *          console.log('I\'m move with ' + this._wheels + ' wheels');
       *       }
       *    };
       *
       *    var ReactionMixin = {
       *       _engines: 0,
       *       move: function () {
       *          console.log('I\'m move with ' + this._engines + ' reaction engines');
       *       }
       *    };
       *
       *    var TurboJet = Vehicle.extend([WheelMixin, ReactionMixin], {
       *       _wheels: 4
       *       _engines: 2,
       *       move: function () {
       *          WheelMixin.move.call(this);
       *          ReactionMixin.move.call(this);
       *       }
       *    });
       *
       *    var myJet = new TurboJet();
       *    myJet.move();//I'm move with 4 wheels, I'm move with 2 reaction engines
       * </pre>
       * @param {Function} parent Конструктор родителя
       * @param {Array.<Object>} mixins Миксины
       * @param {Object} overrides Переназначенные свойства и методы
       * @return {Function} Конструктор потомка
       * @static
       */
      extend: function (Parent, mixins, overrides) {
         if (!(Parent instanceof Function)) {
            overrides = mixins;
            mixins = Parent;
            Parent = Object;
         }
         if (!(mixins instanceof Array)) {
            overrides = mixins;
            mixins = undefined;
         }

         if (!overrides) {
            overrides = {};
         }
         if (!overrides.hasOwnProperty('constructor')) {
            overrides.constructor = function() {
               Parent.prototype.constructor.apply(this, arguments);
            };
         }

         var Child = overrides.constructor,
            Proxy = function () {};
         Proxy.prototype = Parent.prototype;
         Child.prototype = new Proxy();
         Child.superclass = Parent.prototype;

         if (mixins) {
            for (var i = 0, count = mixins.length; i < count; i++) {
               this._mixin(Child.prototype, mixins[i]);
            }
         }

         this._override(Child.prototype, overrides);

         Child.extend = _private.contextualExtend;

         return Child;
      },

      /**
       * Добавляет примесь в прототип
       * @param {Object} target Прототип модуля
       * @param {Object} mixin Примесь
       * @protected
       * @static
       */
      _mixin: function (target, mixin) {
         if (mixin instanceof Object) {
            if (!target.hasOwnProperty('_mixins')) {
               target._mixins = target._mixins ? target._mixins.slice() : [];
            }
            target._mixins.push(mixin);

            var wrappers = _private.mixinWrappers,
               item,
               key,
               wrapperMethod,
               wrapperKey;
            for (key in mixin) {
               if (mixin.hasOwnProperty(key)) {
                  item = mixin[key];
                  if (wrappers.hasOwnProperty(key)) {
                     wrapperMethod = wrappers[key];
                     for (wrapperKey in item) {
                        if (item.hasOwnProperty(wrapperKey)) {
                           if (target[wrapperKey] instanceof Function) {
                              target[wrapperKey] = target[wrapperKey][wrapperMethod](item[wrapperKey]);
                           } else {
                              target[wrapperKey] = item[wrapperKey];
                           }
                        }
                     }
                  } else {
                     target[key] = item;
                  }
               }
            }
         }
      },

      /**
       * Перезаписывает свойства одного объекта свойствами другого
       * @param {Object} target Объект, в которые пишем
       * @param {Object} source Объект, из которого получаем
       * @protected
       * @static
       */
      _override: function (target, source) {
         if (source instanceof Object) {
            for (var key in source) {
               if (source.hasOwnProperty(key)) {
                  target[key] = source[key];
               }
            }
         }
      }
   };

   return Core;
});
