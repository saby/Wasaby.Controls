import Control = require('Core/Control');
import tmpl = require('wml!Controls/_LoadingIndicator/LoadingIndicator');
import randomId = require('Core/helpers/Number/randomId');
import collection = require('Types/collection');
import 'css!theme?Controls/_LoadingIndicator/LoadingIndicator';

/**
 * @name Controls/LoadingIndicator#isGlobal
 * @cfg {Boolean} Показать индикатор над всей страницей или только над собственным контентом.
 * @variant true В этом случае индикатор позиционируется через position: fixed.
 * @variant false В этом случае индикатор позиционируется через position: absolute.
 * @default true
 */

/*
 * @name Controls/LoadingIndicator#isGlobal
 * @cfg {Boolean} show indicator covering whole page (global) or covering just own content
 * @variant true It means position: fixed of indicator's container
 * @variant false It means position: absolute of indicator's container
 * @default true
 */

/**
 * @name Controls/LoadingIndicator#message
 * @cfg {String} Текст сообщения индикатора.
 * @default '' (пустая строка)
 */

/*
 * @name Controls/LoadingIndicator#message
 * @cfg {String} message of indicator
 * @default '' (empty string)
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

/*
 * @name Controls/LoadingIndicator#scroll
 * @cfg {String} add gradient of indicator's background
 * @variant '' (empty string) no gradient
 * @variant 'left' gradient from left to right (increase of fullness)
 * @variant 'right' gradient from right to left
 * @variant 'top' gradient from top to bottom
 * @variant 'bottom' gradient from bottom to top
 * @default '' (empty string)
 */

/**
 * @name Controls/LoadingIndicator#small
 * @cfg {String} Размер некоторых стилей индикатора (настройки полей, фона, границы, ширины, высоты).
 * @variant '' (пустая строка) Стандартный размер индикатора
 * @variant 'small' Делает индикатор меньше
 * @default '' (пустая строка)
 */

/*
 * @name Controls/LoadingIndicator#small
 * @cfg {String} size of some styles of indicator (tuning of margin, background, border, width, height styles)
 * @variant '' (empty string) standard size of indicator
 * @variant 'small' make indicator smaller
 * @default '' (empty string)
 */

/**
 * @name Controls/LoadingIndicator#overlay
 * @cfg {String} Настройка оверлея индикатора.
 * @variant 'default' невидимый фон, индикатор блокирует клики
 * @variant 'dark' темный фон, индикатор блокирует клики
 * @variant 'none' невидимый фон, индикатор не блокирует клики
 * @default 'default'
 */

/*
 * @name Controls/LoadingIndicator#overlay
 * @cfg {String} setting of indicator's overlay
 * @variant 'default' invisible background, indicator blocks clicks
 * @variant 'dark' dark background, indicator blocks clicks
 * @variant 'none' invisible background, indicator don't blocks clicks
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

/*
 * @name Controls/LoadingIndicator#mods
 * @cfg {Array.<String>|String} It can be using for custom tuning of indicator.
 * mods contains words what will be adding as "controls-loading-indicator_mod-[mod]" style in indicator's container
 * @variant [] no mods
 * @variant ['gray'] gray color of gradient. it's using with scroll property
 * @default []
 */

/**
 * @name Controls/LoadingIndicator#delay
 * @cfg {Number} Задержка перед началом показа индикатора.
 * @remark
 * Значение задаётся в миллисекундах.
 * @default 2000
 */

