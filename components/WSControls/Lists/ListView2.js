define('js!WSControls/Lists/ListView2', ['js!WSControls/Lists/ItemsControl',
      'Core/core-instance',
      'js!WSControls/Controllers/ListSelector',
      'tmpl!WSControls/Lists/ListView2',
      'tmpl!WSControls/Lists/resources/ItemTemplate',
      'tmpl!WSControls/Lists/resources/GroupTemplate',
      'js!WSControls/Controllers/ListMultiSelector',
      'js!WSControls/Lists/ItemsToolbar/ItemsToolbarCompatible'],

   function(ItemsControl, cInstance, ListSelector, template, ItemTemplate, groupTemplate, ListMultiSelector) {
      
      var INDICATOR_DELAY = 2000;
      
      var ListView = ItemsControl.extend({
         _template: template,
         
         _needSelector: true,
         _needMultiSelector: true,
         
         _defaultGroupTemplate: groupTemplate,
         _defaultItemTemplate: ItemTemplate,
         _createDefaultSelector : function() {
            return new ListSelector({
               selectedIndex : this._options.selectedIndex,
               selectedKey : this._options.selectedKey,
               allowEmptySelection: this._options.allowEmptySelection,
               projection: this._itemsProjection,
               idProperty: this._options.idProperty
            })
         },
         _createDefaultMultiSelector: function() {
            return new ListMultiSelector({
               projection: this._itemsProjection,
               idProperty: this._options.idProperty,
               allowEmptyMultiSelection: this._options.allowEmptySelection,
               selectedKeys: this._options.selectedKeys
            })
         },
         _getItemData: function() {
            var data = ListView.superclass._getItemData.apply(this, arguments);
            data.selectedKey = this._selector.getSelectedKey();
            return data;
         },
   
         _mouseMove: function(e) {
            var hash = this._getDataHashFromTarget(e.target),
                index = hash && this._itemsProjection ? this._itemsProjection.getIndexByHash(hash) : -1;
            
            if (this.hoveredIndex !== index) {
               this.hoveredIndex = index;
            }
         },
   
         _mouseLeave: function () {
            this.hoveredIndex = -1;
         },


         /*DataSource*/
         _toggleIndicator: function(show){  //TODO метод скопирован из старого ListView
            var self = this;
//            container = this.getContainer(),
//            ajaxLoader = container.find('.controls-AjaxLoader').eq(0),
//            indicator, centerCord, scrollContainer;


            this._showedLoading = show;
            if (show) {
               setTimeout(function(){
                  if (!self.isDestroyed() && self._showedLoading) {
//                  scrollContainer = self._getScrollContainer()[0];
//                  indicator = ajaxLoader.find('.controls-AjaxLoader__outer');
//                  if(indicator.length && scrollContainer && scrollContainer.offsetHeight && container[0].scrollHeight > scrollContainer.offsetHeight) {
//                     /* Ищем кординату, которая находится по середине отображаемой области грида */
//                     centerCord =
//                        (Math.max(scrollContainer.getBoundingClientRect().bottom, 0) - Math.max(container[0].getBoundingClientRect().top, 0))/2;
//                     /* Располагаем индикатор, учитывая прокрутку */
//                     indicator[0].style.top = centerCord + scrollContainer.scrollTop + 'px';
//                  } else {
//                     /* Если скрола нет, то сбросим кординату, чтобы индикатор сам расположился по середине */
//                     indicator[0].style.top = '';
//                  }
                     self.loading = true;
                  }
               }, INDICATOR_DELAY);
            }
            else {
               this.loading = show;
            }
            this._setDirty();
         }
         /**/
      });

      return ListView;
   });