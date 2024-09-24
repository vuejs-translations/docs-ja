import partnerData from '../partners/partners.json'

const partnerName = 'Proxify'
const partner = partnerData.find(partner => partner.name === partnerName)

const websiteLabel = 'proxify.io'
const websiteUrl = 'https://proxify.io/'
const applyUrl = 'https://career.proxify.io/apply'
const hireUrl = 'https://proxify.io/hire-vuejs'
const vueArticleUrl = 'https://proxify.io/hire-vue-developers'
const imageStorageUrl = 'https://res.cloudinary.com/proxify-io/image/upload'

const partnerConfig = {
  // Partner information
  partnerName: partner?.name,
  logo: partner?.logo,
  flipLogo: partner?.flipLogo || false,

  // Partner website
  websiteUrl: websiteUrl,
  hireUsButtonUrl: hireUrl,

  // Image storage URL
  imageStorageUrl: imageStorageUrl,

  // Hero Section
  pageHeroBanner: {
    title: 'Vue Developers',
    description: 'Vue Developers は認定された個人フリーランサーです。支払い、コンプライアンス、審査はパートナーである Proxify によって管理されています。リストへの参加に興味がありますか？',
    applyButton: {
      url: applyUrl,
      label: 'お申し込みはこちら'
    }
  },

  // Hero Section
  pageJoinSection: {
    title: 'リストに載るには',
    description: 'Vue.js 開発者を探している企業で、長期のパートタイムまたはフルタイムのポジションを得ましょう。',
    applyButton: {
      url: applyUrl,
      label: '参加を申し込む'
    }
  },

  // Footer Configuration
  pageFooter: {
    text: `This highly vetted developer is brought to you by Vue’s partner:`,
    email: 'vue@proxify.io',
    phone: '+44 20 4614 2667',
    websiteVueLink: vueArticleUrl,
    websiteVueLabel: websiteLabel + '/hire-vue-developers'
  },

  // Diagram sections
  profileDiagram: {
    title: 'Candidate profile',
    prependText: 'How our developers score in the parameters that correlate best with future success in the role.'
  },

  scoreDiagram: {
    title: 'Engineering excellence score',
    prependText: 'The practical score range is 0 to 300. This is the distribution of scores for all evaluated Vue.js developers, and here’s where your candidate scored.',
    appendText: 'Data from 3,661 evaluated Vue.js developers and 38,008 applicants.'
  },

  // Proficiency Section
  proficiencies: {
    skillsPerCard: 5
  }
}

export default partnerConfig
