import {Control} from 'UI/Base';
// import template = require('wml!Controls/_popup/Manager/Container');
import * as template from 'wml!Controls/_LoadingIndicator/LoadingIndicator';
import {
    ILoadingIndicator,
    ILoadingIndicatorConfig,
    ILoadingIndicatorMods,
    ILoadingIndicatorOverlay,
    ILoadingIndicatorScroll,
    ILoadingIndicatorSmall
} from 'Controls/_LoadingIndicator/ILoadingIndicator';
import 'css!theme?Controls/_LoadingIndicator/LoadingIndicator';
import {List} from 'Types/collection';
import {SyntheticEvent} from 'Vdom/Vdom';
import randomId = require('Core/helpers/Number/randomId');

let ManagerController;
export default class LoadingIndicator extends Control implements ILoadingIndicator {
    protected _template: TemplateFunction = template;
    private _isOverlayVisible: boolean = false;
    private _isMessageVisible: boolean = false;
    // fixme: any
    private _stack: List<ILoadingIndicatorConfig> = null;
    private _delay: number = 2000;
    private _toggleOverlayTimerId: number = null;
    private _delayTimeout: number = null;
    private _zIndex: number = null;

    private isGlobal: boolean = true;
    private message: string = '';
    private scroll: ILoadingIndicatorScroll = '';
    private small: ILoadingIndicatorSmall = '';
    private overlay: ILoadingIndicatorOverlay = 'default';
    private mods: ILoadingIndicatorMods = [];

    protected _beforeMount(cfg: ILoadingIndicatorConfig): void {
        this.mods = [];
        this._stack = new List();
        this._updateProperties(cfg);
    }

    protected _afterMount(cfg: ILoadingIndicatorConfig): void {
        const self = this;
        if (cfg.mainIndicator) {
            // fixme: тут должен быть интерфейс из Controls/popup, либо сделать todo ниже
            requirejs(['Controls/popup'], (popup: any) => {
                // TODO: Индикатор сейчас напрямую зависит от Controls/popup и наоборот
                // Надо либо пересмотреть формирование библиотек и включить LoadingIndicator в popup,
                // Либо переписать индикатор так, чтобы зависимостей от Controls/popup не было.
                ManagerController = popup.Controller;
                ManagerController.setIndicator(self);
            });
        }
    }

    protected _beforeUpdate(cfg: ILoadingIndicatorConfig): void {
        this._updateProperties(cfg);
    }

    private _updateProperties(cfg: ILoadingIndicatorConfig): void {
        const {mods, overlay, isGlobal, message, small, scroll, delay} = cfg;
        if (isGlobal !== undefined) {
            this.isGlobal = isGlobal;
        }
        if (message !== undefined) {
            this.message = message;
        }
        if (scroll !== undefined) {
            this.scroll = scroll;
        }
        if (small !== undefined) {
            this.small = small;
        }
        if (overlay !== undefined) {
            this.overlay = overlay;
        }
        if (mods !== undefined) {
            // todo сделать mods строкой всегда, или вообще удалить опцию
            if (Array.isArray(mods)) {
                this.mods = mods;
            } else if (typeof mods === 'string') {
                this.mods = [mods];
            }
        }
        this._delay = delay !== undefined ? delay : this._delay;

    }

    // Indicator is opened above existing popups.
    private _updateZIndex(config: ILoadingIndicatorConfig): void {
        // fixme: была вот такая строчка:
        //  const popupItem = ManagerController && ManagerController.find((config || {}).popupId);
        //  но в config мы никогда popupId не кладём
        //  -> popupItem никогда не было -> а _zIndex становился null всегда.
        //  поменял popupId -> id (d заполняется в _prepareConfig)
        const popupItem = ManagerController && ManagerController.find((config || {}).id);
        if (popupItem) {
            this._zIndex = popupItem.currentZIndex;
        } else {
            this._zIndex = null;
        }
    }

    private _showHandler(event: SyntheticEvent<Event>,
                         config: ILoadingIndicatorConfig,
                         waitPromise?: Promise<any>): number {
        event.stopPropagation();
        return this._show(config, waitPromise);
    }

    private _hideHandler(event: SyntheticEvent<Event>, id: number): void {
        event.stopPropagation();
        return this._hide(id);
    }

    /**
     * show indicator (bypassing requests of indicator showing stack)
     */
    show(config: ILoadingIndicatorConfig, waitPromise?: Promise<any>): number {
        return this._show(config, waitPromise);
    }

    _show(config: ILoadingIndicatorConfig, waitPromise?: Promise<any>): number {
        const newCfg = this._prepareConfig(config, waitPromise);
        const isOpened = this._getItemIndex(newCfg.id) > -1;
        if (isOpened) {
            this._replaceItem(newCfg.id, newCfg);
        } else {
            this._stack.add(newCfg);
            this._toggleIndicator(true, newCfg);
        }
        return newCfg.id;
    }

