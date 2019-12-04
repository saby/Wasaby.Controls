import { assert } from 'chai';

import { TileCollection } from 'Controls/display';
import { List } from 'Types/collection';

describe('Controls/_display/TileCollection', () => {
    let list = null;

    beforeEach(() => {
        list = new List({
            items: [1, 2, 3, 4]
        });
    });

    afterEach(() => {
        list.destroy();
        list = null;
    });

    it('.getTileMode()', () => {
        const collection = new TileCollection({
            collection: list,
            tileMode: 'myMode'
        });
        assert.strictEqual(collection.getTileMode(), 'myMode');
    });

    it('.getTileHeight()', () => {
        const collection = new TileCollection({
            collection: list,
            tileHeight: 123
        });
        assert.strictEqual(collection.getTileHeight(), 123);
    });

    it('.getTileWidth()', () => {
        const collection = new TileCollection({ collection: list });
        // This returns a constant, so we just check if the method exists
        collection.getTileWidth();
    });

    it('.getImageProperty()', () => {
        const collection = new TileCollection({
            collection: list,
            imageProperty: 'myImageProperty'
        });
        assert.strictEqual(collection.getImageProperty(), 'myImageProperty');
    });

    it('.getTileScalingMode()', () => {
        const collection = new TileCollection({
            collection: list,
            tileScalingMode: 'myScalingMode'
        });
        assert.strictEqual(collection.getTileScalingMode(), 'myScalingMode');
    });

    it('.getCompressionCoefficient()', () => {
        const collection = new TileCollection({ collection: list });
        // This returns a constant, so we just check if the method exists
        collection.getCompressionCoefficient();
    });

    it('.getShadowVisibility()', () => {
        const collection = new TileCollection({ collection: list });
        // This returns a constant, so we just check if the method exists
        collection.getShadowVisibility();
    });

    describe('.getZoomCoefficient()', () => {
        it('none and overlap scaling modes have no zoom', () => {
            const noneCollection = new TileCollection({
                collection: list,
                tileScalingMode: 'none'
            });
            assert.strictEqual(noneCollection.getZoomCoefficient(), 1, 'none collection should have no zoom');

            const overlapCollection = new TileCollection({
                collection: list,
                tileScalingMode: 'overlap'
            });
            assert.strictEqual(overlapCollection.getZoomCoefficient(), 1, 'overlap collection should have no zoom');
        });

        it('other scaling modes have zoom', () => {
            const otherCollection = new TileCollection({
                collection: list,
                tileScalingMode: 'other'
            });
            assert.isAbove(otherCollection.getZoomCoefficient(), 1);
        });
    });

    describe('.getItemContainerPositionInDocument()', () => {
        let collection;

        beforeEach(() => {
            collection = new TileCollection({ collection: list });
        });

        it('complete fit', () => {
            const targetItemPosition = {
                left: 10,
                right: 10,
                top: 10,
                bottom: 10
            };
            const viewContainerRect = {
                left: 10,
                top: 10,
                right: 40,
                bottom: 40
            };
            const documentRect = {
                width: 50,
                height: 50
            };

            const position = collection.getItemContainerPositionInDocument(
                targetItemPosition, viewContainerRect, documentRect
            );
            assert.deepEqual(position, { left: 20, right: 20, top: 20, bottom: 20 });
        });

        it('complete fit (viewContainer === document)', () => {
            const targetItemPosition = {
                left: 10,
                right: 10,
                top: 10,
                bottom: 10
            };
            const viewContainerRect = {
                left: 0,
                top: 0,
                right: 30,
                bottom: 30
            };
            const documentRect = {
                width: 30,
                height: 30
            };

            const position = collection.getItemContainerPositionInDocument(
                targetItemPosition, viewContainerRect, documentRect
            );
            assert.deepEqual(position, { left: 10, right: 10, top: 10, bottom: 10 });
        });

        it('no fit', () => {
            const targetItemPosition = {
                left: 0,
                right: 0,
                top: 0,
                bottom: 0
            };
            const viewContainerRect = {
                left: 0,
                top: -20,
                right: 30,
                bottom: 10
            };
            const documentRect = {
                width: 30,
                height: 10
            };

            const position = collection.getItemContainerPositionInDocument(
                targetItemPosition, viewContainerRect, documentRect
            );
            assert.isNull(position);
        });
    });

    describe('.getItemContainerPosition()', () => {
        let collection;

        beforeEach(() => {
            collection = new TileCollection({
                collection: list,
                tileScalingMode: 'dynamic'
            });
        });

        it('no fit left and right', () => {
            const targetItemSize = {
                width: 60,
                height: 60
            };
            const itemRect = {
                left: 5,
                right: 45,
                top: 15,
                bottom: 55,
                width: 40,
                height: 40
            };
            const viewContainerRect = {
                width: 50,
                height: 70,
                left: 0,
                right: 0,
                top: 0,
                bottom: 0
            };

            const position = collection.getItemContainerPosition(
                targetItemSize, itemRect, viewContainerRect
            );
            assert.isNull(position);
        });

        it('no fit right and bottom', () => {
            const targetItemSize = {
                width: 60,
                height: 60
            };
            const itemRect = {
                left: 15,
                right: 55,
                top: 5,
                bottom: 45,
                width: 40,
                height: 40
            };
            const viewContainerRect = {
                width: 70,
                height: 50,
                left: 0,
                right: 0,
                top: 0,
                bottom: 0
            };

            const position = collection.getItemContainerPosition(
                targetItemSize, itemRect, viewContainerRect
            );
            assert.isNull(position);
        });

        it('no fit left and top', () => {
            const targetItemSize = {
                width: 60,
                height: 60
            };
            const itemRect = {
                left: 5,
                right: 45,
                top: 5,
                bottom: 45,
                width: 40,
                height: 40
            };
            const viewContainerRect = {
                width: 70,
                height: 70,
                left: 0,
                top: 0,
                right: 70,
                bottom: 70
            };

            const position = collection.getItemContainerPosition(
                targetItemSize, itemRect, viewContainerRect
            );
            assert.deepEqual(position, { left: 0, right: 10, top: 0, bottom: 10 });
        });

        it('no fit right and bottom', () => {
            const targetItemSize = {
                width: 60,
                height: 60
            };
            const itemRect = {
                left: 25,
                right: 65,
                top: 25,
                bottom: 65,
                width: 40,
                height: 40
            };
            const viewContainerRect = {
                width: 70,
                height: 70,
                left: 0,
                top: 0,
                right: 70,
                bottom: 70
            };

            const position = collection.getItemContainerPosition(
                targetItemSize, itemRect, viewContainerRect
            );
            assert.deepEqual(position, { left: 10, right: 0, top: 10, bottom: 0 });
        });

        it('complete fit', () => {
            const targetItemSize = {
                width: 60,
                height: 60
            };
            const itemRect = {
                left: 15,
                right: 55,
                top: 15,
                bottom: 55,
                width: 40,
                height: 40
            };
            const viewContainerRect = {
                width: 70,
                height: 70,
                left: 0,
                top: 0,
                right: 70,
                bottom: 70
            };

            const position = collection.getItemContainerPosition(
                targetItemSize, itemRect, viewContainerRect
            );
            assert.deepEqual(position, { left: 5, right: 5, top: 5, bottom: 5 });
        });

        it('size * zoom is less than target size', () => {
            const targetItemSize = {
                width: 60,
                height: 70
            };
            const itemRect = {
                left: 15,
                right: 55,
                top: 20,
                bottom: 60,
                width: 40,
                height: 40
            };
            const viewContainerRect = {
                width: 70,
                height: 80,
                left: 0,
                top: 0,
                right: 70,
                bottom: 80
            };

            const position = collection.getItemContainerPosition(
                targetItemSize, itemRect, viewContainerRect
            );
            assert.deepEqual(position, { left: 5, right: 5, top: 10, bottom: 0 });

            const noneCollection = new TileCollection({
                collection: list,
                tileScalingMode: 'none'
            });
            const noneTargetItemSize = {
                width: 40,
                height: 50
            };
            const noneItemRect = {
                left: 15,
                right: 55,
                top: 20,
                bottom: 60,
                width: 40,
                height: 40
            };
            const noneViewContainerRect = {
                width: 70,
                height: 80,
                left: 0,
                top: 0,
                right: 70,
                bottom: 80
            };

            const nonePosition = noneCollection.getItemContainerPosition(
                noneTargetItemSize, noneItemRect, noneViewContainerRect
            );
            assert.deepEqual(nonePosition, { left: 15, right: 15, top: 20, bottom: 10 });
        });
    });

    describe('.getItemContainerSize()', () => {
        let itemContainer, itemContent, imageWrapper;

        beforeEach(() => {
            imageWrapper = {
                style: {
                    height: '100px'
                },
                getBoundingClientRect() {
                    return {
                        height: parseFloat(this.style.height)
                    };
                }
            };

            itemContent = {
                style: {
                    width: '70px'
                },
                getBoundingClientRect() {
                    return {
                        width: parseFloat(this.style.width)
                    };
                },
                classList: {
                    add() {},
                    remove() {}
                }
            };

            itemContainer = {
                querySelector(selector: string) {
                    if (selector === '.controls-TileView__itemContent') {
                        return itemContent;
                    } else if (selector === '.controls-TileView__imageWrapper') {
                        return imageWrapper;
                    }
                }
            };
        });

        it('no tile scaling', () => {
            const collection = new TileCollection({
                collection: list,
                tileScalingMode: 'none'
            });

            itemContent.style.width = '100px';

            const itemContainerSize = collection.getItemContainerSize(itemContainer);
            assert.strictEqual(itemContainerSize.width, 100);
        });

        it('dynamic tile scaling', () => {
            const collection = new TileCollection({
                collection: list,
                tileMode: 'dynamic',
                tileScalingMode: 'outside'
            });

            itemContent.style.width = '100px';

            const itemContainerSize = collection.getItemContainerSize(itemContainer);
            assert.strictEqual(itemContainerSize.width, 100 * collection.getZoomCoefficient());
        });
    });
});
