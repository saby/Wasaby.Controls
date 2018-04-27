define('Controls/Path', [
   'Core/Control',
   'Controls/Utils/BreadCrumbsUtil',
   'Controls/List/resources/utils/ItemsUtil',
   'tmpl!Controls/Path/Path',
   'tmpl!Controls/Button/BackButton/Back',
   'css!Controls/Path/Path'
], function(
   Control,
   BreadCrumbsUtil,
   ItemsUtil,
   template,
   backButtonTemplate
) {
   'use strict';

   var _private = {
      calculateClasses: function(self, maxCrumbsWidth, backButtonWidth, availableWidth) {
         if (maxCrumbsWidth < availableWidth / 2 && backButtonWidth < availableWidth / 2) {
            self._backButtonClass = '';
            self._breadCrumbsClass = '';
         } else if (maxCrumbsWidth < availableWidth / 2 && backButtonWidth > availableWidth / 2) {
            self._backButtonClass = 'controls-Path__backButton_long';
            self._breadCrumbsClass = 'controls-Path__breadCrumbs_short';
         } else if (maxCrumbsWidth > availableWidth / 2 && backButtonWidth > availableWidth / 2) {
            self._backButtonClass = 'controls-Path__backButton_half';
            self._breadCrumbsClass = 'controls-Path__breadCrumbs_half';
         } else if (maxCrumbsWidth > availableWidth / 2 && backButtonWidth < availableWidth / 2) {
            self._backButtonClass = 'controls-Path__backButton_short';
            self._breadCrumbsClass = 'controls-Path__breadCrumbs_long';
         }
      },
      
      calculateItems: function(self, items) {
         var
            backButtonWidth,
            availableWidth,
            breadCrumbsItems;

         self._backButtonCaption = ItemsUtil.getPropertyValue(items[0], self._options.displayProperty || 'title');
         if (items.length > 1) {
            breadCrumbsItems = items.slice(1);
            backButtonWidth = BreadCrumbsUtil.getWidth(backButtonTemplate({
               _options: {
                  caption: self._backButtonCaption,
                  style: 'default',
                  size: 'm'
               }
            }));
            _private.calculateClasses(self, BreadCrumbsUtil.getMaxCrumbsWidth(breadCrumbsItems), backButtonWidth, self._container.clientWidth);

            availableWidth = self._breadCrumbsClass === 'controls-Path__breadCrumbs_half' ? self._container.clientWidth / 2 : self._container.clientWidth;
            BreadCrumbsUtil.calculateBreadCrumbsToDraw(self,  breadCrumbsItems, BreadCrumbsUtil.getItemsSizes(breadCrumbsItems), availableWidth);
         } else {
            self._visibleItems = [];
         }
      }
   };

   var Path = Control.extend({
      _template: template,
      _backButtonCaption: '',
      _visibleItems: [],
      _backButtonClass: '',
      _breadCrumbsClass: '',
      _oldWidth: 0,

      _beforeMount: function() {
         //Эта функция передаётся по ссылке в Opener, так что нужно биндить this, чтобы не потерять его
         this._onResult = this._onResult.bind(this);
      },

      _afterMount: function() {
         BreadCrumbsUtil.calculateConstants();

         this._oldWidth = this._container.clientWidth;
         if (this._options.items && this._options.items.length > 0) {
            _private.calculateItems(this, this._options.items);
            this._forceUpdate();
         }
      },

      _beforeUpdate: function(newOptions) {
         if (BreadCrumbsUtil.shouldRedraw(this._options.items, newOptions.items, this._oldWidth, this._container.clientWidth - BreadCrumbsUtil.HOME_WIDTH)) {
            this._oldWidth = this._container.clientWidth;
            _private.calculateItems(this, newOptions.items);
         }
      },

      _onResult: function(args) {
         BreadCrumbsUtil.onResult(this, args);
      },

      _onItemClick: function(e, originalEvent, item, isDots) {
         BreadCrumbsUtil.onItemClick(this, originalEvent, item, isDots);
      },

      _onBackButtonClick: function() {
         BreadCrumbsUtil.onItemClick(this, {}, this._options.items[0]);
      },

      _onResize: function() {
         this._children.menuOpener.close();
      }
   });
   return Path;
});
