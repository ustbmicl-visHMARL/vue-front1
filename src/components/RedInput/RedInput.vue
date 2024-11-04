<template>
  <div class="inputList">
    <div v-for="(input, index) in inputs" :key="index">
      <el-input v-model="input.value" :placeholder="getPlaceholder(index)" />
    </div>
    <el-button @click="addInput">Add</el-button>
  </div>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'

// Define a reactive array to store input values
const inputs = reactive([
  { value: '8080,8080', placeholderWarning: false },
  { value: '', placeholderWarning: false }
])

// Method to add a new input field
const addInput = () => {
  // Check if the last input is empty
  if (inputs[inputs.length - 1].value.trim() === '') {
    inputs[inputs.length - 1].placeholderWarning = true
  } else {
    inputs.push({ value: '', placeholderWarning: false })
  }
}

// Function to get the placeholder text with a warning if the field is empty
const getPlaceholder = (index: number) => {
  if (inputs[index].value.trim() === '' && inputs[index].placeholderWarning) {
    setTimeout(() => {
      inputs[index].placeholderWarning = false
    }, 1000)
    return 'Please enter a value before add'
  }
  return 'external,internal: (8080 | 8080,8080)'
}
</script>

<style scoped>
.inputList {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
</style>
