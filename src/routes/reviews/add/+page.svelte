<script lang="ts">
	import { db } from "$lib/db";
    import "$lib/style/form.css";
    import Tab, { Icon, Label } from '@smui/tab';
    import TabBar from '@smui/tab-bar';
    import IconButton from '@smui/icon-button';
    import StarRating from "$lib/components/starRating.svelte";

    import { mdiStoreMarker, mdiNoodles, mdiGlassCocktail, mdiAvTimer, mdiCeilingLight, mdiExclamationThick, mdiRoomService, mdiCrystalBall, mdiCashMultiple, mdiCommentProcessing } from '@mdi/js';
    import { mdiChevronLeft, mdiChevronRight } from '@mdi/js';

    let status = "";
    let restaurantName = "";

    interface FormStep {
        label: string,
        type: string,
        value: number | string | boolean | undefined,
        weight: number | undefined,
        icon: string,
        helperText: string,
    }

    let formSteps: FormStep[] = [
        { label: "Food", type: "star", value: undefined, weight: 5, "icon": mdiNoodles, helperText: "This is some additional text" },
        { label: "Drinks", type: "star", value: undefined, weight: 4, "icon": mdiGlassCocktail, helperText: "This is some additional text" },
        { label: "Service", type: "star", value: undefined, weight: 3, "icon": mdiAvTimer, helperText: "This is some additional text" },
        { label: "Ambiance", type: "star", value: undefined, weight: 3, "icon": mdiCeilingLight, helperText: "This is some additional text" },
        { label: "Wow", type: "boolean", value: undefined, weight: 1, "icon": mdiExclamationThick, helperText: "This is some additional text" },
        { label: "Presentation", type: "star", value: undefined, weight: 2, "icon": mdiRoomService, helperText: "This is some additional text" },
        { label: "Vibes", type: "boolean", value: undefined, weight: 3, "icon": mdiCrystalBall, helperText: "This is some additional text" },
        { label: "Value", type: "star", value: undefined, weight: 4, "icon": mdiCashMultiple, helperText: "This is some additional text" },
        { label: "Comment", type: "textArea", value: undefined, weight: undefined, "icon": mdiCommentProcessing, helperText: "This is some additional text" },
    ];

    let activeIndex = 0;
    let active = formSteps[activeIndex];

    $: activeIndex = formSteps.findIndex(step => step === active);

    function nextItem() {
        // Increment the index and loop back to the start if necessary
        activeIndex = (activeIndex + 1) % formSteps.length;
        active = formSteps[activeIndex];
    }

    function prevItem() {
        // Decrement the index and loop to the end if necessary
        activeIndex = (activeIndex - 1 + formSteps.length) % formSteps.length;
        active = formSteps[activeIndex];
    }

    function getClassesForIndex(index : number) {
        switch (index) {
            case activeIndex:
                return "form-step active";
            case (activeIndex - 1) % formSteps.length:
                return "form-step prev";
            case (activeIndex + 1) % formSteps.length:
                return "form-step next";
            default:
                return "form-step";
        }
    }

    function calculate_composite() {
        let weightedSum = 0;
        let totalWeight = 0;

        for (let formStep of formSteps) {
            if (formStep.value === undefined || formStep.weight === undefined)
                continue;

            weightedSum += +formStep.value * formStep.weight;
            totalWeight += formStep.weight;
        }

        return weightedSum / totalWeight;
    }
  
    async function addReview() {
        // TODO: validation

        try {
            const id = await db.reviews.add({
                restaurant_name: restaurantName,
                foodScore: formSteps[1].value as number | undefined,
                drinkScore: formSteps[2].value as number | undefined,
                serviceScore: formSteps[3].value as number | undefined,
                ambianceScore: formSteps[4].value as number | undefined,
                wowScore: formSteps[7].value !== undefined ? Boolean(formSteps[7].value) : undefined,
                presentationScore: formSteps[6].value as number | undefined,
                vibesScore: formSteps[7].value !== undefined ? Boolean(formSteps[7].value) : undefined,
                valueScore: formSteps[8].value as number | undefined,
                comment: formSteps[9].value as string | undefined,
                compositeScore: calculate_composite(),
                created_at: new Date(),
            });
    
            status = `Review for ${restaurantName} successfully added. Got id ${id}`;1
        } catch (error) {
            status = `Failed to add review for ${restaurantName}: ${error}`;
        }
    }

</script>

