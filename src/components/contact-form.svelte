<script lang="ts">
    import type {IAcfField, IGenericObject} from "@models/general.ts";
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
    export let labels: IGenericObject = {};

    onMount(() => {
        schema = z.object({});
        fields.forEach(field => {
            if (field.type === 'group' && Array.isArray(field.sub_fields)) {
                field.sub_fields.filter(f => f.required === 1).forEach(f => {
                    schema = schema.extend({
                        [f._name]: f.type === 'email' ? z.string().email() : z.string().min(3, labels['too_few_characters'] || 'Too few characters')
                    });

                });
            } else {
                if (field.required !== 1) {
                    return;
                }
                schema = schema.extend({
                    [field._name]: field.type === 'email' ? z.string().email({message: labels['invalid_email'] || 'Invalid Email'}) : z.string().min(3, labels['too_few_characters'] || 'Too few characters')
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
            <span class="font-medium">{labels['thank_you'] || 'Thank you!'}</span>
            {labels['success_message'] || 'Your message has been sent successfully.'}
        </div>
    </div>
{/if}
{#if ready}
    <form>

        <Fields {fields} bind:errors={errors} labels={labels} />

        <button on:click={submit}
                type="submit" class="btn-primary w-full">
            {labels['send'] || 'Send'}
        </button>
    </form>
{/if}



