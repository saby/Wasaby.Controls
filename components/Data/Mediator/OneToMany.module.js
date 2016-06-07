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
      _parents: null,
      _children: null,
      _parentToChild: null,
      _childToParent: null,

      constructor: function $OneToMany() {
         OneToMany.superclass.constructor.call(this);
         this._parents = [];
         this._children = [];
         this._parentToChild = [];
         this._childToParent = {};
      },

      //region SBIS3.CONTROLS.Data.Mediator.IMediator

      getInstance: function () {
         return Di.resolve('mediator.one-to-many');
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
         var parentIndex = this._insertParent(parent),
            childIndex = this._insertChild(child);
         this._insertRelation(parentIndex, childIndex, name);
      },

      /**
       * Удаляет отношение "родитель - ребенок"
       * @param {SBIS3.CONTROLS.Data.Mediator.IReceiver} parent Родитель
       * @param {SBIS3.CONTROLS.Data.Mediator.IReceiver} child Ребенок
       */
      removeFrom: function (parent, child) {
         var parentIndex = this._getParentIndex(parent),
            childIndex;
         if (parentIndex > -1) {
            childIndex = this._removeChild(child);
            if (childIndex > -1) {
               this._removeRelation(parentIndex, childIndex);
            }
         }
      },

      /**
       * Очищает все отношения у указанного родителя
       * @param {SBIS3.CONTROLS.Data.Mediator.IReceiver} parent Родитель
       */
      clear: function (parent) {
         var parentIndex = this._getParentIndex(parent),
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
         var parentIndex = this._getParentIndex(parent),
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
            callback.call(this, this._children[childIndex], relation ? relation[1]: undefined);
         }
      },

      /**
       * Возвращает родителя для указанного ребенка
       * @param {SBIS3.CONTROLS.Data.Mediator.IReceiver} child Ребенок
       * @return {SBIS3.CONTROLS.Data.Mediator.IReceiver}
       */
      getParent: function (child) {
         var relation = this._childToParent[this._getChildIndex(child)];
         return relation ? this._parents[relation[0]] : undefined;
      },

      /**
       * Уведомляет родителя об изменении ребенка
       * @param {SBIS3.CONTROLS.Data.Mediator.IReceiver} child Ребенок
       * @param {*} [data] Данные об изменениях
       */
      childChanged: function (child, data) {
         var parent = this.getParent(child),
            relation;
         if (parent) {
            relation = this._childToParent[this._getChildIndex(child)];
            parent.relationChanged(child, relation ? relation[1] : '', data);
         }
      },

      /**
       * Уведомляет детей об изменении родителя
       * @param {SBIS3.CONTROLS.Data.Mediator.IReceiver} parent Родитель
       * @param {*} [data] Данные об изменениях
       */
      parentChanged: function (parent, data) {
         this.each(parent, function(child, name) {
            child.relationChanged(parent, name, data);
         });
      },

      //endregion Public methods

      //region Protected methods

      /**
       * Проверяет наличие закэшированного значения поля
       * @param {String} name Название поля
       * @return {Boolean}
       * @protected
       */

      _getParentIndex: function(parent) {
         return Array.indexOf(this._parents, parent);
      },

      _getChildIndex: function(child) {
         return Array.indexOf(this._children, child);
      },

      _insertParent: function(parent) {
         var index = this._getParentIndex(parent);
         if (index === -1) {
            index = this._parents.length;
            this._parents.push(parent);
         }
         return index;
      },

      _insertChild: function(child) {
         var index = this._getChildIndex(child);
         if (index === -1) {
            index = this._children.length;
            this._children.push(child);
         }
         return index;
      },

      _removeChild: function(child) {
         var index = this._getChildIndex(child);
         if (index > -1) {
            this._children.splice(index, 1);
         }
         return index;
      },

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

      _removeRelation: function(parentIndex, childIndex) {
         var children = this._getChildren(parentIndex),
            index = Array.indexOf(children, childIndex);
         if (index > -1) {
            children.splice(index, 1);
         }
         delete this._childToParent[childIndex];
         return index;
      },

      _getChildren: function(parentIndex) {
         var children = this._parentToChild[parentIndex];
         if (!children) {
            children = this._parentToChild[parentIndex] = [];
         }
         return children;
      }

      //endregion Protected methods
   });

    OneToMany.getInstance = OneToMany.prototype.getInstance;

   Di.register('mediator.one-to-many', OneToMany, {single: true});

   return OneToMany;
});
