<!-- FriendList.svelte -->
<!-- <script lang="ts">
    import { liveQuery } from "dexie";
    import { db } from "$lib/db";

    let status = "";
  
    let restaurants = liveQuery(
        () => db.restaurants.toArray()
    );

    async function deleteRestaurant(id: number) {
        try {
            await db.restaurants.delete(id);
    
            status = `Restaurant with ID ${id} successfully deleted.`;
        } catch (error) {
            status = `Failed to delete restaurant with ID ${id}: ${error}`;
        }
    }
</script>
<div>
    <p>{status}</p>
    {#if $restaurants}
        {#each $restaurants as restaurant (restaurant.id)}
            <div>{restaurant.id}</div>
            <div>{restaurant.name}</div>
            <div>{restaurant.nae}</div>
            <button on:click={() => deleteRestaurant(restaurant.id)}>Delete</button>
        {/each}
    {/if}
</div> -->