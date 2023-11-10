<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router";
import LogoSVG from '@/assets/UwULogo.vue';
import LoungeLogo from '@/assets/LoungeLogo.vue';
</script>

<template>
  <header class="mx-[-2rem]">
    <div class="relative w-full h-[21.875rem]">
      <div class="absolute w-full h-full">
        <img class="max-w-[initial] h-[21.875rem] absolute left-1/2 translate-x-[-50%]" src="./assets/UwUFCHouse-2.0.png">
        <div class="absolute w-full h-full z-10 top-0 bg-gradient-to-b from-[#181818] via-[#18181840] to-[#181818]"></div>
      </div>
      <div class="flex items-center pt-4 gap-8 z-20">
        <div class="flex items-center">
          <span>
            <LogoSVG />
          </span>
          <span class="-ml-4">
            <LoungeLogo />
          </span>
        </div>
        <nav class="ml-auto">
          <RouterLink to="/">To Mount Tracking</RouterLink>
          <RouterLink to="/minions">To Minion Listings</RouterLink>
          <RouterLink to="/gear">Desynth Gear</RouterLink>
          <!-- <RouterLink to="/test">Testing</RouterLink> -->
        </nav>
      </div>
    </div>
  </header>
  <RouterView />
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    /*padding-right: calc(var(--section-gap) / 2);*/
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
