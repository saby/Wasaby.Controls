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
       * Slider.
       *
       * <a href="/materials/demo-ws4-header-separator">Demo-example</a>.
       * @public
       * @extends Core/Control
       * @class Controls/Slider
       * @author Колесов В.А.
       */
      var _private = {
         _calcValue: function(wrapper, pos) {
            var
               box = wrapper.getBoundingClientRect(),
               rangeLength,
               percent; 
            if (pos < box.left) {
               return this._options.minValue;
            } else if (pos > box.left + box.width) {
               return this._options.maxValue;
            } else {
               rangeLength = this._options.maxValue - this._options.minValue;
               percent = (pos - box.left - window.pageXOffset) / box.width;
               var val = percent * rangeLength;
               if (this._options.scaleAlign && this.scaleArr.length>1){
                  var scaleSize = this.scaleArr[1]-this.scaleArr[0];
                  val =  Math.round(val / scaleSize) * scaleSize;
               }
               return this._options.minValue + val;
            }
         },
         _checkBuildOptions: function(opts) {
            if (opts.minValue == undefined || opts.maxValue == undefined) {
               throw new Error('You must set minValue and maxValue for slider.');
            }
            if (opts.scaleStep < 0) {
               throw new Error('scaleStep must positive.');
            }
            return true;
         },
         _prepareBuildOptions: function(opts) {
            this.scaleArr = [];
            if (opts.scaleStep) {
               for (var i = 0; i <= opts.scaleStep; i++){
                  this.scaleArr.push(opts.minValue + (opts.maxValue - opts.minValue) / opts.scaleStep * i);
               }
            }
         },
         _getPoint(eTarget, pos){
             
            this._value = _private._calcValue.call(this, eTarget.parentElement, pos);
            
            
            this._value = Math.round(this._value*(10**this._options.decimals))/(10**this._options.decimals)
            
            if (eTarget.classList.contains('controls-Slider__point__start')) {
               return eTarget;
            } 
            else if (eTarget.classList.contains('controls-Slider__point__end')){
               return eTarget;
            }
            else{
               var container = eTarget.parentElement;
               if (container.classList.contains('controls-Slider__line__wrapper')){
                  container = container.parentElement;
               }
               if (this._options.single){
                  return container.getElementsByClassName('controls-Slider__point__end')[0];
               }
               else{
                  var endValue = this._endValue,
                     startValue = this._startValue;

                  if (this._value > endValue) return container.getElementsByClassName('controls-Slider__point__end')[0];
                  if (this._value < startValue) return container.getElementsByClassName('controls-Slider__point__start')[0];
                  if (this._value > (endValue + startValue) / 2) return container.getElementsByClassName('controls-Slider__point__end')[0];
                  else return container.getElementsByClassName('controls-Slider__point__start')[0];
               }
            }
         },
         _setValues: function(target) {
             if (target.classList.contains('controls-Slider__point__start')) {
               this._startValue = this._value > this._endValue ? this._endValue : this._value;
            } 
            else if (target.classList.contains('controls-Slider__point__end')){
               this._endValue = this._value < this._startValue ? this._startValue : this._value;
            }
         },
         _render: function() {
            var
               rangeLength = this._options.maxValue - this._options.minValue,
               left = (this._startValue - this._options.minValue) / rangeLength * 100,
               right = (this._endValue - this._options.minValue) / rangeLength * 100,
               width = right - left;   
            this._container.getElementsByClassName('controls-Slider__point__end')[0].style.left = right + '%';
            this._container.getElementsByClassName('controls-Slider__point__start')[0].style.left = left + '%';
            this._container.getElementsByClassName('controls-Slider__line__full')[0].style.left = left + '%';
            this._container.getElementsByClassName('controls-Slider__line__full')[0].style.width = width + '%';
            
         }
      };

      var Slider = Control.extend({
         _template: template,
         _beforeMount: function(options) {
            _private._checkBuildOptions(options);
            _private._prepareBuildOptions.call(this, options);
            this._endValue = options.endValue || options.maxValue;
            this._startValue = options.startValue || options.minValue;
         },

         _beforeUpdate: function(options) {
            _private._checkBuildOptions(options);
            _private._prepareBuildOptions.call(this, options);
         },
         /**
          * Handler for the mousedown event. 
          */
         _onMouseDownHandler: function(event) {
            if (!this._options.readOnly){
               var nativeEvent = event.nativeEvent;
               this._startElemPosition = event.nativeEvent.clientX;
               var target;
               target = _private._getPoint.call(this, event.target, nativeEvent.pageX); 
               _private._setValues.call(this, target);
               _private._render.call(this);
               this._children.dragNDrop.startDragNDrop(target, event);
            }
         },
         /**
          * Handler for the dragmove event. 
          */
         _onDragMoveHandler: function(e, dragObject) { 
            if (!this._options.readOnly){
               this._value = _private._calcValue.call(this, dragObject.entity.parentElement, dragObject.position.x);  

               this._value = Math.round(this._value*(10**this._options.decimals))/(10**this._options.decimals)
               _private._setValues.call(this, dragObject.entity);
               _private._render.call(this);
            }
         },
         /**
          * Handler for the dragend event. 
          */
         _onDragEndHandler: function() {
            if (!this._options.readOnly){
               this._startElemPosition = undefined;
               this._value = undefined;
            }
         },
         changeStartValue: function(e, val) {
            val = Math.round(val*(10**this._options.decimals))/(10**this._options.decimals)
            val = Math.min(val, this._options.maxValue);
            val = Math.max(val, this._options.minValue);
            if (this._options.scaleAlign && this.scaleArr.length>1){
                  var scaleSize = this.scaleArr[1]-this.scaleArr[0];
                  val = this._options.minValue +Math.round((val - this._options.minValue) / scaleSize) * scaleSize;
               }
            this._startValue = Math.max(val, this._options.minValue);
            this._endValue = Math.max(this._startValue, this._endValue);
            _private._render.call(this);

         },
         keyDownHeandler: function(e){
            if (e.nativeEvent.key === 'Enter'){
               this._children.input_end.activate();

            }

         },
         changeEndValue: function(e, val) {
            val = Math.round(val*(10**this._options.decimals))/(10**this._options.decimals)
            val = Math.min(val, this._options.maxValue);
            val = Math.max(val, this._options.minValue);            
            if (this._options.scaleAlign && this.scaleArr.length>1){
                  var scaleSize = this.scaleArr[1]-this.scaleArr[0];
                  val = this._options.minValue +Math.round((val - this._options.minValue) / scaleSize) * scaleSize;
               }
            this._endValue = Math.min(val, this._options.maxValue);
            this._startValue = Math.min(this._endValue, this._startValue);
            _private._render.call(this);
         }

      });

      Slider.getDefaultOptions = function() {
         return {
            /**
             * @cfg {Boolean} Determines whether slider has one point or two
             */
            single: false,
            /**
             * @cfg {Boolean} Determines whether slider's points are of big
             */
            bigPoint: false,
            /**
             * @cfg {Boolean} Determines whether slider has input fields
             */
            input: false,
            /**
             * @cfg {Boolean} Determines whether slider has border. Cannot be used with visible scale
             */
            bordered: false,
            /**
             * @cfg {Boolean} Determines whether user can change control's value
             */
            readOnly: false,
            /**
             * @cfg {Boolean} Determines whether value should align to scale marks
             */
            scaleAlign: false,
            /**
             * @cfg {Boolean} Determines whether scale is visible. Cannot be used with the border
             */
            showScale: false,
            /**
             * @cfg {Number} Minimum possible value
             */            
            minValue: 0,
            /**
             * @cfg {Number} Maximum possible value
             */            
            maxValue: 10,
            /**
             * @cfg {Number} Number of scale steps
             */            
            scaleStep: 5,
            /**
             * @cfg {Number} Number of characters in decimal part.
             */            
            decimals: 1,
            /**
             * @cfg {String} Left label
             */            
            startLabel: '',
            /**
             * @cfg {String} Label between input fields
             */            
            centerLabel: '',
            /**
             * @cfg {String} Right label
             */            
            endLabel: '',
         };
      };

      return Slider;
   }
);
