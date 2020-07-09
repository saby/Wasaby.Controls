export interface ISliderOptions {
    borderVisible?: boolean;
    tooltipVisible?: boolean;
    scaleStep?: number;
    precision: number;
    tooltipFormatter?: Function;
    size?: string;
    minValue: number;
    maxValue: number;
    scaleLabelFormatter?: Function;
}
/**
 * Интерфейс для контрола Слайдер.
 *
 * @interface Controls/_slider/interface/ISlider
 * @public
 * @author Бондарь А.В.
 */

/*
 * Interface for the "Slider" control.
 *
 * @interface Controls/_slider/interface/ISlider
 * @public
 * @author Бондарь А.В.
 */

export interface ISlider {
    readonly '[Controls/_slider/interface/ISlider]': boolean;
}

/**
 * @name Controls/_slider/interface/ISlider#borderVisible
 * @cfg {Boolean} Устанавливает границу вокруг контрола.
 * @demo Controls-demo/Slider/Base/BorderVisible/Index
 * @demo Controls-demo/Slider/Range/BorderVisible/Index
 * @example
 * Слайдер с границей:
 * <pre class="brush:html">
 *   <Controls.slider:Base borderVisible="{{true}}"/>
 * </pre>
 */

/**
 * @name Controls/_slider/interface/ISlider#tooltipVisible
 * @cfg {Boolean} Устанавливает подсказку при наведении на шкалу.
 * @default true
 * @demo Controls-demo/Slider/Base/TooltipVisible/Index
 * @demo Controls-demo/Slider/Range/TooltipVisible/Index
 * @example
 * Слайдер с тултипом:
 * <pre class="brush:html">
 *   <Controls.slider:Base tooltipVisible="{{true}}"/>
 * </pre>
 */

/*
 * @name Controls/_slider/interface/ISlider#borderVisible
 * @cfg {Boolean} sets the stroke around control
 * @demo Controls-demo/Slider/Base/BorderVisible/Index
 * @demo Controls-demo/Slider/Range/BorderVisible/Index
 * @example
 * Slider with border
 * <pre class="brush:html">
 *   <Controls.slider:Base borderVisible="{{true}}"/>
 * </pre>
 */

/**
 * @name Controls/_slider/interface/ISlider#scaleStep
 * @cfg {Number} Параметр scaleStep определяет шаг шкалы, расположенной под слайдером.
 * @remark Шкала отображается, когда опция {@link borderVisible} установлена в значения false, а параметр scaleStep положительный.
 * @demo Controls-demo/Slider/Base/ScaleStep/Index
 * @demo Controls-demo/Slider/Range/ScaleStep/Index
 * @example
 * Слайдер со шкалой с шагом 20:
 * <pre class="brush:html">
 *   <Controls.slider:Base scaleStep="{{20}}"/>
 * </pre>
 */

/*
 * @name Controls/_slider/interface/ISlider#scaleStep
 * @cfg {Number} The scaleStep option determines the step in the scale grid under the slider
 * @remark Scale displayed only if borderVisible is false and scaleStep is positive.
 * @demo Controls-demo/Slider/Base/ScaleStep/Index
 * @demo Controls-demo/Slider/Range/ScaleStep/Index
 * @example
 * Slider with scale step of 20
 * <pre class="brush:html">
 *   <Controls.slider:Base scaleStep="{{20}}"/>
 * </pre>
 */

/**
 * @name Controls/_slider/interface/ISlider#precision
 * @cfg {Number} Количество символов в десятичной части.
 * @remark Должно быть неотрицательным.
 * @demo Controls-demo/Slider/Base/Precision/Index
 * @demo Controls-demo/Slider/Range/Precision/Index
 * @example
 * Слайдер с целыми значениями:
 * <pre class="brush:html">
 *   <Controls.slider:Base precision="{{0}}"/>
 * </pre>
 */

/*
 * @name Controls/_slider/interface/ISlider#precision
 * @cfg {Number} Number of characters in decimal part.
 * @remark Must be non-negative
 * @demo Controls-demo/Slider/Base/Precision/Index
 * @demo Controls-demo/Slider/Range/Precision/Index
 * @example
 * Slider with integer values;
 * <pre class="brush:html">
 *   <Controls.slider:Base precision="{{0}}"/>
 * </pre>
 */

