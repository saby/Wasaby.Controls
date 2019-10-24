import {RecordSet} from 'Types/collection';
import {Record} from 'Types/entity';

export interface IMoreOptions {
    moreMeta?: MoreRecordSet | unknown;
}

type MoreRecord = Record<{
    id: string|number,
    navResult: unknown
}>;
type MoreRecordSet = RecordSet<MoreRecord>;

class More {
    protected more: MoreRecordSet = null;

    constructor(options?: IMoreOptions = {}) {
        this.more = this.resolveMore(options.moreMeta);
    }

    private resolveMore(moreMeta?: unknown): MoreRecordSet {
        let moreResult;

        if (moreMeta !== undefined) {
            if (moreMeta.each) {
                moreResult = moreMeta;
            } else {
                moreResult = new RecordSet({
                    keyProperty: 'id',
                    rawData: [{
                        id: null,
                        nav_result: moreMeta
                    }]
                });
            }
        }

        return moreResult;
    }

    getMoreMeta(key?: string|number): unknown {
        let moreResult: unknown;
        let moreIndex: Number;

        if (this.more) {
            if (key !== undefined) {
                moreIndex = this.more.getIndexByValue('id', key);
            } else {
                moreIndex = 0;
            }

            if (moreIndex !== -1) {
                moreResult = this.more.at(moreIndex).get('nav_result');
            }
        }

        return moreResult;
    }

    setMoreMeta(moreMeta: MoreRecordSet|unknown): void {
        this.more = this.resolveMore(moreMeta);
    }
}

export default More;
