import {BaseService} from "./base.service.mjs";

export class PagesService extends BaseService {
    async getPages(limit = 10) {
        let allPages = [];

        const res = await fetch(`${this.wpUrl}pages?limit=${limit}&acf_format=standard`, {
            headers: this.authHeaders()
        });
        const data = await res.json();
        const totalPages = res.headers.get(this.totalPagesHeaderParam);
        const totalItems = res.headers.get(this.totalItemsHeaderParam);

        allPages = allPages.concat(data);

        for (let idx = 1; idx < totalPages; idx++) {
            const r = await fetch(`${this.wpUrl}pages?limit=${limit}&acf_format=standard&page=${idx + 1}`);
            const d = await r.json();
            console.log(`*** Pages page ${idx + 1} complete`);
            allPages = allPages.concat(d);
        }

        return allPages;
    }
}
