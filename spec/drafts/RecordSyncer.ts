import Deferred = require('Core/Deferred');
import Record = require('js!WS.Data/Entity/Record');
import ISource = require('js!WS.Data/Source/ISource');
import SbisService = require('js!WS.Data/Source/SbisService');


class ScrollControl {
    constructor() {

    }
}

class FormController implements IRecordsSync {
    constructor(source: ISource) {
    }
    syncRecords(recordState) {}
    subscribe(event: 'recordschange', fn: (recordState) => void) {}
}

class OpenDialog {
    constructor(source: ISource) {
    }

    execute(record) {
    };

    subscribe(evt: 'save', fn: (record: Record) => {}) {
    }
}

class ListController implements IRecordsSync {
    constructor(source: ISource,
                scroll?: ScrollControl,
                action?: ActionContainer) {

    }

    subscribe(evt: 'itemclick', fn: (record: Record) => {}) {
    }
    subscribe(event: 'recordschange', fn: (recordState) => void) {}
    syncRecords(recordState) {}
}

interface IRecordState {
    record: Record
    state: 'updated' | 'created' | 'deleted' | 'moved'
}

interface IRecordsSync {
    syncRecords(recordState)
    subscribe(event: 'recordschange', fn: (recordState) => void);
}

let source1: SbisService;
let source2: SbisService;
let recordState: IRecordState;
let form = new FormController(source1);
let dialog = new OpenDialog(form);
let lc = new ListController(source2);
lc.subscribe('itemclick', (record) => {
    dialog.execute(record);
});

class RecordSyncer {
    private controls: Array<IRecordsSync>;
    private strategy: (rs: IRecordState) => IRecordState;
    constructor(...args) {
        this.controls = args;
    }

    setStrategy(strategy: (rs: IRecordState) => IRecordState) {
        this.strategy = strategy;
    }

    private middleware() {
        for (let cntrl of this.controls) {
            cntrl.subscribe('recordschange', function (recordState) {
                this.notifyByControl(this, this.strategy(recordState));
            });
        }
    }

    private notifyByControl(from: IRecordsSync, recordState: IRecordState) {
        for (let cntrl of this.controls) {
            if (cntrl === from) {
                continue;
            }
            cntrl.syncRecords(recordState);
        }
    }
}
new RecordSyncer([form, lc]);