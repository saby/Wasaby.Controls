/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Mediator.OneToMany', [
   'js!SBIS3.CONTROLS.Data.Mediator.IMediator',
   'js!SBIS3.CONTROLS.Data.Entity.Abstract',
   'js!SBIS3.CONTROLS.Data.Di'
], function (
   IMediator,
   Abstract,
   Di
) {
   'use strict';

   /**
    * Посредник, реализующий отношения "один ко многим".
    * @class SBIS3.CONTROLS.Mediator.OneToMany
    * @extends SBIS3.CONTROLS.Data.Entity.Abstract
    * @mixes SBIS3.CONTROLS.Data.Mediator.IMediator
    * @author Мальцев Алексей
    */

   var OneToMany = Abstract.extend([IMediator], /** @lends SBIS3.CONTROLS.Data.Mediator.OneToMany.prototype */{
      _moduleName: 'SBIS3.CONTROLS.Data.Mediator.OneToMany',

      /**
       * @member {Array.<Object>} Реестр объектов
       */
      _registry: null,

      /**
       * @member {Array.<Array.<Number>>} Индекс родителя -> [индексы детей]
       */
      _parentToChild: null,

      /**
       * @member {Object.<Number, Array.<Number, String>>} Индекс ребенка -> [индекс родителя, название отношения]
       */
      _childToParent: null,

      constructor: function $OneToMany() {
         OneToMany.superclass.constructor.call(this);
         this._registry = [];
         this._parentToChild = [];
         this._childToParent = {};
      },

      //region SBIS3.CONTROLS.Data.Mediator.IMediator

      getInstance: function () {
         return _instance || (_instance = new OneToMany());
      },

      //endregion SBIS3.CONTROLS.Data.Mediator.IMediator

      //region Public methods

      /**
       * Добавляет отношение "родитель - ребенок"
       * @param {SBIS3.CONTROLS.Data.Mediator.IReceiver} parent Родитель
       * @param {SBIS3.CONTROLS.Data.Mediator.IReceiver} child Ребенок
       * @param {String} [name] Название отношений
       */
      addTo: function (parent, child, name) {
         var parentIndex = this._insert(parent),
            childIndex = this._insert(child);
         this._insertRelation(parentIndex, childIndex, name);
      },

      /**
       * Удаляет отношение "родитель - ребенок"
       * @param {SBIS3.CONTROLS.Data.Mediator.IReceiver} parent Родитель
       * @param {SBIS3.CONTROLS.Data.Mediator.IReceiver} child Ребенок
       */
      removeFrom: function (parent, child) {
         var parentIndex = this._getIndex(parent),
            childIndex;
         if (parentIndex > -1) {
            childIndex = this._getIndex(child);
            if (childIndex > -1) {
               this._removeRelation(parentIndex, childIndex);
            }
         }
      },

      /**
       * Очищает все отношения c детьми у указанного родителя
       * @param {SBIS3.CONTROLS.Data.Mediator.IReceiver} parent Родитель
       */
      clear: function (parent) {
         var parentIndex = this._getIndex(parent),
            children;
         if (parentIndex === -1) {
            return;
         }
         children = this._getChildren(parentIndex);
         for (var i = 0; i < children.length; i++) {
            delete this._childToParent[children[i]];
         }
         children.length = 0;
      },

      /**
       * Возвращает всех детей для указанного родителя
       * @param {SBIS3.CONTROLS.Data.Mediator.IReceiver} parent Родитель
       * @param {Function(SBIS3.CONTROLS.Data.Mediator.IReceiver)} callback Функция обратного вызова для каждого ребенка
       */
      each: function (parent, callback) {
         var parentIndex = this._getIndex(parent),
            childIndex,
            children,
            relation;
         if (parentIndex === -1) {
            return;
         }
         children = this._getChildren(parentIndex);
         for (var i = 0; i < children.length; i++) {
            childIndex = children[i];
            relation = this._childToParent[childIndex];
            callback.call(this, this._registry[childIndex], relation ? relation[1]: undefined);
         }
      },

      /**
       * Возвращает родителя для указанного ребенка
       * @param {SBIS3.CONTROLS.Data.Mediator.IReceiver} child Ребенок
       * @return {SBIS3.CONTROLS.Data.Mediator.IReceiver}
       */
      getParent: function (child) {
         var relation = this._childToParent[this._getIndex(child)];
         return relation ? this._registry[relation[0]] : undefined;
      },

      /**
       * Уведомляет родителя об изменении ребенка
       * @param {SBIS3.CONTROLS.Data.Mediator.IReceiver} child Ребенок
       * @param {*} [data] Данные об изменениях
       * @param {Boolean} [recursive=false] Рекурсивно обойти всю иерархию родителей
       */
      childChanged: function (child, data, recursive) {
         var parent = this.getParent(child),
            relation;
         if (parent) {
            relation = this._childToParent[this._getIndex(child)];
            if ($ws.helpers.instanceOfMixin(parent, 'SBIS3.CONTROLS.Data.Mediator.IReceiver')) {
               parent.relationChanged(child, relation ? relation[1] : '', data);
               if (recursive) {
                  this.childChanged(parent, data, recursive);
               }
            }
         }
      },

      /**
       * Уведомляет детей об изменении родителя
       * @param {SBIS3.CONTROLS.Data.Mediator.IReceiver} parent Родитель
       * @param {*} [data] Данные об изменениях
       * @param {Boolean} [recursive=false] Рекурсивно обойти всю иерархию детей
       */
      parentChanged: function (parent, data, recursive) {
         this.each(parent, (function(child, name) {
            if ($ws.helpers.instanceOfMixin(child, 'SBIS3.CONTROLS.Data.Mediator.IReceiver')) {
               child.relationChanged(parent, name, data);
               if (recursive) {
                  this.parentChanged(child, data, recursive);
               }
            }
         }).bind(this));
      },

      //endregion Public methods

      //region Protected methods

      /**
       * Возвращает индекс объекта в реестре
       * @param {Object} item Объект
       * @return {Number}
       * @protected
       */
      _getIndex: function(item) {
         return Array.indexOf(this._registry, item);
      },

      /**
       * Добавляет объект в реестр, если его еще там нет
       * @param {Object} item Объект
       * @return {Number} Индекс объекта в реестре
       * @protected
       */
      _insert: function(item) {
         var index = this._getIndex(item);
         if (index === -1) {
            index = this._registry.length;
            this._registry.push(item);
         }
         return index;
      },

      /**
       * Удаляет объект из реестра, если он там есть
       * @param {Object} item Объект
       * @return {Number} Индекс удаленного объекта в реестре
       * @protected
       */
      _remove: function(child) {
         var index = this._getIndex(child);
         if (index > -1) {
            this._registry[index] = null;
         }
         return index;
      },

      /**
       * Добавляет отношение
       * @param {Number} parentIndex Индекс родителя
       * @param {Number} childIndex Индекс ребенка
       * @param {String} name Название отношения
       * @return {Number}
       * @protected
       */
      _insertRelation: function(parentIndex, childIndex, name) {
         var children = this._getChildren(parentIndex),
            index = Array.indexOf(children, childIndex);
         if (index === -1) {
            index = children.length;
            children.push(childIndex);
         }
         this._childToParent[childIndex] = [parentIndex, name];
         return index;
      },

      /**
       * Удаляет отношение
       * @param {Number} parentIndex Индекс родителя
       * @param {Number} childIndex Индекс ребенка
       * @return {Number}
       * @protected
       */
      _removeRelation: function(parentIndex, childIndex) {
         var children = this._getChildren(parentIndex),
            index = Array.indexOf(children, childIndex);
         if (index > -1) {
            children.splice(index, 1);
         }
         delete this._childToParent[childIndex];
         return index;
      },

      /**
       * Возвращает индексы детей
       * @param {Number} parentIndex Индекс родителя
       * @return {Array.<Number>}
       * @protected
       */
      _getChildren: function(parentIndex) {
         var children = this._parentToChild[parentIndex];
         if (!children) {
            children = this._parentToChild[parentIndex] = [];
         }
         return children;
      }

      //endregion Protected methods
   });

   var _instance = null;

   OneToMany.getInstance = OneToMany.prototype.getInstance;

   Di.register('mediator.one-to-many', OneToMany);

   return OneToMany;
});
