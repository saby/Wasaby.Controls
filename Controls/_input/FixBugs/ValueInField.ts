/**
 * Класс для поддержки корректной работы контрола ввода и синхронизатора.
 * Проблема: Обработка пользовательского ввода происходит по событию input. В этот момент введенное значение
 * уже отрисовано браузером. Это значение может быть изменено в зависимости от логики работы контрола.
 * Чтобы не было морганий из-за синхронизации VDOM, значение меняется напрямую через свойство value на <input/>.
 * Поэтому работа синхронизатора не требуется. Иначе из-за асинхронности, если во время обновления произойдет
 * обработка ввода, то её результат будет удален синхронизатором после завершения обновления.
 * Решение: меняем состояние только при инициализации, и смене режима на редактирование.
 *
 * TODO: inferno может обновить значение по состоянию, когда оно не менялось.
 * Из-за того, что там находится не актуальное значение, в поле вставляется неверное значение.
 * Является ли это корректным будет разобрано по  https://online.sbis.ru/opendoc.html?guid=e66b36f1-d530-4e4b-9f0b-8674f777c1fd\
 * Сценарий: https://online.sbis.ru/opendoc.html?guid=cc98f941-82db-426e-a3bd-503c9d8c2dc7
 * Решение: если контрол строится/перестраивается, то возвращаем состояние, иначе значение с <input/>.
 */
export class ValueInField {
    private _fieldValue: string | null = null;

    beforeMount(initValue: string): void {
        this._fieldValue = initValue;
    }

    afterMount(): void {
        this._fieldValue = null;
    }

    beforeUpdate(oldReadOnly: boolean, newReadOnly: boolean, value: string): void {
        if (oldReadOnly === true && newReadOnly === false) {
            this._fieldValue = value;
        }
    }

    afterUpdate(): void {
        this._fieldValue = null;
    }

    detectFieldValue(field: HTMLInputElement): string {
        if (field && this._fieldValue === null) {
            return  field.value;
        }

        return this._fieldValue;
    }
}
