/**
 * Интерфейс функции обратного вызова.
 *
 * @interface Controls/interface/ICallback
 *
 * @public
 * @author Красильников А.С.
 */

/*
 * Callback function interface.
 *
 * @interface Controls/interface/ICallback
 *
 * @public
 * @author Красильников А.С.
 */

/**
 * @typedef IValue Значение поля.
 */

/*
 * @typedef IValue Field value.
 */ 

/**
 * @typedef {Object} IFieldData
 * @property {Number} position Положение каретки.
 * @property {String} displayValue Значение, которое будет отображено в поле.
 */

/*
 * @typedef {Object} IFieldData
 * @property {Number} position The position of the carriage.
 * @property {String} displayValue The displayed value in the field.
 */ 

/**
 * @name Controls/interface/ICallback#inputCallback
 * @function
 * @description Функция обратного вызова вызывается после основного процесса обработки входных данных.
 * @param {IFieldData & IValue} data
 * @return {IFieldData} Измененные данные поля.
 */

/*
 * @name Controls/interface/ICallback#inputCallback
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
