define('js!SBIS3.CONTROLS._TreeMixin', [], function() {
   /**
    * Позволяет контролу отображать данные имеющие иерархическую структуру и работать с ними.
    * @mixin SBIS3.CONTROLS._TreeMixin
    */
   var _TreeMixin = /** @lends SBIS3.CONTROLS._TreeMixin.prototype */{
      $protected: {
         _options: {
            /**
             * @cfg {Boolean} Отображать сначала узлы, потом листья
             */
            folderSort: false,
            /**
             * @cfg {String} Идентификатор узла, относительно которого надо отображать данные
             */
            root: '',
            /**
             * @cfg {Boolean} При открытия узла закрывать другие
             */
            singleExpand: '',
            /**
             * @cfg {String[]} Набор идентификаторов, обозначающих какую ветку надо развернуть при инициализации
             */
            openedPath: '',
            /**
             * @cfg {String} Поле иерархии
             */
            hierField : null
         }
      },
      /**
       * Установить корень выборки
       * @param {String} root Идентификатор корня
       */
      setRoot: function(root) {

      },
      /**
       * Открыть определенный путь
       * @param {String[]} path набор идентификаторов
       */
      setOpenedPath: function(path) {

      },
      /**
       * Раскрыть определенный узел
       * @param {String} key Идентификатор раскрываемого узла
       */
      openNode: function(key) {

      }

   };

   return _TreeMixin;

});