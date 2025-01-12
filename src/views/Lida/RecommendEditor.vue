<script setup lang="tsx">
import { CodeEditor } from '@/components/CodeEditor'
import { ContentWrap } from '@/components/ContentWrap'
import { onMounted, ref } from 'vue'
import { defineProps } from 'vue'

const props = defineProps({
  code: String
})
onMounted(() => {
  console.log(props)
})

const MonacoEditRef = ref<InstanceType<typeof CodeEditor>>()
</script>
<template>
  <ContentWrap>
    <div class="edit-container h-60vh">
      <CodeEditor ref="MonacoEditRef" v-model="props!.code" language="python" />
    </div>
  </ContentWrap>
</template>