    /**
     * hide indicator (bypassing requests of indicator showing stack)
     */
    hide(id?: number): void {
        if (!id) {

            // Used public api. In this case, hide the indicator immediately.
            this._clearStack();
            this._toggleIndicator(false, {});
        } else {
            this._hide(id);
        }
    }

    private _hide(id?: number): void {
        this._removeItem(id);
        if (this._stack.getCount()) {
            this._toggleIndicator(true, this._stack.at(this._stack.getCount() - 1), true);
        } else {
            this._toggleIndicator(false);
        }
    }

    private _clearStack(): void {
        this._stack.clear();
    }

    private _isOpened(config: ILoadingIndicatorConfig): boolean {
        // config is not required parameter. If config object is empty we should always create new Indicator
        // due to absence of ID field in config
        if (!config) {
            return false;
        }
        const index = this._getItemIndex(config.id);
        if (index < 0) {
            delete config.id;
        }
        return !!config.id;
    }

    private _waitPromiseHandler(config: ILoadingIndicatorConfig): void {
        if (this._isOpened(config)) {
            this._hide(config.id);
        }
    }

    private _prepareConfig(config: ILoadingIndicatorConfig, waitPromise?: Promise<any>): ILoadingIndicatorConfig {
        if (typeof config !== 'object') {
            config = {
                message: config
            };
        }
        if (!config.hasOwnProperty('overlay')) {
            config.overlay = 'default';
        }
        if (!config.id) {
            // fixme: работает, но неправильно сигнатура у хелпера описана
            //  https://online.sbis.ru/opendoc.html?guid=a80ceb09-6af7-4740-b9cf-0395956972a8
            // @ts-ignore
            config.id = randomId();
        }
        if (!config.hasOwnProperty('delay')) {
            config.delay = this._delay;
        }

        if (!config.waitPromise && waitPromise) {
            config.waitPromise = waitPromise;
            config.waitPromise.then(this._waitPromiseHandler.bind(this, config));
            config.waitPromise.catch(this._waitPromiseHandler.bind(this, config));
        }
        return config;
    }

    private _removeItem(id): void {
        const index = this._getItemIndex(id);
        if (index > -1) {
            this._stack.removeAt(index);
        }
    }

    private _replaceItem(id: number, config: ILoadingIndicatorConfig): void {
        this._removeItem(id);
        this._stack.add(config);
    }

    private _getItemIndex(id: number): number {
        return this._stack.getIndexByValue('id', id);
    }

    private _getDelay(config: ILoadingIndicatorConfig): number {
        return typeof config.delay === 'number' ? config.delay : this._delay;
    }

    private _getOverlay(overlay: string): string {
        // if overlay is visible, but message don't visible, then overlay must be transparent.
        if (this._isOverlayVisible && !this._isMessageVisible) {
            return 'default';
        }
        return overlay;
    }

    private _toggleIndicator(visible: boolean, config?: ILoadingIndicatorConfig, force?: boolean): void {
        clearTimeout(this._delayTimeout);
        this._updateZIndex(config);
        if (visible) {
            this._toggleOverlayAsync(true, config);
            if (force) {
                this._toggleIndicatorVisible(true, config);
            } else {
                // if we have indicator in stack, then don't hide overlay
                this._toggleIndicatorVisible(this._stack.getCount() > 1 && this._isOverlayVisible, config);
                this._delayTimeout = <any> setTimeout(() => {
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
    }

    private _toggleOverlayAsync(toggle: boolean, config: ILoadingIndicatorConfig): void {
        // контролы, которые при ховере показывают окно, теряют свой ховер при показе оверлея,
        // что влечет за собой вызов обработчиков на mouseout + визуально дергается ховер таргета.
        // Делаю небольшую задержку, если окно не имеет в себе асинхронного кода, то оно успеет показаться раньше
        // чем покажется оверлей. Актуально для инфобокса, превьюера и выпадающего списка.
        // Увеличил до 100мс, за меньшее время не во всех браузерах успевает отрсиоваться окно даже без асинхронных фаз
        this._clearOverlayTimerId();
        const delay = Math.min(this._getDelay(config), 100);
        // ts из ноды считает что будет NodeJS.Timeout, но мы то знаем что будет number в браузере :)
        this._toggleOverlayTimerId = <any> setTimeout(() => {
            this._toggleOverlay(toggle, config);
        }, delay);
    }

    private _toggleOverlay(toggle: boolean, config: ILoadingIndicatorConfig): void {
        this._isOverlayVisible = toggle && config.overlay !== 'none';
        this._forceUpdate();
    }

    private _clearOverlayTimerId(): void {
        if (this._toggleOverlayTimerId) {
            clearTimeout(this._toggleOverlayTimerId);
        }
    }

    private _toggleIndicatorVisible(toggle: boolean, config?: object): void {
        if (toggle) {
            this._clearOverlayTimerId();
            this._isMessageVisible = true;
            this._isOverlayVisible = true;
            this._updateProperties(config);
        } else {
            this._isMessageVisible = false;
        }
    }
}
