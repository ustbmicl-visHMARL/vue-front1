<script setup>
import { onMounted, ref } from 'vue'
import hljs from 'highlight.js/lib/core'
import python from 'highlight.js/lib/languages/python'
import 'highlight.js/styles/github-dark.css' // 选择一个喜欢的主题

hljs.registerLanguage('python', python)

// 接收 props
defineProps({
  code: {
    type: String,
    required: true
  }
})

// 绑定代码元素的引用
const codeElement = ref(null)

onMounted(() => {
  if (codeElement.value) {
    hljs.highlightBlock(codeElement.value)
  }
})
</script>

<template>
  <div class="python-code">
    <pre><code ref="codeElement" class="language-python">{{ code }}</code></pre>
  </div>
</template>

<style scoped>
.python-code {
  padding: 1rem;
  padding-top: 0;
  padding-bottom: 0;
  border-radius: 8px;
  font-family: 'Fira Code', monospace;
  font-size: 1rem;
  overflow-x: auto;
}
.python-code pre {
  margin: 14px auto;
}
</style>
