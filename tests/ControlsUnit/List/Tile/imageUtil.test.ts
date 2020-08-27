import {assert} from 'chai';
import {getImageClasses, getImageUrl, getImageSize, IMAGE_FIT} from 'Controls/_tile/TileView/resources/imageUtil';

describe('tileImageUtil', () => {
    describe('getImageClasses', () => {
        assert.strictEqual(getImageClasses(IMAGE_FIT.CONTAIN), 'controls-TileView__image-contain');
        assert.strictEqual(getImageClasses(IMAGE_FIT.COVER), '');
    });
    describe('getImageUrl', () => {
        const imageUrlResolver = () => 'resolvedUrl';
        const baseUrl = '/online.sbis.ru/doc';
        const defaultPrefix = '/previewer/r/';
        let defaultUrl = getImageUrl(0, 100, baseUrl);
        assert.strictEqual(defaultUrl, `${defaultPrefix}100/${baseUrl}`);

        defaultUrl = getImageUrl(100, 0, baseUrl);
        assert.strictEqual(defaultUrl, `${defaultPrefix}100/${baseUrl}`);

        defaultUrl = getImageUrl(100, 100, baseUrl);
        assert.strictEqual(defaultUrl, `${defaultPrefix}100/100/${baseUrl}`);

        defaultUrl = getImageUrl(100, 0, baseUrl, imageUrlResolver);
        assert.strictEqual(defaultUrl, 'resolvedUrl');
    });
    describe('getImageSize', () => {
        describe('cover image fit', () => {
            it('proportional image must be require with scale width by 1.5', () => {
                const proportionalImage = getImageSize(200, 200, 'static', 25, 25, 'cover');
                assert.isTrue(proportionalImage.height === 0);
                assert.isTrue(proportionalImage.width === 300);
            });

            it('wide image', () => {
                const imageSizesWide = getImageSize(200, 300, 'static', 400, 2500, 'cover');
                assert.isTrue(imageSizesWide.height === 0);
                assert.isTrue(imageSizesWide.width === 300);
            });
            it('tall image', () => {
                const imageSizesTall = getImageSize(200, 300, 'static', 4000, 350, 'cover');
                assert.isTrue(imageSizesTall.width === 0);
                assert.isTrue(imageSizesTall.height === 450);
            });
        });
        describe('none and contain image fit', () => {
            it('returns image original sizes', () => {
                const imageSizesTall = getImageSize(200, 300, 'static', 1, 1, 'contain');
                assert.isTrue(imageSizesTall.width === 1);
                assert.isTrue(imageSizesTall.height === 1);

                const imageSizesTall = getImageSize(200, 300, 'static', 1, 1, 'none');
                assert.isTrue(imageSizesTall.width === 1);
                assert.isTrue(imageSizesTall.height === 1);
            });
        })
    });
});
