import {BaseService} from "./base.service.mjs";

export class PostsService extends BaseService {
    async getPosts(limit = 10) {
        let allPosts = [];

        const res = await fetch(`${this.wpUrl}posts?limit=${limit}&acf_format=standard`, {
            headers: this.authHeaders()
        });
        const data = await res.json();
        const totalPages = res.headers.get(this.totalPagesHeaderParam);
        const totalItems = res.headers.get(this.totalItemsHeaderParam);

        allPosts = allPosts.concat(data);

        for (let idx = 1; idx < totalPages; idx++) {
            const r = await fetch(`${this.wpUrl}posts?limit=${limit}&acf_format=standard&page=${idx + 1}`);
            const d = await r.json();
            console.log(`*** Posts page ${idx + 1} complete`);
            allPosts = allPosts.concat(d);
        }

        return allPosts;
    }
}
