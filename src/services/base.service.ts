import {readFile} from "fs/promises";
import type {IAcfField} from "@models/general.ts";
import pkg from 'lodash';
const {find, filter} = pkg;

export class BaseService {
    public async load(filename: string) {
        const cached = await readFile(`__cache/${filename}.json`)
        return JSON.parse(cached.toString());
    }

    public async getById(id: number, type: string) {
        const items = await this.load(type);
        return items.find((item: any) => item.id === id);
    }

    public async getSiteSettings(key = 'Site Settings'): Promise<IAcfField[]> {
        const allAcfGroups = await this.load('all_options_pages');
        const siteSettingsGroup = allAcfGroups.find((group: any) => group.title === key);
        if (!siteSettingsGroup) {
            return [];
        }

        return siteSettingsGroup.fields;
    }

    public getAcfField(key: string, acfFields: IAcfField[]): IAcfField {
        const acfField = acfFields.find((acfField: IAcfField) => acfField._name === key);
        if (!acfField) {
            throw new Error(`Acf field ${key} not found`);
        }

        return acfField;
    }

    public async getAcfFieldValue(key: string): Promise<any> {
        const siteSettings = await this.getSiteSettings();
        const field = this.getAcfField(key, siteSettings);
        if (!field || !field.value) {
            return null;
        }

        return field.value;
    }

    public async getSectionSeo(section: string){
        const siteSettings = await this.getSiteSettings();
        const field = this.getAcfField('seo_defaults', siteSettings);
        if (!field || !field.value || !field.value['pages_seo']) {
            return null;
        }

        return field.value['pages_seo'].find((item) => item.section === section);
    }

    public async getPostObjectByProperty(type: string, property: string, value: string) {
        const items = await this.load(type);

        const item = find(items, [property, value]);

        return item;
    }

    public async filterPostObjectsByProperty(type: string, property: string, value: string) {
        const items = await this.load(type);

        return filter(items, [property, value]);

    }
}
