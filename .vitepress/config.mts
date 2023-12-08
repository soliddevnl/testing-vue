import {DefaultTheme, defineConfig} from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Testing Vue",
  description: "The ultimate guide to testing complex Vue apps",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: nav(),

    sidebar: {
      '/scenarios/': sidebarScenarios()
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/soliddevnl/testing-vue' }
    ],
  },
})

function sidebarScenarios(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: 'Scenarios',
      collapsed: false,
      items: [
        {
          text: 'Building a newsletter subscription form',
          link: '/scenarios/feature-newsletter-subscription-form',
        }
      ]
    }
  ]
}

function nav(): DefaultTheme.NavItem[] {
  return [
    { text: 'Home', link: '/' },
    {
      text: 'Scenarios',
      link: 'scenarios/feature-newsletter-subscription-form',
      activeMatch: '^/scenarios/'
    }
  ]
}
