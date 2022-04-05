<script setup lang="ts">
import { VTLink } from '@vue/theme'
import membersCoreData from './members-core.json'
import membersEmeritiData from './members-emeriti.json'
import membersPartnerData from './members-partner.json'
import TeamHero from './TeamHero.vue'
import TeamList from './TeamList.vue'
import type { Member } from './Member'
</script>

<template>
  <div class="TeamPage">
    <TeamHero>
      <template #title>チーム紹介</template>
      <template #lead
        >Vue とそのエコシステムの開発は国際チームによって主導されています。一部のメンバーを以下に記載します。</template
      >



      <template #action>
        <VTLink
          href="https://github.com/vuejs/governance/blob/master/Team-Charter.md"
          >チームについてもっと知る</VTLink
        >
      </template>
    </TeamHero>

    <TeamList :members="membersCoreData">
      <template #title>コアチームメンバー</template>
      <template #lead
        >コアチームメンバーは1つから複数のプロジェクトを積極的にメンテナンスしています。
        彼らは Vue エコシステムに有意な貢献をしており、プロジェクトとユーザの成功のために長い期間献身しています。</template
      >
    </TeamList>



    <TeamList :members="membersEmeritiData as Member[]">
      <template #title>名誉コアチーム</template>
      <template #lead
        >私達が誇る過去に価値のある貢献をした元コアチームメンバーです。</template
      >
    </TeamList>


    <TeamList :members="membersPartnerData as Member[]">
      <template #title>コミュニティパートナー</template>
      <template #lead
        >一部の Vue コミュニティメンバーはコミュニティを発展させたため、特筆します。
        私達は主要なパートナーとより親密に開発し、頻繁に今後の機能やニュースを決定しています。</template
      >
    </TeamList>
  </div>
</template>



<style scoped>
.TeamPage {
  padding-bottom: 16px;
}

@media (min-width: 768px) {
  .TeamPage {
    padding-bottom: 96px;
  }
}

.TeamList + .TeamList {
  padding-top: 64px;
}
</style>
