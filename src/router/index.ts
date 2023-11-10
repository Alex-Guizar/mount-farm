import { createRouter, createWebHashHistory } from "vue-router";
import HomeView from "@/views/HomeView.vue";
import MinionView from "@/views/MinionView.vue";
import GearView from "@/views/GearView.vue";
import TestViewVue from "@/views/TestView.vue";
import SlotViewVue from "@/views/SlotView.vue";

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/minions",
      name: "minion",
      component: MinionView,
    },
    {
      path: "/gear",
      name: "gear",
      component: GearView,
    },
    {
      path: "/test",
      name: "test",
      component: TestViewVue,
    },
    {
      path: "/slots",
      name: "slots",
      component: SlotViewVue,
    }
  ],
});

export default router;
