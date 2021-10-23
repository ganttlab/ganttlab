<template functional>
  <svg
    class="spinner"
    :width="props.size"
    :height="props.size"
    viewBox="0 0 50 50"
  >
    <circle class="path" cx="25" cy="25" r="20" fill="none" stroke-width="5" />
  </svg>
</template>

<script>
export default {
  props: {
    size: {
      type: [Number, String],
      default: 16,
    },
  },
};
</script>

<style lang="scss" scoped>
.spinner {
  animation: rotate 2s linear infinite;
  z-index: 2;

  & .path {
    stroke: currentColor;
    stroke-linecap: round;
    animation: dash 1.5s ease-in-out infinite;
  }
}

@keyframes rotate {
  100% {
    transform: rotate(360deg);
  }
}

@keyframes dash {
  0% {
    stroke-dasharray: 1, 150;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -35;
  }
  100% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -124;
  }
}
</style>
