import { assert } from 'chai';
import { GridHeader, GridHeaderRow } from 'Controls/display';

describe('Controls/_display/GridHeader', () => {

    describe('.isSticked()', () => {
        const getOwnerMock = (isStickyHeader, isFullGridSupport) => ({
            isStickyHeader: () => isStickyHeader,
            isFullGridSupport: () => isFullGridSupport
        });

        it('should sticky header if options.stickyHeader === true in full grid support browsers', function () {
            const header = new GridHeader({
                owner: getOwnerMock(true, true),
                header: [{}, {}, {}]
            });
            assert.isTrue(header.isSticked());
        });

        it('should not sticky header if options.stickyHeader === false in full grid support browsers', function () {
            const header = new GridHeader({
                owner: getOwnerMock(false, true),
                header: [{}, {}, {}]
            });
            assert.isFalse(header.isSticked());
        });

        it('should not sticky header in browsers without grid support', function () {
            const header = new GridHeader({
                owner: getOwnerMock(true, false),
                header: [{}, {}, {}]
            });
            assert.isFalse(header.isSticked());
        });
    });

    describe('.isMultiline()', () => {
        it('should returns false for solo row header', function () {
            const header = new GridHeader({
                owner: {},
                header: [{}, {}, {}]
            });
            assert.isFalse(header.isMultiline());
        });
    });

    describe('.getRow()', () => {
        const getOwnerMock = () => ({
            isFullGridSupport: () => true
        });

        it('should returns GridHeaderRow', function () {
            const header = new GridHeader({
                owner: getOwnerMock(),
                header: [{}, {}, {}]
            });
            const row = header.getRow();
            assert.instanceOf(row, GridHeaderRow);
        });
    });

    describe('.getRows()', () => {
        const getOwnerMock = () => ({
            isFullGridSupport: () => true
        });

        it('should returns GridHeaderRow', function () {
            const header = new GridHeader({
                owner: getOwnerMock(),
                header: [{}, {}, {}]
            });
            const row = header.getRows();
            assert.instanceOf(row, Array);
            assert.instanceOf(row[0], GridHeaderRow);
        });
    });
});
