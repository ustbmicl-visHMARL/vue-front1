<template>
  <div class="inputList">
    <div v-for="(input, index) in inputs" :key="index">
      <div class="couple">
        <div class="external">
          external{{ index }}:
          <el-input v-model="input.value[0]" :placeholder="getPlaceholder(index)" />
        </div>
        <div class="internal">
          internal{{ index }}:
          <el-input
            v-model="input.value[1]"
            :placeholder="getPlaceholder(index)"
            :disabled="index === 0"
          />
        </div>
      </div>
    </div>
    <el-button @click="addInput">Add</el-button>
  </div>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'

// Define a reactive array to store input values
const inputs = reactive([
  { value: ['', '8080'], placeholderWarning: false },
  { value: ['', ''], placeholderWarning: false }
])

inputs.pop()
// Method to add a new input field
const addInput = () => {
  // Check if the last input is empty
  if (inputs[inputs.length - 1].value[0].trim() === '') {
    inputs[inputs.length - 1].placeholderWarning = true
  } else {
    inputs.push({ value: ['', ''], placeholderWarning: false })
  }
}

// Function to get the placeholder text with a warning if the field is empty
const getPlaceholder = (index: number) => {
  if (
    inputs[index].value[0].trim() === '' &&
    inputs[index].value[1].trim() === '' &&
    inputs[index].placeholderWarning
  ) {
    setTimeout(() => {
      inputs[index].placeholderWarning = false
    }, 1000)
    return 'Please enter a value before add'
  }
  return 'number'
}
</script>

<style scoped>
.inputList {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.couple {
  display: flex;
}

.couple > div {
  flex: 1;
}

.couple .el-input {
  width: 80%;
}
</style>
