define('Controls/Path', [
   'Core/Control',
   'tmpl!Controls/Path/Path',
   'tmpl!Controls/Button/BackButton/Back',
   'Core/helpers/Object/isEqual',
   'css!Controls/Path/Path'
], function(
   Control,
   template,
   backButtonTemplate,
   isEqual
) {
   'use strict';

   var _private = {
      getWidth: function(element) {
         //TODO: копипаста из BreadCrumbsController
         var
            measurer = document.createElement('div'),
            width;
         measurer.classList.add('controls-BreadCrumbsV__measurer');
         
         measurer.innerHTML = element;
         document.body.appendChild(measurer);
         width = measurer.clientWidth;
         document.body.removeChild(measurer);
         return width;
      },

      shouldRedraw: function(currentItems, newItems, oldWidth, availableWidth) {
         //TODO: копипаста из BreadCrumbsController
         return  !isEqual(currentItems, newItems) || oldWidth !== availableWidth;
      },

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
         var backButtonWidth;
         
         //TODO: вместо title доставать через idProperty
         self._backButtonCaption = items[0].title;
         if (items.length > 1) {
            self._breadCrumbsItems = items.slice(1);
            backButtonWidth = _private.getWidth(backButtonTemplate({
               _options: {
                  caption: items[0].title,
                  style: 'default',
                  size: 'm'
               }
            }));
            _private.calculateClasses(self, self._children.breadCrumbs.getMaxCrumbsWidth(self._breadCrumbsItems), backButtonWidth, self._container.clientWidth);
         }
      }
   };

   var Path = Control.extend({
      _template: template,
      _backButtonCaption: '',
      _breadCrumbsItems: [],
      _backButtonClass: '',
      _breadCrumbsClass: '',
      _oldWidth: 0,

      _afterMount: function() {
         this._oldWidth = this._container.clientWidth;
         if (this._options.items && this._options.items.length > 0) {
            _private.calculateItems(this, this._options.items);
            this._forceUpdate();
         }
      },

      _beforeUpdate: function(newOptions) {
         if (!isEqual(this._options.items, newOptions.items)) {
            _private.calculateItems(this, newOptions.items);
         }
      },

      _onItemClick: function(e, item) {
         this._notify('itemClick', [item]);
      },

      _onResize: function() {
         var backButtonWidth;
         backButtonWidth = _private.getWidth(backButtonTemplate({
            _options: {
               caption: this._options.items[0].title,
               style: 'default',
               size: 'm'
            }
         }));
         _private.calculateClasses(this, this._children.breadCrumbs.getMaxCrumbsWidth(this._breadCrumbsItems), backButtonWidth, this._container.clientWidth);
         this._oldWidth = this._container.clientWidth;
      }
   });
   return Path;
});
