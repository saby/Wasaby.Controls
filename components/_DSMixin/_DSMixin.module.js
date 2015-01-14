define('js!SBIS3.CONTROLS._DSMixin', ['js!SBIS3.CONTROLS.Algorithm'], function (_) {

   /**
    * Миксин, задающий любому контролу поведение работы с набором однотипных элементов.
    * @mixin SBIS3.CONTROLS._DSMixin
    */

   var _DSMixin = /**@lends SBIS3.CONTROLS._DSMixin.prototype  */{
      $protected: {
         _dataSource: undefined,
         _DataSet: null,
         _dotItemTpl: null,
         _options: {
            dataSource: undefined
         }
      },

      $constructor: function () {
         this._dataSource = this._options.dataSource;
      },

      _drawItems: function () {
         var self = this;
         console.log('draw');
         this._query().addCallback(function () {

            _.each(self._DataSet, function (rec) {
               var
                  oneItemContainer = self._drawOneItemContainer(),
                  targetContainer = self._getTargetContainer();

               oneItemContainer.attr('data-id', rec.getKey()).addClass('controls-ListView__item');
               targetContainer.append(oneItemContainer);

               self._drawItem(oneItemContainer, rec);

            });

         });
      },


      //метод рисующий контейнер для одного элемента
      _drawOneItemContainer: function () {
         return $('<div class="js-controls-ListView__itemContent"></div>');
      },

      //метод определяющий в какой контейнер разместить определенный элемент
      _getTargetContainer: function () {
         //по стандарту все строки рисуются в itemsContainer
         return this._getItemsContainer();
      },

      //метод отдающий контейнер в котором надо отрисовывать элементы
      _getItemsContainer: function () {
         return this._container;
      },

      _drawItem: function (itemContainer, item) {
         var resContainer = itemContainer.hasClass('js-controls-ListView__itemContent') ? itemContainer : $('.js-controls-ListView__itemContent', itemContainer);
         var
            def = new $ws.proto.Deferred(),
            itemTpl = this._getItemTemplate(item);

         if (typeof itemTpl == 'string') {
            resContainer.append(doT.template(itemTpl)(item));
            def.callback(resContainer);
         }
         return def;
      },

      _getItemTemplate: function () {
         return '<div>template</div>';
      },

      _query: function () {
         var self = this,
            def = new $ws.proto.Deferred();
         this._dataSource.query().addCallback(
            function (DS) {
               self.setItems(DS);
               def.callback(DS);
            }
         );
         return def;
      },


      setItems: function (items) {
         this._DataSet = items;
      }

   };

   return _DSMixin;

});