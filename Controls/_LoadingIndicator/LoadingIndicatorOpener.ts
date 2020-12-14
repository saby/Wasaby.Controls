import ILoadingIndicator, {ILoadingIndicatorOptions} from './interface/ILoadingIndicator';

export default {
    _setIndicator(indicator: ILoadingIndicator): void {
        this.mainIndicator = indicator;
    },
    /*
     * show indicator (bypassing requests of indicator showing stack)
     */
    /**
     * Отображает индикатор загрузки.
     * @function
     * @name Controls/LoadingIndicator#show
     * @param {Object} [config] Объект с параметрами. Если не задан, по умолчанию используется значение аналогичного параметра контрола.
     * @param {Boolean} [config.isGlobal=true] Определяет, показать индикатор над всей страницей или только над собственным контентом.
     * @param {String} [config.message=''] Текст сообщения индикатора.
     * @param {Scroll} [config.scroll=''] Добавляет градиент фону индикатора.
     * @param {Small} [config.small=''] Размер индикатора.
     * @param {Overlay} [config.overlay=default] Настройки оверлея индикатора.
     * @param {Number} [config.delay=2000] Задержка перед началом показа индикатора.
     * @param {Promise} [waitPromise] Promise, к которому привязывается отображение индикатора. Индикатор скроется после завершения Promise.
     * @returns {String} Возвращает id индикатора загрузки. Используется в методе {@link hide} для закрытия индикатора.
     * @see hide
     */
    show(config: ILoadingIndicatorOptions = {}, waitPromise?: Promise<unknown>): string {
        return this.mainIndicator?.show(config, waitPromise);
    },
    /*
     * hide indicator (bypassing requests of indicator showing stack)
     */
    /**
     * Скрывает индикатор загрузки.
     * @function
     * @name Controls/LoadingIndicator#hide
     * @param {string} id Идентификатор индикатора загрузки.
     * @see show
     */
    hide(id: string): void {
        if (id) {
            this.mainIndicator?.hide(id);
        }
    }
};
