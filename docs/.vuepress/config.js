module.exports = {
    title: '知行',
    description: '个人技术博客',
    plugins: [
        '@vuepress/back-to-top',
        '@vuepress/search',
        [
            '@vuepress/blog',
            {
                directories: [
                    {
                        id: 'post',
                        dirname: '_posts',
                        itemPermalink: '/post/:year/:month/:day/:slug',
                        path: '/',
                        pagination: {
                            lengthPerPage: 10,
                            prevText: '上一页',
                            nextText: '下一页',
                            layout: 'IndexPost',

                        }
                    },
                ],
            },
        ],
        {
            sidebarLinkSelector: '.sidebar-link',
            headerAnchorSelector: '.header-anchor'
        }],
    themeConfig: {
        activeHeaderLinks: false,
        displayAllHeaders: true,
        sidebar: 'auto',
        smoothScroll: true,
        nav: [
            // { text: '项目', link: '/projects' },
            { text: '关于', link: '/about' },
            { text: 'Github', link: 'https://github.com/zhiqiuyao' },
        ]
    },
    markdown: {
        lineNumbers: true
    },
    dest: 'public'
}