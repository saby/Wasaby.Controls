/* global define, console, doT, $ws, $, require */
define('js!SBIS3.CONTROLS.MenuNewView', [
   'js!SBIS3.CONTROLS.IMenuNewView',
   'js!SBIS3.CONTROLS.TreeControl.TreeView',
   'js!SBIS3.CONTROLS.FloatArea',
   'js!SBIS3.CONTROLS.Data.Utils'
], function(IMenuNewView,TreeView, FloatArea, DataUtils) {
   'use strict';
   /**
    * Представление для меню
    * @class SBIS3.CONTROLS.MenuView
    * @extends SBIS3.CONTROLS.TreeControl.TreeView
    * @author Крайнов Дмитрий Олегович
    */
   var MenuView = TreeView.extend([IMenuNewView],/** @lends SBIS3.CONTROLS.MenuView.prototype */{
      _moduleName: 'SBIS3.CONTROLS.MenuView',
      $protected: {
         _rootNodeСssClass: 'controls-Menu',
         _subMenuСssClass: 'controls-Menu__Popup controls-Menu__SubMenuPopup',
         _itemHasChildClass: ' controls-Menu__hasChild',
         _сssPrefix: 'controls-Menu__',
         _subContainers: {},
         _subMenus: {},
         _itemContainerTag: 'div',
         /**
          * @var {defaultDirectionFirstLevel} в какую сторону окрывать всплывающее меню при наведении на элемент
          * меню первого уровня. Допустимые значения: down, up, rigth, left.
          */
         defaultDirectionFirstLevel: 'down'

      },

      destroy: function() {
         MenuView.superclass.destroy.call(this);
         this.destroySubObjects();
      },
      // region public
      /**
      * вызывает деструктор у дочерних меню
      */
      destroySubObjects: function() {
         $ws.helpers.forEach(this._subMenus, function(subMenu) {
            subMenu.destroy();
         });
         this._subMenus = {};
         this._subContainers = {};
      },

      setNodeExpanded: function(node, expanded) {
         if(expanded && node.getChildren().getCount()) {
            var hash = node.getHash();
            if(this._subMenus[hash]) {
               this._subMenus[hash].show();
            }
            else {
               this.renderNode(node);
            }
         }
      },

      renderNode: function(node) {
         var targetContainer = this._getContainerByHash(node.getHash()),
            hash = node.getHash(),
            area;
         if(!this._subMenus.hasOwnProperty(hash)) {
            area = this._createSubMenu(targetContainer, node);
            area.getContainer().html(this._execTemplate(
               this._options.template,
               this._getRenderData(node)
            ));
            this._attachEventHandlers(area.getContainer());
            area.show();
            this._subMenus[hash] = area;
         } else {
            this._subMenus[hash].show();
         }
      },

      getComponents: function(node) {
         var components = [];
         if(node) {
            node.find('[data-component]').each(function(i, item) {
               if(typeof item.wsControl === 'function')
                  components.push(item.wsControl());
            });
         }
         else {
            components = this.getComponents(this.getRootNode());
            var self = this;
            $ws.helpers.forEach(this._subMenus, function(area) {
               components = components.concat(self.getComponents(area.getContainer()));
            });
         }
         return components;
      },

      getSubMenus: function() {
         return this._subMenus;
      },
      /**
       * возвращает css класс контейнера элемента
       * @returns {String}
       */
      getItemContainerClass: function() {
         return this._сssPrefix + this._itemContainerCssClass;
      },

      hideSubMenus: function() {
         var menus = this.getSubMenus();
         $ws.helpers.forEach(menus, function(subMenu) {
            subMenu.hide();
         });
      },
      // endregion public
      //region protected
      _getItemRenderData: function(item, index, level) {
         level = level || 0;
         var itemData = TreeView.superclass._getItemRenderData.call(this, item, index);
         if($ws.helpers.instanceOfMixin(item, 'SBIS3.CONTROLS.Data.Collection.ITreeItem')) {
            itemData.level = level;
            if(item.isNode()) {
               var expandClass = ' ' + this._сssPrefix + (item.isExpanded()?this._treeExpandedСssClass:this._treeCollapsedСssClass);
               itemData.containerClass += expandClass + ' ' + this._itemHasChildClass;
               itemData.expanded = item.isExpanded();
            }
         }
         return itemData;
      },

      _createSubMenu: function(target, item) {
         target = $(target);
         var config,
            parent,
            isFirstLevel = true,
            parentHash = item.getParent().getHash();
         if(this._subMenus.hasOwnProperty(parentHash)) {
            parent = this._subMenus[parentHash];
            isFirstLevel = false;
         }
         else {
            parent = this.getRootNode().wsControl();
         }
         config = this._getSubMenuConfig(isFirstLevel, item);
         config.element = $('<div/>').addClass(this._rootNodeСssClass +' '+this._subMenuСssClass);
         config.parent = parent;
         config.opener = typeof parent.getOpener == 'function' ? parent.getOpener() : parent;
         config.target = target;
         return new FloatArea(config);
      },

      _getSubMenuConfig: function(isFirstLevel, item) {
         var config = {
            corner: 'tr',
            verticalAlign: {
               side: 'top'
            },
            horizontalAlign: {
               side: 'left'
            },
            closeByExternalOver: true,
            targetPart: true
         };
         config = this._onMenuConfig(config, isFirstLevel, item);
         return config;
      },

      _onMenuConfig: function(config, isFirstLevel, item) {
         var direction = DataUtils.getItemPropertyValue(item.getContents(), 'direction');
         if(!direction && isFirstLevel) {
            direction = 'down';
         }
         if(direction) {
            switch(direction) {
               case 'down' :
               {
                  config.corner = 'bl';
                  break;
               }
               case 'up' :
               {
                  config.corner = 'tl';
                  config.verticalAlign.side = 'bottom';
                  break;
               }
               case 'right' :
               {
                  config.corner = 'tl';
                  config.horizontalAlign.side = 'right';
                  break;
               }
            }
         }
         return config;
      },
      /*
      * ищет контейнер по хешу в основном контейнере и подменю
      * @params hash - хеш элемента
      * @return {JQuery}
      * */
      _getContainerByHash: function(hash) {
         var elem = $("[data-hash="+hash+"]", this.getRootNode());
         if(elem.length > 0) {
            return elem;
         }
         var subMenus = this.getSubMenus();
         for(var h in subMenus){
            if(subMenus.hasOwnProperty(h)) {
               var menu = subMenus[h];
               elem = $("[data-hash="+hash+"]", menu.getContainer());
               if(elem.length > 0)
                  return elem;
            }
         }
         return $();

      },
      _getTreeChildrenContainer: function(item) {
         var hash = item.getHash(),
            subMenus = this.getSubMenus();
         if(subMenus.hasOwnProperty(hash)) {
            return subMenus[hash].getContainer();
         }
         return $();
      }
      //endregion protected
   });
   return MenuView;
});
