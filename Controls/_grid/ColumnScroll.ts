import Control = require('Core/Control');
import ColumnScrollTpl = require('wml!Controls/_grid/ColumnScroll');
import 'css!theme?Controls/grid';
import Env = require('Env/Env');
import Entity = require('Types/entity');

import tmplNotify = require('Controls/Utils/tmplNotify');

const
   _private = {
      calculateFixedColumnWidth(container, multiSelectVisibility ) {
         const
            fixedCellContainer = container.querySelector(multiSelectVisibility === 'hidden' ?
               '.controls-Grid__cell_fixed' : '.controls-Grid__cell_fixed:nth-child(2)');
         return fixedCellContainer.offsetLeft + fixedCellContainer.offsetWidth;
      },
      updateSizes(self) {
         _private.drawTransform(self, 0);
         const
            newContentSize = self._children.content.scrollWidth,
            newContentContainerSize = self._children.content.offsetWidth;
         if (self._contentSize !== newContentSize || self._contentContainerSize !== newContentContainerSize) {
            self._contentSize = self._children.content.scrollWidth;
            self._contentContainerSize = self._children.content.offsetWidth;

            // reset scroll position after resize, if we don't need scroll
            if (self._contentSize <= self._contentContainerSize) {
               self._scrollPosition = 0;
               _private.drawTransform(self, self._scrollPosition);
            }
            self._shadowState =
               _private.calculateShadowState(self._scrollPosition, self._contentContainerSize, self._contentSize);
            self._fixedColumnsWidth =
               _private.calculateFixedColumnWidth(self._children.content, self._options.multiSelectVisibility);
            self._forceUpdate();
         }
         if (newContentContainerSize + self._scrollPosition > newContentSize) {
            self._scrollPosition -= (newContentContainerSize + self._scrollPosition) - newContentSize;
         }
         _private.drawTransform(self, self._scrollPosition);
      },
      calculateShadowState(scrollPosition, containerSize, contentSize) {
         let
            shadowState = '';

         if (scrollPosition > 0) {
            shadowState += 'start';
         }
         if (contentSize - containerSize - scrollPosition >= 1) {
            shadowState += 'end';
         }
         return shadowState;
      },
      isShadowVisible(shadowState, position) {
         return shadowState.indexOf(position) !== - 1;
      },
      calculateShadowClasses(shadowState, position) {
         let
            shadowClasses = 'controls-ColumnScroll__shadow';
         shadowClasses += ' controls-ColumnScroll__shadow-' + position;
         if (!_private.isShadowVisible(shadowState, position)) {
            shadowClasses += ' controls-ColumnScroll__shadow_invisible';
         }
         return shadowClasses;
      },
      calculateShadowStyles(self, position) {
         let
            shadowStyles = '';
         if (position === 'start' && _private.isShadowVisible(self._shadowState, position)) {
            shadowStyles = 'left: ' + self._fixedColumnsWidth + 'px;';
         }
         let emptyTemplate = self._container.getElementsByClassName('controls-BaseControl__emptyTemplate')[0];
         if (emptyTemplate) {
            shadowStyles += 'height: ' + emptyTemplate.offsetTop + 'px;';
         }
         return shadowStyles;
      },
      drawTransform (self, position) {
         // This is the fastest synchronization method scroll position and cell transform.
         // Scroll position synchronization via VDOM is much slower.
         self._children.contentStyle.innerHTML =
            '.' + self._transformSelector +
            ' .controls-Grid__cell_transform { transform: translateX(-' + position + 'px); }';
      }
   },
   ColumnScroll = Control.extend({
      _template: ColumnScrollTpl,

      _notifyHandler: tmplNotify,
      _scrollPosition: 0,
      _contentSize: 0,
      _contentContainerSize: 0,
      _shadowState: '',
      _fixedColumnsWidth: 0,
      _transformSelector: '',

      _beforeMount() {
         this._transformSelector = 'controls-ColumnScroll__transform-' + Entity.Guid.create();
      },

      _afterMount() {
         _private.updateSizes(this);
      },

      _resizeHandler() {
         _private.updateSizes(this);
      },

      _isColumnScrollVisible() {
         return this._contentSize > this._contentContainerSize;
      },

      _calculateShadowClasses(position) {
         return _private.calculateShadowClasses(this._shadowState, position);
      },

      _calculateShadowStyles(position) {
         return _private.calculateShadowStyles(this, position);
      },

      _positionChangedHandler(event, position) {
         const
            newScrollPosition = Math.round(position);
         if (this._scrollPosition !== newScrollPosition) {
            this._scrollPosition = newScrollPosition;
            this._shadowState =
               _private.calculateShadowState(this._scrollPosition, this._contentContainerSize, this._contentSize);

            _private.drawTransform(this, this._scrollPosition);
         }
      },
      getContentContainerSize() {
         return this._contentContainerSize;
      }
   });
export = ColumnScroll;
