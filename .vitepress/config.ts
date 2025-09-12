import fs from 'fs'
import path from 'path'
import { defineConfigWithTheme, type HeadConfig } from 'vitepress'
import type { Config as ThemeConfig } from '@vue/theme'

import baseConfig from '@vue/theme/config'
import { headerPlugin } from './headerMdPlugin'
// import { textAdPlugin } from './textAdMdPlugin'
import { groupIconMdPlugin,groupIconVitePlugin } from 'vitepress-plugin-group-icons'

const nav: ThemeConfig['nav'] = [
  {
    text: 'ドキュメント',
    activeMatch: `^/(guide|style-guide|cookbook|examples)/`,
    items: [
      { text: 'ガイド', link: '/guide/introduction' },
      { text: 'チュートリアル', link: '/tutorial/' },
      { text: '実装例', link: '/examples/' },
      { text: 'クイックスタート', link: '/guide/quick-start' },
      // { text: 'Style Guide', link: '/style-guide/' },
      { text: '用語集', link: '/glossary/' },
      { text: 'エラーリファレンス', link: '/error-reference/' },
      {
        text: 'Vue 2 のドキュメント',
        link: 'https://v2.ja.vuejs.org'
      },
      {
        text: 'Vue 2 からの移行',
        link: 'https://v3-migration.vuejs.org/ja/'
      }
    ]
  },
  {
    text: 'API',
    activeMatch: `^/api/`,
    link: '/api/'
  },
  {
    text: 'プレイグラウンド',
    link: 'https://play.vuejs.org'
  },
  {
    text: 'エコシステム',
    activeMatch: `^/ecosystem/`,
    items: [
      {
        text: 'リソース',
        items: [
          { text: 'パートナー', link: '/partners/' },
          { text: 'テーマ', link: '/ecosystem/themes' },
          { text: 'UI コンポーネント', link: 'https://ui-libs.vercel.app/' },
          { text: 'プラグインコレクション', link: 'https://www.vue-plugins.org/' },
          {
            text: '検定',
            link: 'https://certificates.dev/vuejs/?ref=vuejs-nav'
          },
          { text: '仕事', link: 'https://vuejobs.com/?ref=vuejs' },
          { text: 'T シャツショップ', link: 'https://vue.threadless.com/' }
        ]
      },
      {
        text: '公式ライブラリー',
        items: [
          { text: 'Vue Router', link: 'https://router.vuejs.org/' },
          { text: 'Pinia', link: 'https://pinia.vuejs.org/' },
          { text: 'ツールガイド', link: '/guide/scaling-up/tooling.html' }
        ]
      },
      {
        text: '動画講座',
        items: [
          {
            text: 'Vue Mastery',
            link: 'https://www.vuemastery.com/courses/'
          },
          {
            text: 'Vue School',
            link: 'https://vueschool.io/?friend=vuejs&utm_source=Vuejs.org&utm_medium=Link&utm_content=Navbar%20Dropdown'
          }
        ]
      },
      {
        text: 'ヘルプ',
        items: [
          {
            text: 'Discord Chat',
            link: 'https://discord.com/invite/HBherRA'
          },
          {
            text: 'GitHub Discussions',
            link: 'https://github.com/vuejs/core/discussions'
          },
          { text: 'DEV Community', link: 'https://dev.to/t/vue' }
        ]
      },
      {
        text: 'ニュース',
        items: [
          { text: 'ブログ', link: 'https://blog.vuejs.org/' },
          { text: 'Twitter', link: 'https://twitter.com/vuejs' },
          { text: 'イベント', link: 'https://events.vuejs.org/' },
          { text: 'ニュースレター', link: '/ecosystem/newsletters' }
        ]
      }
    ]
  },
  {
    text: '情報',
    activeMatch: `^/about/`,
    items: [
      { text: 'FAQ', link: '/about/faq' },
      { text: 'チーム', link: '/about/team' },
      { text: 'リリース', link: '/about/releases' },
      {
        text: 'コミュニティーガイド',
        link: '/about/community-guide'
      },
      { text: '行動規範', link: '/about/coc' },
      { text: 'プライバシーポリシー', link: '/about/privacy' },
      {
        text: 'ドキュメンタリー',
        link: 'https://www.youtube.com/watch?v=OrxmtDw4pVI'
      }
    ]
  },
  {
    text: 'スポンサー',
    link: '/sponsor/'
  },
  {
    text: 'パートナー',
    activeMatch: `^/partners/`,
    link: '/partners/'
  }
]

