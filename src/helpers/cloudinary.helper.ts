import {config} from "@data/config.ts";
import type {IWpMedia} from "@models/media.ts";

export function f(item: IWpMedia, settings: string) {
    if (!item) {
        return config.defaultNoImage;
    }

    if (item && item.cloudinary) {
        return cloudinaryRawSettings(item.cloudinary.url, settings);
    }

    // remove any w_ or h_ settings
    const src = item.source_url.replace(/(w_\d+,|h_\d+,)/g, '');

    return cloudinaryRawSettings(src, settings);
}

export function cloudinaryRawSettings(src: string, settings: string) {
    if (!src) {
        return config.defaultNoImage;
    }

    if (typeof src === 'object') {
        src = src['url'];
    }

    if (src.indexOf('cloudinary') === -1) {
        return src;
    }

    const ext = src.split('.').pop().replace(/\?.*$/, "");

    if ([ 'jpg', 'png' ].indexOf(ext as string) !== -1) {
        src = src.replace(/\.[^/.]+$/, ".webp")
    }

    return src
        .replace('upload/', `upload/${settings}/`)
        .replace('images/', `images/${settings}/`);
}
export function optimizeCloudinaryImage(src: string, w: number|null = null, h: number|null = null, cropMode: 'fit'|'fill' = 'fit', q = 'auto:good'): string {
    if (typeof src === 'undefined' || !src) {
        return  config.defaultNoImage;
    }

    if (typeof src === 'object') {
        src = src['url'];
    }

    try {
        const ext = src.split('.').pop()
        if ([ 'jpg', 'png' ].indexOf(ext as string) !== -1) {
            src = src.replace(/\.[^/.]+$/, ".webp")
        }

        const width = (w) ? `w_${w},` : 'w_auto,';
        const height = (h) ? `h_${h},` : '';
        let crop = (w || h) ? 'c_fit,' : '';
        if (crop.length > 0) {
            crop = `c_${cropMode},`
        }
        return src.replace('upload/', `upload/${width}${height}${crop}q_${q},f_auto,dpr_auto/`);
    }
    catch (e) {
        return  config.defaultNoImage;
    }

}

export function cloudinarySrcSet(src: string, sizes = [767, 1190]) {
    if (!src) {
        return null;
    }

    return {
        original: optimizeCloudinaryImage(src, sizes[0]),
        copies: sizes.map(size => ({
            url: src.replace('upload/', `upload/w_${size},c_scale,q_auto:good,f_auto,dpr_auto/`),
            size
        }))
    };
}

export function cloudinaryUrlFromRaw(item: IWpMedia, settings: string) {
    if (!item) {
        return config.defaultNoImage;
    }

    if (item && item.cloudinary) {
        return cloudinaryRawSettings(item.cloudinary.url, settings);
    }

    // remove any w_ or h_ settings
    const src = item.source_url.replace(/(w_\d+,|h_\d+,)/g, '');

    return cloudinaryRawSettings(src, settings);
}
