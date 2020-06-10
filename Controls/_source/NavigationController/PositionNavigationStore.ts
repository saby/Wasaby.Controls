import {CursorDirection} from 'Controls/Constants';

interface IPositionHasMore {
    backward: boolean;
    forward: boolean;
    before?: boolean;
    after?: boolean;
}

type TPositionHasMore = boolean | IPositionHasMore;

// TODO Общие типы
type TPosition = any;
/**
 * Позиция, от которой нужно начинать скролл
 * Является массивом из любых типов (number, date, string и тд)
 */
type TPositionValue = any[];
type TField = string | string[];
type TFieldValue = string[];

export interface IPositionNavigationStoreOptions {
    field: TField;
    position: TPosition;
    direction: CursorDirection;
    limit: number;
}
export interface IPositionNavigationState {
    field: TField;
    position: TPosition;
    direction: CursorDirection;
    limit: number;
    backwardPosition: TPosition;
    forwardPosition: TPosition;
}
class PositionNavigationStore {
    private _field: TFieldValue;
    private _position: TPositionValue;
    private _direction: CursorDirection;
    private _limit: number;

    protected _backwardPosition: TPositionValue = [null];
    protected _forwardPosition: TPositionValue = [null];
    private _more: boolean | TPositionHasMore;

    constructor(cfg: IPositionNavigationStoreOptions) {
        if (cfg.field !== undefined) {
            this._field = cfg.field.length ? cfg.field as TFieldValue : [cfg.field] as TFieldValue;
        } else {
            throw new Error('Option field is undefined in PositionNavigation');
        }
        if (cfg.position !== undefined) {
            this._position = cfg.position.length ? cfg.position : [cfg.position];
        } else {
            throw new Error('Option position is undefined in PositionNavigation');
        }
        if (cfg.direction !== undefined) {
            this._direction = PositionNavigationStore._convertDirection(cfg.direction);
        } else {
            throw new Error('Option direction is undefined in PositionNavigation');
        }
        if (cfg.limit !== undefined) {
            this._limit = cfg.limit;
        } else {
            throw new Error('Option limit is undefined in PositionNavigation');
        }

        this._more = PositionNavigationStore._getDefaultMoreMeta();
    }

    private static _getDefaultMoreMeta(): IPositionHasMore {
        return {
            backward: false,
            forward: false,
            before: false,
            after: false
        };
    }

    /**
     * Конвертор старых и новых названий направления.
     * TODO Необходимо убрать этот метод, когда своместимость более не понадобится
     * @param position
     */
    private static _convertDirection(position: CursorDirection | 'before' | 'after' | 'both'): CursorDirection {
        const map = {
            before: CursorDirection.backward,
            after: CursorDirection.forward,
            both: CursorDirection.bothways
        };
        return map[position] ? map[position] : position;
    }

    getParams(): IPositionNavigationState {
        return {
            field: this._field,
            position: this._position,
            direction: this._direction,
            limit: this._limit,
            backwardPosition: this._backwardPosition,
            forwardPosition: this._forwardPosition
        };
    }

    shiftNextPage(): void {
        this._nextPage++;
    }

    shiftPrevPage(): void {
        this._prevPage--;
    }

    setCurrentPage(pageNumber: number): void {
        this._initPages(pageNumber);
    }

    setMetaMore(more: boolean | number): void {
        this._more = more;
    }

    destroy(): void {
        this._nextPage = null;
        this._prevPage = null;
        this._more = null;

        this._page = null;
        this._pageSize = null;
        this._hasMore = null;
    }
}

export default PositionNavigationStore;
