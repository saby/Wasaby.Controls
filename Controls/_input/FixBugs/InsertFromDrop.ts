export interface IInputData {
    oldValue: string;
    oldPosition: number;
    newValue: string;
    newPosition: number;
}

/**
 * Класс для исправления бага не правильной вставки значения при перетаскивании.
 * Причина: во время фокусировки, позиция каретки может измениться. Подробнее в CarriagePositionWhenFocus.
 * Решение: пользовательское перетаскивание запускает события focus и input синхронно. Сохраним позицию
 * каретки на момент фокусировки, а затем удалим ассинхронно. Измененять нативную позицию перед обработкой нельзя!
 * Таким образом, если позиция каретки сохранена, на момент обработки ввода, значит произошло перетаскивание, тогда
 * модифицируем данные.
 */
export class InsertFromDrop {
    private _position: number | null = null;
    private _timeoutId: number | null = null;

    cancel(): void {
        clearTimeout(this._timeoutId);
        this._timeoutId = null;
        this._position = null;
    }

    focusHandler(event: FocusEvent): void {
        const target: HTMLInputElement = event.target as HTMLInputElement;
        this._position = target.selectionEnd;
        this._timeoutId = setTimeout(() => {
           this._position = null;
        }, 0);
    }

    positionForInputProcessing(data: IInputData): IInputData {
        if (this._position === null) {
            return data;
        }

        const insertLength: number = data.newPosition - data.oldPosition;
        const dropValue: string = data.newValue.substr(data.oldPosition, insertLength);
        const oldPosition = this._position;
        const newPosition = this._position + insertLength;
        const newValue: string =
            data.oldValue.substring(0, oldPosition) +
            dropValue +
            data.oldValue.substring(oldPosition);
        return {
            oldValue: data.oldValue,
            oldPosition, newPosition, newValue
        };
    }
}
