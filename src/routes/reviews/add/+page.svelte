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

    interface NumberOptions {
        min: number,
        max: number,
        step: number,
    }

    const yesNoOptions: NumberOptions = { min: 0, max: 1, step: 1 };

    interface FormStep {
        label: string,
        type: string,
        value: number | string | undefined,
        icon: string,
        typeOptions: NumberOptions | {},
        helperText: string,
    }

    let formSteps: FormStep[] = [
        { label: "Restaurant", type: "text", value: undefined, "icon": mdiStoreMarker, typeOptions: {}, helperText: "Enter the name of the restaurant you're reviewing" },
        { label: "Food", type: "star", value: undefined, "icon": mdiNoodles, typeOptions: {}, helperText: "This is some additional text" },
        { label: "Drinks", type: "star", value: undefined, "icon": mdiGlassCocktail, typeOptions: {}, helperText: "This is some additional text" },
        { label: "Service", type: "star", value: undefined, "icon": mdiAvTimer, typeOptions: {}, helperText: "This is some additional text" },
        { label: "Ambiance", type: "star", value: undefined, "icon": mdiCeilingLight, typeOptions: {}, helperText: "This is some additional text" },
        { label: "Wow", type: "number", value: undefined, "icon": mdiExclamationThick, typeOptions: yesNoOptions, helperText: "This is some additional text" },
        { label: "Presentation", type: "star", value: undefined, "icon": mdiRoomService, typeOptions: {}, helperText: "This is some additional text" },
        { label: "Vibes", type: "star", value: undefined, "icon": mdiCrystalBall, typeOptions: yesNoOptions, helperText: "This is some additional text" },
        { label: "Value", type: "star", value: undefined, "icon": mdiCashMultiple, typeOptions: {}, helperText: "This is some additional text" },
        { label: "Comment", type: "textarea", value: undefined, "icon": mdiCommentProcessing, typeOptions: {}, helperText: "This is some additional text" },
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
        return 2.5;
    }
  
    async function addReview() {
        // TODO: validation

        const restaurantName = formSteps[0].value as string;
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
    
            status = `Review for ${restaurantName} successfully added. Got id ${id}`;
        } catch (error) {
            status = `Failed to add review for ${restaurantName}: ${error}`;
        }
    }

</script>

<TabBar tabs={formSteps} let:tab bind:active>
    <Tab {tab}>
        <Icon class="tab-bar-icon" style="width: 1.5em; height: 1.5em;" tag="svg" viewBox="0 0 24 24">
            <path fill="currenColor" d={tab.icon} />
        </Icon>
    </Tab>
</TabBar>

<p>{status}</p>
<div class="form-wrapper">
    <IconButton onclick={() => prevItem()}>
        <Icon tag="svg" viewBox="0 0 24 24">
            <path fill="currentColor" d={mdiChevronLeft} />
        </Icon>
    </IconButton>
    <div class="test">
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
                    <!-- {formStep.value} -->
                    <StarRating bind:rating={formStep.value as number}/>
                {:else if formStep.type === 'number'}
                    <input
                        type={formStep.type}
                        min={(formStep.typeOptions as NumberOptions).min}
                        max={(formStep.typeOptions as NumberOptions).max}
                        step={(formStep.typeOptions as NumberOptions).step}
                        bind:value={formStep.value}
                    />
                {:else if formStep.type === 'textArea'}
                    <textarea bind:value={formStep.value}></textarea>
                {/if}
            </div>
        {/each}
    </div>
</div>
<IconButton onclick={nextItem}>
    <Icon tag="svg" viewBox="0 0 24 24">
        <path fill="currentColor" d={mdiChevronRight} />
    </Icon>
</IconButton>
</div>
<button on:click={addReview} class="btn submit-btn">Add Review</button>

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
        width: 100%; /* Make sure the form container adapts to the center column width */
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
        justify-content: center; /* Center contents horizontally */
        text-align: center;
        /* align-items: center; Center contents vertically if needed */
    }

    .test {
        overflow: hidden;
    }

    .submit-btn {
        display: block;
        background-color: #28a745; /* Green color for the "Add Review" button */
        /* margin-top: 10px; Space above the submit button */
        width: 40%;
        margin: 30px auto 0px auto;
    }

    .submit-btn:hover {
        background-color: #218838;
    }
</style>