export const sidebar: ThemeConfig['sidebar'] = {
  '/guide/': [
    {
      text: '入門',
      items: [
        { text: 'はじめに', link: '/guide/introduction' },
        {
          text: 'クイックスタート',
          link: '/guide/quick-start'
        }
      ]
    },
    {
      text: '基本',
      items: [
        {
          text: 'アプリケーションの作成',
          link: '/guide/essentials/application'
        },
        {
          text: 'テンプレート構文',
          link: '/guide/essentials/template-syntax'
        },
        {
          text: 'リアクティビティーの基礎',
          link: '/guide/essentials/reactivity-fundamentals'
        },
        {
          text: '算出プロパティ',
          link: '/guide/essentials/computed'
        },
        {
          text: 'クラスとスタイルのバインディング',
          link: '/guide/essentials/class-and-style'
        },
        {
          text: '条件付きレンダリング',
          link: '/guide/essentials/conditional'
        },
        { text: 'リストレンダリング', link: '/guide/essentials/list' },
        {
          text: 'イベントハンドリング',
          link: '/guide/essentials/event-handling'
        },
        { text: 'フォーム入力バインディング', link: '/guide/essentials/forms' },
        { text: 'ウォッチャー', link: '/guide/essentials/watchers' },
        { text: 'テンプレート参照', link: '/guide/essentials/template-refs' },
        {
          text: 'コンポーネントの基礎',
          link: '/guide/essentials/component-basics'
        },
        {
          text: 'ライフサイクルフック',
          link: '/guide/essentials/lifecycle'
        }
      ]
    },
    {
      text: 'コンポーネントの詳細',
      items: [
        {
          text: '登録',
          link: '/guide/components/registration'
        },
        { text: 'props', link: '/guide/components/props' },
        { text: 'イベント', link: '/guide/components/events' },
        { text: 'コンポーネントの v-model', link: '/guide/components/v-model' },
        {
          text: 'フォールスルー属性',
          link: '/guide/components/attrs'
        },
        { text: 'スロット', link: '/guide/components/slots' },
        {
          text: 'Provide / inject',
          link: '/guide/components/provide-inject'
        },
        {
          text: '非同期コンポーネント',
          link: '/guide/components/async'
        }
      ]
    },
    {
      text: '再利用性',
      items: [
        {
          text: 'コンポーザブル',
          link: '/guide/reusability/composables'
        },
        {
          text: 'カスタムディレクティブ',
          link: '/guide/reusability/custom-directives'
        },
        { text: 'プラグイン', link: '/guide/reusability/plugins' }
      ]
    },
    {
      text: '組み込みコンポーネント',
      items: [
        { text: 'トランジション', link: '/guide/built-ins/transition' },
        {
          text: 'トランジショングループ',
          link: '/guide/built-ins/transition-group'
        },
        { text: 'KeepAlive', link: '/guide/built-ins/keep-alive' },
        { text: 'Teleport', link: '/guide/built-ins/teleport' },
        { text: 'Suspense', link: '/guide/built-ins/suspense' }
      ]
    },
    {
      text: 'スケールアップ',
      items: [
        { text: '単一ファイルコンポーネント', link: '/guide/scaling-up/sfc' },
        { text: 'ツール', link: '/guide/scaling-up/tooling' },
        { text: 'ルーティング', link: '/guide/scaling-up/routing' },
        {
          text: '状態管理',
          link: '/guide/scaling-up/state-management'
        },
        { text: 'テスト', link: '/guide/scaling-up/testing' },
        {
          text: 'サーバーサイドレンダリング（SSR）',
          link: '/guide/scaling-up/ssr'
        }
      ]
    },
    {
      text: 'ベストプラクティス',
      items: [
        {
          text: '本番デプロイ',
          link: '/guide/best-practices/production-deployment'
        },
        {
          text: 'パフォーマンス',
          link: '/guide/best-practices/performance'
        },
        {
          text: 'アクセシビリティー',
          link: '/guide/best-practices/accessibility'
        },
        {
          text: 'セキュリティー',
          link: '/guide/best-practices/security'
        }
      ]
    },
    {
      text: 'TypeScript',
      items: [
        { text: '概要', link: '/guide/typescript/overview' },
        {
          text: 'Composition API と TypeScript',
          link: '/guide/typescript/composition-api'
        },
        {
          text: 'Options API と TypeScript',
          link: '/guide/typescript/options-api'
        }
      ]
    },
    {
      text: '番外トピック',
      items: [
        {
          text: 'Vue のさまざまな活用方法',
          link: '/guide/extras/ways-of-using-vue'
        },
        {
          text: 'Composition API の FAQ',
          link: '/guide/extras/composition-api-faq'
        },
        {
          text: 'リアクティビティーの探求',
          link: '/guide/extras/reactivity-in-depth'
        },
        {
          text: 'レンダリングの仕組み',
          link: '/guide/extras/rendering-mechanism'
        },
        {
          text: 'レンダー関数と JSX',
          link: '/guide/extras/render-function'
        },
        {
          text: 'Vue と Web コンポーネント',
          link: '/guide/extras/web-components'
        },
        {
          text: 'アニメーションテクニック',
          link: '/guide/extras/animation'
        }
        // {
        //   text: 'Building a Library for Vue',
        //   link: '/guide/extras/building-a-library'
        // },
        // {
        //   text: 'Vue for React Devs',
        //   link: '/guide/extras/vue-for-react-devs'
        // }
      ]
    }
  ],
  '/api/': [
    {
      text: 'グローバル API',
      items: [
        { text: 'アプリケーション', link: '/api/application' },
        {
          text: '汎用',
          link: '/api/general'
        }
      ]
    },
    {
      text: 'Composition API',
      items: [
        { text: 'setup()', link: '/api/composition-api-setup' },
        {
          text: 'リアクティビティー: コア',
          link: '/api/reactivity-core'
        },
        {
          text: 'リアクティビティー: ユーティリティー',
          link: '/api/reactivity-utilities'
        },
        {
          text: 'リアクティビティー: 上級編',
          link: '/api/reactivity-advanced'
        },
        {
          text: 'ライフサイクルフック',
          link: '/api/composition-api-lifecycle'
        },
        {
          text: '依存関係の注入',
          link: '/api/composition-api-dependency-injection'
        },
        {
          text: 'ヘルパー',
          link: '/api/composition-api-helpers'
        }
      ]
    },
    {
      text: 'Options API',
      items: [
        { text: 'オプション: 状態', link: '/api/options-state' },
        { text: 'オプション: レンダリング', link: '/api/options-rendering' },
        {
          text: 'オプション: ライフサイクル',
          link: '/api/options-lifecycle'
        },
        {
          text: 'オプション: 合成',
          link: '/api/options-composition'
        },
        { text: 'オプション: その他', link: '/api/options-misc' },
        {
          text: 'コンポーネントインスタンス',
          link: '/api/component-instance'
        }
      ]
    },
    {
      text: 'ビルトイン',
      items: [
        { text: 'ディレクティブ', link: '/api/built-in-directives' },
        { text: 'コンポーネント', link: '/api/built-in-components' },
        {
          text: '特別な要素',
          link: '/api/built-in-special-elements'
        },
        {
          text: '特別な属性',
          link: '/api/built-in-special-attributes'
        }
      ]
    },
    {
      text: '単一ファイルコンポーネント',
      items: [
        { text: '構文仕様', link: '/api/sfc-spec' },
        { text: '<script setup>', link: '/api/sfc-script-setup' },
        { text: 'CSS 機能', link: '/api/sfc-css-features' }
      ]
    },
    {
      text: '高度な API',
      items: [
        { text: 'カスタム要素', link: '/api/custom-elements' },
        { text: 'レンダー関数', link: '/api/render-function' },
        { text: 'サーバーサイドレンダリング', link: '/api/ssr' },
        { text: 'TypeScript ユーティリティー', link: '/api/utility-types' }, // /api/ で折り返されないよう「型」を省略
        { text: 'カスタムレンダラー', link: '/api/custom-renderer' },
        { text: 'コンパイル時フラグ', link: '/api/compile-time-flags' }
      ]
    }
  ],
  '/examples/': [
    {
      text: 'Basic',
      items: [
        {
          text: 'Hello World',
          link: '/examples/#hello-world'
        },
        {
          text: 'Handling User Input',
          link: '/examples/#handling-input'
        },
        {
          text: 'Attribute Bindings',
          link: '/examples/#attribute-bindings'
        },
        {
          text: 'Conditionals and Loops',
          link: '/examples/#conditionals-and-loops'
        },
        {
          text: 'Form Bindings',
          link: '/examples/#form-bindings'
        },
        {
          text: 'Simple Component',
          link: '/examples/#simple-component'
        }
      ]
    },
    {
      text: 'Practical',
      items: [
        {
          text: 'Markdown Editor',
          link: '/examples/#markdown'
        },
        {
          text: 'Fetching Data',
          link: '/examples/#fetching-data'
        },
        {
          text: 'Grid with Sort and Filter',
          link: '/examples/#grid'
        },
        {
          text: 'Tree View',
          link: '/examples/#tree'
        },
        {
          text: 'SVG Graph',
          link: '/examples/#svg'
        },
        {
          text: 'Modal with Transitions',
          link: '/examples/#modal'
        },
        {
          text: 'List with Transitions',
          link: '/examples/#list-transition'
        },
      ]
    },
    {
      // https://eugenkiss.github.io/7guis/
      text: '7 GUIs',
      items: [
        {
          text: 'Counter',
          link: '/examples/#counter'
        },
        {
          text: 'Temperature Converter',
          link: '/examples/#temperature-converter'
        },
        {
          text: 'Flight Booker',
          link: '/examples/#flight-booker'
        },
        {
          text: 'Timer',
          link: '/examples/#timer'
        },
        {
          text: 'CRUD',
          link: '/examples/#crud'
        },
        {
          text: 'Circle Drawer',
          link: '/examples/#circle-drawer'
        },
        {
          text: 'Cells',
          link: '/examples/#cells'
        }
      ]
    }
  ],
  '/style-guide/': [
    {
      text: 'Style Guide',
      items: [
        {
          text: '概要',
          link: '/style-guide/'
        },
        {
          text: '優先度 A: 必須',
          link: '/style-guide/rules-essential'
        },
        {
          text: '優先度 B: 強く推奨',
          link: '/style-guide/rules-strongly-recommended'
        },
        {
          text: '優先度 C: 推奨',
          link: '/style-guide/rules-recommended'
        },
        {
          text: '優先度 D: 注意深く使用する',
          link: '/style-guide/rules-use-with-caution'
        }
      ]
    }
  ]
}

