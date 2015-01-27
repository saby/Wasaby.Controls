define('js!SBIS3.CONTROLS.DSMixin', ['js!SBIS3.CONTROLS.Algorithm'], function (_) {

   /**
    * Миксин, задающий любому контролу поведение работы с набором однотипных элементов.
    * @mixin SBIS3.CONTROLS.DSMixin
    */

   var DSMixin = /**@lends SBIS3.CONTROLS.DSMixin.prototype  */{
      $protected: {
         _itemsInstances: {},
         _dataSource: undefined,
         _dataSet: null,
         _dotItemTpl: null,
         _options: {
            /**
             * @cfg {DataSource} Набор исходных данных по которому строится отображение
             */
            dataSource: undefined
         }
      },

      $constructor: function () {
         this._publish('onDrawItems');
         this._dataSource = this._options.dataSource;
      },

      getDataSet: function () {
         return this._dataSet;
      },

      setDataSet: function (DS) {
         //TODO: проверка что действительно DataSource.
         this._dataSet = DS;
      },

      _drawItems: function () {
         this._itemsInstances = {};

         var
            itemsReadyDef = new $ws.proto.ParallelDeferred(),
            self = this,
            itemsContainer = this._getItemsContainer();

         itemsContainer.empty();


         this._query().addCallback(function (DS) {
            _.each(DS, function (item, key, i, parItem, lvl) {

               var
                  targetContainer = self._getTargetContainer(item, key, parItem, lvl);

               itemsReadyDef.push(self._drawItem(item, targetContainer, key, i, parItem, lvl));

            });
         });


         itemsReadyDef.done().getResult().addCallback(function () {
            self._notify('onDrawItems');
            self._drawItemsCallback();
         });

      },

      _drawItemsCallback: function () {

      },

      _query: function () {
         var self = this,
            def = new $ws.proto.Deferred();
         this._dataSource.query().addCallback(
            function (DS) {
               self.setDataSet(DS);
               def.callback(DS);
            }
         );
         return def;
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

      _drawItem: function (item, targetContainer) {
         var
            key = this._dataSet.getKey(item),
            self = this;
         return this._createItemInstance(item, targetContainer).addCallback(function (container) {
            self._addItemClasses(container, key);
         });
      },

      _getItemTemplate: function () {
         throw new Error('Method _getItemTemplate() must be implemented')
      },

      _addItemClasses: function (container, key) {
         container.attr('data-id', key).addClass('controls-ListView__item');
      },

      _createItemInstance: function (item, resContainer) {
         var
            itemTpl = this._getItemTemplate(item),
            def = new $ws.proto.Deferred();

         function drawItemFromTpl(tplConfig, resContainer) {
            var container = $(tplConfig);
            resContainer.append(container);
            def.callback(container);
         }

         if (typeof itemTpl == 'string') {
            drawItemFromTpl.call(this, doT.template(itemTpl)(item), resContainer);
         }
         else if (typeof itemTpl == 'function') {
            var self = this;
            var tplConfig = itemTpl.call(this, item);
            //Может быть DotTepmlate
            if (typeof tplConfig == 'string') {
               drawItemFromTpl.call(this, tplConfig, resContainer);
            }
            //иначе функция выбиратор
            else if (tplConfig.componentType && tplConfig.componentType.indexOf('js!') == 0) {
               //если передали имя класса то реквайрим его и создаем
               require([tplConfig.componentType], function (Ctor) {
                  var
                     ctrlWrapper = $('<div></div>').appendTo(resContainer),
                     config = tplConfig.config;
                  config.element = ctrlWrapper;
                  config.parent = self;
                  var ctrl = new Ctor(config);
                  self._itemsInstances[self._dataSet.getKey()] = ctrl;
                  def.callback(ctrl.getContainer());
               });
            }
            else {
               //и также можно передать dot шаблон
               drawItemFromTpl.call(this, doT.template(tplConfig.componentType)(tplConfig.config), resContainer);
            }
         }
         return def;
      }

   };

   return DSMixin;

});