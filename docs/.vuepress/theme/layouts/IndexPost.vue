<template>
    <ParentLayout>
        <template #page-top>
            <div class="theme-default-content">
                <ul id="default-layout">
                    <li v-for="page in $pagination.pages">
                        <router-link class="page-link" :to="page.path">
                            {{page.title}}
                        </router-link>
                    </li>
                </ul>

                <Pagination v-if="$pagination.length > 1" />
            </div>
        </template>
    </ParentLayout>
</template>

<script>
    import ParentLayout from './Layout.vue'
    import { Pagination } from '@vuepress/plugin-blog/lib/client/components';
    export default {
        name: 'Layout',
        components: {
            Pagination,
            ParentLayout
        },
    };
</script>