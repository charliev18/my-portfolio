<script lang="ts">
    export let data;
</script>

<div>
  {#each data.reviews as { id, user_id, restaurant_id, food_score, drink_score, service_score, ambiance_score, wow_score, presentation_score, vibes_score, value_score, comment, created_at } (id)}
    <div>{id} - {comment} - {created_at}</div>
  {/each}
</div>
