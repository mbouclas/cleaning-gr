import {readdir, readFile, unlink, writeFile} from "fs/promises";
import {dirname, join} from "path";
import {PostProcessing} from "./postProcessing.mjs";
import {fileURLToPath} from "url";

export class BaseService {
    apiUrl = process.env.API_BASE_URL;
    wpUrl = this.apiUrl + process.env.WP_ENDPOINT;
    mcmsUrl = this.apiUrl + process.env.MCMS_ENDPOINT;
    totalPagesHeaderParam = 'X-WP-TotalPages';
    totalItemsHeaderParam = 'X-WP-Total';
    astroKey = process.env.ASTRO_KEY;
    apiKey = process.env.API_KEY;
    cacheFolderLocation;

    authHeaders() {
        return {
            'X-API-KEY': process.env.API_KEY,
            'Content-Type': 'application/json'
        }
    }

    async getTaxonomies() {
        const url = `${this.wpUrl}taxonomies?acf_format=standar`;
        const res = await fetch(url, {
            headers: this.authHeaders()
        });
        const taxonomies = await res.json();

        // foreach taxonomy, go fetch the terms
        for (const key in taxonomies) {
            taxonomies[key].terms = await this.getTerms(taxonomies[key].rest_base);
        }

        return taxonomies;
    }



    async getTerms(taxonomy) {
        const url = `${this.wpUrl}${taxonomy}?acf_format=standardd&per_page=100`;
        const res = await fetch(url, {
            headers: this.authHeaders()
        });

        const data = await res.json();
        let terms = [];
        const totalPages = res.headers.get(this.totalPagesHeaderParam);
        const totalItems = res.headers.get(this.totalItemsHeaderParam);

        terms = terms.concat(data);

        for (let idx = 1; idx < totalPages; idx++) {
            const r = await fetch(`${this.wpUrl}${taxonomy}?acf_format=standardd&per_page=100&page=${idx + 1}`, {
                headers: this.authHeaders()
            });
            const d = await r.json();
            terms = terms.concat(d);
            console.log(`*** ${taxonomy} page ${idx + 1} complete. ${terms.length} of ${totalItems} items fetched.`);
        }



        return terms;
    }

    async getPostTypes(onlyPublic = true) {
        const url = `${this.mcmsUrl}post-types?acf_format=standard`;
        const res = await fetch(url, {
            headers: this.authHeaders()
        });
        const postTypes = await res.json();
        if (!onlyPublic) {
            return postTypes;
        }
        const all = [];

        for (const pt in postTypes) {
            if (postTypes[pt].public) {
                all.push(postTypes[pt]);
            }
        }

        return all;
    }

    async getPostTypeContents(postType, limit = 10) {
        const statusQuery = ['attachment'].indexOf(postType) !== -1 ? '&status=publish' : '';
        const res = await fetch(`${this.wpUrl}${postType}?per_page=${limit}${statusQuery}&acf_format=standard`, {
            headers: this.authHeaders()
        });

        const data = await res.json();
        let allPosts = [];
        const totalPages = res.headers.get(this.totalPagesHeaderParam);
        const totalItems = res.headers.get(this.totalItemsHeaderParam);

        allPosts = allPosts.concat(data);

        for (let idx = 1; idx < totalPages; idx++) {
            const r = await fetch(`${this.wpUrl}${postType}?per_page=${limit}${statusQuery}&acf_format=standard&page=${idx + 1}`, {
                headers: this.authHeaders()
            });
            const d = await r.json();
            allPosts = allPosts.concat(d);
            console.log(`*** ${postType} page ${idx + 1} complete. ${allPosts.length} of ${totalItems} items fetched.`);
        }

        return allPosts;
    }

    async saveAllPosts(cacheFolderLocation) {
        this.cacheFolderLocation = cacheFolderLocation;
        const allPostTypes = await this.getPostTypes();
        for (const pt of allPostTypes) {
            if (pt.name === 'attachment') {
                continue;
            }
            const items = await this.getPostTypeContents(pt.rest_base || pt.name);
            try {
                await writeFile(
                    join(cacheFolderLocation, `${pt.name}.json`),
                    JSON.stringify(items)
                )
                console.log(`* Saving ${pt.label} complete`)
            } catch (e) {
                console.log(e)
            }
        }

        // run post processing
        const postProcessingService = new PostProcessing(cacheFolderLocation);
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = dirname(__filename);


        // delete all mdx files in the markdown-content folder

        const directory = join(__dirname, "../", "src", "markdown-content");
        const files = await readdir(directory);
        for (const file of files) {
            if (file.endsWith('.mdx')) {
                await unlink(join(directory, file));
            }
        }
        for (const pt of allPostTypes) {
            const allPostsRaw = await readFile(join(cacheFolderLocation, `${pt.name}.json`), 'utf-8');
            const allPosts = JSON.parse(allPostsRaw);

            for (const post of allPosts) {
                post.tags = await postProcessingService.tags(post.tags);
                if (post.featured_media && typeof post.featured_media === 'number') {
                    const found = await postProcessingService.images([post.featured_media]);
                    if (found.length > 0) {
                        post.featured_media = found[0];
                    }
                }

                if (Array.isArray(post.categories)) {
                    post.categories = await postProcessingService.categories(post.categories);
                }


                if (post.acf && Array.isArray(post.acf.gallery) && post.acf.gallery.length > 0) {
                    post.acf.gallery = await postProcessingService.images(post.acf.gallery);
                }



                if (post.acf && post.acf.image && typeof post.acf.image === 'object') {
                    const found = await postProcessingService.images([post.acf.image.ID]);

                    if (found.length > 0) {
                        post.acf.image = found[0];
                    }

                }

                // process any shortcodes
                if (post.content && post.content.rendered) {
                    await postProcessingService.parseShortcodes(post.slug, post.content.rendered);
                }

                if (post.acf && post.acf.description) {
                    await postProcessingService.parseShortcodes(post.slug, post.acf.content);
                }
            }

            try {
                await writeFile(
                    join(cacheFolderLocation, `${pt.name}.json`),
                    JSON.stringify(allPosts)
                )
                console.log(`* Saving processed ${pt.label} complete`)
            } catch (e) {
                console.log(e)
            }
        }
    }

    async getMedia(cacheFolderLocation, limit = 10) {

        const res = await fetch(`${this.mcmsUrl}media?per_page=${limit}&status=publish&acf_format=standard`, {
            headers: this.authHeaders()
        });

        const data = await res.json();
        let allPosts = [];
        const totalPages = res.headers.get(this.totalPagesHeaderParam);
        const totalItems = res.headers.get(this.totalItemsHeaderParam);

        allPosts = allPosts.concat(data);

        for (let idx = 1; idx < totalPages; idx++) {
            const r = await fetch(`${this.mcmsUrl}media?per_page=${limit}&status=inherit&acf_format=standard&page=${idx + 1}`, {
                headers: this.authHeaders()
            });
            const d = await r.json();
            allPosts = allPosts.concat(d);
            console.log(`*** Media page ${idx + 1} complete. ${allPosts.length} of ${totalItems} items fetched.`);
        }


        try {
            await writeFile(
                join(cacheFolderLocation, `attachment.json`),
                JSON.stringify(allPosts)
            )
            console.log(`* Saving Attachment complete`)
        } catch (e) {
            console.log(e)
        }
    }

}
