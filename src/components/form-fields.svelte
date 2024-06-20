<script lang="ts">
    import type {IAcfField, IGenericObject} from "@models/general.ts";


    export let fields: IAcfField[];
    export let level = 0;
    export let errors: Record<string, string> = {};
    export let labels: IGenericObject = {};

    // $effect(() => console.log(fields))

    function label(key: string, field: IAcfField) {

        return labels[key] || field._name;

    }
</script>

{#each fields as field}
    {#if field.type === 'group' && Array.isArray(field.sub_fields)}
        <div class={`grid grid-cols-${field.sub_fields.length} gap-5`}>
            <svelte:self fields={field.sub_fields} level={level + 1} bind:errors={errors} {labels} />
        </div>
    {:else}
        <div class="relative z-0 w-full mb-5 group">
            {#if ['text','email'].indexOf(field.type) !== -1}
                <label for={field._name} class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                    {label(field._name, field)}
                </label>
                <input type={field.type} required={field.required === 1} data-id={field._name}
                       name={field._name} id={field._name} class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                       placeholder={label(field._name, field)} />

            {:else if field.type === 'textarea'}
                <label for={field._name} class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{label(field._name, field)}</label>
                <textarea data-id={field._name}
                          id={field._name} rows="4" class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder={label(field._name, field)}></textarea>

            {/if}
            {#if field.instructions}
                <p id="helper-text-explanation" class="mt-2 text-sm text-gray-500 dark:text-gray-400">{labels[`instructions_${field._name}`] || field.instructions}</p>
            {/if}

            {#if errors[field._name]}
                <p class="mt-2 text-sm text-red-600 dark:text-red-500">{errors[field._name]}</p>
            {/if}


        </div>
    {/if}

{/each}
