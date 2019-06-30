export interface ICheckableOptions {
   value?: boolean;
}

/**
 * Интерфейс переключателя.
 *
 * @interface Controls/_toggle/interface/ICheckable
 * @public
 * @author Красильников А.С.
 */

/*
 * Interface for 2-position control.
 *
 * @interface Controls/_toggle/interface/ICheckable
 * @public
 * @author Красильников А.С.
 */
export interface ICheckable {
   readonly '[Controls/_toggle/interface/ICheckable]': boolean;
}
/**
 * @name Controls/_toggle/interface/ICheckable#value
 * @cfg {boolean} Текущее состояние.
 */

/*
 * @name Controls/_toggle/interface/ICheckable#value
 * @cfg {boolean} Current state.
 */

/**
 * @event Controls/_toggle/interface/ICheckable#valueChanged Происходит при изменении значения.
 * @param {Env/Event:Object} eventObject Дескриптор события.
 * @param {boolean} value Новое значение.
 */

/*
 * @event Controls/_toggle/interface/ICheckable#valueChanged Occurs when value changes.
 * @param {Env/Event:Object} eventObject The event descriptor.
 * @param {boolean} value New value.
 */
