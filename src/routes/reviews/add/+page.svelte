<script lang="ts">
	import { db } from "$lib/db";
    import "$lib/style/form.css";
    import Tab, { Icon, Label } from '@smui/tab';
    import TabBar from '@smui/tab-bar';
    import StarRating from "$lib/components/starRating.svelte";

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
    }

    let formSteps: FormStep[] = [
        { label: "Name", type: "text", value: undefined, "icon": "", typeOptions: {} },
        { label: "Food", type: "star", value: 1, "icon": "", typeOptions: {} },
        { label: "Drinks", type: "star", value: undefined, "icon": "", typeOptions: {} },
        { label: "Service", type: "star", value: undefined, "icon": "", typeOptions: {} },
        { label: "Ambiance", type: "star", value: undefined, "icon": "", typeOptions: {} },
        { label: "Wow", type: "number", value: undefined, "icon": "", typeOptions: yesNoOptions },
        { label: "Presentation", type: "star", value: undefined, "icon": "", typeOptions: {} },
        { label: "Vibes", type: "star", value: undefined, "icon": "", typeOptions: yesNoOptions },
        { label: "Value", type: "star", value: undefined, "icon": "", typeOptions: {} },
        { label: "Comment", type: "textarea", value: undefined, "icon": "", typeOptions: {} },
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
        <Icon class="material-icons">{tab.icon}</Icon>
        <Label>{tab.label}</Label>
    </Tab>
</TabBar>

<p>{status}</p>
<div class="form-wrapper">
<div class="form-container" style="transform: translateX(-{activeIndex * 100}%);">
    {#each formSteps as formStep, i }
        <div class={getClassesForIndex(i)}>
            {formStep.label}:
            {#if formStep.type === "text"}
                <input
                    type={formStep.type}
                    bind:value={formStep.value}
                />
            {:else if formStep.type === 'star'}
                {formStep.value}
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
<div class="form-controls">
    <div class="nav-buttons">
        <button on:click={prevItem} class="btn prev-btn">Prev</button>
        <button on:click={nextItem} class="btn next-btn">Next</button>
    </div>
    <button on:click={addReview} class="btn submit-btn">Add Review</button>
</div>

<style>
    .form-wrapper {
        width: 100%;
        overflow: hidden;
    }

    .form-container {
        display: flex;
        transition: transform 0.5s ease-in-out;
        width: 100%;
    }

    .form-step {
        min-width: 96vw;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
    }

    /* Container for button layout */
    .form-controls {
        display: flex;
        flex-direction: column; /* Stack buttons vertically */
        justify-content: center;
        margin-top: 20px;
        padding: 10px 0;
    }

    /* Navigation buttons container */
    .nav-buttons {
        display: flex;
        justify-content: space-between; /* Space between Prev and Next buttons */
        margin-bottom: 10px; /* Space between the nav buttons and the submit button */
    }

    /* Specific button styles */
    .prev-btn {
        background-color: #6c757d; /* Gray color for the "Prev" button */
    }

    .prev-btn:hover {
        background-color: #5a6268;
    }

    .next-btn {
        background-color: #007bff; /* Primary color for the "Next" button */
    }

    .next-btn:hover {
        background-color: #0056b3;
    }

    .submit-btn {
        background-color: #28a745; /* Green color for the "Add Review" button */
        margin-top: 10px; /* Space above the submit button */
        align-self: center;
    }

    .submit-btn:hover {
        background-color: #218838;
    }

    /* Responsive design for larger screens */
    @media (min-width: 600px) {
        .btn {
            padding: 10px 16px; /* Adjust padding for larger screens */
        }
    }
</style>
