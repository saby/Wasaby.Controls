
/**
 * Класс с помощью которого компонуем считывание размеров с фиксированных заголовков. Перед считыванием размеров,
 * сбрасываем position: sticky если это нужно. Затем производим измерения. Возвращаем position: sticky.
 * После этого мы можем синхронно применить изменния к дом дереву чтобы не было скачков.
 * Решеаем следующие проблемы.
 * 1. В таблицах может находиться несколько групп с заголовками. Каждая группа при инициализации определяет положение
 * ячеек относительно себя. В этот момент скрол контейнер может быть проскролен. По этому приходится сбрасывать
 * position: sticky. Получается, что сначала одна группа сбрасывает у себя sticky, затем считывает положение
 * ячеек, что приводит к лайауту. Затем возвращает sticky. Затем эти же действия делает другая группа. Что приводит
 * к еще одному лайату.
 * 2. Контроллер также производит свои вычисления, что приводит к третьему лайауту.
 * 3. В некоторых сценриях мы устанавливаем ситили сразу же в обход шаблнизации и жизненных циклов компоннетов чтобы
 * не было скачков.
 *
 * @class Controls/_scroll/StickyHeader/FastUpdate
 */
class FastUpdate {
    _measures: Function[] = [];
    _mutates: Function[] = [];
    _stickyContainersForReset: Element[] = [];

    _isInvalid: boolean = false;

    resetSticky(elements: Element[]): void {
        this._stickyContainersForReset =  this._stickyContainersForReset.concat(elements);
    }

    measure(fn: Function): void {
        this._measures.push(fn);
        return this._invalidateMutations();
    }

    mutate(fn: Function): void {
        this._mutates.push(fn);
        return this._invalidateMutations();
    }

    protected _invalidateMutations() {
        if (!this._isInvalid) {
            this._isInvalid = true;
            Promise.resolve().then(this._applyMutations.bind(this));
        }
    }

    protected _applyMutations() {
        this._resetSticky();
        this._runTasks(this._measures);
        this._restoreSticky();
        this._runTasks(this._mutates);
        this._isInvalid = false;
    }

    protected _runTasks(tasks: Function[]) {
        let task;
        // Надо иметь возможность добавлять задачи в момент выполнения выполнения других задач.
        while (task = tasks.shift()) {
            task();
        }
    }

    protected _resetSticky() {
        for (let container of this._stickyContainersForReset) {
            container.style.position = 'static';
        }
    }

    protected _restoreSticky() {
        for (let container of this._stickyContainersForReset) {
            container.style.position = '';
        }
        this._stickyContainersForReset = [];
    }
}

const fastUpdate = new FastUpdate();

export default fastUpdate