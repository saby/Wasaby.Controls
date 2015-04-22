define('js!SBIS3.CONTROLS.TreeMixinDS', [], function (MarkupTransformer) {
   /**
    * Позволяет контролу отображать данные имеющие иерархическую структуру и работать с ними.
    * @mixin SBIS3.CONTROLS.TreeMixinDS
    */
   var TreeMixinDS = /** @lends SBIS3.CONTROLS.TreeMixinDS.prototype */{
      $protected: {
         _ulClass: 'controls-TreeView__list',
         _options: {
            /**
             * @cfg {Boolean} При открытия узла закрывать другие
             * @noShow
             */
            singleExpand: ''

         }
      },

      around : {
         _elemClickHandler: function (parentFnc, id, data, target) {
            if ($(target).hasClass('js-controls-TreeView__expand')) {
               var nodeID = $(target).closest('.controls-ListView__item').data('id');
               this.toggleNode(nodeID)
            }
            else {
               parentFnc.call(this, id, data, target)
            }
         }
      },
      _redraw: function () {
         this._clearItems();
         var
            self = this,
            DataSet = this._dataSet;

         /*TODO вынести середину в переопределяемый метод*/

         this.hierIterate(DataSet, function (record, parent, lvl) {
            var
               targetContainer = self._getTargetContainer(record),
               parentKey = self.getParentKey(DataSet, record);

            if (targetContainer && (parentKey == self._options.root)) {
               self._drawItem(record, targetContainer);
            }
         });

         self.reviveComponents().addCallback(function () {
            self._notify('onDrawItems');
            self._drawItemsCallback();
         });

      },



      /**
       * Закрыть определенный узел
       * @param {String} key Идентификатор раскрываемого узла
       */
      closeNode: function (key) {
         var itemCont = $('.controls-ListView__item[data-id="' + key + '"]', this.getContainer().get(0));
         $('.js-controls-TreeView__expand', itemCont).removeClass('controls-TreeView__expand__open');
         $('.controls-TreeView__childContainer', itemCont).css('display', 'none').empty();
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

      _nodeDataLoaded : function(key, dataSet) {
         var
            self = this,
            itemCont = $('.controls-ListView__item[data-id="' + key + '"]', this.getContainer().get(0));
         $('.js-controls-TreeView__expand', itemCont).first().addClass('controls-TreeView__expand__open');

         dataSet.each(function (record) {
            var targetContainer = self._getTargetContainer(record);
            if (targetContainer) {
               self._drawItem(record, targetContainer);
            }
         });


      }
   };

   return TreeMixinDS;

});