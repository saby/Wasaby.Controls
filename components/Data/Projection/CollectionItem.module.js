/* global define, require, $ws */
define('js!SBIS3.CONTROLS.Data.Projection.CollectionItem', [
   'js!SBIS3.CONTROLS.Data.Entity.Abstract',
   'js!SBIS3.CONTROLS.Data.Entity.OptionsMixin',
   'js!SBIS3.CONTROLS.Data.IHashable',
   'js!SBIS3.CONTROLS.Data.HashableMixin',
   'js!SBIS3.CONTROLS.Data.Di'
], function (Abstract, OptionsMixin, IHashable, HashableMixin, Di) {
   'use strict';

   /**
    * Элемент коллекции
    * @class SBIS3.CONTROLS.Data.Projection.CollectionItem
    * @extends SBIS3.CONTROLS.Data.Entity.Abstract
    * @mixes SBIS3.CONTROLS.Data.Entity.OptionsMixin
    * @mixes SBIS3.CONTROLS.Data.IHashable
    * @mixes SBIS3.CONTROLS.Data.HashableMixin
    * @public
    * @author Мальцев Алексей
    */
   var CollectionItem = Abstract.extend([OptionsMixin, IHashable, HashableMixin], /** @lends SBIS3.CONTROLS.Data.Projection.CollectionItem.prototype */{
      _moduleName: 'SBIS3.CONTROLS.Data.Projection.CollectionItem',

      /**
       * @cfg {SBIS3.CONTROLS.Data.Collection.IEnumerable} Коллекция, которой принадлежит элемент
       * @name SBIS3.CONTROLS.Data.Projection.CollectionItem#owner
       */
      _$owner: null,

      /**
       * @cfg {*} Содержимое элемента коллекции
       * @name SBIS3.CONTROLS.Data.Projection.CollectionItem#contents
       */
      _$contents: null,

      /**
       * @cfg {*} Элемент выбран
       * @name SBIS3.CONTROLS.Data.Projection.CollectionItem#selected
       */
      _$selected: false,

      _hashPrefix: 'collection-item-',

      constructor: function $CollectionItem(options) {
         CollectionItem.superclass.constructor.call(this, options);
         OptionsMixin.constructor.call(this, options);
      },

      //region Public methods

      /**
       * Возвращает коллекцию, которой принадлежит элемент
       * @returns {SBIS3.CONTROLS.Data.Collection.IList}
       */
      getOwner: function () {
         return this._$owner;
      },

      /**
       * Устанавливает коллекцию, которой принадлежит элемент
       * @param {SBIS3.CONTROLS.Data.Collection.IList} owner Коллекция, которой принадлежит элемент
       */
      setOwner: function (owner) {
         this._$owner = owner;
      },

      /**
       * Возвращает содержимое элемента коллекции
       * @returns {*}
       */
      getContents: function () {
         return this._$contents;
      },

      /**
       * Устанавливает содержимое элемента коллекции
       * @param {*} contents Новое содержимое
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
       * @returns {*}
       */
      isSelected: function () {
         return this._$selected;
      },

      /**
       * Устанавливает признак, что элемент выбран
       * @param {Boolean} selected Элемент выбран
       */
      setSelected: function (selected) {
         if (this._$selected === selected) {
            return;
         }
         this._$selected = selected;
         this._notifyItemChangeToOwner('selected');
      },

      //endregion Public methods

      //region Protected methods

      /**
       * Возвращает исходную коллекцию проекции
       * @returns {SBIS3.CONTROLS.Data.Collection.IEnumerable}
       * @private
       */
      _getSourceCollection: function() {
         return this.getOwner().getCollection();
      },

      /**
       * Генерирует событие у владельца об изменении свойства элемента
       * @param {String} property Измененное свойство
       * @private
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

   Di.register('projection.collection-item', CollectionItem);

   return CollectionItem;
});
