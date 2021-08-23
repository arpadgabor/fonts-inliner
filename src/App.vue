<script setup lang="ts">
import { ref, watch, watchEffect } from 'vue'
import ky from 'ky'

const url = ref<string>()
const fontFile = ref<string>()
const resultCss = ref<string>()

async function fetchFont(url: string) {
  const response = await ky.get(url)
  return await response.text()
}

watch(url, async url => {
  if (!url?.includes('https://fonts.googleapis.com/css2')) {
    fontFile.value = ''
    return
  }

  fontFile.value = await fetchFont(url)
  console.log(fontFile.value.split('\n'))
})

watchEffect(async () => {
  if (!fontFile.value) return

  const regex = /url\((.*?)\)/g

  const replacer = async (url: string): Promise<string> => {
    const result = await ky.get(url)
    const blob = await result.blob()

    const base64 = await new Promise<string>(async (res, rej) => {
      const reader = new FileReader()
      reader.readAsDataURL(blob)

      reader.onload = () => res(reader.result!.toString())
      reader.onerror = () => rej(reader.error)
    })

    return base64
  }

  const replacings: Promise<string>[] = []
  fontFile.value.replace(regex, (src, url: string) => {
    replacings.push(replacer(url))
    return src
  })

  const replaceResults = await Promise.all(replacings)

  const result = fontFile.value.replace(
    regex,
    () => `url('${replaceResults.shift()!}')`
  )

  resultCss.value = result
})
</script>

<template>
  <div class="container pt-4">
    <h1>Some text for testing</h1>
    <input
      type="text"
      v-model="url"
      class="bg-gray-200 focus:bg-gray-100 rounded w-full py-2 px-3 transition"
    />

    <template v-if="resultCss">
      <hr class="my-4" />

      <div class="p-4 bg-gray-100 rounded">
        <code class="max-w-full overflow-hidden">
          <pre class="max-w-full overflow-auto">{{ resultCss }}</pre>
        </code>
      </div>
    </template>
  </div>
</template>

<style>
body {
  font-family: 'Roboto' !important;
  font-weight: 500;
}
</style>
