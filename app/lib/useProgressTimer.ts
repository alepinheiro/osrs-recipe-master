import { ref, onMounted, onUnmounted, watch } from "vue";

export function useProgressTimer(intervalRef: { value: number }) {
  const progress = ref(0);
  let lastTick = Date.now();
  let timer: number | null = null;

  function restartTimer() {
    stopTimer();
    lastTick = Date.now();
    progress.value = 0;
    startTimer();
  }

  function startTimer() {
    timer = window.setInterval(() => {
      const now = Date.now();
      const elapsed = now - lastTick;
      const total = intervalRef.value * 1000;
      progress.value = Math.min(100, (elapsed / total) * 100);
      if (progress.value >= 100) {
        lastTick = Date.now();
        progress.value = 0;
      }
    }, 100);
  }

  function stopTimer() {
    if (timer !== null) {
      clearInterval(timer);
      timer = null;
    }
  }

  onMounted(() => {
    restartTimer();
  });

  onUnmounted(() => {
    stopTimer();
  });

  watch(
    () => intervalRef.value,
    () => {
      restartTimer();
    },
  );

  return {
    progress,
    restartTimer,
    stopTimer,
  };
}
