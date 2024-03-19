import {BaseService} from "./base.service.mjs";

export class FieldsService extends BaseService {
    async getGroups() {
        const res = await fetch(`${this.mcmsUrl}fields`, {
            headers: this.authHeaders()
        });

        return  await res.json();

    }
}
