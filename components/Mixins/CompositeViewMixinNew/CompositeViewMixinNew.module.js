define('js!SBIS3.CONTROLS.CompositeViewMixinNew', ['html!SBIS3.CONTROLS.CompositeViewMixin'], function(dotTplFn) {
   'use strict';
   /**
    * Позволяет контролу отображать данные в виде плитки/списка/таблицы
    * @mixin SBIS3.CONTROLS.CompositeViewMixin
    * @public
    */
   var MultiView = {
      _dotTplFn: dotTplFn,
      $protected: {
         _tileWidth: null,
         _folderWidth: null,
         _options: {
            /**
             * @cfg {Object} Режим отображения
             * @variant table таблица
             * @variant list список
             */
            viewMode: 'table',

            imageField: null,
            listTemplate: null,
            tileTemplate: null
         }
      },

      $constructor: function() {
         this._drawViewMode(this._options.mode);
         this._container.addClass('controls-CompositeView-' + this._options.viewMode);
         var self = this;

         this.subscribe('onDrawItems', function() {
            if (self._options.viewMode === 'table') {
               self._buildHead();
            }
         });
      },

      setViewMode: function(mode) {
         this._getItemsContainer().unbind('mousedown', this._dragStartHandler);
         this._options.viewMode = mode;
         this._getItemsContainer().bind('mousedown', this._dragStartHandler);
         this._drawViewMode(mode);
      },

      getViewMode: function() {
         return this._options.viewMode;
      },

      around: {
         _getItemTemplateSelector: function(parentFnc, item) {
            var resultTpl, dotTpl;
            switch (this._options.viewMode) {
               case 'table':
                  resultTpl = parentFnc.call(this, item);
                  break;
               case 'list':
                  {
                     if (this._options.listTemplate) {
                        if (this._options.listTemplate instanceof Function) {
                           dotTpl = this._options.listTemplate;
                        } else {
                           dotTpl = doT.template(this._options.listTemplate);
                        }
                     } else {
                        dotTpl = doT.template('<div style="{{=it.decorators.apply(it.color, \'color\')}}">{{=it.decorators.apply(it.item.get(it.description))}}</div>');
                     }
                     resultTpl = dotTpl;
                     break;
                  }
            }
            return resultTpl;
         },


         _buildTplArgs: function(parentFnc, item) {
            var parentOptions = parentFnc.call(this, item);
            if ((this._options.viewMode == 'list') || (this._options.viewMode == 'tile')) {
               parentOptions.image = this._options.imageField;
               parentOptions.description = this._options.displayField;
            }
            return parentOptions;
         },

         expandNode: function(parentFunc, key) {
            if (this.getViewMode() === 'table') {
               parentFunc.call(this, key);

            }
         },

         collapseNode: function(parentFunc, key) {
            if (this.getViewMode() === 'table') {
               parentFunc.call(this, key);
            }
         },
         _getItemActionsAlign: function(viewMode, hoveredItem) {
            if (hoveredItem.container.hasClass('js-controls-CompositeView__verticalItemActions')) {
               return 'vertical';
            } else {
               return 'horizontal';
            }
         },

         _getItemActionsPosition: function(parentFunc, hoveredItem) {
            var itemActions = this.getItemsActions().getContainer(),
               viewMode = this.getViewMode(),
               actionsAlign = this._getItemActionsAlign(viewMode, hoveredItem),
               height;

            this._itemActionsAlign[actionsAlign].call(itemActions);
            if (viewMode === 'table') return parentFunc.call(this, hoveredItem);

            height = itemActions[0].offsetHeight || itemActions.height();
            var position = {
               top: actionsAlign === 'horizontal' ?
                  hoveredItem.position.top + ((hoveredItem.size.height > height) ? hoveredItem.size.height - height : 0) : hoveredItem.position.top,
               right: this._container[0].offsetWidth - (hoveredItem.position.left + hoveredItem.size.width)
            };
            if (this._touchSupport) {
               position.top = hoveredItem.position.top;
            }
            return position;
         },

         _getItemsContainer: function(parentFnc) {
            if (this._options.viewMode == 'table') {
               return parentFnc.call(this);
            } else {
               return $('.controls-CompositeView__itemsContainer', this._container.get(0));
            }
         },

         _addItemAttributes: function(parentFnc, container, key) {
            switch (this._options.viewMode) {
               case 'list':
                  container.addClass('controls-CompositeView__listItem');
                  break;
               case 'tile':
                  container.addClass('controls-CompositeView__tileItem');
                  break;
            }
            parentFnc.call(this, container, key);
         }
      }

   };

   return MultiView;

});