/*
 * @name Controls/LoadingIndicator#delay
 * @cfg {Number} timeout before indicator will be visible
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

/*
 * Container for content that can show loading indicator.
 * It can be local using for covering it's own content or global using for covering whole page.
 * @remark
 * LoadingIndicator is waiting 2 events: showIndicator and hideIndicator.
 *
 * showIndicator is using for request of indicator showing. It may be some requests.
 * Requests compose stack where last handled request is using by LoadingIndicator for indicator showing.
 * Indicator becomes invisible when stack will be empty.
 * showIndicator has 2 arguments: [config, waitPromise].
 * config is object having properties:
 *    -  id (String) - defines the unique id of showing request (By default use autogenerated id),
 *    -  isGlobal (Boolean) - global or not (If not setted, by default use value of similar control option)
 *    -  message (String) - message of indicator (If not setted, by default use value of similar control option)
 *    -  scroll (String) - add gradient of indicator's background (If not setted, by default use value of similar control option)
 *    -  small (String) - size of indicator (If not setted, by default use value of similar control option)
 *    -  overlay (String) - setting of indicator's overlay (If not setted, by default use value of similar control option)
 *    -  mods (Array.<String>|String) - It can be using for custom tuning of indicator (If not setted, by default use value of similar control option)
 *    -  delay (Number) - timeout before indicator will be visible (If not setted, by default use value of similar control option)
 * waitPromise (Promise) - when this promise will be resolved, indicator hides (not necessary property)
 * showIndicator returns id value using as argument of hideIndicator.
 *
 * hideIndicator is using for remove request of indicator showing.
 * hideIndicator has 1 argument: [id].
 * id is Number type property. It needs for remove concrete request from stack of requests.
 *
 *
 * @css size_LoadingIndicator-l Size of Loading Indicator when option size is set to default.
 * @css size_LoadingIndicator-s Size of Loading Indicator when option size is set to small.
 *
 * @css @spacing_LoadingIndicator-between-content-border-l Spacing between content and border when option size is set to default.
 * @css @spacing_LoadingIndicator-between-content-border-s Spacing between content and border when option size is set to small.
 *
 * @css @border-radius_LoadingIndicator Border radius when option size is set to default.
 *
 * @css @font-size_LoadingIndicator Font-size of message.
 * @css @line-height_LoadingIndicator Line-height of message.
 * @css @color_LoadingIndicator-text Color of message.
 *
 * @css @color_LoadingIndicator-overlay-default Color of overlay when option overlay is set to default.
 * @css @color_LoadingIndicator-overlay-dark Color of overlay when option overlay is set to dark.
 *
 * @css @background-url_LoadingIndicator-l Background-url when option size is set to default.
 * @css @background-url_LoadingIndicator-s Background-url when options size is set to small.
 * @css @background-color_LoadingIndicator Background color of Loading Indicator.
 *
 * @class Controls/LoadingIndicator
 * @extends Core/Control
 * @control
 * @author Красильников А.С.
 * @public
 * @category Container
 * @demo Controls-demo/LoadingIndicator/LoadingIndicatorPG
 */
