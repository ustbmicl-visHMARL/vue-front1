<script setup lang="ts">
import { ref, watchEffect } from 'vue'
const iconUrl = 'https://showdoc.keytop.cn/Public/Uploads/2024-04-28/662dbe484313f.png'
const elecVal = ref(50)
const leftValClass = ref('')
const cost = ref(5)
setInterval(() => {
  elecVal.value -= cost.value
  if (elecVal.value <= 0 || elecVal.value >= 100) {
    cost.value = -cost.value
  }
}, 1000)
watchEffect(() => {
  if (elecVal.value > 30) {
    leftValClass.value = 'white-text'
  }
  if (elecVal.value <= 30) {
    leftValClass.value = 'red-text'
  }
  if (elecVal.value <= 0) {
    elecVal.value = 0
    leftValClass.value = 'no-text'
  }
})
</script>

<template>
  <el-card>
    <div class="card-title">Battery</div>
    <div class="titile">
      <span>ADC value</span>
    </div>
    <div class="container">
      <div class="battery" :style="{ '--height': `${100 - elecVal || 0}%` }">
        <img :src="iconUrl" alt="闪电icon" />
        <div class="cover" :style="{ '--top': `${0 - elecVal || 0}%` }"></div>
      </div>
      <span class="leftVal" :class="leftValClass">{{ elecVal }}%</span>
    </div>
  </el-card>
</template>

<style lang="scss" scoped>
.el-card__body {
  padding-bottom: 0;
}

.titile {
  text-align: center;
}

.no-text {
  color: transparent;
}

.red-text {
  color: red;
}

.white-text {
  color: white;
}

.container {
  padding: 20px;
  padding-bottom: 0;
  color: white;
  font-weight: bold;
  text-align: center;
}

.leftVal {
  display: block;
  transform: translate(-13%, -300%);
  height: 10px;
}

.battery {
  // 电池容器
  width: 68px;
  height: 104px;
  background: rgb(246, 246, 246);
  border: 1px solid rgb(211, 211, 211);
  border-radius: 5px; // 大小、背景、边框
  position: relative; // 后面绝对定位的前提

  img {
    // 让闪电图标在电池里水平垂直居中，并处于高层级
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    z-index: 100;
  }

  &::before {
    // 伪元素 - 模拟电池正极头
    content: '';
    width: 50px;
    height: 15px;
    position: absolute;
    left: 50%;
    top: -15px;
    transform: translate(-50%, 0); // 大小，水平居中，垂直定位
    background: rgb(246, 246, 246);
    border: 1px solid rgb(211, 211, 211);
    border-bottom: none;
    border-radius: 5px 5px 0 0; // 背景、边框
  }

  &::after {
    // 伪元素 - 模拟电量容量
    content: '';
    background-color: rgb(68, 220, 148); // 容量颜色
    position: absolute;
    left: 0;
    top: var(--height); // 容量大小，通过值传入动态变化
    right: 0;
    bottom: 0;
  }

  .cover {
    // 充电时波浪效果容器
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0; // 占满整个原电池容器
    overflow: hidden; // 超出部分隐藏
    z-index: 10;
  }

  &:hover {
    // 伪类 - 当鼠标 hover 在电池上时，模拟正在充电的波浪效果
    .cover::before,
    .cover::after {
      // 伪元素 - 两层波浪
      content: '';
      background: rgba(246, 246, 246, 0.8);
      border-radius: 40% 30%;
      position: absolute;
      width: 150px;
      height: 150px;
      left: -30%;
      top: var(--top); // 波浪所处位置，通过值传入动态变化
      transform: translate(-50%, 0); // 大小，水平居中，垂直定位
      animation: coverBefore 10s linear infinite; // 通过动画实现波浪
    }

    .cover::after {
      background: rgba(246, 246, 246, 0.6); // 通过背景色深浅来体现出两层效果
      animation: coverAfter 10s linear infinite;
    }
  }
}

// 定义的动画
@keyframes coverBefore {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

@keyframes coverAfter {
  0% {
    transform: rotate(30deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>
