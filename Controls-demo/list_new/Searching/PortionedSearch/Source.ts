import * as Deferred from 'Core/Deferred';
import {Memory, Query, DataSet} from 'Types/source';

const SEARCH_DELAY = 35000;

export default class PortionedSearchSource {
    private source: Memory = null;
    protected _mixins: any[] = [];

    constructor(opts) {
        this['[Types/_source/ICrud]'] = true;
        this.source = opts.source;
    }

    query(query: Query<unknown>): Promise<DataSet> {
        const isSearch = query.getWhere().title !== undefined && (query.getOffset() === 10 || query.getOffset() === 30);
        const origQuery = this.source.query.apply(this.source, arguments);
        const loadDef = new Deferred();
        const delayTimer = isSearch ? SEARCH_DELAY : 0;

        setTimeout(() => {
            if (!loadDef.isReady()) {
                loadDef.callback();
            }
        }, delayTimer);
        loadDef.addCallback(() => {
            return origQuery;
        });
        return loadDef;
    }
}
