define('Controls/BreadCrumbs/Path', [
   'Core/Control',
   'Controls/BreadCrumbs/Utils',
   'Controls/Utils/getWidth',
   'Controls/List/resources/utils/ItemsUtil',
   'Controls/Utils/FontLoadUtil',
   'tmpl!Controls/BreadCrumbs/Path/Path',
   'tmpl!Controls/Header/BackButton/Back',
   'Controls/Header/BackButton',
   'css!theme?Controls/BreadCrumbs/Path/Path'
], function(
   Control,
   BreadCrumbsUtil,
   getWidthUtil,
   ItemsUtil,
   FontLoadUtil,
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
            self._backButtonClass = 'controls-BreadCrumbsPath__backButton_long';
            self._breadCrumbsClass = 'controls-BreadCrumbsPath__breadCrumbs_short';
         } else if (maxCrumbsWidth > availableWidth / 2 && backButtonWidth > availableWidth / 2) {
            self._backButtonClass = 'controls-BreadCrumbsPath__backButton_half';
            self._breadCrumbsClass = 'controls-BreadCrumbsPath__breadCrumbs_half';
         } else if (maxCrumbsWidth > availableWidth / 2 && backButtonWidth < availableWidth / 2) {
            self._backButtonClass = 'controls-BreadCrumbsPath__backButton_short';
            self._breadCrumbsClass = 'controls-BreadCrumbsPath__breadCrumbs_long';
         }
      },
      
      calculateItems: function(self, items) {
         var
            backButtonWidth,
            availableWidth;

         self._backButtonCaption = ItemsUtil.getPropertyValue(items[0], self._options.displayProperty || 'title');
         if (items.length > 1) {
            self._breadCrumbsItems = items.slice(1);
            backButtonWidth = getWidthUtil.getWidth(backButtonTemplate({
               _options: {
                  caption: self._backButtonCaption,
                  style: 'default',
                  size: 'm'
               }
            }));
            _private.calculateClasses(self, BreadCrumbsUtil.getMaxCrumbsWidth(self._breadCrumbsItems), backButtonWidth, self._container.clientWidth);

            availableWidth = self._breadCrumbsClass === 'controls-BreadCrumbsPath__breadCrumbs_half' ? self._container.clientWidth / 2 : self._container.clientWidth;
            BreadCrumbsUtil.calculateBreadCrumbsToDraw(self,  self._breadCrumbsItems, availableWidth);
         } else {
            self._visibleItems = [];
            self._breadCrumbsItems = [];
            self._backButtonClass = '';
            self._breadCrumbsClass = '';
         }
      }
   };

   /**
    * Breadcrumbs with back button.
    *
    * @class Controls/BreadCrumbs/Path
    * @extends Core/Control
    * @mixes Controls/interface/IBreadCrumbs
    * @control
    * @public
    *
    * @demo Controls-demo/BreadCrumbs/BreadCrumbs
    */

   /**
    * @event Controls/BreadCrumbs/Path#arrowActivated Happens after clicking the button "View record".
    * @param {Core/vdom/Synchronizer/resources/SyntheticEvent} eventObject Descriptor of the event.
    */

   var BreadCrumbsPath = Control.extend({
      _template: template,
      _backButtonCaption: '',
      _visibleItems: [],
      _breadCrumbsItems: [],
      _backButtonClass: '',
      _breadCrumbsClass: '',
      _oldWidth: 0,

      _afterMount: function() {
         this._oldWidth = this._container.clientWidth;
         if (this._options.items && this._options.items.length > 0) {
            FontLoadUtil.waitForFontLoad('controls-BreadCrumbsView__crumbMeasurer').addCallback(function() {
               FontLoadUtil.waitForFontLoad('controls-BreadCrumbsPath__backButtonMeasurer').addCallback(function() {
                  _private.calculateItems(this, this._options.items);
                  this._forceUpdate();
               }.bind(this));
            }.bind(this));
         }
      },

      _beforeUpdate: function(newOptions) {
         if (BreadCrumbsUtil.shouldRedraw(this._options.items, newOptions.items, this._oldWidth, this._container.clientWidth)) {
            this._oldWidth = this._container.clientWidth;
            _private.calculateItems(this, newOptions.items);
         }
      },

      _onItemClick: function(e, item, homeClick) {
         this._notify('itemClick', [item, homeClick]);
      },

      _onBackButtonClick: function() {
         this._notify('itemClick', [this._options.items[0], true]);
      },

      _onResize: function() {
         //Пустой обработчик чисто ради того, чтобы при ресайзе запускалась перерисовка
      },

      _onArrowClick: function() {
         this._notify('arrowActivated');
      }
   });
   return BreadCrumbsPath;
});