const i18n: ThemeConfig['i18n'] = {
  search: '検索',
  menu: 'メニュー',
  toc: '目次',
  returnToTop: '上に戻る',
  appearance: '外観',
  previous: '前のページ',
  next: '次のページ',
  pageNotFound: 'ページが見つかりません',
  deadLink: {
    before: '存在しないリンクです: ',
    link: '',
    after: '',
  },
  deadLinkReport: {
    before: '修正しますので',
    link: 'こちらのリンク',
    after: 'よりお知らせください。',
  },
  footerLicense:{
    before: '',
    link: '',
    after: 'のもとで公開されています。',
  },

  // aria labels
  ariaAnnouncer: {
    before: '',
    link: '',
    after: 'が読み込まれました'
  },
  ariaDarkMode: 'ダークモードの切り替え',
  ariaSkipToContent: '本文へジャンプ',
  ariaToC: '現在のページの目次',
  ariaMainNav: 'メイン・ナビゲーション',
  ariaMobileNav: 'モバイル・ナビゲーション',
  ariaSidebarNav: 'サイドバー・ナビゲーション',
}

function inlineScript(file: string): HeadConfig {
  return [
    'script',
    {},
    fs.readFileSync(
      path.resolve(__dirname, `./inlined-scripts/${file}`),
      'utf-8'
    )
  ]
}

