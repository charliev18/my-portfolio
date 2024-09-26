<!-- FriendAdder.svelte -->
<script lang="ts">
    import { db } from "$lib/db";
    import "$lib/style/form.css";

    let status = "";

    let restaurantName = "";
  
    async function addRestaurant() {
        try {
            const id = await db.restaurants.add({
                name: restaurantName,
            });
    
            status = `Restaurant ${restaurantName} successfully added. Got id ${id}`;
            
            // Reset form:
            restaurantName = "";
        } catch (error) {
            status = `Failed to add ${restaurantName}: ${error}`;
        }
    }
</script>
<div>
    <p>{status}</p>
    <fieldset>
        <legend>Add new restaurant</legend>
        <label class="form-group">
            Name:
            <input
                type="text"
                bind:value={restaurantName} />
        </label>
        <br />
        <button on:click={addRestaurant}>Add Restaurant</button>
    </fieldset>
</div>