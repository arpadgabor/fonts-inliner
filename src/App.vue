<script setup lang="ts">
import Code from './components/Code.vue'
import type { FontFamily } from './logic/types'

import { onMounted, ref, watch } from 'vue'
import { fetchFont, parseFont } from './logic'

const url = ref<string>()
const font = ref<FontFamily>()

const previewCSS = ref<string>('')
const stylesheet = ref<HTMLStyleElement>()

watch(url, async url => {
  if (!url?.includes('https://fonts.googleapis.com/css2')) {
    font.value = undefined
    return
  }

  const raw = await fetchFont(url)
  font.value = await parseFont(raw)

  previewCSS.value = font.value.fonts.map(({ css }) => css).join('\n')

  stylesheet.value!.innerText! = previewCSS.value
})

onMounted(() => {
  url.value =
    'https://fonts.googleapis.com/css2?family=Roboto:wght@400;500&display=swap'
  stylesheet.value = document.createElement('style')
  stylesheet.value.appendChild(document.createTextNode(''))

  document.head.appendChild(stylesheet.value)
})
</script>

<template>
  <div class="container py-4 flex flex-col min-h-screen">
    <header class="mb-4">
      <h1 class="text-4xl font-bold font-sans">Google Fonts Inliner</h1>
    </header>

    <main class="flex-1">
      <input
        aria-label="Paste a Google Fonts URL"
        placeholder="Paste a Google Fonts URL"
        type="text"
        v-model="url"
        :class="[
          'bg-gray-100 focus:bg-white rounded w-full py-2 px-3 transition',
          'border border-gray-200 font-mono',
        ]"
        focus
      />

      <template v-if="font">
        <hr class="my-4" />

        <textarea
          class="w-full p-4"
          :style="{ fontFamily: `'${font.name}'` }"
          value="Type here to test the font. 1234567890"
        >
        </textarea>

        <hr class="my-4" />

        <Code :key="previewCSS" :code="previewCSS"></Code>
      </template>

      <p v-else class="mt-4 text-gray-600">
        <strong>How to:</strong> Choose your font from
        <a href="Google Fonts">Google Fonts</a>, select your desired styles, and
        paste the URL in the input above.
      </p>
    </main>

    <footer class="mt-8">
      <p>
        <small>
          Made with ❤ by
          <a href="https://twitter.com/arpad_gabor">Arpad</a>, with Vue 3.
          <a href="https://github.com/arpadgabor/fonts-inliner">GitHub</a>
        </small>
      </p>
    </footer>
  </div>
</template>

<style lang="postcss">
body {
  @apply overflow-y-scroll;
}

a {
  @apply underline !important;
}
</style>
