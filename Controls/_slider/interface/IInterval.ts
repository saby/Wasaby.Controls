/**
 * Интерфейс интервала шкалы, закрашенного цветом.
 *
 * @interface Controls/_slider/interface/IInterval
 * @public
 */

/*
 * Interface for colored interval of the scale.
 *
 * @interface Controls/_slider/interface/IInterval
 * @public
 */

export interface IInterval {
   color: string;
   start: number;
   end: number;
}

/**
 * @name Controls/_slider/interface/IInterval#color
 * @cfg {String} Цвет интервала.
 */

/*
 * @name Controls/_slider/interface/IInterval#color
 * @cfg {String} Interval color.
 */

/**
 * @name Controls/_slider/interface/IInterval#start
 * @cfg {Number} Начало интервала
 * @remark Должно находиться в диапазоне [minValue..maxValue] и быть меньше, чем [end]
 */

/*
 * @name Controls/_slider/interface/IInterval#start
 * @cfg {Number} Start of the interval
 * @remark Must be in range of [minValue..maxValue] and lower then [end]
 */

/**
 * @name Controls/_slider/interface/IInterval#end
 * @cfg {Number} Конец интервала
 * @remark Должно находиться в диапазоне [minValue..maxValue] и быть больше, чем [start]
 */

/*
 * @name Controls/_slider/interface/IInterval#end
 * @cfg {Number} End of the interval
 * @remark Must be in range of [minValue..maxValue] and more then [start]
 */
