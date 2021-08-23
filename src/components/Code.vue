<script setup lang="ts">
import { ref } from 'vue'
import prism from 'prismjs'

const props = defineProps({
  code: { type: String, required: true },
})

const isCopied = ref(false)
const onCopy = () => {
  navigator.clipboard.writeText(props.code)
  isCopied.value = true
  setTimeout(() => (isCopied.value = false), 2500)
}

const highlightedCode = prism.highlight(props.code, prism.languages.css, 'css')
</script>

<template>
  <div class="max-w-full overflow-hidden bg-$prism-background rounded relative">
    <button
      @click.prevent="onCopy"
      :class="'absolute top-2 right-2 px-2 py-1 font-mono bg-gray-900 bg-opacity-50 text-white rounded'"
    >
      {{ isCopied ? 'Copied!' : 'Copy CSS' }}
    </button>
    <pre class="overflow-auto p-4"><code v-html="highlightedCode"></code></pre>
  </div>
</template>

<style lang="postcss">
@import 'prism-theme-vars/base.css';

html:not(.dark) {
  --prism-foreground: #393a34;
  --prism-background: #f8f8f8;

  --prism-comment: #758575;
  --prism-namespace: #444444;
  --prism-string: #bc8671;
  --prism-punctuation: #80817d;
  --prism-literal: #36acaa;
  --prism-keyword: #248459;
  --prism-function: #849145;
  --prism-deleted: #9a050f;
  --prism-class: #2b91af;
  --prism-builtin: #800000;
  --prism-property: #ce9178;
  --prism-regex: #ad502b;
}

html.dark {
  --prism-foreground: #d4d4d4;
  --prism-background: #1e1e1e;

  --prism-namespace: #aaaaaa;
  --prism-comment: #758575;
  --prism-namespace: #444444;
  --prism-string: #ce9178;
  --prism-punctuation: #d4d4d4;
  --prism-literal: #36acaa;
  --prism-keyword: #38a776;
  --prism-function: #dcdcaa;
  --prism-deleted: #9a050f;
  --prism-class: #4ec9b0;
  --prism-builtin: #d16969;
  --prism-property: #ce9178;
  --prism-regex: #ad502b;
}
</style>
