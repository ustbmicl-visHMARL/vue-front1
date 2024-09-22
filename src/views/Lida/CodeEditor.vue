<script setup lang="tsx">
import { CodeEditor } from '@/components/CodeEditor'
import { useI18n } from '@/hooks/web/useI18n'
import { ContentWrap } from '@/components/ContentWrap'
import { onMounted, ref } from 'vue'
import { defineProps } from 'vue'

const props = defineProps({
  code: String
})
onMounted(() => {
  console.log(props)
})
const { t } = useI18n()

const MonacoEditRef = ref<InstanceType<typeof CodeEditor>>()
</script>
<template>
  <ContentWrap :title="t('lidaDemo.codeTitle')" :message="t('richText.codeEditorDes')">
    <div class="edit-container h-60vh">
      <CodeEditor ref="MonacoEditRef" v-model="props!.code" language="python" />
    </div>
  </ContentWrap>
</template>
