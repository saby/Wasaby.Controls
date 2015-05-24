define('js!SBIS3.CONTROLS.TreeMixinDS', [], function () {

   /**
    * Позволяет контролу отображать данные имеющие иерархическую структуру и работать с ними.
    * @mixin SBIS3.CONTROLS.TreeMixinDS
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
            expand: false

         }
      },


      _getRecordsForRedraw: function() {
         /*Получаем только рекорды с parent = curRoot*/
         var
            records = [];
         if (this._options.expand) {
            this.hierIterate(this._dataSet, function (record) {
               records.push(record);
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
      closeNode: function (key) {
         var itemCont = $('.controls-ListView__item[data-id="' + key + '"]', this.getContainer().get(0));
         $('.js-controls-TreeView__expand', itemCont).removeClass('controls-TreeView__expand__open');
         this._nodeClosed(key);
      },

      /**
       * Закрыть или открыть определенный узел
       * @param {String} key Идентификатор раскрываемого узла
       */

      toggleNode: function (key) {
         var itemCont = $('.controls-ListView__item[data-id="' + key + '"]', this.getContainer().get(0));
         if ($('.js-controls-TreeView__expand', itemCont).hasClass('controls-TreeView__expand__open')) {
            this.closeNode(key);
         }
         else {
            this.openNode(key);
         }
      },

      before: {
         openNode: function () {
            if (this._options.expand) {
               this._filter = this._filter || {};
               this._filter['Разворот'] = 'С разворотом';
               this._filter['ВидДерева'] = 'Узлы и листья';
            }
         }
      },

      _loadNode : function(key) {
         /*TODO проверка на что уже загружали*/
         var filter = this._filter || {};
         if (this._options.expand) {
            filter['Разворот'] = 'С разворотом';
            filter['ВидДерева'] = 'Узлы и листья';
         }
         filter[this._options.hierField] = key;
         return this._dataSource.query(filter);
      },

      _nodeDataLoaded : function(key, dataSet) {
         var
            self = this,
            itemCont = $('.controls-ListView__item[data-id="' + key + '"]', this.getContainer().get(0));
         $('.js-controls-TreeView__expand', itemCont).first().addClass('controls-TreeView__expand__open');

         this._dataSet.merge(dataSet);
         this._dataSet._reindexTree(this._options.hierField);


         dataSet.each(function (record) {
            var targetContainer = self._getTargetContainer(record);
            if (targetContainer) {
               self._drawItem(record, targetContainer);
            }
         });


      },

      _nodeClosed : function(key) {

      }
   };

   return TreeMixinDS;

});