<template>
  <div
    v-show="visible"
    class="min-h-full min-w-full overflow-hidden flex items-center justify-center"
  >
    <div class="flex space-x-2">
      <div
        class="w-5 h-5 bg-olive-600 bg-opacity-75 rounded-full animate-loading animation-delay-100"
      ></div>
      <div
        class="w-5 h-5 bg-olive-600 bg-opacity-75 rounded-full animate-loading animation-delay-200"
      ></div>
      <div
        class="w-5 h-5 bg-olive-600 bg-opacity-75 rounded-full animate-loading animation-delay-300"
      ></div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'

export default {
  name: 'ndow-loading',
  setup() {
    const visible = ref(false)

    onMounted(() => {
      setTimeout(() => { visible.value = true }, 200)
    })

    return { visible }
  }
}
</script>
