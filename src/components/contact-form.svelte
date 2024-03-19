<script lang="ts">
    import type {IAcfField} from "@models/general.ts";
    import {z} from "zod";
    import Fields from "@components/form-fields.svelte";
    import {onMount} from "svelte";

    export let fields: IAcfField[] = [],
        level = 0;
    let schema;
    let model = {};
    let errors = {};
    let ready = false;
    let success = false;

    onMount(() => {
            schema = z.object({});
            fields.forEach(field => {
                if (field.type === 'group' && Array.isArray(field.sub_fields)) {
                    field.sub_fields.filter(f => f.required === 1).forEach(f => {
                        schema = schema.extend({
                            [f._name]: f.type === 'email' ? z.string().email() : z.string().min(3, 'Too few characters')
                        });

                    });
                } else {
                    if (field.required !== 1) {
                        return;
                    }
                    schema = schema.extend({
                        [field._name]: field.type === 'email' ? z.string().email() : z.string().min(3, 'Too few characters')
                    });

                }
            })

            fields.forEach(f => model[f._name] = '');


        ready = true;
    });

    async function submit(e) {
        errors = {};
        e.preventDefault();

        document.querySelectorAll('[data-id]').forEach(node => {
            model[node.getAttribute('data-id')] = node.value;
        })

        try {
            schema.parse(model)
        }
        catch (e) {
            if (e instanceof z.ZodError) {
                e.issues.forEach(issue => {
                    errors[issue.path[0]] = issue.message;
                })
            }

            return;
        }

        const res = await fetch('/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(model)
        });

        const data = await res.json();
        if (data.success) {
            success = true;
            setTimeout(() => {
                success = false;
            }, 5000);
        }

    }
</script>

    {#if success}
    <div class="text-center my-6">
        <div class="p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400" role="alert">
            <span class="font-medium">Thank you!</span> Your message has been sent.
        </div>
    </div>
    {/if}
{#if ready}
<form>
    <Fields {fields} bind:errors={errors} />

    <button onclick={submit}
            type="submit" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Send</button>
</form>
{/if}



