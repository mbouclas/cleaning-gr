import dotenv from "dotenv"
import {statSync} from "node:fs";
let envPath = '.env';
const env = process.env.ENV ? process.env.ENV : process.env.NODE_ENV || 'development';

try {
    envPath = (statSync(resolve(`.env.${env}`))) ?  `.env.${env}` : '.env';
}
catch (e) {

}

dotenv.config({ path: resolve(process.cwd(), envPath)});
import { loadEnv } from "vite"
import fs from "fs";
import { writeFile } from "fs/promises";
import {join, dirname, resolve} from "path";
import { fileURLToPath } from "url";
import {MenuService} from "./menu.service.mjs";
import {FieldsService} from "./fields.service.mjs";
import {PostsService} from "./posts.service.mjs";
import {PagesService} from "./pages.service.mjs";
import {OptionsPagesService} from "./optionsPages.service.mjs";
import {BaseService} from "./base.service.mjs";
import {PostProcessing} from "./postProcessing.mjs";


const __filename = fileURLToPath(import.meta.url);
const { API_BASE_URL, ASTRO_KEY } = loadEnv("production", process.cwd(), "");
const __dirname = dirname(__filename);

const cacheFolderLocation = join(__dirname, "../", "__cache");

if (process.env.USE_CACHE && process.env.USE_CACHE === "true") {
    process.exit()
}

if (!fs.existsSync(cacheFolderLocation)) {
    fs.mkdirSync(cacheFolderLocation)
}

// get the menus, all posts, pages, cars, makes, models, years

const timeStart = Date.now();
Promise.all([
    saveMenus(),
    saveTaxonomies(),
    saveAcfGroups(),
    saveOptionsPages(),
])
    .then(async () => {
        return Promise.all([
            new BaseService().getMedia(cacheFolderLocation),
        ]);
    })
    .then(async () => {
        return Promise.all([
            saveAllContent(),
        ])
    })
    .then(() => {
    console.log(`* All done in ${Date.now() - timeStart}ms`);
    process.exit();
});

async function saveTaxonomies() {
    const s = new BaseService();
    const taxonomies = await s.getTaxonomies();
    for (const key in taxonomies) {
        const items = taxonomies[key].terms;

        try {
            await writeFile(
                join(cacheFolderLocation, `${taxonomies[key].slug}.json`),
                JSON.stringify(items)
            )
            console.log(`* Saving ${taxonomies[key].name} complete`)
        } catch (e) {
            console.log(e)
        }
    }

}

async function saveMenus() {
    const s = new MenuService();
    const items = await (new PostProcessing(cacheFolderLocation)).menus(await s.getMenus());
    try {
        await writeFile(
            join(cacheFolderLocation, `all_menus.json`),
            JSON.stringify(items)
        )
        console.log(`* Saving All menus complete`)
    } catch (e) {
        console.log(e)
    }
}

async function saveAcfGroups() {
    const s = new FieldsService();
    const items = await s.getGroups();

    try {
        await writeFile(
            join(cacheFolderLocation, `all_acf_groups.json`),
            JSON.stringify(items)
        )
        console.log(`* Saving All acf groups complete`)
    } catch (e) {
        console.log(e)
    }

    // get the contact form fields
    let foundIdx = null;
    items.forEach((item,idx ) => {
        if (!item['acfe_meta']) {
            return;
        }

        for (const key in item['acfe_meta']) {
            if (item['acfe_meta'][key]['acfe_meta_key'] === 'type' && item['acfe_meta'][key]['acfe_meta_value'] === 'contact') {
                foundIdx = idx;
                break;
            }
        }
    });

    if (foundIdx < 0) {
        return;
    }

    try {
        await writeFile(
            join(cacheFolderLocation, `contact_form_fields.json`),
            JSON.stringify(items[foundIdx].fields)
        )
        console.log(`* Saving contact form fields complete`)
    }
    catch (e) {
        console.log(e)
    }
}

async function saveAllContent() {
    const s = new BaseService();
    await s.saveAllPosts(cacheFolderLocation);
    console.log(`* Saving All content complete`)
}



async function saveOptionsPages() {
    const s = new OptionsPagesService();
    const items = await s.getOptionsPages();
    try {
        await writeFile(
            join(cacheFolderLocation, `all_options_pages.json`),
            JSON.stringify(items)
        )
        console.log(`* Saving All options pages complete`)
    } catch (e) {
        console.log(e)
    }
}
