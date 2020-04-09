<template>
    <div>
        <ParentLayout />
        <Comment />
    </div>
</template>

<script>
    import ParentLayout from './Layout.vue'
    import { Comment } from '@vuepress/plugin-blog/lib/client/components';
    export default {
        name: 'Layout',
        components: {
            Comment,
            ParentLayout
        },
    };
</script>