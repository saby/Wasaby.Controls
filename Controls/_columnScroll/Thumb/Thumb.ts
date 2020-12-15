import {Control, IControlOptions, TemplateFunction} from 'UI/Base';
import * as template from 'wml!Controls/_columnScroll/Thumb/Thumb';

export interface IThumbOptions extends IControlOptions {
    stickyHeader?: boolean;
    contentSize: number;
    backgroundStyle: string;
}

export default class Thumb extends Control<IThumbOptions> {
    protected _template: TemplateFunction = template;
    private _position: number = 0;

    /*
    * Устанавливает позицию thumb'a.
    * Метод существует как временное решение ошибки ядра, когда обновлениие реактивного состояния родителя
    * приводит к перерисовке всех дочерних шаблонов, даже если опция в них не передается.
    * https://online.sbis.ru/opendoc.html?guid=5c209e19-b6b2-47d0-9b8b-c8ab32e133b0
    *
    * Ошибка ядра приводит к крайне низкой производительности горизонтального скролла(при изменении позиции
    * перерисовываются записи)
    * https://online.sbis.ru/opendoc.html?guid=16907a96-816e-4c76-9bdb-26bd6c4370b4
    */
    setPosition(position: number): void {
        if (this._position !== position) {
            this._position = position;
            this._notify('positionChanged', [this._position]);
        }
    }

    _onPositionChanged(e, newPosition): void {
        e.stopPropagation();
        this._notify('positionChanged', [newPosition]);
    }
}
