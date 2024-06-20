<script lang="ts">

    let show = false;


    function handleBackdropClick() {
        show = false;
    }

    function toggle() {
        show = !show;
    }
</script>
<button on:click={toggle} class="flex gap-2.5 my-4" title="Menu">
    <slot name="button">Toggle</slot>
</button>
{#if show}
<div id="backdrop" class="fixed z-50 inset-0 bg-gray-500 bg-opacity-25 transition-opacity" on:click={handleBackdropClick}></div>
{/if}
<div id="drawer-navigation"
     class:block={show} class:hidden={!show} class:slide-right={show} class:slide-left={!show}
     class="fixed top-0 left-0 z-50 h-screen p-4 overscroll-contain overflow-y-auto w-80 bg-gray-800">
    <h5 id="drawer-navigation-label" class="text-base font-semibold text-gray-500 uppercase dark:text-gray-400">
        <slot name="title">Menu</slot>
    </h5>
    <button on:click={toggle} type="button" data-drawer-hide="drawer-navigation" aria-controls="drawer-navigation" class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 absolute top-2.5 end-2.5 inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white" >
        <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
        <span class="sr-only">Close menu</span>
    </button>
    <div class="py-4 overflow-y-auto">
        <slot></slot>
    </div>
</div>


<style>
    .slide-right {
        -webkit-animation: slide-right 0.3s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
        animation: slide-right 0.3s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
    }

    @-webkit-keyframes slide-right {
        0% {
            -webkit-transform: translateX(-100%);
            transform: translateX(-100%);
        }
        100% {
            -webkit-transform: translateX(0);
            transform: translateX(0);
        }
    }
    @keyframes slide-right {
        0% {
            -webkit-transform: translateX(-100%);
            transform: translateX(-100%);
        }
        100% {
            -webkit-transform: translateX(0);
            transform: translateX(0);
        }
    }

    .slide-left {
        -webkit-animation: slide-left 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
        animation: slide-left 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
    }

    @-webkit-keyframes slide-left {
        0% {
            -webkit-transform: translateX(0);
            transform: translateX(0);
        }
        100% {
            -webkit-transform: translateX(-100%);
            transform: translateX(-100%);
        }
    }
    @keyframes slide-left {
        0% {
            -webkit-transform: translateX(0);
            transform: translateX(0);
        }
        100% {
            -webkit-transform: translateX(-100%);
            transform: translateX(-100%);
        }
    }

</style>
