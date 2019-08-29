import Control = require('Core/Control');
import ColumnScrollTpl = require('wml!Controls/_grid/ColumnScroll');
import 'css!theme?Controls/grid';
import { detection } from 'Env/Env';
import Entity = require('Types/entity');
import {isEqualWithSkip} from 'Controls/_grid/utils/GridIsEqualUtil';
import {SyntheticEvent} from 'Vdom/Vdom';

import tmplNotify = require('Controls/Utils/tmplNotify');

const
   _private = {
      calculateFixedColumnWidth(container, multiSelectVisibility, stickyColumnsCount) {
         if (!stickyColumnsCount) {
            return 0;
         }

         const
            hasMultiSelect = multiSelectVisibility !== 'hidden',
            columnOffset = hasMultiSelect ? 1 : 0,
            lastStickyColumnIndex = stickyColumnsCount + columnOffset,
            lastStickyColumnSelector = `.controls-Grid__cell_fixed:nth-child(${lastStickyColumnIndex})`,
            stickyCellContainer = container.querySelector(lastStickyColumnSelector);
         if (!stickyCellContainer) {
            return 0;
         }
         const stickyCellOffsetLeft = stickyCellContainer.getBoundingClientRect().left - container.getBoundingClientRect().left;
         return stickyCellOffsetLeft + stickyCellContainer.offsetWidth;
      },
      updateSizes(self) {
         _private.drawTransform(self, 0);
         let
            newContentSize = self._children.content.getElementsByClassName('controls-Grid_columnScroll')[0].scrollWidth,
            newContentContainerSize = null;
         if (self._isNotGridSupport) {
            newContentContainerSize = self._children.content.offsetWidth;
         } else {
            newContentContainerSize = self._children.content.getElementsByClassName('controls-Grid_columnScroll')[0].offsetWidth;
         }

         if (self._contentSize !== newContentSize || self._contentContainerSize !== newContentContainerSize) {
            self._contentSize = newContentSize;
            self._contentContainerSize = newContentContainerSize;

            // reset scroll position after resize, if we don't need scroll
            if (self._contentSize <= self._contentContainerSize) {
               self._scrollPosition = 0;
               _private.drawTransform(self, self._scrollPosition);
            }
            self._shadowState =
               _private.calculateShadowState(self._scrollPosition, self._contentContainerSize, self._contentSize);
            _private.updateFixedColumnWidth(self);
            self._scrollVisible = true;
            self._forceUpdate();
         }
         if (newContentContainerSize + self._scrollPosition > newContentSize) {
            self._scrollPosition -= (newContentContainerSize + self._scrollPosition) - newContentSize;
         }
         self._setOffsetForHScroll();
         _private.drawTransform(self, self._scrollPosition);
      },
      updateFixedColumnWidth(self) {
         self._fixedColumnsWidth = _private.calculateFixedColumnWidth(
            self._children.content.getElementsByClassName('controls-Grid_columnScroll')[0],
            self._options.multiSelectVisibility,
            self._options.stickyColumnsCount
         );
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
      },
      setOffsetForHScroll (self) {
          const prevOffset = self._offsetForHScroll;
          const container = self._children.content;
          self._offsetForHScroll = 0;
          self._leftOffsetForHScroll = 0;
          const HeaderGroup = container.getElementsByClassName('controls-Grid__header')[0] && container.getElementsByClassName('controls-Grid__header')[0].childNodes;
          if (HeaderGroup && !!HeaderGroup.length) {
              const firstCell = HeaderGroup[0];
              if (self._fixedColumnsWidth) {
                  self._leftOffsetForHScroll = self._fixedColumnsWidth;
              } else if (self._options.multiSelectVisibility !== 'hidden') {
                  self._leftOffsetForHScroll = firstCell.offsetWidth + HeaderGroup[1].offsetWidth;
              } else {
                  self._leftOffsetForHScroll = firstCell.offsetWidth;
              }
              self._offsetForHScroll += firstCell.offsetHeight + container.offsetTop;
          }
          if (self._options.listModel.getResultsPosition() === 'top') {
              const ResultsContainer = container.getElementsByClassName('controls-Grid__results')[0] && container.getElementsByClassName('controls-Grid__results')[0].childNodes;
              if (ResultsContainer && !!ResultsContainer.length) {
                  self._offsetForHScroll += ResultsContainer[0].offsetHeight;
              }
          }
          self._contentSizeForHScroll = self._contentSize - self._leftOffsetForHScroll;
          if (prevOffset !== self._offsetForHScroll) {
              self._scrollVisible = true;
          }
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
      _offsetForHScroll: 0,
      _leftOffsetForHScroll: 0,
      _isNotGridSupport: false,
      _contentSizeForHScroll: 0,
       _scrollVisible: true,

      _beforeMount(opt) {
         this._transformSelector = 'controls-ColumnScroll__transform-' + Entity.Guid.create();
         this._isNotGridSupport = opt.listModel.isNoGridSupport();
      },

      _afterMount() {
         _private.updateSizes(this);
         if (this._options.columnScrollStartPosition === 'end' && this._isColumnScrollVisible()) {
            this._positionChangedHandler(null, this._contentSize - this._contentContainerSize);
         }
      },

      _afterUpdate(oldOptions) {
         /*
         * TODO: Kingo
         * Смена колонок может не вызвать событие resize на обёртке грида(ColumnScroll), если общая ширина колонок до обновления и после одинакова.
         * */
         if (
             !isEqualWithSkip(this._options.columns, oldOptions.columns, { template: true, resultTemplate: true })
             || this._options.multiSelectVisibility !== oldOptions.multiSelectVisibility
         ) {
            _private.updateSizes(this);
         }
         if (this._options.stickyColumnsCount !== oldOptions.stickyColumnsCount) {
            _private.updateFixedColumnWidth(this);
            this._setOffsetForHScroll();
         }
          if (this._options.root !== oldOptions.root) {
              this._scrollVisible = false;
          }
      },
      updateShadowStyle() {
          if (this._children.startShadow) {
              this._children.startShadow.style = _private.calculateShadowStyles(this, 'start');
          }
      },
      _resizeHandler() {
         _private.updateSizes(this);
      },

      _isColumnScrollVisible: function() {
         const items = this._options.listModel.getItems();
         return this._scrollVisible && items && !!items.getCount() && (this._contentSize > this._contentContainerSize) ? true : false;
      },

      _calculateShadowClasses(position) {
         return _private.calculateShadowClasses(this._shadowState, position);
      },

      _calculateShadowStyles(position) {
         return _private.calculateShadowStyles(this, position);
      },

      _setOffsetForHScroll() {
         if (!detection.isIE) {
            if (!this._isNotGridSupport) {
               _private.setOffsetForHScroll(this);
            }
         }
      },

      _setScrollPosition: function(position) {
          const
              newScrollPosition = Math.round(position);
          if (this._scrollPosition !== newScrollPosition) {
              this._scrollPosition = newScrollPosition;
              this._shadowState =
                  _private.calculateShadowState(this._scrollPosition, this._contentContainerSize, this._contentSize);

              _private.drawTransform(this, this._scrollPosition);
          }
      },

       _positionChangedHandler(event, position) {
           this._setScrollPosition(position);
       },
       getContentContainerSize() {
           return this._contentContainerSize;
       },

       _wheelHandler(e: SyntheticEvent<WheelEvent>): void {
           const nativeEvent = e.nativeEvent;
           const maxPosition = this._contentSize - this._contentContainerSize;
           let newPosition: number;
           let delta: number;
           if (nativeEvent.shiftKey || nativeEvent.deltaX) {
               e.stopPropagation();
               e.preventDefault();

               // deltaX определена, когда качаем колесом мыши
               if (nativeEvent.deltaX) {
                   delta = this._calcWheelDelta(detection.firefox, nativeEvent.deltaX);
               } else {
                   delta = this._calcWheelDelta(detection.firefox, nativeEvent.deltaY);
               }
               newPosition = this._calcPositionByWheel(this._scrollPosition, maxPosition, delta);
               this._setScrollPosition(newPosition);
           }
       },

       _calcPositionByWheel(currentPosition: number, maxPosition: number, wheelDelta: number): number {
           let newPosition: number;
           newPosition = currentPosition + wheelDelta;
           if (newPosition < 0) {
               newPosition = 0;
           } else if (newPosition > maxPosition) {
               newPosition = maxPosition;
           }

           return newPosition;
       },

       _calcWheelDelta(firefox: boolean, delta: number): number {
           /**
            * Определяем смещение ползунка.
            * В firefox в дескрипторе события в свойстве deltaY лежит маленькое значение,
            * поэтому установим его сами.
            * TODO: Нормальное значение есть в дескрипторе события MozMousePixelScroll в
            * свойстве detail, но на него нельзя подписаться.
            * https://online.sbis.ru/opendoc.html?guid=3e532f22-65a9-421b-ab0c-001e69d382c8
            */
           if (firefox) {
               return Math.sign(delta) * 100;
           }

           return delta;
       }
   });
export = ColumnScroll;
