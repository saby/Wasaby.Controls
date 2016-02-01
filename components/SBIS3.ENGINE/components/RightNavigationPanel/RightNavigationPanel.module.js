define('js!SBIS3.Engine.RightNavigationPanel', [
   'js!SBIS3.CONTROLS.TreeViewDS',
   'html!SBIS3.Engine.RightNavigationPanel/ItemTpl',
   'css!SBIS3.Engine.RightNavigationPanel'
], function(TreeViewDS, itemTpl) {
   'use strict';
   var RightNavigationPanel = TreeViewDS.extend( {
      $protected: {
         _options: {
            itemTemplate: itemTpl,
            allowEmptySelection: false,
            allowEnterToFolder: false,
            multiselect: false,
            itemsActions: [],
            singleExpand: true
         }
      },
      $constructor: function(){
         this.getContainer().addClass('engine-rightNavigationPanel');
      },
      _addItemAttributes : function(container, item) {
         RightNavigationPanel.superclass._addItemAttributes.apply(this,arguments);
         var expandContainer = $('.engine-rightNavigationPanel-expand', container);

         container.addClass('engine-rightNavigationPanel-item');
         if (item.get(this._options.hierField + '@')){
            container.addClass('engine-rightNavigationPanel-node');
         }
         if (expandContainer.length){
            expandContainer.addClass('controls-TreeView__expand js-controls-TreeView__expand');
         }
      },
      _elemClickHandlerInternal: function(data, id, target){
         RightNavigationPanel.superclass._elemClickHandlerInternal.apply(this, arguments);
         if ($(target).hasClass('engine-rightNavigationPanel-expand')) {
            return;
         }
         var row = $('[data-id=' + id + ']', this.getContainer()),
            parentNode = row.closest('.engine-rightNavigationPanel-node'),
            isExpand = !!$('.controls-TreeView__expand__open', parentNode).length;
         if (!isExpand) {
            this.toggleNode(id);
         }
      }
   });
   return RightNavigationPanel;

});