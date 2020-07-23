import * as Deferred from 'Core/Deferred';
import {Memory, Query, DataSet} from 'Types/source';

const SEARCH_DELAY = 35000;

interface IOptions {
    source: Memory;
}

export default class PortionedSearchSource {
    private source: Memory = null;
    protected _mixins: number[] = [];

    constructor(opts: IOptions) {
        this['[Types/_source/ICrud]'] = true;
        this.source = opts.source;
    }

    query(query: Query<unknown>): Promise<DataSet> {
        // tslint:disable-next-line
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
