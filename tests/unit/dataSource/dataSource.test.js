define([
    'Controls/dataSource'
], function (dataSource) {
    describe('Controls/dataSource', function () {
        it('dataSource:error defined', function () {
            assert.isDefined(dataSource.error);
        });
        it('dataSource:parking defined', function () {
            assert.isDefined(dataSource.parking);
        });
    });
});
