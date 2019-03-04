define('Controls/Slider',
   [
      'Core/Control',
      'wml!Controls/Slider/Slider',
      'css!theme?Controls/Slider/Slider',
      'Controls/DragNDrop/Controller'
   ],
   function(Control, template) {
      'use strict';

      /**
       * @public
       * @extends Core/Control
       * @class Controls/StickyHeader
       * @author Семашев Р.И.
       */
      var _private = {
         _calcValue: function(wrapper, pageX) {
            var
               box = wrapper.getBoundingClientRect(),
               rangeLength,
               percent;
            if (pageX < box.left) {
               return this._options.minValue;
            } else if (pageX > box.left + box.width) {
               return this._options.maxValue;
            } else {
               rangeLength = this._options.maxValue - this._options.minValue;
               percent = (pageX - this._shift - box.left - window.pageXOffset) / box.width;
               return this._options.minValue + percent * rangeLength;
            }
         },
         _checkBuildOptions: function(opts){
            if (!opts.minValue || !opts.maxValue) {
               throw new Error('You must set minValue and maxValue for slider.');
            }
            return true;
         },
         _prepareBuildOptions: function(opts) {
            if (opts.scaleStep) {
               this.scaleArr = [];
               this.scaleArr.push(1);
               this.scaleArr.push(2);
            }
         }
      };

      var Slider = Control.extend({
         _template: template,
         _single: true,
         _beforeMount: function(options) {
            _private._checkBuildOptions(options);
            _private._prepareBuildOptions.call(this, options);
            this._endValue = options.endValue || options.maxValue;
            this._startValue = options.startValue || options.minValue;
         },

         _onMouseDownHandler: function(event) {
            var nativeEvent = event.nativeEvent;
            this._startElemPosition = event.nativeEvent.clientX;
            this._shift = nativeEvent.pageX - nativeEvent.target.getBoundingClientRect().left - nativeEvent.target.getBoundingClientRect().width / 2 - pageXOffset;
            this._children.dragNDrop.startDragNDrop(event.target, event);
         },

         _onDragMoveHandler: function(e, dragObject) {
            var
               value = _private._calcValue.call(this, dragObject.entity.parentElement, dragObject.position.x);

            if (dragObject.entity.classList.contains('controls-Slider__point__start')) {
               this._startValue = value > this._endValue ? this._endValue : value;
            } else {
               this._endValue = value < this._startValue ? this._startValue : value;
            }

            var
               rangeLength = this._options.maxValue - this._options.minValue,
               left = (this._startValue - this._options.minValue) / rangeLength * 100,
               right = (this._endValue - this._options.minValue) / rangeLength * 100,
               width = right - left;

            this._container.getElementsByClassName('controls-Slider__point__end')[0].style.left = right + '%';
            this._container.getElementsByClassName('controls-Slider__point__start')[0].style.left = left + '%';
            this._container.getElementsByClassName('controls-Slider__line__full')[0].style.left = left + '%';
            this._container.getElementsByClassName('controls-Slider__line__full')[0].style.width = width + '%';
         },

         _onDragEndHandler: function() {
            this._startElemPosition = undefined;
         }
      });

      Slider.getDefaultOptions = function() {
         return {
            bigPoint: false
         };
      };

      return Slider;
   }
);
