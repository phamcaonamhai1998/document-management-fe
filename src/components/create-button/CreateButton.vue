<script lang="ts">
import { defineComponent } from 'vue';
import { PlusOutlined } from '@ant-design/icons-vue';

export default defineComponent({
    props: {
        createText: String,
        url: String,
    },

    components: {
        PlusOutlined,
    },

    setup(props) {

        return {
            props,
        };
    },

});
</script>

<template>
    <a-button type="primary">
        <RouterLink :to="props.url || ''">
            <PlusOutlined class="mr-2" />
            {{ props.createText }}
        </RouterLink>
    </a-button>
</template>
