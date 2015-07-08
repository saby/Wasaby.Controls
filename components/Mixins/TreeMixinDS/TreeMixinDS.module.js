define('js!SBIS3.CONTROLS.TreeMixinDS', [], function () {

   /**
    * Позволяет контролу отображать данные имеющие иерархическую структуру и работать с ними.
    * @mixin SBIS3.CONTROLS.TreeMixinDS
    * @author Крайнов Дмитрий Олегович
    */
   var TreeMixinDS = /** @lends SBIS3.CONTROLS.TreeMixinDS.prototype */{
      $protected: {
         _options: {
            /**
             * @cfg {Boolean} При открытия узла закрывать другие
             * @noShow
             */
            singleExpand: '',

            /**
             * Опция задаёт режим разворота.
             * @Boolean false Без разворота
             */
            expand: false,
            openedPath : {}
         }
      },

      $constructor : function() {
         this._filter = this._filter || {};
         delete (this._filter[this._options.hierField]);
         if (this._options.expand) {
            this._filter['Разворот'] = 'С разворотом';
            this._filter['ВидДерева'] = 'Узлы и листья';
         }
      },

      _getRecordsForRedraw: function() {
         /*Получаем только рекорды с parent = curRoot*/
         var
            self = this,
            records = [];
         if (this._options.expand) {
            this.hierIterate(this._dataSet, function (record) {
               if (self._options.displayType == 'folders') {
                  if (record.get(self._options.hierField + '@')) {
                     records.push(record);
                  }
               }
               else {
                  records.push(record);
               }
            });
         }
         else {
            return this._getRecordsForRedrawCurFolder();
         }

         return records;
      },

      /**
       * Закрыть определенный узел
       * @param {String} key Идентификатор раскрываемого узла
       */
      collapseNode: function (key) {
         var itemCont = $('.controls-ListView__item[data-id="' + key + '"]', this.getContainer().get(0));
         $('.js-controls-TreeView__expand', itemCont).removeClass('controls-TreeView__expand__open');
         delete(this._options.openedPath[key]);
         this._nodeClosed(key);
      },

      /**
       * Закрыть или открыть определенный узел
       * @param {String} key Идентификатор раскрываемого узла
       */

      toggleNode: function (key) {
         var itemCont = $('.controls-ListView__item[data-id="' + key + '"]', this.getContainer().get(0));
         if ($('.js-controls-TreeView__expand', itemCont).hasClass('controls-TreeView__expand__open')) {
            this.collapseNode(key);
         }
         else {
            this.expandNode(key);
         }
      },

      expandNode: function (key) {
         var self = this,
          filter = $ws.core.clone(this._filter) || {};
         if (this._options.expand) {
            this._filter = this._filter || {};
            filter['Разворот'] = 'С разворотом';
            filter['ВидДерева'] = 'Узлы и листья';
         }
         filter[this._options.hierField] = key;
         this._dataSource.query(filter).addCallback(function (dataSet) {
            self._nodeDataLoaded(key, dataSet);
         });
      },

      _nodeDataLoaded : function(key, dataSet) {
         var
            self = this,
            itemCont = $('.controls-ListView__item[data-id="' + key + '"]', this.getContainer().get(0));

         $('.js-controls-TreeView__expand', itemCont).first().addClass('controls-TreeView__expand__open');
         this._options.openedPath[key] = true;
         this._dataSet.merge(dataSet);
         this._dataSet._reindexTree(this._options.hierField);


         dataSet.each(function (record) {
            var targetContainer = self._getTargetContainer(record);
            if (targetContainer) {
               if (self._options.displayType == 'folders') {
                  if (record.get(self._options.hierField + '@')) {
                     self._drawItem(record, targetContainer);
                  }
               }
               else {
                  self._drawItem(record, targetContainer);
               }

            }
         });


      },

      _nodeClosed : function(key) {

      },

      before: {
         _dataLoadedCallback: function () {
            this._options.openedPath = {};
            this._dataSet._reindexTree(this._options.hierField);
            if (this._options.expand) {
               var tree = this._dataSet._indexTree;
               for (var i in tree) {
                  if (tree.hasOwnProperty(i) && i != 'null' && i != this._curRoot) {
                     this._options.openedPath[i] = true;
                  }
               }
            }
         }
      },

      _elemClickHandlerInternal: function (data, id, target) {
         if ($(target).hasClass('js-controls-TreeView__expand') && $(target).hasClass('has-child')) {
            var nodeID = $(target).closest('.controls-ListView__item').data('id');
            this.toggleNode(nodeID);
         }
      }

   };

   return TreeMixinDS;

});