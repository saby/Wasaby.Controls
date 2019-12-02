/**
 * Интерфейс для контрола Слайдер.
 *
 * @interface Controls/_slider/ISlider
 * @public
 * @author Бондарь А.В.
 */

/*
 * Interface for the "Slider" control.
 *
 * @interface Controls/_slider/ISlider
 * @public
 * @author Бондарь А.В.
 */

/**
 * @name Controls/_slider/ISlider#borderVisible
 * @cfg {Boolean} Устанавливает границу вокруг контрола.
 * @example
 * Слайдер с границей:
 * <pre class="brush:html">
 *   <Controls.slider:Base borderVisible="{{true}}"/>
 * </pre>
 */

/*
 * @name Controls/_slider/ISlider#borderVisible
 * @cfg {Boolean} sets the stroke around control
 * @example
 * Slider with border
 * <pre class="brush:html">
 *   <Controls.slider:Base borderVisible="{{true}}"/>
 * </pre>
 */

/**
 * @name Controls/_slider/ISlider#scaleStep
 * @cfg {Number} Параметр scaleStep определяет шаг шкалы, расположенной под слайдером.
 * @remark Шкала отображается, когда опция {@link borderVisible} установлена в значения false, а параметр scaleStep положительный.
 * @example
 * Слайдер со шкалой с шагом 20:
 * <pre class="brush:html">
 *   <Controls.slider:Base scaleStep="{{20}}"/>
 * </pre>
 */

/*
 * @name Controls/_slider/ISlider#scaleStep
 * @cfg {Number} The scaleStep option determines the step in the scale grid under the slider
 * @remark Scale displayed only if borderVisible is false and scaleStep is positive.
 * @example
 * Slider with scale step of 20
 * <pre class="brush:html">
 *   <Controls.slider:Base scaleStep="{{20}}"/>
 * </pre>
 */

/**
 * @name Controls/_slider/ISlider#precision
 * @cfg {Number} Количество символов в десятичной части.
 * @remark Должно быть неотрицательным.
 * @example
 * Слайдер с целыми значениями:
 * <pre class="brush:html">
 *   <Controls.slider:Base precision="{{0}}"/>
 * </pre>
 */

/*
 * @name Controls/_slider/ISlider#precision
 * @cfg {Number} Number of characters in decimal part.
 * @remark Must be non-negative
 * @example
 * Slider with integer values;
 * <pre class="brush:html">
 *   <Controls.slider:Base precision="{{0}}"/>
 * </pre>
 */

/**
 * @name Controls/_slider/ISlider#tooltipFormatter
 * @cfg {Function} Функция форматирования подсказки.
 * @remark
 * Аргументы функции:
 * <ul>
 *    <li>value - текущее положение слайдера</li>
 * </ul>
 */

/*
 * @name Controls/_slider/ISlider#tooltipFormatter
 * @cfg {Function} Tooltip formatter function.
 * @remark
 * Function Arguments:
 * <ul>
 *    <li>value - slider current position</li>
 * </ul>
 */

