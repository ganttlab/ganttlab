<template functional>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    :width="props.size"
    :height="props.size"
    viewBox="0 0 130 130"
  >
    <g class="layer">
      <g class="layer" fill="currentColor">
        <path
          d="M90.16172 106.56387H39.83828c-21.28164 0-38.80078-17.40156-38.80078-38.80078v-5.52617c0-21.28164 17.51914-38.80078 38.80078-38.80078h50.32344c21.39922 0 38.80078 17.51914 38.80078 38.80078v5.52617c0 21.39922-17.51914 38.80078-38.80078 38.80078z"
        />
        <circle r="10.58203" cy="65.05879" cx="41.48438" />
        <circle r="10.58203" cy="65.05879" cx="65" />
        <circle r="10.58203" cy="65.05879" cx="88.51563" />
      </g>
    </g>
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
@mixin fadeHelper($delay) {
  opacity: 0.35;
  animation: fade 0.7s cubic-bezier(0.39, 0.58, 0.57, 1) $delay infinite
    alternate-reverse;
}

path {
  @apply text-gray-100;
  animation: expandBiggest 1s linear infinite alternate;
}

circle {
  @apply text-gray-200;

  &:nth-of-type(1) {
    @include fadeHelper(0s);
  }

  &:nth-of-type(2) {
    @include fadeHelper(0.4s);
  }

  &:nth-of-type(3) {
    @include fadeHelper(0.8s);
  }
}

@keyframes fade {
  from {
    opacity: 1;
  }
  to {
    opacity: 0.45;
  }
}

@mixin scaleCircle($factor, $cx, $cy) {
  transform: translate((1 - $factor) * $cx + px, (1 - $factor) * $cy + px)
    scale($factor);
}

@keyframes expandTiny {
  from {
    transform: scale(1);
  }
  to {
    @include scaleCircle(1.1, -41, 74.8);
  }
}

@keyframes expandBigger {
  from {
    transform: scale(1);
  }
  to {
    @include scaleCircle(1.1, -25.2, 62.6);
  }
}

@keyframes expandBiggest {
  from {
    transform: scale(1);
  }
  to {
    transform: translate(-0.525px, -0.9487500190734863px) scale(1.025);
  }
}
</style>
