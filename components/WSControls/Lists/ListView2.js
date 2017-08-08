define('js!WSControls/Lists/ListView2', ['js!WSControls/Lists/Selector',
      'tmpl!WSControls/Lists/ListView2',
      'tmpl!WSControls/Lists/resources/GroupTemplate',
      'js!WSControls/Controllers/ListMultiSelector',
      'js!WSControls/Lists/ItemsToolbar/ItemsToolbarCompatible'],

   function(Selector, template, groupTemplate, ListMultiSelector) {
      
      var INDICATOR_DELAY = 2000;
      
      var ListView = Selector.extend({
         _controlName: 'WSControls/Lists/ListView',
         _template: template,
         _needMultiSelector: true,
         
         _defaultGroupTemplate: groupTemplate,

         _createDefaultMultiSelector: function() {
            return new ListMultiSelector({
               display: this._display,
               idProperty: this._options.idProperty,
               allowEmptyMultiSelection: this._options.allowEmptySelection,
               selectedKeys: this._options.selectedKeys,
               multiSelect: this._options.multiSelect
            })
         },

         _mouseMove: function(e, index) {
            if (this._hoveredIndex !== index) {
               this._hoveredIndex = index;
            }
         },

         _mouseLeave: function () {
            this._hoveredIndex = -1;
         },
   
         _getItemData: function(displayItem, index) {
            var data = ListView.superclass._getItemData.apply(this, arguments);
            data.hovered = this._hoveredIndex === index;
            return data;
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