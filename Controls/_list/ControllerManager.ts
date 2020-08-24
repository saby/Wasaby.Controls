
const libraries = {
    MarkerController: 'Controls/marker'
};

export default class ControllerManager<T> {
    private _controller: T;
    // промис загрузки библиотеки, чтобы не вызвалась загрузка 2 раза, например если быстро нажать на чекбокс
    private _loadPromise: Promise<void>;
    // функция создания контроллера
    private readonly _creatingFunction: () => T;

    constructor(createFunction: () => T) {
        this._creatingFunction = createFunction;
    }

    execute(methodCall: (controller: T) => any, resultHandler?: (result: any) => void): void {
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
                    const result = methodCall(this._controller);
                    if (resultHandler) {
                        resultHandler(result);
                    }
                });
            } else {
                // загружаем библиотеку, создаем контроллер и выполняем действие
                this._loadPromise = import(libraries.MarkerController).then((library) => {
                    this._controller = this._creatingFunction();

                    const result = methodCall(this._controller);
                    resultHandler(result);
                });
            }
        }
    }
}
