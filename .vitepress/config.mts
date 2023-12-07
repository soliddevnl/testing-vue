import {DefaultTheme, defineConfig} from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Testing Vue",
  description: "The ultimate guide to testing complex Vue apps",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: nav(),

    sidebar: {
      '/guide/': sidebarGuide()
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/soliddevnl/testing-vue' }
    ],
  }
})

function sidebarGuide(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: 'The principles',
      collapsed: false,
      items: [
        {
          text: 'Behaviour',
          link: 'behaviour',
        }
      ]
    }
  ]
}

function nav(): DefaultTheme.NavItem[] {
  return [
    { text: 'Home', link: '/' },
    {
      text: 'Guide',
      link: '/guide/the-principles',
      activeMatch: '^/guide/'
    }
  ]
}

function currentYear(): number {
  return new Date().getFullYear()
}
