import { defineStore } from 'pinia'

export const useTitle = defineStore('titleId', {
  state: () => ({
    title: ''
  }),

  actions: {
    onClickTitle(title: string) {
      this.title = title
    }
  }
})
