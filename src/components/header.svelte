<script lang="ts">
    import SideBar from '@components/sidebar.svelte';
</script>
<header>
    <div class="md:hidden">

    </div>
    <nav class="bg-white border-gray-200 px-4 lg:px-6 py-2.5">
        <div class="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
            <a href="/" title="Cleaning.gr Αρχική">
                <slot name="logo"></slot>
            </a>
            <div class="flex items-center lg:order-2">
                <div class="block lg:hidden">
                <SideBar>
                    <svelte:fragment slot="button">
                        <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h15M1 7h15M1 13h15"/>
                        </svg>
                    </svelte:fragment>
                    <slot></slot>
                </SideBar>
                </div>
            </div>
            <div class="hidden justify-between items-center w-full lg:flex lg:w-auto lg:order-1" id="desktop-menu">
                <slot></slot>

            </div>
        </div>
    </nav>
</header>