export default defineConfigWithTheme<ThemeConfig>({
  extends: baseConfig,

  sitemap: {
    hostname: 'https://ja.vuejs.org'
  },

  lang: 'ja',
  title: 'Vue.js',
  description: 'Vue.js - The Progressive JavaScript Framework',
  srcDir: 'src',
  srcExclude: ['tutorial/**/description.md'],

  head: [
    ['meta', { name: 'theme-color', content: '#3c8772' }],
    ['meta', { property: 'og:url', content: 'https://vuejs.org/' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:title', content: 'Vue.js' }],
    [
      'meta',
      {
        property: 'og:description',
        content: 'Vue.js - The Progressive JavaScript Framework'
      }
    ],
    [
      'meta',
      {
        property: 'og:image',
        content: 'https://vuejs.org/images/logo.png'
      }
    ],
    ['meta', { name: 'twitter:site', content: '@vuejs' }],
    ['meta', { name: 'twitter:card', content: 'summary' }],
    [
      'link',
      {
        rel: 'preconnect',
        href: 'https://automation.vuejs.org'
      }
    ],
    inlineScript('restorePreference.js'),
    inlineScript('uwu.js'),
    [
      'script',
      {
        src: 'https://cdn.usefathom.com/script.js',
        'data-site': 'NJTQDIQA',
        'data-spa': 'auto',
        defer: ''
      }
    ],
    [
      'script',
      {
        src: 'https://media.bitterbrains.com/main.js?from=vuejs&type=top',
        async: 'true'
      }
    ],
    inlineScript('perfops.js')
  ],

  themeConfig: {
    nav,
    sidebar,
    i18n,

    localeLinks: [
      {
        link: 'https://vuejs.org',
        text: 'English',
        repo: 'https://github.com/vuejs/docs'
      },
      {
        link: 'https://cn.vuejs.org',
        text: '简体中文',
        repo: 'https://github.com/vuejs-translations/docs-zh-cn'
      },
      {
        link: 'https://ua.vuejs.org',
        text: 'Українська',
        repo: 'https://github.com/vuejs-translations/docs-uk'
      },
      {
        link: 'https://fr.vuejs.org',
        text: 'Français',
        repo: 'https://github.com/vuejs-translations/docs-fr'
      },
      {
        link: 'https://ko.vuejs.org',
        text: '한국어',
        repo: 'https://github.com/vuejs-translations/docs-ko'
      },
      {
        link: 'https://pt.vuejs.org',
        text: 'Português',
        repo: 'https://github.com/vuejs-translations/docs-pt'
      },
      {
        link: 'https://bn.vuejs.org',
        text: 'বাংলা',
        repo: 'https://github.com/vuejs-translations/docs-bn'
      },
      {
        link: 'https://it.vuejs.org',
        text: 'Italiano',
        repo: 'https://github.com/vuejs-translations/docs-it'
      },
      {
        link: 'https://fa.vuejs.org',
        text: 'فارسی',
        repo: 'https://github.com/vuejs-translations/docs-fa'
      },
      {
        link: 'https://ru.vuejs.org',
        text: 'Русский',
        repo: 'https://github.com/vuejs-translations/docs-ru'
      },
      {
        link: 'https://cs.vuejs.org',
        text: 'Čeština',
        repo: 'https://github.com/vuejs-translations/docs-cs'
      },
      {
        link: 'https://zh-hk.vuejs.org',
        text: '繁體中文',
        repo: 'https://github.com/vuejs-translations/docs-zh-hk'
      },
      {
        link: 'https://pl.vuejs.org',
        text: 'Polski',
        repo: 'https://github.com/vuejs-translations/docs-pl',
      },
      {
        link: '/translations/',
        text: '翻訳にご協力ください！',
        isTranslationsDesc: true
      }
    ],

    algolia: {
      indexName: 'vuejs',
      appId: 'ML0LEBN7FQ',
      apiKey: '21cf9df0734770a2448a9da64a700c22',
      searchParameters: {
        facetFilters: ['version:v3']
      }
    },

    carbonAds: {
      code: 'CEBDT27Y',
      placement: 'vuejsorg'
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/' },
      { icon: 'twitter', link: 'https://twitter.com/vuejs' },
      { icon: 'discord', link: 'https://discord.com/invite/vue' }
    ],

    editLink: {
      repo: 'vuejs-translations/docs-ja',
      text: 'このページを GitHub で編集'
    },

    footer: {
      license: {
        text: 'MIT ライセンス',
        link: 'https://opensource.org/licenses/MIT'
      },
      copyright: '日本語ドキュメントの内容の著作権は Vue 公式チームと翻訳協力者にあり、すべての権利は留保されています。'
    }
  },

  markdown: {
    theme: 'github-dark',
    config(md) {
      md.use(headerPlugin)
        .use(groupIconMdPlugin)
      // .use(textAdPlugin)
    }
  },

  vite: {
    define: {
      __VUE_OPTIONS_API__: false
    },
    optimizeDeps: {
      include: ['gsap', 'dynamics.js'],
      exclude: ['@vue/repl']
    },
    // @ts-ignore
    ssr: {
      external: ['@vue/repl']
    },
    server: {
      host: true,
      fs: {
        // for when developing with locally linked theme
        allow: ['../..']
      }
    },
    build: {
      chunkSizeWarningLimit: Infinity
    },
    json: {
      stringify: true
    },
    plugins: [
      groupIconVitePlugin({
        customIcon: {
          cypress: 'vscode-icons:file-type-cypress',
          'testing library': 'logos:testing-library'
        }
      }) as Plugin
    ]
  }
})
