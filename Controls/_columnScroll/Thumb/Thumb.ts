import {Control, IControlOptions, TemplateFunction} from 'UI/Base';
import * as template from 'wml!Controls/_columnScroll/Thumb/Thumb';
import Scrollbar from 'Controls/_scroll/Scroll/Scrollbar';
import {SyntheticEvent} from 'Vdom/Vdom';

export interface IThumbOptions extends IControlOptions {
    stickyHeader?: boolean;
    positionChangeHandler: (e: SyntheticEvent<null>, position: number) => void;
    contentSize: number;

    /**
     * Стиль background в случае sticky header
     */
    backgroundStyle: string;
}

export default class Thumb extends Control<IThumbOptions> {
    protected _template: TemplateFunction = template;

    private _localPositionHandler: IThumbOptions['positionChangeHandler'];
    private _needNotifyResize: boolean = true;
    private _shouldSetMarginTop: boolean = false;
    private _position: number = 0;

    protected _beforeMount(options: IThumbOptions): void {
        this._localPositionHandler = options.positionChangeHandler;
        this._shouldSetMarginTop = !!options.stickyHeader;
    }

    /*
    * Устанавливает позицию thumb'a.
    * Метод существует как временное решение ошибки ядра, когда обновлениие реактивного состояния родителя
    * приводит к перерисовке всех дочерних шаблонов, даже если опция в них не передается.
    * https://online.sbis.ru/opendoc.html?guid=5c209e19-b6b2-47d0-9b8b-c8ab32e133b0
    *
    * Ошибка ядра приводит к крайне низкой производительности горизонтального скролла(при изменении позиции
    * перерисовываются записи)
    * https://online.sbis.ru/opendoc.html?guid=16907a96-816e-4c76-9bdb-26bd6c4370b4
    *
    * После решения ошибки ядра, позиция thumb'a будет изменяться только по опциям, а _localPositionHandler
    * заменен на полноценный _notify.
    * _localPositionHandler - костыль созданный из за невозможности подписаться на событие не методом контрола,
    * а проброшенным методом. При горизонтальном скролле таблица оборачивается в отдельный шаблон с целью объединить
    * GridView, ColumnScroll и DragScroll.
    * */
    setPosition(position: number): void {
        if (this._position !== position) {
            this._position = position;
            if (this._localPositionHandler) {
                this._localPositionHandler(null, this._position);
            }
        }
    }

    protected _afterRender(): void {
        if (this._needNotifyResize) {
            (this._children.scrollbar as Scrollbar).recalcSizes();
            this._notify('newPositionRendered', [this._position], {bubbling: true});
            this._needNotifyResize = false;
        }
    }

    _beforeUpdate(options: IThumbOptions): void {
        if (typeof options.position === 'number' && this._position !== options.position) {
            this._position = options.position;
        }
    }
}