/**
 * @name Controls/_slider/interface/ISlider#tooltipFormatter
 * @cfg {Function} Функция форматирования подсказки.
 * @demo Controls-demo/Slider/Base/TooltipFormatter/Index
 * @demo Controls-demo/Slider/Range/TooltipFormatter/Index
 * @remark
 * Аргументы функции:
 * <ul>
 *    <li>value - текущее положение слайдера</li>
 * </ul>
 */

/*
 * @name Controls/_slider/interface/ISlider#tooltipFormatter
 * @cfg {Function} Tooltip formatter function.
 * @demo Controls-demo/Slider/Base/TooltipFormatter/Index
 * @demo Controls-demo/Slider/Range/TooltipFormatter/Index
 * @remark
 * Function Arguments:
 * <ul>
 *    <li>value - slider current position</li>
 * </ul>
 */

/**
 * @name Controls/_slider/interface/ISlider#size
 * @cfg {String} Устанавливает размер ползунка слайдера.
 * @variant s
 * @variant m
 * @default m
 * @demo Controls-demo/Slider/Base/Size/Index
 * @demo Controls-demo/Slider/Range/Size/Index
 * @example
 * Слайдер с диаметром ползунка = 12px
 * <pre class="brush:html">
 *   <Controls.slider:Base size="s"/>
 * </pre>
 */

/*
 * @name Controls/_slider/interface/ISlider#size
 * @cfg {String} sets the size of slider point
 * @demo Controls-demo/Slider/Base/Size/Index
 * @demo Controls-demo/Slider/Range/Size/Index
 * @example
 * Slider with diameter of point = 12px
 * <pre class="brush:html">
 *   <Controls.slider:Base size="s"/>
 * </pre>
 */

/**
 * @name Controls/_slider/interface/ISlider#minValue
 * @cfg {Number} Устанавливает минимальное значение слайдера.
 * @remark Должно быть меньше, чем {@link maxValue}.
 * @demo Controls-demo/Slider/Base/Base/Index
 * @example
 * Слайдер с границей:
 * <pre class="brush:html">
 *   <Controls.slider:Base minValue="{{10}}"/>
 * </pre>
 * @see maxValue
 */

/*
 * @name Controls/_slider/interface/ISlider#minValue
 * @cfg {Number} sets the minimum value of slider
 * @remark must be less than maxValue
 * @demo Controls-demo/Slider/Base/Base/Index
 * @example
 * Slider with border
 * <pre class="brush:html">
 *   <Controls.slider:Base minValue="{{10}}"/>
 * </pre>
 * @see maxValue
 */

/**
 * @name Controls/_slider/interface/ISlider#maxValue
 * @cfg {Number} Устанавливает максимальное значение слайдера.
 * @remark Должно быть больше, чем {@link minValue}.
 * @demo Controls-demo/Slider/Base/Base/Index
 * @example
 * Слайдер с границей:
 * <pre class="brush:html">
 *   <Controls.slider:Base maxValue="{{100}}"/>
 * </pre>
 * @see minValue
 */

/*
 * @name Controls/_slider/interface/ISlider#maxValue
 * @cfg {Number} sets the maximum value of slider
 * @remark must be greater than minValue
 * @demo Controls-demo/Slider/Base/Base/Index
 * @example
 * Slider with border
 * <pre class="brush:html">
 *   <Controls.slider:Base maxValue="{{100}}"/>
 * </pre>
 * @see minValue
 */

/**
 * @name Controls/_slider/interface/ISlider#scaleLabelFormatter
 * @cfg {Function} Функция форматирования метки шкалы.
 * @demo Controls-demo/Slider/Base/ScaleLabelFormatter/Index
 * @remark
 * Аргументы функции:
 * <ul>
 *    <li>value - текущее положение слайдера</li>
 * </ul>
 */

/*
 * @name Controls/_slider/interface/ISlider#scaleLabelFormatter
 * @cfg {Function} Scale label formatter function.
 * @demo Controls-demo/Slider/Base/ScaleLabelFormatter/Index
 * @remark
 * Function Arguments:
 * <ul>
 *    <li>value - slider current position</li>
 * </ul>
 */
