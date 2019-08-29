export interface IMonthListVirtualPageSizeOptions {
   virtualPageSize: number;
}

/**
 * Интерфейс для контролов основанных на Controls/calendar:MonthList и поддерживающих изменение виртуалной страницы.
 * @interface Controls/_calendar/interface/IMonthListVirtualPageSize
 * @public
 */
export interface IMonthListVirtualPageSize {
   readonly '[Controls/_calendar/interface/IMonthListVirtualPageSize]': boolean;
}

/**
 * @name Controls/_calendar/interface/IMonthListVirtualPageSize#virtualPageSize
 * @cfg {Number} Размер виртуальной страницы указывает максимальное количество одновременно отображаемых элементов в списке.
 * @default 6
 */
