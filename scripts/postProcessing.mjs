import {readFile} from "fs/promises";
import {join} from "path";
import {
    writeMdxFileFromShortcodesArray
} from "./shortcodes.helper.mjs";


export class PostProcessing {
    cacheFolderLocation;
    constructor(cacheFolderLocation) {
        this.cacheFolderLocation = cacheFolderLocation;
    }

    async loadFile(file) {
        const data = await readFile(join(this.cacheFolderLocation, `${file}.json`), 'utf-8');
        return JSON.parse(data);
    }

    async tags(ids = []) {
        const all = await this.loadFile('post_tag');
        if (ids.length === 0) {
            return [];
        }
        const tags = [];

        for (const id of ids) {
            tags.push(all.find(tag => tag.id === id));
        }

        return tags;
    }

    async images(ids = []) {
        const all = await this.loadFile('attachment');

        if (ids.length === 0) {
            return [];
        }

        const images = [];

        for (const id of ids) {
            images.push(all.find(image => image.id === parseInt(id)));
        }

        return images;
    }

    async categories(ids) {
        const all = await this.loadFile('category');
        if (ids.length === 0) {
            return [];
        }
        const items = [];

        for (const id of ids) {
            items.push(all.find(item => item.id === id));
        }

        return items;
    }

    async menus(menus) {


        return menus;
    }

    async parseShortcodes(slug, html) {

        await writeMdxFileFromShortcodesArray(html, slug, true);

    }
}
