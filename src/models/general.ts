import type {IWpMedia} from "@models/media.ts";

export interface IGenericObject<T = any> {
    [key: string]: T;
}

export interface IGenericWpObject {
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
    content: Content;
    featured_media: IWpMedia;
    template: string;
    acf: IGenericObject;
    yoast_head: string;
    yoast_head_json: YoastHeadJson;
    excerpt: Excerpt;
}
export interface Guid {
    rendered: string;
}
export interface Title {
    rendered: string;
}

export interface Excerpt {
    rendered: string;
}

export interface Content {
    rendered: string;
    protected: boolean;
}
export interface Acf {
    make?: number[] | null;
    model_year?: number[] | null;
}
export interface YoastHeadJson {
    title: string;
    description: string;
    canonical: string;
    og_locale: string;
    og_type: string;
    og_title: string;
    og_url: string;
    og_site_name: string;
    twitter_card: string;
}

export interface ItemListElement {
    position: number;
    name: string;
    item: string;
}

export interface Target {
    urlTemplate: string;
}
export interface Logo {
    inLanguage: string;
    url: string;
    contentUrl: string;
    width: number;
    height: number;
    caption: string;
}


export interface AcfPost {
    embeddable: boolean;
    href: string;
}
export interface WpAttachment {
    href: string;
}
export interface Curies {
    name: string;
    href: string;
    templated: boolean;
}

export interface IAcfPostObject {
    ID: number;
    post_author: string;
    post_date: string;
    post_date_gmt: string;
    post_content: string;
    post_title: string;
    post_excerpt: string;
    post_status: string;
    comment_status: string;
    ping_status: string;
    post_password: string;
    post_name: string;
    to_ping: string;
    pinged: string;
    post_modified: string;
    post_modified_gmt: string;
    post_content_filtered: string;
    post_parent: number;
    guid: string;
    menu_order: number;
    post_type: string;
    post_mime_type: string;
    comment_count: string;
    filter: string;
}

export interface IWpGenericTaxonomy {
    term_id: number;
    name: string;
    slug: string;
    term_group: number;
    term_taxonomy_id: number;
    taxonomy: string;
    description: string;
    parent: number;
    count: number;
    filter: string;
}

export interface IAcfField {
    ID: number;
    key: string;
    label: string;
    name: string;
    prefix: string;
    type: 'text'|'textarea'|'select'|'number'|'email'|'url'|'group'|'tab'|'repeater';
    sub_fields?: IAcfField[];
    value?: any;
    menu_order: number;
    instructions: string;
    required: number;
    id: string;
    class: string;
    conditional_logic: number;
    parent: number;
    default_value: string;
    maxlength: string;
    placeholder: string;
    prepend: string;
    append: string;
    _name: string;
    _valid: number;
    rows: string;
    wrapper: IAcfFieldWrapper;
    new_lines: string;
    acfe_textarea_code: number;
    center_lat: string;
    center_lng: string;
    zoom: string;
    height: string;
}

export interface IAcfFieldWrapper {
    width: string;
    class: string;
    id: string;
}
