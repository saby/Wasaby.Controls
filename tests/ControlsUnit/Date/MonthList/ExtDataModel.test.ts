import {DataSet, QueryNavigationType} from 'Types/source';
import ExtDataModel from 'Controls/_calendar/MonthList/ExtDataModel';

describe('Controls/_calendar/MonthList/ExtDataModel', function() {
    let options;

    beforeEach(() => {
       options = {
           source: {
               query: sinon.fake()
           },
           viewMode: 'year'
       };
    });

    describe('invalidatePeriod', function() {
        it('should update data field', () => {
            let
                model,
                query;

            model = new ExtDataModel(options);
            model._data = {
                '2000-01-01': 'data 2000-01-01',
                '2001-01-01': 'data 2000-01-01',
                '2002-01-01': 'data 2000-01-01',
                '2003-01-01': 'data 2000-01-01',
                '2004-01-01': 'data 2000-01-01'
            };

            query = model.invalidatePeriod(
                new Date(2001, 0, 1), new Date(2003, 0, 1));

            assert.deepEqual(model._data, {
                '2000-01-01': 'data 2000-01-01',
                '2004-01-01': 'data 2000-01-01'
            });
        });
    });

    describe('getQuery', function() {
        [{
            caption: 'should return correct query object for viewMode: "month"',
            viewMode: 'month',
            start: new Date(2000, 0, 1),
            end: new Date(2000, 1, 1),
            where: '1999-12-01',
            limit: 2
        }, {
            caption: 'should return correct query object for viewMode: "year"',
            viewMode: 'year',
            start: new Date(2001, 0, 1),
            end: new Date(2002, 0, 1),
            where: '2000-12-01',
            limit: 24
        }].forEach((test) => {
            it(test.caption, () => {
                let
                    model,
                    query;

                options.viewMode = test.viewMode;
                model = new ExtDataModel(options);
                query = model._getQuery(test.start, test.end);

                assert.deepEqual(query._where, { 'id>=': test.where });
                assert.equal(query._limit, test.limit);
                assert.deepEqual(query._meta, { navigationType: QueryNavigationType.Position });
            });
        });
    });

    describe('_updateData', function() {
        [{
            caption: 'should update data object for viewMode: "month"',
            viewMode: 'month',
            rawData: [{
                id: '2019-01-01',
                extData: []
            }, {
                id: '2019-02-01',
                extData: []
            }],
            updatedData: {
                '2019-01-01': [],
                '2019-02-01': []
            }
        }, {
            caption: 'should update data object for viewMode: "year"',
            viewMode: 'year',
            rawData: [{
                id: '2019-01-01',
                extData: [1]
            }, {
                id: '2019-02-01',
                extData: [2]
            }, {
                id: '2019-03-01',
                extData: [3]
            }, {
                id: '2019-04-01',
                extData: [4]
            }, {
                id: '2019-05-01',
                extData: [5]
            }, {
                id: '2019-06-01',
                extData: [6]
            }, {
                id: '2019-07-01',
                extData: [7]
            }, {
                id: '2019-08-01',
                extData: [8]
            }, {
                id: '2019-09-01',
                extData: [9]
            }, {
                id: '2019-10-01',
                extData: [10]
            }, {
                id: '2019-11-01',
                extData: [11]
            }, {
                id: '2019-12-01',
                extData: [12]
            }],
            updatedData: {
                '2019-01-01': [[1], [2], [3], [4], [5], [6], [7], [8], [9], [10], [11], [12]]
            }
        }].forEach(function(test) {
            it(test.caption, function() {
                let
                    model,
                    dataSet = new DataSet({
                        rawData: { data: test.rawData },
                        itemsProperty: 'data',
                        keyProperty: 'id'
                    });
                options.viewMode = test.viewMode;
                model = new ExtDataModel(options);
                model._updateData(dataSet);
                assert.deepEqual(model._data, test.updatedData);
            });
         });
      });
});
