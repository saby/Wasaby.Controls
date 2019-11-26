import * as Deferred from 'Core/Deferred';
import {Memory} from 'Types/source';

const SEARCH_DELAY = 15000;

export default class PortionedSearchSource {
    private source: Memory = null;

    constructor(opts) {
        this.source = opts.source;
    }

    query(query) {
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

    static '[Types/_source/ICrud]': boolean = true;
}