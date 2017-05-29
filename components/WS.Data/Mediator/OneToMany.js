/* global define */
define('js!WS.Data/Mediator/OneToMany', [
   'js!WS.Data/Mediator/IMediator',
   'js!WS.Data/Entity/Abstract',
   'js!WS.Data/Di',
   'Core/core-instance'
], function (
   IMediator,
   Abstract,
   Di,
   CoreInstance
) {
   'use strict';

   /**
    * Посредник, реализующий отношения "один ко многим".
    * @class WS.Data/Mediator/OneToMany
    * @extends WS.Data/Entity/Abstract
    * @implements WS.Data/Mediator/IMediator
    * @author Мальцев Алексей
    */

   var OneToMany = Abstract.extend([IMediator], /** @lends WS.Data/Mediator/OneToMany.prototype */{
      _moduleName: 'WS.Data/Mediator/OneToMany',

      /**
       * @member {Array.<Object>} Реестр объектов
       */
      _registry: null,

      /**
       * @member {Object.<String, Number>} Реестр идентификаторов объектов
       */
      _identities: null,

      /**
       * @member {Array.<Array.<Number>>} Индекс родителя -> [индексы детей]
       */
      _parentToChild: null,

      /**
       * @member {Object.<Number, Array.<Number|String>>} Индекс ребенка -> [индекс родителя, название отношения]
       */
      _childToParent: null,

      constructor: function $OneToMany() {
         OneToMany.superclass.constructor.call(this);
         this._registry = [];
         this._identities = {};
         this._parentToChild = [];
         this._childToParent = {};
      },

      destroy: function() {
         this._registry = null;
         this._identities = null;
         this._parentToChild = null;
         this._childToParent = null;
         OneToMany.superclass.destroy.call(this);
      },

      //region WS.Data/Mediator/IMediator

      //endregion WS.Data/Mediator/IMediator

      //region Public methods

      /**
       * Добавляет отношение "родитель - ребенок"
       * @param {*} parent Родитель
       * @param {*} child Ребенок
       * @param {String} [name] Название отношений
       */
      addTo: function (parent, child, name) {
         var parentIndex = this._insert(parent),
            childIndex = this._insert(child);
         this._insertRelation(parentIndex, childIndex, name);
      },

      /**
       * Удаляет отношение "родитель - ребенок"
       * @param {*} parent Родитель
       * @param {*} child Ребенок
       */
      removeFrom: function (parent, child) {
         var parentIndex = this._getIndex(parent),
            childIndex;
         if (parentIndex > -1) {
            childIndex = this._getIndex(child);
            if (childIndex > -1) {
               this._removeRelation(parentIndex, childIndex);
               this._removeUnlinked(childIndex);
            }
            this._removeUnlinked(parentIndex);
         }
      },

      /**
       * Очищает все отношения c детьми у указанного родителя
       * @param {*} parent Родитель
       */
      clear: function (parent) {
         var parentIndex = this._getIndex(parent),
            children;
         if (parentIndex === -1) {
            return;
         }
         children = this._getChildrenIndexes(parentIndex);
         for (var i = 0; i < children.length; i++) {
            delete this._childToParent[children[i]];
         }
         children.length = 0;

         this._removeUnlinked(parentIndex);
      },

      /**
       * Возвращает всех детей для указанного родителя
       * @param {*} parent Родитель
       * @param {Function(*)} callback Функция обратного вызова для каждого ребенка
       */
      each: function (parent, callback) {
         var parentIndex = this._getIndex(parent),
            childIndex,
            children,
            child,
            relation;
         if (parentIndex === -1) {
            return;
         }
         children = this._getChildrenIndexes(parentIndex);
         for (var i = 0; i < children.length; i++) {
            childIndex = children[i];
            relation = this._getRelation(childIndex);
            child = this._registry[childIndex];
            if (this._isAlive(child)) {
               callback.call(this, child, relation ? relation[1]: undefined);
            }
         }
      },

      /**
       * Возвращает родителя для указанного ребенка
       * @param {*} child Ребенок
       * @return {*}
       */
      getParent: function (child) {
         var relation = this._getRelation(this._getIndex(child)),
            parent = relation ? this._registry[relation[0]] : undefined;
         return this._isAlive(parent) ? parent : undefined;
      },

      /**
       * Уведомляет родителя об изменении ребенка
       * @param {*} child Ребенок
       * @param {*} [data] Данные об изменениях
       * @param {Boolean} [recursive=false] Рекурсивно обойти всю иерархию родителей
       */
      childChanged: function (child, data, recursive) {
         var parent = this.getParent(child),
            relation;

         if (parent) {
            relation = this._getRelation(this._getIndex(child));

            if (parent._wsDataMediatorIReceiver) {//it's equal to CoreInstance.instanceOfMixin(parent, 'WS.Data/Mediator/IReceiver')
               if (this._isAlive(parent)) {
                  parent.relationChanged(child, relation ? relation[1] : '', data);
               }
               if (recursive) {
                  this.childChanged(parent, data, recursive);
               }
            }
         }
      },

      /**
       * Уведомляет детей об изменении родителя
       * @param {*} parent Родитель
       * @param {*} [data] Данные об изменениях
       * @param {Boolean} [recursive=false] Рекурсивно обойти всю иерархию детей
       */
      parentChanged: function (parent, data, recursive) {
         this.each(parent, (function(child, name) {
            if (child && child._wsDataMediatorIReceiver) {//it's equal to CoreInstance.instanceOfMixin(child, 'WS.Data/Mediator/IReceiver')
               if (this._isAlive(child)) {
                  child.relationChanged(parent, name, data);
               }
               if (recursive) {
                  this.parentChanged(child, data, recursive);
               }
            }
         }).bind(this));
      },

      //endregion Public methods

      //region Protected methods

      /**
       * Возвращает идентификатор объекта
       * @param {*} item Объект
       * @return {String}
       * @protected
       */
      _getInstanceId: function(item) {
         //item._wsDataEntityIInstantiable is equal to CoreInstance.instanceOfMixin(item, 'WS.Data/Entity/IInstantiable')
         return item && item._wsDataEntityIInstantiable ? item.getInstanceId() : undefined;
      },

      /**
       * Возвращает индекс объекта в реестре
       * @param {*} item Объект
       * @return {Number}
       * @protected
       */
      _getIndex: function(item) {
         var id = this._getInstanceId(item);
         if (id) {
            var index = this._identities[id];
            return index === undefined ? -1 : index;
         } else {
            return this._registry.indexOf(item);
         }
      },

      /**
       * Добавляет объект в реестр, если его еще там нет
       * @param {*} item Объект
       * @return {Number} Индекс объекта в реестре
       * @protected
       */
      _insert: function(item) {
         var index = this._getIndex(item);
         if (index === -1) {
            index = this._registry.length;
            this._registry.push(item);
            var id = this._getInstanceId(item);
            if (id) {
               this._identities[id] = index;
            }
         }
         return index;
      },

      /**
       * Удаляет объект из реестра, если он больше ни с кем не связан
       * @param {Number} index Индекс объекта
       * @protected
       */
      _removeUnlinked: function(index) {
         var asParent = this._parentToChild[index],
            asChild = this._childToParent[index];
         if (!asParent && !asChild) {
            this._remove(index);
         }
      },

      /**
       * Удаляет объект из реестра, если он там есть
       * @param {Number} index Индекс объекта
       * @protected
       */
      _remove: function(index) {
         if (index > -1) {
            var item = this._registry[index],
               id = item ? this._getInstanceId(item) : undefined;
            if (id) {
               delete this._identities[id];
            }
            this._registry[index] = null;
         }
      },

      /**
       * Проверяет, что объект "живой" (не был уничтожен)
       * @param {*} item Объект
       * @return {Boolean}
       * @protected
       */
      _isAlive: function(item) {
         //Вместо CoreInstance.instanceOfModule(item, 'WS.Data/Entity/Abstract') т.к. важна скорость
         return item instanceof Object && item.isDestroyed ? !item.isDestroyed() : true;
      },

      /**
       * Возвращет отношение
       * @param {Number} childIndex Индекс ребенка
       * @return {Array.<Number, String>}
       * @protected
       */
      _getRelation: function(childIndex) {
         return this._childToParent[childIndex];
      },

      /**
       * Добавляет отношение
       * @param {Number} parentIndex Индекс родителя
       * @param {Number} childIndex Индекс ребенка
       * @param {String} name Название отношения
       * @protected
       */
      _insertRelation: function(parentIndex, childIndex, name) {
         if (parentIndex > -1) {
            var children = this._getChildrenIndexes(parentIndex);
            children.push(childIndex);
         }
         this._childToParent[childIndex] = [parentIndex, name];
      },

      /**
       * Удаляет отношение
       * @param {Number} parentIndex Индекс родителя
       * @param {Number} childIndex Индекс ребенка
       * @protected
       */
      _removeRelation: function(parentIndex, childIndex) {
         if (parentIndex > -1) {
            var children = this._getChildrenIndexes(parentIndex),
               index = children.indexOf(childIndex);
            if (index > -1) {
               children.splice(index, 1);
               if (children.length === 0) {
                  this._parentToChild[parentIndex] = undefined;
               }
            }
         }
         if (this._getParentIndex(childIndex) === parentIndex) {
            delete this._childToParent[childIndex];
         }
      },

      /**
       * Возвращает индекс родителя для указанного ребенка
       * @param {Number} childIndex Индекс ребенка
       * @return {Number} Индекс родителя
       * @protected
       */
      _getParentIndex: function(childIndex) {
         var relation = this._getRelation(childIndex);
         return relation ? relation[0] : -1;
      },

      /**
       * Возвращает индексы детей
       * @param {Number} parentIndex Индекс родителя
       * @return {Array.<Number>}
       * @protected
       */
      _getChildrenIndexes: function(parentIndex) {
         var children = this._parentToChild[parentIndex];
         if (!children) {
            children = this._parentToChild[parentIndex] = [];
         }
         return children;
      }

      //endregion Protected methods
   });

   Di.register('mediator.one-to-many', OneToMany);

   return OneToMany;
});
