import { sql } from "@vercel/postgres";
import { error } from '@sveltejs/kit';

export async function load({ params }) {
    const reviews = await sql`SELECT * from reviews where user_id=${params.user_id}`;

    console.log(reviews);

	if (!reviews) throw error(404);

	return {
		reviews: reviews.rows
	};
}
