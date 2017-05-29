/* global define */
define('js!WS.Data/Relation/Hierarchy', [
   'js!WS.Data/Entity/Abstract',
   'js!WS.Data/Entity/OptionsMixin',
   'js!WS.Data/Di',
   'Core/core-instance'
], function (
   Abstract,
   OptionsMixin,
   Di,
   CoreInstance
) {
   'use strict';

   /**
    * Класс, предоставляющий возможность построить иерархические отношения.
    *
    * Организуем работу с иерархическим каталогом товаров:
    * <pre>
    *    //Создадим экземпляр иерархических отношений и рекордсет
    *    var hierarchy = new Hierarchy({
    *          idProperty: 'id',
    *          parentProperty: 'parent',
    *          nodeProperty: 'parent@',
    *          declaredChildrenProperty: 'parent$'
    *       }),
    *       catalogue = new RecordSet({
    *          rawData: [
    *             {id: 1, parent: null, 'parent@': true, 'parent$': true, title: 'Computers'},
    *             {id: 2, parent: 1, 'parent@': true, 'parent$': false, title: 'Mac'},
    *             {id: 3, parent: 1, 'parent@': true, 'parent$': true, title: 'PC'},
    *             {id: 4, parent: null, 'parent@': true, 'parent$': true, title: 'Smartphones'},
    *             {id: 5, parent: 3, 'parent@': false, title: 'Home Station One'},
    *             {id: 6, parent: 3, 'parent@': false, title: 'Home Station Two'},
    *             {id: 7, parent: 4, 'parent@': false, title: 'Apple iPhone 7'},
    *             {id: 8, parent: 4, 'parent@': false, title: 'Samsung Galaxy Note 7'}
    *          ]
    *       });
    *
    *    //Проверим, является ли узлом запись 'Computers'
    *    hierarchy.isNode(catalogue.at(0));//true
    *
    *    //Проверим, является ли узлом запись 'Apple iPhone 7'
    *    hierarchy.isNode(catalogue.at(6));//false
    *
    *    //Получим все записи узла 'PC' (по значению ПК узла)
    *    hierarchy.getChildren(3, catalogue);//'Home Station One', 'Home Station Two'
    *
    *    //Получим все записи узла 'Smartphones' (по узлу)
    *    hierarchy.getChildren(catalogue.at(3), catalogue);//'Apple iPhone 7', 'Samsung Galaxy Note 7'
    *
    *    //Получим родительский узел для товара 'Home Station One' (по значению ПК товара)
    *    hierarchy.getParent(5, catalogue);//'PC'
    *
    *    //Получим родительский узел для узла 'Mac' (по узлу)
    *    hierarchy.getParent(catalogue.at(1), catalogue);//'Computers'
    *
    *    //Проверим, есть ли декларируемые потомки в узле 'Computers'
    *    hierarchy.hasDeclaredChildren(catalogue.at(0));//true
    *
    *    //Проверим, есть ли декларируемые потомки в узле 'Mac'
    *    hierarchy.hasDeclaredChildren(catalogue.at(1));//false
    * </pre>
    *
    * @class WS.Data/Relation/Hierarchy
    * @extends WS.Data/Entity/Abstract
    * @mixes WS.Data/Entity/OptionsMixin
    * @public
    * @author Мальцев Алексей
    */

   var Hierarchy = Abstract.extend([OptionsMixin], /** @lends WS.Data/Relation/Hierarchy.prototype */{
      _moduleName: 'WS.Data/Relation/Hierarchy',

      /**
       * @cfg {String} Название свойства, содержащего идентификатор узла.
       * @name WS.Data/Relation/Hierarchy#idProperty
       * @see getIdProperty
       * @see setIdProperty
       */
      _$idProperty: '',

      /**
       * @cfg {String} Название свойства, содержащего идентификатор родительского узла.
       * @name WS.Data/Relation/Hierarchy#parentProperty
       * @see getIdProperty
       * @see setIdProperty
       */
      _$parentProperty: '',

      /**
       * @cfg {String} Название свойства, содержащего признак узла.
       * @name WS.Data/Relation/Hierarchy#nodeProperty
       * @see getIdProperty
       * @see setIdProperty
       */
      _$nodeProperty: '',

      /**
       * @cfg {String} Название свойства, содержащего декларируемый признак наличия детей.
       * @name WS.Data/Relation/Hierarchy#declaredChildrenProperty
       * @see getIdProperty
       * @see setIdProperty
       */
      _$declaredChildrenProperty: '',

      constructor: function $Hierarchy(options) {
         Hierarchy.superclass.constructor.call(this, options);
         OptionsMixin.constructor.call(this, options);
      },

      //region Public methods

      /**
       * Возвращает название свойства, содержащего идентификатор узла.
       * @return {String}
       * @see idProperty
       * @see setIdProperty
       */
      getIdProperty: function () {
         return this._$idProperty;
      },

      /**
       * Устанавливает название свойства, содержащего идентификатор узла.
       * @param {String} idProperty
       * @see idProperty
       * @see getIdProperty
       */
      setIdProperty: function (idProperty) {
         this._$idProperty = idProperty;
      },


      /**
       * Возвращает название свойства, содержащего идентификатор родительского узла.
       * @return {String}
       * @see parentProperty
       * @see setParentProperty
       */
      getParentProperty: function () {
         return this._$parentProperty;
      },

      /**
       * Устанавливает название свойства, содержащего идентификатор родительского узла.
       * @param {String} parentProperty
       * @see parentProperty
       * @see getParentProperty
       */
      setParentProperty: function (parentProperty) {
         this._$parentProperty = parentProperty;
      },

      /**
       * Возвращает название свойства, содержащего признак узла.
       * @return {String}
       * @see nodeProperty
       * @see setNodeProperty
       */
      getNodeProperty: function () {
         return this._$nodeProperty;
      },

      /**
       * Устанавливает название свойства, содержащего признак узла.
       * @param {String} nodeProperty
       * @see nodeProperty
       * @see getNodeProperty
       */
      setNodeProperty: function (nodeProperty) {
         this._$nodeProperty = nodeProperty;
      },

      /**
       * Возвращает название свойства, содержащего декларируемый признак наличия детей.
       * @return {String}
       * @see declaredChildrenProperty
       * @see setDeclaredChildrenProperty
       */
      getDeclaredChildrenProperty: function () {
         return this._$declaredChildrenProperty;
      },

      /**
       * Устанавливает название свойства, содержащего декларируемый признак наличия детей.
       * @param {String} declaredChildrenProperty
       * @see declaredChildrenProperty
       * @see getDeclaredChildrenProperty
       */
      setDeclaredChildrenProperty: function (declaredChildrenProperty) {
         this._$declaredChildrenProperty = declaredChildrenProperty;
      },

      /**
       * Проверяет, является ли запись узлом.
       * Возвращаемые значения:
       * <ul>
       *   <li><em>true</em>: запись является узлом</li>
       *   <li><em>false</em>: запись является листом</li>
       *   <li><em>null</em>: запись является скрытым узлом</li>
       * </ul>
       * @param {WS.Data/Entity/Record} record
       * @return {Boolean|null}
       * @see nodeProperty
       */
      isNode: function(record) {
         return record.get(this._$nodeProperty);
      },

      /**
       * Возвращает список детей для указанного родителя.
       * @param {WS.Data/Entity/Record|Sting|Number} parent Родительский узел или его идентификатор
       * @param {WS.Data/Collection/RecordSet} rs Рекордсет
       * @return {Array.<WS.Data/Entity/Record>}
       * @see nodeProperty
       */
      getChildren: function(parent, rs) {
         if (!this._$parentProperty) {
            return parent === null || parent === undefined ? (function(){
               var result = [];
               rs.each(function(item) {
                  result.push(item);
               });
               return result;
            })() : [];
         }

         var parentId = this._asField(parent, this._$idProperty),
            indices = rs.getIndicesByValue(this._$parentProperty, parentId),
            children = [],
            i;

         //If nothing found by that property value, return all if null(root) requested
         if (indices.length === 0 && parentId === null) {
            indices = rs.getIndicesByValue(this._$parentProperty);
         }

         for (i = 0; i < indices.length; i++) {
            children.push(rs.at(indices[i]));
         }

         return children;
      },

      /**
       *
       * Возвращает признак наличия декларируемых детей.
       * @param {WS.Data/Entity/Record} record
       * @return {Boolean}
       * @see declaredChildrenProperty
       */
      hasDeclaredChildren: function(record) {
         return record.get(this._$declaredChildrenProperty);
      },

      /**
       * Возвращает родителя для указанного дочернего узла.
       * Если записи с указанным идентификатором нет - кидает исключение.
       * Если узел является корневым, возвращает null.
       * @param {WS.Data/Entity/Record|Sting|Number} child Дочерний узел или его идентификатор
       * @param {WS.Data/Collection/RecordSet} rs Рекордсет
       * @return {WS.Data/Entity/Record|Null}
       * @see nodeProperty
       */
      getParent: function(child, rs) {
         child = this._asRecord(child, rs);
         var parentId = child.get(this._$parentProperty);

         return parentId ? this._asRecord(parentId, rs) : null;
      },

      //endregion Public methods

      //region Protected methods

      /**
       * Возвращает инстанс записи
       * @param {WS.Data/Entity/Record|Sting|Number} value Запись или ее ПК
       * @param {WS.Data/Collection/RecordSet} rs Рекордсет
       * @return {WS.Data/Entity/Record}
       * @protected
       */
      _asRecord: function(value, rs) {
         if (CoreInstance.instanceOfModule(value, 'WS.Data/Entity/Record')) {
            return value;
         }

         var idProperty = this._$idProperty || rs.getIdProperty(),
            index = rs.getIndexByValue(idProperty, value);

         if (index === -1) {
            throw new ReferenceError(this._moduleName + ': Record with id "' + value + '" is not found in RecordSet');
         }

         return rs.at(index);
      },

      /**
       * Возвращает значение поля записи
       * @param {WS.Data/Entity/Record|Sting|Number} value Запись или значение ее поля
       * @param {String} field Имя поля
       * @return {*}
       * @protected
       */
      _asField: function(value, field) {
         if (!CoreInstance.instanceOfModule(value, 'WS.Data/Entity/Record')) {
            return value;
         }

         return value.get(field);
      }

      //endregion Protected methods
   });

   Di.register('relation.hierarchy', Hierarchy);

   return Hierarchy;
});
