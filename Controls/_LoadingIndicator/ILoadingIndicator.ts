import {Control, IControlOptions} from 'UI/Base';

export type ILoadingIndicatorScroll = '' | 'left' | 'right' | 'top' | 'bottom';
export type ILoadingIndicatorSmall = '' | 'small';
export type ILoadingIndicatorOverlay = 'default' | 'dark' | 'none';
export type ILoadingIndicatorMods = [] | ['gray'];

export interface ILoadingIndicatorConfig extends IControlOptions {
    id?: number;
    isGlobal?: boolean;
    message?: string;
    scroll?: ILoadingIndicatorScroll;
    small?: ILoadingIndicatorSmall;
    overlay?: ILoadingIndicatorOverlay;
    mods?: ILoadingIndicatorMods;
    delay?: number;
    // fixme: секретная опция конфига ?
    mainIndicator?: any;
    // fixme: тут явно не соответсвуют API и внутрености, есть опция config,
    //   но в неё подмешивается waitPromise в методе _prepareConfig
    //   надо бы:
    //   либо не подмешивать опцию в коде
    //   либо прям в конфиг её и перенести, ничего этому не мешает вроде.
    //   либо надо делать приватный расширенный интерфейс
    waitPromise?: Promise<any>;
}

/**
 * https://wi.sbis.ru/docs/js/Controls/LoadingIndicator/
 */
export interface ILoadingIndicator extends Control {
    show(config: ILoadingIndicatorConfig, waitPromise?: Promise<any>): number;
    hide(id?: number): void;
}

/**
 * @name Controls/LoadingIndicator#isGlobal
 * @cfg {Boolean} Показать индикатор над всей страницей или только над собственным контентом.
 * @variant true В этом случае индикатор позиционируется через position: fixed.
 * @variant false В этом случае индикатор позиционируется через position: absolute.
 * @default true
 */

/**
 * @name Controls/LoadingIndicator#message
 * @cfg {String} Текст сообщения индикатора.
 * @default '' (пустая строка)
 */

/**
 * @name Controls/LoadingIndicator#scroll
 * @cfg {String} Добавляет градиент к фону индикатора для прокручивания объекта привязки.
 * @variant '' (пустая строка) без градиента.
 * @variant 'left' Градиент слева направо (увелечение цветового наполнения)
 * @variant 'right' Градиент справа налево
 * @variant 'top' Градиент сверху вниз
 * @variant 'bottom' Градиент снизу вверх
 * @default '' (пустая строка)
 */

/**
 * @name Controls/LoadingIndicator#small
 * @cfg {String} Размер некоторых стилей индикатора (настройки полей, фона, границы, ширины, высоты).
 * @variant '' (пустая строка) Стандартный размер индикатора
 * @variant 'small' Делает индикатор меньше
 * @default '' (пустая строка)
 */

/**
 * @name Controls/LoadingIndicator#overlay
 * @cfg {String} Настройка оверлея индикатора.
 * @variant 'default' невидимый фон, индикатор блокирует клики
 * @variant 'dark' темный фон, индикатор блокирует клики
 * @variant 'none' невидимый фон, индикатор не блокирует клики
 * @default 'default'
 */

/**
 * @name Controls/LoadingIndicator#mods
 * @cfg {Array.<String>|String} Параметр может использоваться для пользовательской настройки индикатора.
 * Параметр mods содержит слова, которые будут добавлены в качестве стиля "controls-loading-indicator_mod-[mod]" в контейнер индикатора.
 * @variant [] Без использования параметра mods
 * @variant ['gray'] Серый цвет градиента. Используется с настройками скролла.
 * @default []
 */

/**
 * @name Controls/LoadingIndicator#delay
 * @cfg {Number} Задержка перед началом показа индикатора.
 * @remark
 * Значение задаётся в миллисекундах.
 * @default 2000
 */

/**
 * Контейнер для контента с возможностью отображения индикатора загрузки.
 * Может использоваться локально для покрытия собственного контента или глобально для покрытия всей страницы.
 * @remark
 * LoadingIndicator обрабатывает два события: showIndicator и hideIndicator.
 *
 * showIndicator используется для отображения индикатора. Это могут быть какие-либо запросы.
 * Запросы составляют стек, где последний обработанный запрос LoadingIndicator используется для отображения индикатора.
 * Индикатор пропадает, когда стек становится пустым.
 *
 * showIndicator имеет два аргумента [config, waitPromise].
 *
 * config — это объект, имеющий свойства:
 *    * id (String) — определяет уникальный идентификатор запроса на отображение индикатора (по умолчанию используется автоматически сгенерированный идентификатор)
 *    * isGlobal (Boolean) — определяет, глобальный или нет идентификатор (если не задан, по умолчанию используется значение аналогичного параметра контрола)
 *    * message (String) — текст сообщения индикатора (если не задан, по умолчанию используется значение аналогичного параметра контрола)
 *    * scroll (String) — добавляет градиент фону индикатора (если не задан, по умолчанию используется значение аналогичного параметра контрола)
 *    * small (String) — размер индикатора (если не задан, по умолчанию используется значение аналогичного параметра контрола)
 *    * overlay (String) — настройки оверлея индикатора (если не задан, по умолчанию используется значение аналогичного параметра контрола)
 *    * mods (Array.<String>|String) — может использоваться для пользовательской настройки индикатора. (если не задан, по умолчанию используется значение аналогичного параметра контрола)
 *    * delay (Number) — задержка перед началом показа индикатора. (если не задан, по умолчанию используется значение аналогичного параметра контрола)
 *
 * waitPromise (Promise) — когда условие будет выполнено, индикатор скроется (необязательное свойство)
 *
 * showIndicator возвращает значение id, используя в качестве аргумента hideIndicator.
 *
 * hideIndicator используется для удаления запроса отображения индикатора.
 * hideIndicator имеет один аргумент: [id].
 * id — тип свойства Number. Необходим для удаления конкретного запроса из стека запросов.
 *
 *
 * @css size_LoadingIndicator-l Размер LoadingIndicator, когда задан размер опции — по умолчанию.
 * @css size_LoadingIndicator-s Размер LoadingIndicator, когда задан размер опции — маленький.
 *
 * @css @spacing_LoadingIndicator-between-content-border-l Расстояние между контентом и границей, когда задан размер параметра — по умолчанию.
 * @css @spacing_LoadingIndicator-between-content-border-s Расстояние между контентом и границей, когда задан размер параметра — маленький.
 *
 * @css @border-radius_LoadingIndicator Радиус границы, когда задан размер параметра — по умолчанию.
 *
 * @css @font-size_LoadingIndicator Размер шрифта сообщения.
 * @css @line-height_LoadingIndicator Высота строки сообщения.
 * @css @color_LoadingIndicator-text Цвет сообщения.
 *
 * @css @color_LoadingIndicator-overlay-default Цвет оверлея, когда задано значение параметра — по умолчанию.
 * @css @color_LoadingIndicator-overlay-dark Цвет оверлея, когда задано значение параметра — темный.
 *
 * @css @background-url_LoadingIndicator-l Фон ссылки когда задан размер параметра — по умолчанию.
 * @css @background-url_LoadingIndicator-s Фон ссылки когда задан размер параметра — маленький.
 * @css @background-color_LoadingIndicator Цвет фона LoadingIndicator.
 *
 * @class Controls/LoadingIndicator
 * @extends Core/Control
 * @control
 * @author Красильников А.С.
 * @public
 * @category Container
 * @demo Controls-demo/LoadingIndicator/LoadingIndicatorPG
 */
