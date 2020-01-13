import {assert} from 'chai';

import {QueryNavigationType, Query} from 'Types/source';

import {QueryParamsBuilder} from 'Controls/_source/NavigationController';
import {IAdditionalQueryParams} from 'Controls/_source/interface/IAdditionalQueryParams';

describe('Controls/_source/NavigationController:QueryParamsBuilder', () => {
    let builder1: QueryParamsBuilder;
    let builder2: QueryParamsBuilder;
    let b1raw: IAdditionalQueryParams;
    let b2raw: IAdditionalQueryParams;

    beforeEach(() => {
        builder1 = new QueryParamsBuilder({
            filter: {
                'field<=': 2,
                'id<=': 1
            },
            limit: 50,
            meta: {
                navigationType: QueryNavigationType.Position
            }
        });
        builder2 = new QueryParamsBuilder({
            limit: 4,
            offset: 4,
            meta: {
                navigationType: QueryNavigationType.Page
            }
        });
        b1raw = builder1.raw();
        b2raw = builder2.raw();
    });
    describe('merge', () => {
        it('should merge params inside query builder correctly', () => {
            const result = builder1.merge(builder2.raw()).raw();
            assert.notEqual(result.filter, b1raw.filter, 'filters should not be copied');
            assert.equal(result.filter['id<='], b1raw.filter['id<='], 'filters should be merged');
            assert.equal(result.limit, b2raw.limit, '"limit" property should be copied');
            assert.equal(result.meta, b2raw.meta, '"meta" property should be copied');
            assert.equal(result.offset, b2raw.offset, '"offset" property should be copied');
        });
    });
    describe('build', () => {
        it('should build builder params into the correct Query object', () => {
            const result = builder1.merge(builder2.raw()).build();
            assert.instanceOf(result, Query, 'result of builder.build() should be a Types/source:Query instance');
        });
    });
});
