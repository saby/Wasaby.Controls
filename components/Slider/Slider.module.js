/**
 * Created by ps.borisov on 08.09.2016.
 */

define('js!SBIS3.CONTROLS.Slider',
   [
      'js!SBIS3.CORE.CompoundControl',
      'html!SBIS3.CONTROLS.Slider',
      'js!SBIS3.CONTROLS.DragNDropMixinNew',
      'js!SBIS3.CONTROLS.RangeMixin',
      'Core/IoC'
   ], function(CompoundControl, dotTplFn, DragNDropMixinNew, RangeMixin, IoC) {
      'use strict';
      //TODO: documentation
      ///controls-Slider__withBorder
      var
         constants = {
            pointWidth: {
               big: 20,
               small: 12
            }
         },

         Slider = CompoundControl.extend([DragNDropMixinNew, RangeMixin],/** @lends SBIS3.CONTROLS.Slider.prototype */{
            _dotTplFn : dotTplFn,
            $protected: {
               _options: {
                  minValue: undefined,
                  maxValue: undefined,
                  startValue: undefined,
                  endValue: undefined,
                  decimals: 0,//TODO:setter/getter
                  single: false,//TODO:setter/getter
                  startLabel: undefined,//TODO:setter/getter
                  endLabel: undefined,//TODO:setter/getter
                  bigPoint: false//TODO:setter/getter
               },
               _endValue: 0,
               _startValue: 0,
               _shift : 0,
               _fullLine: undefined,
               _dragInProcess: false,
               _wrapper: undefined
            },

            _modifyOptions: function(options) {
               options = Slider.superclass._modifyOptions.apply(this, arguments);
               if (options.single) {
                  options.startValue  = options.minValue;
               }
               if (options.minValue === undefined) {
                  options.minValue = options.startValue;
               }
               if (options.maxValue === undefined) {
                  options.maxValue = options.endValue;
               }
               return options;
            },

            $constructor: function() {
               this._publish('onDrawValueChange');
               this._fullLine = this._container.find('.controls-Slider__line__full');
               this._wrapper = this._container.find('.controls-Slider__wrapper');
               this._endValue = this._prepareValue(this._options.endValue ? this._options.endValue : this._options.maxValue, 'right');
               this._startValue = this._prepareValue(this._options.startValue, 'left');
               this._pointsContainers = {
                  left: this._container.find('.controls-Slider__point__left'),
                  right: this._container.find('.controls-Slider__point__right')
               };
               this._pointsContainers.left.on('mousedown', this._initDrag.bind(this));
               this._pointsContainers.right.on('mousedown', this._initDrag.bind(this));
               //если заданы начальные и конечные значения то необходимо их отрисовать и нотифицировать об этом
               //если значения не заданы то точки встанут в начало и конец а start/endValue будут пустыми
               if (this._options.startValue || this._options.endValue) {
                  this._redraw();
               }
            },

            setStartValue: function(value) {
               this._drawStartValue(value);
               Slider.superclass.setStartValue.apply(this, [value]);
            },

            setEndValue: function(value) {
               this._drawEndValue(value);
               Slider.superclass.setEndValue.apply(this, [value]);
            },

            setMinValue: function(minValue){
               if (minValue >= this._options.maxValue) {
                  IoC.resolve('ILogger').error('CONTROLS.Slider', 'Попытка установить некорректное минимальное значение');
               } else {
                  this._options.minValue = minValue;
                  this._drawStartValue(this._startValue);
                  this._drawEndValue(this._endValue);
               }
            },

            getMinValue: function(){
               return this._options.minValue;
            },

            setMaxValue: function(maxValue) {
               if (maxValue <= this._options.minValue) {
                  IoC.resolve('ILogger').error('CONTROLS.Slider', 'Попытка установить некорректное максимальное значение');
               } else {
                  this._options.maxValue = maxValue;
                  this._drawStartValue(this._startValue);
                  this._drawEndValue(this._endValue);
               }
            },

            getMaxValue: function(){
               return this._options.maxValue;
            },

            _prepareValue: function(value, side) {
               value = value || value === 0 ? value : side === 'left'? this._options.minValue : this._options.maxValue;
               if (value > this._options.maxValue) {
                  value = this._options.maxValue;
               }
               if (value < this._options.minValue ) {
                  value = this._options.minValue;
               }
               if (side === 'left' && value > this._endValue) {
                  value = this._endValue;
               }
               if (side === 'right' && value < this._startValue) {
                  value = this._startValue;
               }
               value = +value;
               return +value.toFixed(this._options.decimals);
            },

            _redraw: function() {
               var
                  rangeLength = this._options.maxValue - this._options.minValue,
                  left = (this._startValue - this._options.minValue) / rangeLength * 100,
                  right = (this._endValue - this._options.minValue) / rangeLength * 100,
                  width = right - left;
               this._pointsContainers.right.css('left', right  + '%');
               this._pointsContainers.left.css('left', left + '%');
               this._fullLine.css('left',  left + '%');
               this._fullLine.css('width', width + '%');
            },

            _drawStartValue: function(value){
               value = this._prepareValue(value, 'left');
               this._startValue = value;
               this._redraw();
            },

            _drawEndValue: function(value){
               value = this._prepareValue(value, 'right');
               this._endValue = value;
               this._redraw();
            },

            //DragNDropMixin методы
            _initDrag: function(event) {
               event.preventDefault();
               Slider.superclass._initDrag.apply(this, arguments);
            },

            _findDragDropContainer: function(){
               return  $(document);
            },

            _beginDragHandler: function(DragObject, event) {
               this._dragInProcess = true;
               this._container.find('.controls-Slider__point').removeClass('lastActivePoint');
               $(event.target).addClass('lastActivePoint');
               DragObject.setOwner(this);
               DragObject.setTarget(event.target);
               this._shift =  event.pageX - event.target.getBoundingClientRect().left - pageXOffset;
            },

            _onDragHandler: function(DragObject, event) {
               var
                  width = this._container.width(),
                  instance = DragObject.getOwner(),
                  rangeLength = instance._options.maxValue - instance._options.minValue,
                  side = $(DragObject.getTarget()).hasClass('controls-Slider__point__left') ? 'left' : 'right',
                  percent = (event.pageX - instance._shift - instance._wrapper[0].getBoundingClientRect().left - pageXOffset) / (width - constants.pointWidth[instance._options.bigPoint ? 'big' : 'small']), //дробная часть от того что надо выделить
                  value = instance._options.minValue + percent * rangeLength;
               if (instance._dragInProcess && instance.isEnabled()) {
                  instance[side === 'left' ? '_drawStartValue' : '_drawEndValue'](value);
                  this._notify('onDrawValueChange', this._startValue, this._endValue)
               }
            },

            _endDragHandler: function(DragObject, event) {
               var
                  instance = DragObject.getOwner();
               if (instance.isEnabled()) {
                  if ($(DragObject.getTarget()).hasClass('controls-Slider__point__left')) {
                     instance.setStartValue(instance._startValue);
                  } else {
                     instance.setEndValue(instance._endValue);
                  }
               }
               instance._dragInProcess = false;
            }
         });
      return Slider;
   });