let ManagerController;
const module = Control.extend(/** @lends Controls/LoadingIndicator.prototype */{
    _template: tmpl,
    _isOverlayVisible: false,
    _isMessageVisible: false,
    _isPreloading: false,
    _prevLoading: null,
    _stack: null,
    _isLoadingSaved: null,
    _delay: 2000,

    isGlobal: true,
    message: '',
    scroll: '',
    small: '',
    overlay: 'default',
    mods: null,

    _beforeMount(cfg) {
        this.mods = [];
        this._stack = new collection.List();
        this._updateProperties(cfg);
    },
    _afterMount(cfg) {
        const self = this;
        if (cfg.mainIndicator) {
            requirejs(['Controls/popup'], function(popup) {
                // TODO: Индикатор сейчас напрямую зависит от Controls/popup и наоборот
                // Надо либо пересмотреть формирование библиотек и включить LoadingIndicator в popup,
                // Либо переписать индикатор так, чтобы зависимостей от Controls/popup не было.
                ManagerController = popup.Controller;
                ManagerController.setIndicator(self);
            });
        }
    },
    _beforeUpdate(cfg) {
        this._updateProperties(cfg);
    },
    _updateProperties(cfg) {
        if (cfg.isGlobal !== undefined) {
            this.isGlobal = cfg.isGlobal;
        }
        if (cfg.message !== undefined) {
            this.message = cfg.message;
        }
        if (cfg.scroll !== undefined) {
            this.scroll = cfg.scroll;
        }
        if (cfg.small !== undefined) {
            this.small = cfg.small;
        }
        if (cfg.overlay !== undefined) {
            this.overlay = cfg.overlay;
        }
        if (cfg.mods !== undefined) {
            // todo сделать mods строкой всегда, или вообще удалить опцию
            if (Array.isArray(cfg.mods)) {
                this.mods = cfg.mods;
            } else if (typeof cfg.mods === 'string') {
                this.mods = [cfg.mods];
            }
        }
        this.delay = cfg.delay !== undefined ? cfg.delay : this._delay;

    },

    // Indicator is opened above existing popups.
    _updateZIndex(config) {
        const popupItem = ManagerController && ManagerController.find((config || {}).popupId);
        if (popupItem) {
            this._zIndex = popupItem.currentZIndex;
        } else {
            this._zIndex = null;
        }
    },
    _showHandler(event, config, waitPromise) {
        event.stopPropagation();
        return this._show(config, waitPromise);
    },

    _hideHandler(event, id) {
        event.stopPropagation();
        return this._hide(id);
    },

    /*
     * show indicator (bypassing requests of indicator showing stack)
     */
    /**
     * Отображает индикатор загрузки.
     * @param config Объект с параметрами.
     * @param {String} config.id Определяет уникальный идентификатор запроса на отображение индикатора (по умолчанию используется автоматически сгенерированный идентификатор).
     * @param {Boolean} isGlobal Определяет, глобальный или нет идентификатор (если не задан, по умолчанию используется значение аналогичного параметра контрола).
     * @param {String} message Текст сообщения индикатора (если не задан, по умолчанию используется значение аналогичного параметра контрола).
     * @param {String} scroll Добавляет градиент фону индикатора (если не задан, по умолчанию используется значение аналогичного параметра контрола).
     * @param {String} small Размер индикатора (если не задан, по умолчанию используется значение аналогичного параметра контрола).
     * @param {String} overlay Настройки оверлея индикатора (если не задан, по умолчанию используется значение аналогичного параметра контрола).
     * @param {Array.<String>|String} Может использоваться для пользовательской настройки индикатора (если не задан, по умолчанию используется значение аналогичного параметра контрола).
     * @param {Number} delay Задержка перед началом показа индикатора (если не задан, по умолчанию используется значение аналогичного параметра контрола).
     * @param waitPromise Когда условие будет выполнено, индикатор скроется (необязательное свойство).
     */ 
    show(config, waitPromise) {
        return this._show(config, waitPromise);
    },

    _show(config, waitPromise) {
        const newCfg = this._prepareConfig(config, waitPromise);
        const isOpened = this._getItemIndex(newCfg.id) > -1;
        if (isOpened) {
            this._replaceItem(newCfg.id, newCfg);
        } else {
            this._stack.add(newCfg);
            this._toggleIndicator(true, newCfg);
        }
        return newCfg.id;
    },

    /*
     * hide indicator (bypassing requests of indicator showing stack)
     */
    /**
     * Скрывает индикатор загрузки.
     * @param {Number} id Необходим для удаления конкретного запроса из стека запросов.
     */
    hide(id) {
        if (!id) {

            // Used public api. In this case, hide the indicator immediately.
            this._clearStack();
            this._toggleIndicator(false, {});
        } else {
            this._hide(id);
        }
    },

    _hide(id) {
        this._removeItem(id);
        if (this._stack.getCount()) {
            this._toggleIndicator(true, this._stack.at(this._stack.getCount() - 1), true);
        } else {
            this._toggleIndicator(false);
        }
    },

    _clearStack() {
        this._stack.clear();
    },

    _isOpened(config) {
        // config is not required parameter. If config object is empty we should always create new Indicator due to absence of ID field in config
        if (!config) {
            return false;
        }
        const index = this._getItemIndex(config.id);
        if (index < 0) {
            delete config.id;
        }
        return !!config.id;
    },

    _waitPromiseHandler(config) {
        if (this._isOpened(config)) {
            this._hide(config.id);
        }
    },

    _prepareConfig(config, waitPromise) {
        if (typeof config !== 'object') {
            config = {
                message: config
            };
        }
        if (!config.hasOwnProperty('overlay')) {
            config.overlay = 'default';
        }
        if (!config.id) {
            config.id = randomId();
        }
        if (!config.hasOwnProperty('delay')) {
            config.delay = this.delay;
        }

        if (!config.waitPromise && waitPromise) {
            config.waitPromise = waitPromise;
            config.waitPromise.then(this._waitPromiseHandler.bind(this, config));
            config.waitPromise.catch(this._waitPromiseHandler.bind(this, config));
        }
        return config;
    },

    _removeItem(id) {
        const index = this._getItemIndex(id);
        if (index > -1) {
            this._stack.removeAt(index);
        }
    },

    _replaceItem(id, config) {
        this._removeItem(id);
        this._stack.add(config);
    },

    _getItemIndex(id) {
        return this._stack.getIndexByValue('id', id);
    },

    _getDelay(config) {
        return typeof config.delay === 'number' ? config.delay : this.delay;
    },

    _getOverlay(overlay: string): string {
        // if overlay is visible, but message don't visible, then overlay must be transparent.
        if (this._isOverlayVisible && !this._isMessageVisible) {
            return 'default';
        }
        return  overlay;
    },

    _toggleIndicator(visible, config, force) {
        clearTimeout(this.delayTimeout);
        this._updateZIndex(config);
        if (visible) {
            this._toggleOverlayAsync(true, config);
            if (force) {
                this._toggleIndicatorVisible(true, config);
            } else {
                // if we have indicator in stack, then don't hide overlay
                this._toggleIndicatorVisible(this._stack.getCount() > 1 && this._isOverlayVisible, config);
                this.delayTimeout = setTimeout(() => {
                    const lastIndex = this._stack.getCount() - 1;
                    if (lastIndex > -1) {
                        this._toggleIndicatorVisible(true, this._stack.at(lastIndex));
                        this._forceUpdate();
                    }
                }, this._getDelay(config));
            }
        } else {
            // if we dont't have indicator in stack, then hide overlay
            if (this._stack.getCount() === 0) {
                this._toggleIndicatorVisible(false);
                this._toggleOverlayAsync(false, {});
            }
        }
        this._forceUpdate();
    },
    _toggleOverlayAsync(toggle: boolean, config) {
        // контролы, которые при ховере показывают окно, теряют свой ховер при показе оверлея,
        // что влечет за собой вызов обработчиков на mouseout + визуально дергается ховер таргета.
        // Делаю небольшую задержку, если окно не имеет в себе асинхронного кода, то оно успеет показаться раньше
        // чем покажется оверлей. Актуально для инфобокса, превьюера и выпадающего списка.
        // Увеличил до 100мс, за меньшее время не во всех браузерах успевает отрсиоваться окно даже без асинхронных фаз
        this._clearOverlayTimerId();
        const delay = Math.min(this._getDelay(config), 100);
        this._toggleOverlayTimerId = setTimeout(() => {
            this._toggleOverlay(toggle, config);
        }, delay);
    },
    _toggleOverlay(toggle: boolean, config): void {
        this._isOverlayVisible = toggle && config.overlay !== 'none';
        this._forceUpdate();
    },
    _clearOverlayTimerId() {
        if (this._toggleOverlayTimerId) {
            clearTimeout(this._toggleOverlayTimerId);
        }
    },

    _toggleIndicatorVisible(toggle: boolean, config?: object): void {
        if (toggle) {
            this._clearOverlayTimerId();
            this._isMessageVisible = true;
            this._isOverlayVisible = true;
            this._updateProperties(config);
        } else {
            this._isMessageVisible = false;
        }
    }
});

export = module;
