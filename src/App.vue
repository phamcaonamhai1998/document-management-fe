<script setup lang="ts">
import { RouterView } from 'vue-router'
import 'ant-design-vue/dist/antd.css'
import './index.css'

</script>

<template>
  <!-- <header>
    <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="125" height="125" />

    <div class="wrapper">
      <HelloWorld msg="You did it!" />
      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
        <RouterLink to="/layout">Layout</RouterLink>
      </nav>
    </div>
  </header> -->
  <Layout />
  <RouterView />
</template>

<style lang="scss">
@import 'styles/global.scss'
</style>