<TabBar tabs={formSteps} let:tab bind:active>
    <Tab {tab} stacked={true} indicatorSpanOnlyContent={true}>
        <Icon class="material-icons" style="width: 1.5em; height: 1.5em;" tag="svg" viewBox="0 0 24 24">
            <path fill="currentColor" d={tab.icon} />
        </Icon>
        {#if tab.type === "star"}
        <Icon class="material-icons" style="width: 1em; height: 1em;" tag="svg" viewBox="-5 -5 60 60">
            <path fill={tab.value !== undefined ? "gold" : "rgba(100, 100, 100, 0.15)"} d="M48.856,22.73c0.983-0.958,1.33-2.364,0.906-3.671c-0.425-1.307-1.532-2.24-2.892-2.438l-12.092-1.757c-0.515-0.075-0.96-0.398-1.19-0.865L28.182,3.043c-0.607-1.231-1.839-1.996-3.212-1.996c-1.372,0-2.604,0.765-3.211,1.996L16.352,14c-0.23,0.467-0.676,0.79-1.191,0.865L3.069,16.622c-1.359,0.197-2.467,1.131-2.892,2.438c-0.424,1.307-0.077,2.713,0.906,3.671l8.749,8.528c0.373,0.364,0.544,0.888,0.456,1.4L8.224,44.701c-0.183,1.06,0.095,2.091,0.781,2.904c1.066,1.267,2.927,1.653,4.415,0.871l10.814-5.686c0.452-0.237,1.021-0.235,1.472,0l10.815,5.686c0.526,0.277,1.087,0.417,1.666,0.417c1.057,0,2.059-0.47,2.748-1.288c0.687-0.813,0.964-1.846,0.781-2.904l-2.065-12.042c-0.088-0.513,0.083-1.036,0.456-1.4L48.856,22.73z" />
        </Icon>
        {/if}
        <span class="savedReview">{tab.value}</span>
    </Tab>
</TabBar>

<p>{status}</p>
{#if !restaurantName}
    <Icon class="material-icons" style="width: 1.5em; height: 1.5em;" tag="svg" viewBox="0 0 24 24">
        <path fill="currentColor" d={mdiStoreMarker} />
    </Icon>
    <h1>Restaurant Name</h1>
    <input type="text" bind:value={restaurantName} />
{:else}
<p>Reviewing {restaurantName}</p>
<div class="form-wrapper">
    <IconButton disabled={activeIndex === 0} onclick={() => prevItem()}>
        <Icon tag="svg" viewBox="0 0 24 24">
            <path fill="currentColor" d={mdiChevronLeft} />
        </Icon>
    </IconButton>
    <div class="form">
        <div class="form-container" style="transform: translateX(-{activeIndex * 100}%);">
            {#each formSteps as formStep, i }
                <div class={getClassesForIndex(i)}>
                    <h1 class="form-step-label">{formStep.label}</h1>
                    <h4 class="form-step-help-text">{formStep.helperText}</h4>
                    {#if formStep.type === "text"}
                        <input
                            type={formStep.type}
                            bind:value={formStep.value}
                        />
                    {:else if formStep.type === 'star'}
                        <StarRating bind:rating={formStep.value as number} on:submitStar={nextItem}/>
                    {:else if formStep.type === 'boolean'}
                        <input
                            type="checkbox"
                            bind:checked={formStep.value as boolean}
                        />
                    {:else if formStep.type === 'textArea'}
                        <textarea bind:value={formStep.value}></textarea>
                    {/if}
                </div>
            {/each}
        </div>
    </div>
    <IconButton disabled={activeIndex === formSteps.length - 1} onclick={nextItem}>
        <Icon tag="svg" viewBox="0 0 24 24">
            <path fill="currentColor" d={mdiChevronRight} />
        </Icon>
    </IconButton>
</div>
<button on:click={addReview} class="btn submit-btn">Add Review</button>
{/if}

<style>
    .form-wrapper {
        display: grid;
        grid-template-columns: 1fr minmax(0, 80vw) 1fr; /* Middle column takes up 80vw */
        width: 100%;
        overflow: hidden;
    }

    .form-container {
        display: flex;
        transition: transform 0.5s ease-in-out;
        grid-column: 2; /* Ensure the form container is aligned with the middle column */
        width: 100%;
    }

    .form-step-label {
        font-size: 2rem;
        color: rgb(102, 99, 99);
    }

    .form-step-help-text {
        color: rgb(164, 163, 163);
    }

    .form-step {
        min-width: 100%;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        justify-content: center;
        text-align: center;
    }

    .form {
        overflow: hidden;
    }

    .tab {
        display: flex;
        flex-direction: column;
    }

    .submit-btn {
        display: block;
        background-color: #28a745;
        width: 40%;
        margin: 30px auto 0px auto;
    }

    .submit-btn:hover {
        background-color: #218838;
    }
    
    .savedReview {
        position: absolute;
        top: 76%;
        left: 52%;
        transform: translate(-50%, -50%);
        font-size: 0.7em;
        z-index: 100;
    }
</style>
