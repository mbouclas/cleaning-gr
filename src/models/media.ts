export interface IWpMedia {
    id: number;
    date: string;
    date_gmt: string;
    guid: Guid;
    modified: string;
    modified_gmt: string;
    slug: string;
    status: string;
    type: string;
    link: string;
    title: Title;
    author: number;
    comment_status: string;
    ping_status: string;
    template: string;
    meta: Meta;
    acf?: any[] | null;
    is_cloudinary_synced: boolean;
    source_url: string;
    description: Description;
    caption: Caption;
    alt_text: string;
    media_type: string;
    mime_type: string;
    media_details: MediaDetails;
    post?: null;
    _links: Links;
    cloudinary?: ICloudinaryDetails;
}
export interface  ICloudinaryDetails {
    url: string;
    public_id: string;
}

export interface Guid {
    rendered: string;
}
export interface Title {
    rendered: string;
}
export interface Meta {
    _cloudinary_featured_overwrite: boolean;
}
export interface Description {
    rendered: string;
}
export interface Caption {
    rendered: string;
}
export interface MediaDetails {
    width: number;
    height: number;
    file: string;
    filesize: number;
    sizes: Sizes;
    image_meta: ImageMeta;
}
export interface Medium {
    file: string;
    width: number;
    height: number;
    filesize: number;
    mime_type: string;
    source_url: string;
}
export interface Sizes {
    medium: Medium;
    thumbnail: Thumbnail;
    medium_large: MediumLarge;
    full: Full;
}
export interface Thumbnail {
    file: string;
    width: number;
    height: number;
    filesize: number;
    mime_type: string;
    source_url: string;
}
export interface MediumLarge {
    file: string;
    width: number;
    height: number;
    filesize: number;
    mime_type: string;
    source_url: string;
}
export interface Full {
    file: string;
    width: number;
    height: number;
    mime_type: string;
    source_url: string;
}
export interface ImageMeta {
    aperture: string;
    credit: string;
    camera: string;
    caption: string;
    created_timestamp: string;
    copyright: string;
    focal_length: string;
    iso: string;
    shutter_speed: string;
    title: string;
    orientation: string;
    keywords?: any[] | null;
}
export interface Self {
    href: string;
}
export interface Links {
    self?: Self[] | null;
    collection?: Collection[] | null;
    about?: About[] | null;
    author?: Author[] | null;
    replies?: Replies[] | null;
}
export interface Collection {
    href: string;
}
export interface About {
    href: string;
}
export interface Author {
    embeddable: boolean;
    href: string;
}
export interface Replies {
    embeddable: boolean;
    href: string;
}
