// TODO: использовать интерфейс опций базового класса полей ввода, когда он появится.
import {IControlOptions} from 'UI/Base';
import {IInputData, InsertFromDrop} from './FixBugs/InsertFromDrop';
import {TUpdatePositionCallback, CarriagePositionWhenFocus} from './FixBugs/CarriagePositionWhenFocus';

interface IConfig {
    updatePositionCallback: TUpdatePositionCallback;
}

// TODO: перенести все исправления нативных ошибок по полям сюда.
// https://online.sbis.ru/opendoc.html?guid=aae7bb03-7707-4156-a8d8-3686205c8142
export class FixBugs {
    private _insertFromDropBug: InsertFromDrop;
    private _carriagePositionBug: CarriagePositionWhenFocus;

    // TODO: добавить свойство с публичной информацией. Например, первый клик, фокус и т.д.
    // Испольлзовать её в полях ввода для уменьшения нагрузки на модули.

    constructor(config: IConfig) {
        this._insertFromDropBug = new InsertFromDrop();
        this._carriagePositionBug = new CarriagePositionWhenFocus(config.updatePositionCallback);
    }

    update(oldOptions: IControlOptions, newOptions: IControlOptions): void {
        if (oldOptions.readOnly !== newOptions.readOnly) {
            this._carriagePositionBug.editingModeWasChanged(oldOptions.readOnly, newOptions.readOnly);
        }
    }

    mouseDownHandler(): void {
        this._carriagePositionBug.mouseDownHandler();
    }

    focusHandler(event: FocusEvent): void {
        this._insertFromDropBug.focusHandler(event);
        const positionChanged: boolean = this._carriagePositionBug.focusHandler();
        if (!positionChanged) {
            this._insertFromDropBug.cancel();
        }
    }

    positionForInputProcessing(data: IInputData): IInputData {
        return this._insertFromDropBug.positionForInputProcessing(data);
    }
}
