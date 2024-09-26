<!-- FriendAdder.svelte -->
<script lang="ts">
	import { db } from "$lib/db";
    import "$lib/style/form.css";

    let status = "";

    // let restaurantName = "";
    // let foodScore: number | undefined;
    // let drinkScore: number | undefined;
    // let serviceScore: number | undefined;
    // let ambianceScore: number | undefined;
    // let wowScore: boolean | undefined;
    // let presentationScore: number | undefined;
    // let vibesScore: boolean | undefined;
    // let valueScore: number | undefined;
    // let comment: string | undefined;

    interface NumberOptions {
        min: number,
        max: number,
        step: number,
    }

    let starOptions: NumberOptions = { min: 0, max: 0, step: .25 };
    let yesNoOptions: NumberOptions = { min: 0, max: 1, step: .25 };

    interface FormStep {
        label: string,
        type: string,
        bind: string,
        key: string,
        value: number | string | undefined,
        typeOptions: NumberOptions | {},
    }

    let formSteps: FormStep[] = [
        { label: "Name", type: "text", bind: 'my-class', key: "restaurantName", value: undefined, typeOptions: {} },
        { label: "Food", type: "number", bind: 'my-class', key: "foodScore", value: undefined, typeOptions: starOptions },
        { label: "Drinks", type: "number", bind: 'my-class', key: "drinkScore", value: undefined, typeOptions: starOptions },
        { label: "Service", type: "number", bind: 'my-class', key: "foodScore", value: undefined, typeOptions: starOptions },
        { label: "Ambiance", type: "number", bind: 'my-class', key: "ambianceScore", value: undefined, typeOptions: starOptions },
        { label: "Wow", type: "number", bind: 'my-class', key: "wowScore", value: undefined, typeOptions: yesNoOptions },
        { label: "Presentation", type: "number", bind: 'my-class', key: "presentationScore", value: undefined, typeOptions: starOptions },
        { label: "Vibes", type: "number", bind: 'my-class', key: "vibesScore", value: undefined, typeOptions: yesNoOptions },
        { label: "Value", type: "number", bind: 'my-class', key: "valueScore", value: undefined, typeOptions: starOptions },
        { label: "Comment", type: "textarea", bind: 'my-class', key: "commentScore", value: undefined, typeOptions: {} },
    ];

    let activeIndex = 0;

    function nextItem() {
        // Increment the index and loop back to the start if necessary
        activeIndex = (activeIndex + 1) % formSteps.length;
    }

    function prevItem() {
        // Decrement the index and loop to the end if necessary
        activeIndex = (activeIndex - 1 + formSteps.length) % formSteps.length;
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


<p>{status}</p>
<div class="form-container" style="transform: translateX(-{activeIndex * 100}%);">
    {#each formSteps as formStep, i }
        <div class={getClassesForIndex(i)}>
            {formStep.label}:
            {#if formStep.type === "text"}
                <input
                    type={formStep.type}
                    bind:value={formStep.value}
                />
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
        display: flex;
        flex-direction: column;
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

    /* Shared button styles */
    .btn {
        max-width: 10em;
        padding: 8px 12px; /* Smaller padding for buttons */
        border: none;
        border-radius: 4px; /* Slightly smaller border-radius for compactness */
        color: white;
        font-size: 14px; /* Smaller font size for compact buttons */
        font-weight: 500;
        cursor: pointer;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        transition: background-color 0.3s ease, box-shadow 0.3s ease, transform 0.2s ease;
        flex: 1; /* Allow buttons to grow */
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
