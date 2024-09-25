// db.ts
import Dexie, { type EntityTable } from "dexie";
import dexieCloud from "dexie-cloud-addon";

interface Restaurant {
    id: number;
    name: string;
}

interface Review {
    id: number;
    user_id: number;
    restaurant_id: number;
    food_score?: number;
    drink_score?: number;
    service_score?: number;
    ambiance_score?: number;
    wow_score?: boolean;
    presentation_score?: number;
    vibes_score?: boolean;
    value_score?: number;
    composite_score?: number;
    comment?: string;
    created_at: Date;
}

const db = new Dexie("ReviewDatabase", { addons: [dexieCloud] }) as Dexie & {
    restaurants: EntityTable<
        Restaurant,
        "id"
    >;
    reviews: EntityTable<
        Review,
        "id"
    >;
};

// Schema declaration:
db.version(1).stores({
    restaurants: "@id, name",
    reviews: "@id, user_id, restaurant_id, food_score, drink_score, service_score, ambiance_score, wow_score, presentation_score, vibes_score, value_score, composite_score, comment, created_at"
});

db.cloud.configure({
    databaseUrl: "https://zfwqfezp0.dexie.cloud",
    requireAuth: false // TODO: figure this out
});

export type { Restaurant, Review };
export { db };
