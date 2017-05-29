/* global define, require */
define('js!WS.Data/Display/CollectionItem', [
   'js!WS.Data/Entity/Abstract',
   'js!WS.Data/Entity/OptionsMixin',
   'js!WS.Data/Entity/SerializableMixin',
   'js!WS.Data/Entity/IInstantiable',
   'js!WS.Data/Entity/InstantiableMixin',
   'js!WS.Data/Di'
], function (
   Abstract,
   OptionsMixin,
   SerializableMixin,
   IInstantiable,
   InstantiableMixin,
   Di
) {
   'use strict';

   /**
    * Элемент коллекции
    * @class WS.Data/Display/CollectionItem
    * @extends WS.Data/Entity/Abstract
    * @mixes WS.Data/Entity/OptionsMixin
    * @implements WS.Data/Entity/IInstantiable
    * @mixes WS.Data/Entity/InstantiableMixin
    * @mixes WS.Data/Entity/SerializableMixin
    * @public
    * @author Мальцев Алексей
    */
   var CollectionItem = Abstract.extend([OptionsMixin, IInstantiable, InstantiableMixin, SerializableMixin], /** @lends WS.Data/Display/CollectionItem.prototype */{
      _moduleName: 'WS.Data/Display/CollectionItem',

      /**
       * @cfg {WS.Data/Collection/IEnumerable} Коллекция, которой принадлежит элемент
       * @name WS.Data/Display/CollectionItem#owner
       */
      _$owner: null,

      /**
       * @cfg {*} Содержимое элемента коллекции
       * @name WS.Data/Display/CollectionItem#contents
       */
      _$contents: null,

      /**
       * @cfg {*} Элемент выбран
       * @name WS.Data/Display/CollectionItem#selected
       */
      _$selected: false,

      _instancePrefix: 'collection-item-',

      /**
       * @member {Number} Индекс содержимого элемента в коллекции (используется для сериализации)
       */
      _contentsIndex: undefined,

      constructor: function $CollectionItem(options) {
         CollectionItem.superclass.constructor.call(this, options);
         OptionsMixin.constructor.call(this, options);
      },

      //region WS.Data/Entity/SerializableMixin

      _getSerializableState: function(state) {
         state = SerializableMixin._getSerializableState.call(this, state);

         if (state.$options.owner) {
            var index = state.$options.owner.getCollection().getIndex(state.$options.contents);
            if (index > -1) {
               state.ci = index;
               delete state.$options.contents;
            }
         }

         delete state.$options.owner;

         state.iid = this.getInstanceId();

         return state;
      },

      _setSerializableState: function(state) {
         return SerializableMixin._setSerializableState(state).callNext(function() {
            if (state.hasOwnProperty('ci')) {
               this._contentsIndex = state.ci;
            }
            this._instanceId = state.iid;
         });
      },

      //endregion WS.Data/Entity/SerializableMixin

      //region Public methods

      /**
       * Возвращает коллекцию, которой принадлежит элемент
       * @return {WS.Data/Collection/IList}
       */
      getOwner: function () {
         return this._$owner;
      },

      /**
       * Устанавливает коллекцию, которой принадлежит элемент
       * @param {WS.Data/Collection/IList} owner Коллекция, которой принадлежит элемент
       */
      setOwner: function (owner) {
         this._$owner = owner;
      },

      /**
       * Возвращает содержимое элемента коллекции
       * @return {*}
       */
      getContents: function () {
         if (this._contentsIndex !== undefined) {
            //Ленивое восстановление _$contents по _contentsIndex после десериализации
            this._$contents = this.getOwner().getCollection().at(this._contentsIndex);
            this._contentsIndex = undefined;
         }
         return this._$contents;
      },

      /**
       * Устанавливает содержимое элемента коллекции
       * @param {*} contents Новое содержимое
       * @param {Boolean} [silent=false] Не уведомлять владельца об изменении содержимого
       */
      setContents: function (contents, silent) {
         if (this._$contents === contents) {
            return;
         }
         this._$contents = contents;
         if (!silent) {
            this._notifyItemChangeToOwner('contents');
         }
      },

      /**
       * Возвращает признак, что элемент выбран
       * @return {*}
       */
      isSelected: function () {
         return this._$selected;
      },

      /**
       * Устанавливает признак, что элемент выбран
       * @param {Boolean} selected Элемент выбран
       * @param {Boolean} [silent=false] Не уведомлять владельца об изменении признака выбранности
       */
      setSelected: function (selected, silent) {
         if (this._$selected === selected) {
            return;
         }
         this._$selected = selected;
         if (!silent) {
            this._notifyItemChangeToOwner('selected');
         }
      },

      //endregion Public methods

      //region Protected methods

      /**
       * Возвращает исходную коллекцию проекции
       * @return {WS.Data/Collection/IEnumerable}
       * @protected
       */
      _getSourceCollection: function() {
         return this.getOwner().getCollection();
      },

      /**
       * Генерирует событие у владельца об изменении свойства элемента
       * @param {String} property Измененное свойство
       * @protected
       */
      _notifyItemChangeToOwner: function(property) {
         if (this._$owner) {
            this._$owner.notifyItemChange(
               this,
               property
            );
         }
      }

      //endregion Protected methods
   });

   Di.register('display.collection-item', CollectionItem);

   return CollectionItem;
});
