import { Entity } from "dexie";
import type { Db } from "$lib/db";

export class Restaurant extends Entity<Db> {
    id!: string;
    name!: string;
    owner!: string; // Dexie Cloud specific property
    realmId!: string; // Dexie Cloud specific property
};

export class Review extends Entity<Db> {
    id!: string;
    restaurant_name!: string;
    foodScore?: number;
    drinkScore?: number;
    serviceScore?: number;
    ambianceScore?: number;
    wowScore?: boolean;
    presentationScore?: number;
    vibesScore?: boolean;
    valueScore?: number;
    comment?: string;
    compositeScore?: number;
    created_at!: Date;
    owner!: string; // Dexie Cloud specific property
    realmId!: string; // Dexie Cloud specific property
}
