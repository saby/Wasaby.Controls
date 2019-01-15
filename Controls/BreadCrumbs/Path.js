define('Controls/BreadCrumbs/Path', [
   'Core/Control',
   'Controls/BreadCrumbs/Utils',
   'Controls/Utils/getWidth',
   'Controls/List/resources/utils/ItemsUtil',
   'Controls/Utils/FontLoadUtil',
   'Controls/Utils/tmplNotify',
   'Controls/Utils/applyHighlighter',
   'wml!Controls/BreadCrumbs/Path/Path',
   'wml!Controls/BreadCrumbs/Path/_Back',
   'Controls/BreadCrumbs/Path/_Back',
   'Types/entity',
   'Controls/Heading/Back',
   'css!theme?Controls/BreadCrumbs/Path/Path'
], function(
   Control,
   BreadCrumbsUtil,
   getWidthUtil,
   ItemsUtil,
   FontLoadUtil,
   tmplNotify,
   applyHighlighter,
   template,
   backButtonTemplate,
   PathBack,
   entity
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

      calculateItems: function(self, options, containerWidth) {
         var
            backButtonWidth,
            availableWidth,
            homeWidth;

         self._header = _private.getHeader(options);
         self._backButtonCaption = ItemsUtil.getPropertyValue(options.items[options.items.length - 1], options.displayProperty);
         if (options.items.length > 1) {
            self._breadCrumbsItems = options.items.slice(0, options.items.length - 1);
            if (!options.header) {
               backButtonWidth = getWidthUtil.getWidth(backButtonTemplate({
                  _options: {
                     backButtonCaption: self._backButtonCaption,
                     counterCaption: options.counterCaption
                  }
               }));
               homeWidth = getWidthUtil.getWidth('<div class="controls-BreadCrumbsPath__home icon-size icon-Home3"></div>');
               _private.calculateClasses(self, BreadCrumbsUtil.getMaxCrumbsWidth(self._breadCrumbsItems), backButtonWidth, containerWidth - homeWidth);

               availableWidth = self._breadCrumbsClass === 'controls-BreadCrumbsPath__breadCrumbs_half' ? containerWidth / 2 : containerWidth;
               BreadCrumbsUtil.calculateBreadCrumbsToDraw(self, self._breadCrumbsItems, availableWidth - homeWidth);
            } else {
               BreadCrumbsUtil.calculateBreadCrumbsToDraw(self, self._breadCrumbsItems, containerWidth);
            }
         } else {
            self._visibleItems = null;
            self._breadCrumbsItems = null;
            self._backButtonClass = '';
            self._breadCrumbsClass = '';
         }
      },

      getHeader: function(options) {
         var newHeader = options.header;
         if (options.items && options.header && !options.header[0].title && !options.header[0].template) {
            newHeader = options.header.slice();
            newHeader[0] = {
               template: PathBack,
               templateOptions: {
                  backButtonClass: 'controls-BreadCrumbsPath__backButton_inHeader',
                  backButtonStyle: options.backButtonStyle,
                  backButtonCaption: ItemsUtil.getPropertyValue(options.items[options.items.length - 1], options.displayProperty),
                  counterCaption: options.counterCaption
               },
               width: options.header[0].width
            };
         }
         return newHeader;
      },

      getRootModel: function(root, keyProperty) {
         var rawData = {};

         rawData[keyProperty] = root;
         return new entity.Model({
            idProperty: keyProperty,
            rawData: rawData
         });
      }
   };

   /**
    * Breadcrumbs with back button.
    *
    * @class Controls/BreadCrumbs/Path
    * @extends Core/Control
    * @mixes Controls/interface/IBreadCrumbs
    * @mixes Controls/BreadCrumbs/PathStyles
    * @mixes Controls/interface/IHighlighter
    * @control
    * @public
    * @author Зайцев А.С.
    *
    * @demo Controls-demo/BreadCrumbs/PathPG
    */

   /**
    * @event Controls/BreadCrumbs/Path#arrowActivated Happens after clicking the button "View Model".
    * @param {Core/vdom/Synchronizer/resources/SyntheticEvent} eventObject Descriptor of the event.
    */

   /**
    * @name Controls/BreadCrumbs/Path#backButtonStyle
    * @cfg {String} Back heading display style.
    * @default secondary
    * @see Controls/Heading/Back#style
    */

   var BreadCrumbsPath = Control.extend({
      _template: template,
      _backButtonCaption: '',
      _visibleItems: null,
      _breadCrumbsItems: null,
      _backButtonClass: '',
      _breadCrumbsClass: '',
      _oldWidth: 0,

      _beforeMount: function(options) {
         this._header = _private.getHeader(options);
      },

      _afterMount: function() {
         this._oldWidth = this._container.clientWidth;
         if (this._options.items && this._options.items.length > 0) {
            FontLoadUtil.waitForFontLoad('controls-BreadCrumbsView__crumbMeasurer').addCallback(function() {
               FontLoadUtil.waitForFontLoad('controls-BreadCrumbsPath__backButtonMeasurer').addCallback(function() {
                  _private.calculateItems(this, this._options, this._oldWidth);
                  this._forceUpdate();
               }.bind(this));
            }.bind(this));
         }
      },

      _beforeUpdate: function(newOptions) {
         var containerWidth = this._container.clientWidth;
         if (BreadCrumbsUtil.shouldRedraw(this._options.items, newOptions.items, this._oldWidth, containerWidth) || this._options.header !== newOptions.header) {
            this._oldWidth = containerWidth;
            _private.calculateItems(this, newOptions, containerWidth);
         }
      },

      _notifyHandler: tmplNotify,
      _applyHighlighter: applyHighlighter,
      _getRootModel: _private.getRootModel,

      _onBackButtonClick: function(e) {
         var item;

         if (this._options.items.length > 1) {
            item = this._options.items[this._options.items.length - 2];
         } else {
            item = this._getRootModel(this._options.root, this._options.keyProperty);
         }

         this._notify('itemClick', [item]);
         e.stopPropagation();
      },

      _onResize: function() {
         // Пустой обработчик чисто ради того, чтобы при ресайзе запускалась перерисовка
      },

      _onHomeClick: function() {
         this._notify('itemClick', [this._getRootModel(this._options.root, this._options.keyProperty)]);
      },

      _onArrowClick: function(e) {
         this._notify('arrowActivated');
         e.stopPropagation();
      }
   });

   BreadCrumbsPath.getDefaultOptions = function() {
      return {
         displayProperty: 'title',
         root: null,
         backButtonStyle: 'secondary'
      };
   };

   return BreadCrumbsPath;
});
