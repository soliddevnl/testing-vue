import {DefaultTheme, defineConfig, HeadConfig} from 'vitepress'

console.log('process.env.NODE_ENV', process.env.NODE_ENV)
// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Testing Vue",
  description: "The ultimate guide to testing complex Vue apps",
  head: head(),
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: nav(),

    sidebar: {
      '/scenarios/': sidebar(),
      '/tactics/': sidebar(),
    },

    socialLinks: [
      {icon: 'github', link: 'https://github.com/soliddevnl/testing-vue'}
    ],
  },
})

function sidebar(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: 'Scenarios',
      collapsed: false,
      items: [
        {
          text: 'Newsletter subscription form',
          link: '/scenarios/feature-newsletter-subscription-form',
        }
      ]
    },
    {
      text: 'Tactics',
      collapsed: false,
      items: [
        {
          text: 'Forms',
          link: '/tactics/testing-double-submit-prevention',
        }
      ]
    }
  ]
}

function nav(): DefaultTheme.NavItem[] {
  return [
    {text: 'Home', link: '/'},
    {
      text: 'Scenarios',
      link: 'scenarios/feature-newsletter-subscription-form',
      activeMatch: '^/scenarios/'
    },
    {
      text: 'Tactics',
      link: 'tactics/testing-double-submit-prevention',
      activeMatch: '^/tactics/'
    }
  ]
}

function head(): HeadConfig {
  const head = []

  if (process.env.NODE_ENV === 'production') {
    head.push([
        'script',
        {async: '', src: 'https://www.googletagmanager.com/gtag/js?id=818MVBDRWL'}
      ]
    )
    head.push([
      'script',
      {},
      `window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '818MVBDRWL');`
    ])
  }

  return head
}
