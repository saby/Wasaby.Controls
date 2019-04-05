interface IValue<T> {
    value: T;
}

interface IFieldData {
    position: number;
    displayValue: string;
}

type ICallback<T> = (data: IValue<T> & IFieldData) => IFieldData;

export default ICallback;
