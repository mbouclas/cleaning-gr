<script lang="ts">
    import Swiper from 'swiper';
    import { Navigation, Pagination, Autoplay } from 'swiper/modules';
    import {onMount} from "svelte";
    // import Swiper styles
    // let { width = 100, height = 50 } = $props<{width: number, height: number}>();

    onMount(() => {
        Swiper.use([Navigation, Pagination, Autoplay]);
            const progressCircle = document.querySelector(".autoplay-progress svg");
            const progressContent = document.querySelector(".autoplay-progress span");
            const progressIndicator = document.querySelector(".autoplay-progress");
            const swiper = new Swiper('.swiper-container', {
                    // Optional parameters
                    direction: 'horizontal',
                    loop: true,
                    slidesPerView: 1,
                    spaceBetween: 30,
                    centeredSlides: true,
                    autoplay: {
                            delay: 5000,
                            disableOnInteraction: true,
                    },
                    // If we need pagination
                    pagination: {
                            el: '.swiper-pagination',
                            clickable: true,
                    },
                    navigation: {
                            nextEl: '.next-page',
                            prevEl: '.previous-page',
                    },

                    on: {
                            autoplayPause(swiper: Swiper) {
                                    progressIndicator.style.setProperty("display", 'none');
                            },
                            autoplayStart(swiper: Swiper) {
                                    progressIndicator.style.setProperty("display", 'flex');
                            },
                            autoplayTimeLeft(s, time, progress) {
                                    progressCircle.style.setProperty("--progress", 1 - progress);
                                    progressContent.textContent = `${Math.ceil(time / 1000)}s`;
                            },
                    },
            });


    })
</script>

        <slot></slot>




