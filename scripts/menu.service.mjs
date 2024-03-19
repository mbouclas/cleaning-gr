import {BaseService} from "./base.service.mjs";

export class MenuService extends BaseService {
    async getMenus() {
        const res = await fetch(`${this.mcmsUrl}menus`, {
            headers: this.authHeaders()
        });

        return  await res.json();

    }
}
