import { defineStore } from 'pinia'

export const useMenu = defineStore('menuId', {
  state: () => ({
    selectedKeys: [''],
    openKeys: ['']
  }),

  actions: {
    onSelectedKeys(data: string[]) {
      this.selectedKeys = data
    },

    onOpenKeys(data: string[]) {
      this.openKeys = data
    }
  }
})
