import ILoadingIndicator, {ILoadingIndicatorOptions} from './interface/ILoadingIndicator';

export default {
    _setIndicator(indicator: ILoadingIndicator): void {
        this.mainIndicator = indicator;
    },
    show(config: ILoadingIndicatorOptions = {}, waitPromise?: Promise<unknown>): string {
        return this.mainIndicator?.show(config, waitPromise);
    },
    hide(id: string): void {
        if (id) {
            this.mainIndicator?.hide(id);
        }
    }
};
