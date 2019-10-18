import MonthsSource from 'Controls/_calendar/MonthList/MonthsSource';
import {Query} from 'Types/source';
import monthListUtils from 'Controls/_calendar/MonthList/Utils';

describe('Controls/_calendar/MonthList/MonthsSource', () => {

    describe('query', () => {
        const LIMIT = 2;
        [{
            options: { viewMode: 'month' },
            query: (new Query()).where({'id~': monthListUtils.dateToId(new Date(2019, 0))}),
            resp: [{
                id: monthListUtils.dateToId(new Date(2019, 0))
            }, {
                id: monthListUtils.dateToId(new Date(2019, 1))
            }]
        }, {
            options: { viewMode: 'month' },
            query: (new Query()).where({'id>=': monthListUtils.dateToId(new Date(2019, 0))}),
            resp: [{
                id: monthListUtils.dateToId(new Date(2019, 1))
            }, {
                id: monthListUtils.dateToId(new Date(2019, 2))
            }]
        }, {
            options: { viewMode: 'month' },
            query: (new Query()).where({'id<=': monthListUtils.dateToId(new Date(2019, 0))}),
            resp: [{
                id: monthListUtils.dateToId(new Date(2018, 10))
            }, {
                id: monthListUtils.dateToId(new Date(2018, 11))
            }]
        }, {
            options: {
                displayedRanges: [[new Date(2018, 0), new Date(2018, 11)]],
                viewMode: 'month'
            },
            query: (new Query()).where({'id~': monthListUtils.dateToId(new Date(2018, 11))}),
            resp: [{
                id: monthListUtils.dateToId(new Date(2018, 11))
            }]
        }, {
            options: {
                displayedRanges: [[new Date(2018, 0), new Date(2018, 11)]],
                viewMode: 'month'
            },
            query: (new Query()).where({'id>=': monthListUtils.dateToId(new Date(2018, 11))}),
            resp: []
        }, {
            options: {
                displayedRanges: [[new Date(2018, 0), new Date(2018, 11)]],
                viewMode: 'month'
            },
            query: (new Query()).where({'id<=': monthListUtils.dateToId(new Date(2018, 11))}),
            resp: [{
                id: monthListUtils.dateToId(new Date(2018, 9))
            }, {
                id: monthListUtils.dateToId(new Date(2018, 10))
            }]
        }, {
            options: {
                displayedRanges: [[new Date(2018, 0), new Date(2018, 11)]],
                viewMode: 'month'
            },
            query: (new Query()).where({'id~': monthListUtils.dateToId(new Date(2018, 0))}),
            resp: [{
                id: monthListUtils.dateToId(new Date(2018, 0))
            }, {
                id: monthListUtils.dateToId(new Date(2018, 1))
            }]
        }, {
            options: {
                displayedRanges: [[new Date(2018, 0), new Date(2018, 11)]],
                viewMode: 'month'
            },
            query: (new Query()).where({'id>=': monthListUtils.dateToId(new Date(2018, 0))}),
            resp: [{
                id: monthListUtils.dateToId(new Date(2018, 1))
            }, {
                id: monthListUtils.dateToId(new Date(2018, 2))
            }]
        }, {
            options: {
                displayedRanges: [[new Date(2018, 0), new Date(2018, 11)]],
                viewMode: 'month'
            },
            query: (new Query()).where({'id<=': monthListUtils.dateToId(new Date(2018, 0))}),
            resp: []
        }, {
            options: {
                displayedRanges: [
                    [new Date(2018, 0), new Date(2018, 6)],
                    [new Date(2019, 0), new Date(2019, 6)]
                ],
                viewMode: 'month'
            },
            limit: 3,
            query: (new Query()).where({'id~': monthListUtils.dateToId(new Date(2018, 6))}),
            resp: [{
                id: monthListUtils.dateToId(new Date(2018, 6))
            }, {
                id: monthListUtils.dateToId(new Date(2018, 7))
            }, {
                id: monthListUtils.dateToId(new Date(2019, 0))
            }]
        }, {
            options: {
                displayedRanges: [[new Date(2018, 0), new Date(2018, 6)]],
                viewMode: 'month'
            },
            query: (new Query()).where({'id~': monthListUtils.dateToId(new Date(2017, 6))}),
            resp: [{
                id: monthListUtils.dateToId(new Date(2018, 0))
            }]
        }, {
            options: {
                displayedRanges: [[null, new Date(2018, 11)]],
                viewMode: 'month'
            },
            query: (new Query()).where({'id~': monthListUtils.dateToId(new Date(2017, 10))}),
            resp: [{
                id: monthListUtils.dateToId(new Date(2017, 10))
            }, {
                id: monthListUtils.dateToId(new Date(2017, 11))
            }]
        }, {
            options: {
                displayedRanges: [[null, new Date(2018, 11)]],
                viewMode: 'month'
            },
            query: (new Query()).where({'id>=': monthListUtils.dateToId(new Date(2017, 10))}),
            resp: [{
                id: monthListUtils.dateToId(new Date(2017, 11))
            }, {
                id: monthListUtils.dateToId(new Date(2017, 12))
            }]
        }, {
            options: {
                displayedRanges: [[null, new Date(2018, 11)]],
                viewMode: 'month'
            },
            query: (new Query()).where({'id<=': monthListUtils.dateToId(new Date(2017, 10))}),
            resp: [{
                id: monthListUtils.dateToId(new Date(2017, 8))
            }, {
                id: monthListUtils.dateToId(new Date(2017, 9))
            }]
        }, {
            options: {
                displayedRanges: [[new Date(2019, 0), null]],
                viewMode: 'month'
            },
            query: (new Query()).where({'id~': monthListUtils.dateToId(new Date(2019, 6))}),
            resp: [{
                id: monthListUtils.dateToId(new Date(2019, 6))
            }, {
                id: monthListUtils.dateToId(new Date(2019, 7))
            }]
        }, {
            options: {
                displayedRanges: [[new Date(2019, 0), null]],
                viewMode: 'month'
            },
            query: (new Query()).where({'id>=': monthListUtils.dateToId(new Date(2019, 6))}),
            resp: [{
                id: monthListUtils.dateToId(new Date(2019, 7))
            }, {
                id: monthListUtils.dateToId(new Date(2019, 8))
            }]
        }, {
            options: {
                displayedRanges: [[new Date(2019, 0), null]],
                viewMode: 'month'
            },
            query: (new Query()).where({'id<=': monthListUtils.dateToId(new Date(2019, 6))}),
            resp: [{
                id: monthListUtils.dateToId(new Date(2019, 4))
            }, {
                id: monthListUtils.dateToId(new Date(2019, 5))
            }]
        }].forEach((test, i) => {
            it(`should return proper data ${i}`, () => {
                const source = new MonthsSource(test.options);

                return source.query(test.query.limit(test.limit || LIMIT)).then((resp) => {
                    resp = resp.getAll().getRawData();
                    assert.lengthOf(resp, test.resp.length);
                    resp.forEach((item, i) => {
                        assert.strictEqual(item.id, test.resp[i].id);
                    });
                });
            });
        });
    });

});
