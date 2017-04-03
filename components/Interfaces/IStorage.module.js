/**
 * Created by am.gerasimov on 18.01.2017.
 */
define('js!SBIS3.CONTROLS.IStorage', [], function() {

   'use strict';

   /**
    * Интерфейс хранения данных в хранилище.
    * Позволяет добавлять, изменять или удалять сохраненные элементы данных.
    * @public
    * @mixin SBIS3.CONTROLS.IStorage
    * @author Герасимов Александр
    */
   var IStorage =/** @lends SBIS3.CONTROLS.IStorage.prototype */ {
      /**
       * Строка, содержащая название ключа, по которому получается значение из хранилища.
       * @param key {String}
       */
      getItem: function(key) {
         throw new Error('Method must be implemented');
      },
      /**
       * Если методу setItem() передать ключ и значение, то в хранилище будет добавлено соответсвтующее ключу значение,
       * либо, если запись уже есть в хранилище, то значение по ключу будет обновлено.
       * @param key {String}
       * @param value {*}
       */
      setItem: function(key, value) {
         throw new Error('Method must be implemented');
      },
      /**
       * Если методу removeItem() передать ключ, то из хранилища будет удален элемент с указанным ключем.
       * @param key {String}
       */
      removeItem: function(key) {
         throw new Error('Method must be implemented');
      }
   };

   return IStorage;

});