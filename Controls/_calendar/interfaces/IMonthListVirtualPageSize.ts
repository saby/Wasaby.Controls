export interface IMonthListVirtualPageSizeOptions {
   virtualPageSize: number;
}

/**
 * Интерфейс для контролов основанных на Controls/calendar:MonthList и поддерживающих изменение виртуалной страницы.
 * @interface Controls/_calendar/interfaces/IMonthListVirtualPageSize
 * @public
 */
export interface IMonthListVirtualPageSize {
   readonly '[Controls/_calendar/interfaces/IMonthListVirtualPageSize]': boolean;
}

/**
 * @name Controls/_calendar/interfaces/IMonthListVirtualPageSize#virtualPageSize
 * @cfg {Number} Размер виртуальной страницы указывает максимальное количество одновременно отображаемых элементов в списке.
 * @default 6
 */
