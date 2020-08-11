
export interface IImageSize {
    width: number;
    height: number;
    unsetWidth: boolean;
}

const SCALE_PREVIEW_SIZE_MULTIPLIER = 1.5;
const NORMALIZE_IMAGE_COEFFICIENT = 1.10;
export const IMAGE_FIT = {
    COVER: 'cover',
    CONTAIN: 'contain'
};

export function getImageUrl(
    imageWidth: number,
    imageHeight: number,
    baseUrl: string,
    urlResolver?: (width?: number, height?: number, url?: string) => string
): string {
    if (urlResolver) {
        return urlResolver(imageWidth, imageHeight, baseUrl);
    } else {
        return `/previewer/r/${imageWidth}/${imageHeight}/${baseUrl}`;
    }
}

export function getImageSize(
        tileWidth: number,
        tileHeight: number,
        tileMode: 'static' | 'dynamic',
        imageHeight: number,
        imageWidth: number,
        imageFit: string
    ): IImageSize {
    let height = 0;
    let width = 0;
    let unsetWidth = true;
    if (imageFit === IMAGE_FIT.COVER && tileMode === 'static') {
        const tileWidthNumber = Number(tileWidth);
        const tileHeightNumber = Number(tileHeight);
        const imageHeightNumber = Number(imageHeight);
        const imageWidthNumber = Number(imageWidth);
        const tileDeltaW = tileWidthNumber / tileHeightNumber;
        const imageDeltaW = imageWidthNumber / imageHeightNumber;
        const scaledTileDeltaW = tileDeltaW * SCALE_PREVIEW_SIZE_MULTIPLIER;
        const scaledImageDeltaW = imageDeltaW * SCALE_PREVIEW_SIZE_MULTIPLIER;

        if (imageHeightNumber) {
            if (imageDeltaW > tileDeltaW && imageDeltaW < scaledTileDeltaW) {
                height = imageHeightNumber * NORMALIZE_IMAGE_COEFFICIENT;
                width = 0;
            } else if (tileDeltaW < scaledImageDeltaW) {
                height = 0;
                width = tileWidthNumber * SCALE_PREVIEW_SIZE_MULTIPLIER;
                unsetWidth = imageDeltaW > tileDeltaW;
            } else if (imageDeltaW < scaledTileDeltaW) {
                height = tileHeightNumber * SCALE_PREVIEW_SIZE_MULTIPLIER;
                width = 0;
            } else {
                height = imageHeightNumber * NORMALIZE_IMAGE_COEFFICIENT;
                width = 0;
            }
        }
    } else {
        height = imageHeight || tileHeight;
        width = imageWidth || tileWidth;
    }

    return {
        height,
        width,
        unsetWidth
    };
}
