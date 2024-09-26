// db.ts
import Dexie from "dexie";
import dexieCloud, { type DexieCloudTable } from "dexie-cloud-addon";
import { Restaurant, Review } from "$lib/dbTables";

export class Db extends Dexie {
    restaurants!: DexieCloudTable<Restaurant, 'id'>;
    reviews!: DexieCloudTable<Review, 'id'>;

    constructor() {
        super("ReviewDB", { addons: [dexieCloud] });

        this.version(1).stores({
            restaurants: "@id, name",
            reviews: "@id, user_id, restaurant_id, food_score, drink_score, service_score, ambiance_score, wow_score, presentation_score, vibes_score, value_score, composite_score, comment, created_at"
        });

        this.restaurants.mapToClass(Restaurant);
        this.reviews.mapToClass(Review);

        this.cloud.configure({
            databaseUrl: "https://zfwqfezp0.dexie.cloud",
            requireAuth: false // TODO: figure this out
        });
    }
}

export const db = new Db();
