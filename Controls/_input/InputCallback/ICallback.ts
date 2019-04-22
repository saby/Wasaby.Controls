/**
 * Callback function interface.
 *
 * @interface Controls/_input/InputCallback/ICallback
 *
 * @public
 * @author Журавлев М.С.
 */

/**
 * @typedef IValue Field value.
 */

/**
 * @typedef {Object} IFieldData
 * @property {Number} position The position of the carriage.
 * @property {String} displayValue The displayed value in the field.
 */

/**
 * @name Controls/_input/InputCallback/ICallback#InputCallback
 * @function
 * @description The callback function is called after the main input processing process.
 * @param {IFieldData & IValue} data
 * @return {IFieldData} Modified field data.
 */

interface IValue<T> {
    value: T;
}

interface IFieldData {
    position: number;
    displayValue: string;
}

type ICallback<T> = (data: IValue<T> & IFieldData) => IFieldData;

export default ICallback;
