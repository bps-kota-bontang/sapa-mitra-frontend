import { onMounted, onUnmounted, ref } from "vue";

export const usePagerCount = () => {
  const pagerCount = ref(typeof window !== "undefined" && window.innerWidth <= 768 ? 5 : 7);

  const updatePagerCount = () => {
    pagerCount.value = window.innerWidth <= 768 ? 5 : 7;
  };

  onMounted(() => window.addEventListener("resize", updatePagerCount));
  onUnmounted(() => window.removeEventListener("resize", updatePagerCount));

  return pagerCount;
};