<script lang="ts">
    import { liveQuery } from "dexie";
    import { db } from "$lib/db";

    let status = "";
  
    let reviews = liveQuery(
        () => db.reviews.toArray()
    );

    async function deleteReview(id: string) {
        try {
            await db.reviews.delete(id);
    
            status = `Review with ID ${id} successfully deleted.`;
        } catch (error) {
            status = `Failed to delete review with ID ${id}: ${error}`;
        }
    }
</script>
<div>
    <p>{status}</p>
    {#if $reviews}
    <div class="review-table">
        {#each $reviews as review (review.id)}
            <div class="review-row">
                <div class="review-header">ID</div><div>{review.id}</div>
                <div class="review-header">Restaurant Name</div><div>{review.restaurant_name}</div>
                <div class="review-header">Food Score</div><div>{review.foodScore}</div>
                <div class="review-header">Drink Score</div><div>{review.drinkScore}</div>
                <div class="review-header">Service Score</div><div>{review.serviceScore}</div>
                <div class="review-header">Ambiance Score</div><div>{review.ambianceScore}</div>
                <div class="review-header">Wow Score</div><div>{review.wowScore}</div>
                <div class="review-header">Presentation Score</div><div>{review.presentationScore}</div>
                <div class="review-header">Vibes Score</div><div>{review.vibesScore}</div>
                <div class="review-header">Value Score</div><div>{review.valueScore}</div>
                <div class="review-header">Comment</div><div>{review.comment}</div>
                <div class="review-header">Composite Score</div><div>{review.compositeScore}</div>
                <div class="review-header">Created At</div><div>{review.created_at}</div>
                <div class="review-header">Owner</div><div>{review.owner}</div>
                <div class="review-header">Realm ID</div><div>{review.realmId}</div>
                <div><button on:click={() => deleteReview(review.id)} class="delete-btn">Delete</button></div>
            </div>
        {/each}
    </div>
{/if}
</div>

<style>
    .review-table {
        display: grid;
        grid-template-columns: 1fr;
        gap: 10px;
        margin-top: 10px;
    }

    .review-row {
        display: grid;
        grid-template-columns: repeat(2, 1fr); /* Two columns: one for the header, one for the value */
        gap: 8px;
        padding: 10px;
        border: 1px solid #ddd;
        border-radius: 8px;
        background-color: #f9f9f9;
    }

    .review-header {
        font-weight: bold;
        color: #555;
    }

    .delete-btn {
        grid-column: span 2;
        padding: 8px 12px;
        background-color: #ff4d4d;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        text-align: center;
        transition: background-color 0.3s ease;
    }

    .delete-btn:hover {
        background-color: #ff1a1a;
    }

    @media (min-width: 600px) {
        /* For larger screens, add padding and slightly different layout */
        .review-table {
            grid-template-columns: 1fr 1fr;
        }

        .review-row {
            grid-template-columns: repeat(2, 1fr);
        }

        .delete-btn {
            grid-column: span 2;
        }
    }
</style>