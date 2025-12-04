import { ref, watch, onMounted, onUnmounted } from "vue";

/**
 * useInterval composable
 * @param callback - function to call on each interval
 * @param interval - interval in ms (reactive)
 * @returns { start, stop, isActive }
 */
export function useInterval(callback: () => void, interval: Ref<number>) {
  const timer = ref<number | null>(null);
  const isActive = ref(false);

  function start() {
    stop();
    isActive.value = true;
    timer.value = window.setInterval(callback, interval.value);
  }

  function stop() {
    if (timer.value !== null) {
      clearInterval(timer.value);
      timer.value = null;
      isActive.value = false;
    }
  }

  watch(interval, (newVal, oldVal) => {
    if (isActive.value) {
      start(); // reinicia com novo intervalo
    }
  });

  onMounted(() => {
    start();
  });

  onUnmounted(() => {
    stop();
  });

  return { start, stop, isActive };
}
