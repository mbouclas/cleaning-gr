import type {IWpGenericMenuItem} from "@models/menus.ts";

export function stripDomainFromWpUrl(menuItem: IWpGenericMenuItem) {
    let prefix = '';
    switch (menuItem.object) {
        case 'page':
            prefix = 'page';
            break;
        case 'post':
            prefix = 'blog';
            break;
        case 'category':
            prefix = 'category';
            break;
        case 'tag':
            prefix = 'tag';
            break;
        case 'custom':
            prefix = 'custom';
            break;
        default:
            prefix = 'page';
            break;
    }
    //remove the http:// or https:// from the url

    if (prefix === 'custom') {
        return menuItem.url;
    }

    if (menuItem.acf && menuItem.acf.slug) {
        return (menuItem.acf.slug.charAt(0) !== '/') ? `/${menuItem.acf.slug}` : menuItem.acf.slug;
    }



    const url = new URL(menuItem.url);
    return `/${prefix}/${url.pathname.replace(/^\/+|\/+$/g, '')}`;
}
