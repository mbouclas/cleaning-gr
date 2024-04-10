<script lang="ts">

    import 'glightbox/dist/css/glightbox.min.css';
    import {onMount} from "svelte";

    onMount(async () => {
        if (!window) {
            return;
        }

        const GLightboxImport = await import('glightbox');
        const GLightbox = GLightboxImport.default;

        const lightbox = GLightbox({
            touchNavigation: true,
            selector: ".gallery",
        });

    });
</script>
<slot></slot>
