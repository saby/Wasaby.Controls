import {Model} from 'Types/entity';

export interface IImageSize {
    width: number;
    height: number;
}

export interface IImageRestrictions {
    width?: boolean,
    height?: boolean
}

const DEFAULT_SCALE_COEFFICIENT = 1.5;

export const IMAGE_FIT = {
    COVER: 'cover',
    CONTAIN: 'contain',
    NONE: 'none'
};

export function getImageUrl(
    imageWidth: number,
    imageHeight: number,
    baseUrl: string,
    item: Model,
    urlResolver?: (width?: number, height?: number, url?: string, item?: Model) => string
): string {
    if (urlResolver) {
        return urlResolver(imageWidth, imageHeight, baseUrl, item);
    } else {
        return `/previewer/c${imageWidth ? '/' + imageWidth : ''}${imageHeight ? '/' + imageHeight : ''}${baseUrl}`;
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
    let width = imageWidth;
    let height = imageHeight;
    if (imageFit !== IMAGE_FIT.NONE && imageWidth && imageHeight) {
        if (imageHeight <= tileHeight && imageWidth <= tileWidth) {
            height = imageHeight;
            width = imageWidth;
        } else if (imageWidth > tileWidth && imageHeight > tileHeight) {
            height = tileHeight * DEFAULT_SCALE_COEFFICIENT;
            width = tileWidth * DEFAULT_SCALE_COEFFICIENT;
        } else if (imageWidth < tileWidth && imageHeight > tileHeight) {
            height = tileHeight * DEFAULT_SCALE_COEFFICIENT;
            width = 0;
        } else {
            height = 0;
            width = tileWidth * DEFAULT_SCALE_COEFFICIENT;
        }
    } else {
        height = tileHeight;
        width = tileWidth;
    }
    return {
        height,
        width
    };
}

export function getImageClasses(imageFit: 'contain' | 'cover', imageRestrictions: IImageRestrictions = {}): string {
    let result = '';
    if (imageFit === IMAGE_FIT.CONTAIN) {
        result = 'controls-TileView__image-contain';
    }
    if (imageRestrictions.height) {
        result += ' controls-TileView__image_fullHeight';
    }
    if (imageRestrictions.width) {
        result += ' controls-TileView__image_fullWidth';
    }
    return result;
}

export function getImageRestrictions(
    imageHeight: number,
    imageWidth: number,
    tileHeight: number,
    tileWidth: number
): IImageRestrictions {
    if (imageHeight && imageWidth) {
        const tileDeltaW = Number((tileWidth / tileHeight).toFixed(1));
        const imageDeltaW = Number((imageWidth / imageHeight).toFixed(1));
        const imageDeltaH = Number((imageHeight / imageWidth).toFixed(1));
        const tileDeltaH = Number((tileHeight / tileWidth).toFixed(1));
        const restrictions = {
            width: false,
            height: false
        };
        if (imageDeltaW > tileDeltaW) {
            restrictions.height = true;
        } else if (imageDeltaH <= tileDeltaH) {
            restrictions.width = true;
        } else if (imageDeltaW === tileDeltaW && imageDeltaW <= 1) {
            restrictions.height = true;
        } else if (imageDeltaW <= 1) {
            restrictions.width = true;
        } else {
            restrictions.height = true;
        }
        return restrictions;
    } else {
        return {
            width: true,
            height: true
        };
    }
}
