/**
 * Created by as.krasilnikov on 21.09.2018.
 */
/**
 * Модуль возвращает набор методов, с помощью которых можно добавить/удалить/обновить запись в рекордсете,
 * при этом запись может не совпадать по формату с рекордсетом, в который она добавляется.
 * @class Controls/Utils/RecordSynchronizer
 * @public
 * @author Красильников А.С.
 */

/**
 * @typedef {Object} additionalData
 * @description Дополнительные данные для добавления записи в рекордсет
 * @property {String} key Ключ записи, которая добавится в рекордсет. По умолчанию значение берется с записи editRecord.
 * @property {Number} at Позиция, в которую добавляется запись.
 */

import {Record, Model} from 'Types/entity';
import {RecordSet} from 'Types/collection';
import Di = require('Types/di');

interface IAdditionalData {
    at?: number;
    key?: string;
}

const _private = {
    createRecord(editRecord: Model, items: RecordSet, additionalData: IAdditionalData): Model {
        let syncRecord: Model;

        syncRecord = Di.create(items.getModel(), {
            adapter: items.getAdapter(),
            format: items.getFormat(),
            idProperty: items.getIdProperty()
        });

        const changedValues: object = _private.getChangedValues(syncRecord, editRecord);
        _private.setRecordValues(syncRecord, changedValues);

        const key: string = additionalData.key || editRecord.getId();
        syncRecord.set(items.getIdProperty(), key);
        return syncRecord;
    },

    getSyncRecord(items: RecordSet, editKey: string): Model {
        const index: number = items.getIndexByValue(items.getIdProperty(), editKey);
        return items.at(index);
    },
    getChangedValues(syncRecord: Model, editRecord: Model): object {
        const newValues: object = {};
        let recValue;

        Record.prototype.each.call(syncRecord, (key, value) => {
            if (editRecord.has(key)) {
                recValue = editRecord.get(key);

                if (recValue !== value && key !== editRecord.getIdProperty()) {
                    // clone the model, flags, etc because
                    // when they lose touch with the current record, the edit can still continue.
                    if (recValue && (typeof recValue.clone === 'function')) {
                        recValue = recValue.clone();
                    }
                    newValues[key] = recValue;
                }
            }
        });

        return newValues;
    },
    setRecordValues(record: Model, values: object): void {
        // The property may not have a setter
        try {
            record.set(values);
        } catch (e) {
            if (!(e instanceof ReferenceError)) {
                throw e;
            }
        }
    },
    addRecord(editRecord: Model, additionalData: IAdditionalData, items: RecordSet): void {
        const newRecord: Model = _private.createRecord(editRecord, items, additionalData || {});
        let at = additionalData.at || 0;

        if (at > items.getCount()) {
            at = items.getCount();
        }

        items.add(newRecord, at);
    },
    mergeRecord(editRecord: Model, items: RecordSet, editKey: string): void {
        const syncRecord = _private.getSyncRecord(items, editKey);
        if (syncRecord) {
            const changedValues = _private.getChangedValues(syncRecord, editRecord);
            _private.setRecordValues(syncRecord, changedValues);
        }

    },
    deleteRecord(items: RecordSet, editKey: string): void {
        const syncRecord = _private.getSyncRecord(items, editKey);
        items.remove(syncRecord);
    }
};

const RecordSynchronizer = {

    /**
     * Добавляет запись в рекордсет
     * @function Controls/Utils/RecordSynchronizer#addRecord
     * @param {Model|Array} editRecord Запись, которую нужно добавить в рекордсет. Можно передать так же массив записей.
     * @param {additionalData} additionalData Дополнительные данные, которые могут потребоваться для добавления.
     * @param {RecordSet} items Рекордсет, в которые добавляется запись
     */
    addRecord(editRecord: Model, additionalData: IAdditionalData, items: RecordSet): void {
        additionalData = additionalData || {};
        if (editRecord instanceof Array) {
            items.setEventRaising(false, true);
            for (let i = editRecord.length - 1; i > -1; i--) {
                additionalData.key = null;
                _private.addRecord(editRecord[i], additionalData, items);
            }
            items.setEventRaising(true, true);
        } else {
            _private.addRecord(editRecord, additionalData, items);
        }
    },

    /**
     * Обновляет запись в рекордсете
     * @function Controls/Utils/RecordSynchronizer#mergeRecord
     * @param {Model|Array} editRecord Запись, из которой берутся данные для обновления записи в рекордсете
     * Можно передать так же массив записей.
     * @param {RecordSet} items Рекордсет, в котором обновляется запись
     * @param {String} editKey Ключ обновляемой записи в рекордсете.
     */
    mergeRecord(editRecord: Model, items: RecordSet, editKey: string): void {
        if (editRecord instanceof Array) {
            items.setEventRaising(false, true);
            for (let i = 0; i < editRecord.length; i++) {
                _private.mergeRecord(editRecord[i], items, editRecord[i].getId());
            }
            items.setEventRaising(true, true);
        } else {
            _private.mergeRecord(editRecord, items, editKey);
        }
    },

    /**
     * Удаляет запись из рекордсета
     * @function Controls/Utils/RecordSynchronizer#deleteRecord
     * @param {RecordSet} items Рекордсет, в котором удаляется запись
     * @param {String|Array} editKey Ключ удаляемой записи в рекордсете. Можно передать так же массив ключей.
     */
    deleteRecord(items: RecordSet, editKey: string): void {
        if (editKey instanceof Array) {
            items.setEventRaising(false, true);
            for (let i = 0; i < editKey.length; i++) {
                _private.deleteRecord(items, editKey[i]);
            }
            items.setEventRaising(true, true);
        } else {
            _private.deleteRecord(items, editKey);
        }
    }
};

export = RecordSynchronizer;
