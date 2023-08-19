<script lang="ts">
import { useMenu } from '../stores/use-menu';

export default {
    setup() {
        const store = useMenu();
        store.onSelectedKeys(['dashboard'])
    }
}
</script>

<template>
    This is Dashboard page
</template>
