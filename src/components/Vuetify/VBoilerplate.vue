<template>
  <div>
    <v-skeleton-loader v-for="(s, idx) in skeletons" :key="idx" :type="s" :elevation="elevation" tile />
  </div>
</template>

<script>
export default {
  props: {
    skeletons: { type: Array, default: () => [] },
    elevation: { type: Number, default: 2 }
  }
};
</script>
