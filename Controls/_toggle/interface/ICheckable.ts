export interface ICheckableOptions {
   value?: boolean;
}

/**
 * Interface for 2-position control.
 *
 * @interface Controls/_toggle/interface/ICheckable
 * @public
 * @author Михайловский Д.С.
 */

/**
 * @name Controls/_toggle/interface/ICheckable#value
 * @cfg {boolean} Current state.
 */
export default interface ICheckable {
   /**
    * @event Controls/_toggle/interface/ICheckable#valueChanged Occurs when value changes.
    * @param {boolean} value New value.
    */
}

