import {Control, IControlOptions, TemplateFunction} from 'UI/Base';
import template = require('wml!Controls/_form/PrimaryAction/PrimaryAction');
import {Model, Record} from 'Types/entity';
import * as cInstance from 'Core/core-instance';
import * as Deferred from "Core/Deferred";

/**
 * Контроллер реализующий функциональность редактирования записи.
 * @remark
 * Для того, чтобы дочерние контролы могли отреагировать на начало сохранения, либо уничтожения контрола, им необходимо зарегистрировать соответствующие обработчики.
 * Обработчики регистрируются через событие registerFormOperation, в аргументах которого ожидается объект с полями
 *
 * * save:Function - вызов происходит перед началом сохранения
 * * cancel:Function - вызов происходит перед показом вопроса о сохранении
 * * isDestroyed:Function - функция, которая сообщает о том, не разрушился ли контрол, зарегистрировавший операцию.
 * В случае, если он будет разрушен - операция автоматически удалится из списка зарегистрированных
 *
 * @class Controls/_form/ControllerBase
 * @extends UI/Base:Control
 * @mixes Controls/_interface/ISource
 * @mixes Controls/_form/interface/IFormController
 * @implements Controls/_interface/IErrorController
 * @public
 * @author Красильников А.С.
 *
 * @demo Controls-demo/Popup/Edit/Opener
 */
export default class ControllerBase extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
    private _pendingPromise: Promise<any>;
    protected _record: Record;

    protected _beforeMount(options?: IControlOptions): void {

    }

    protected _afterMount(): void {
        this._createChangeRecordPending();
    }

    protected _setRecord(record: Model): void {
        if (!record || this._checkRecordType(record)) {
            this._record = record;
        }
    }

    private _checkRecordType(record: Model): boolean {
        return cInstance.instanceOfModule(record, 'Types/entity:Record');
    }

    private _createChangeRecordPending(): void {
        const self = this;
        self._pendingPromise = new Deferred();
        self._notify('registerPending', [self._pendingPromise, {
            showLoadingIndicator: false,
            validate(): boolean {
                return self._needShowConfirmation();
            },
            onPendingFail(forceFinishValue: boolean, deferred: Promise<boolean>): void {
                self._startFormOperations('cancel').then(() => {
                    self._showConfirmDialog(deferred, forceFinishValue);
                });
            }
        }], {bubbling: true});
    }
}
