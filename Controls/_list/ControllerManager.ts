
const libraries = {
    MarkerController: 'Controls/marker'
};

export default class ControllerManager<T> {
    private _controller: T;
    private _loadPromise: Promise<void>;
    private readonly _creatingFunction: (library: any, options: any) => T;

    constructor(createFunction: (library: any, options: any) => T) {
        this._creatingFunction = createFunction;
    }

    /**
     * Выполнить метод контроллера с обработкой его результата.
     * @remark
     * При первом вызове асинхронно загружается библиотека и создается контроллер,
     * все последующие вызовы выполняются синхронно
     * @param methodCall Колбэк который вызывает метод контроллера
     * @param resultHandler Колбэк который обрабатывает результат метода контроллера
     * @param options Опции для создания контроллера
     */
    execute(methodCall: (controller: T) => any, resultHandler?: (result: any) => void, options?: any): void {
        // если контроллер уже создан, то загружать библиотеку не надо => нет асинхронности
        if (this._controller) {
            const result = methodCall(this._controller);
            if (resultHandler) {
                resultHandler(result);
            }
        } else {
            // если промис уже есть, то просто добавляем колбэк
            if (this._loadPromise) {
                this._loadPromise.then(() => {
                    if (this._controller) {
                        const result = methodCall(this._controller);
                        if (resultHandler) {
                            resultHandler(result);
                        }
                    }
                });
            } else {
                // загружаем библиотеку, создаем контроллер и выполняем действие
                this._loadPromise = import(libraries.MarkerController).then((library) => {
                    this._controller = this._creatingFunction(library, options);

                    if (this._controller) {
                        const result = methodCall(this._controller);
                        if (resultHandler) {
                            resultHandler(result);
                        }
                    }
                });
            }
        }
    }

    /**
     * Был ли уже создан контроллер
     */
    hasController(): boolean {
        return !!this._controller;
    }

    getController(): T {
        return this._controller;
    }
}
