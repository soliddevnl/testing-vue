import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Testing Vue",
  description: "The ultimate guide to testing complex Vue apps",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/soliddevnl/testing-vue' }
    ]
  }
})
