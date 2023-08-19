<script setup lang="ts">
import SideBar from '../components/SideBar.vue'
import TheHeader from '../components/TheHeader.vue'
</script>

<template>
  <a-row>
    <a-col :span="6">
      <div class="logo-container flex justify-center">
        <img alt="Vue logo" class="logo-img" src="@/assets/logo.png" width="125" height="100" />
      </div>
      <SideBar />
    </a-col>
    <a-col :span="18">
      <TheHeader title="Header" />
      <div class="p-6">
        <RouterView />
      </div>
    </a-col>
  </a-row>
</template>
<style lang="scss">
.logo-container {
  border: 1px solid #f0f0f0;

  img {
    padding: 12px 0px;
  }
}

.ant-row {
  height: 100%;
}
</style>
