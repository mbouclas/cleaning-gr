import {BaseService} from "./base.service.mjs";

export class OptionsPagesService extends BaseService {
    async getOptionsPages() {
        const res = await fetch(`${this.mcmsUrl}options-pages`, {
            headers: this.authHeaders()
        });
        return await res.json();
    }
}
