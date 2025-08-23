<script lang="ts">
const shuffleMembers = (
  members: Member[],
  pinTheFirstMember = false
): void => {
  let offset = pinTheFirstMember ? 1 : 0
  // `i` is between `1` and `length - offset`
  // `j` is between `0` and `length - offset - 1`
  // `offset + i - 1` is between `offset` and `length - 1`
  // `offset + j` is between `offset` and `length - 1`
  let i = members.length - offset
  while (i > 0) {
    const j = Math.floor(Math.random() * i)
    ;[members[offset + i - 1], members[offset + j]] = [
      members[offset + j],
      members[offset + i - 1]
    ]
    i--
  }
}
</script>

<script setup lang="ts">
import { VTLink } from '@vue/theme'
import membersCoreData from './members-core.json'
import membersEmeritiData from './members-emeriti.json'
import membersPartnerData from './members-partner.json'
import TeamHero from './TeamHero.vue'
import TeamList from './TeamList.vue'
import type { Member } from './Member'
shuffleMembers(membersCoreData as Member[], true)
shuffleMembers(membersEmeritiData as Member[])
shuffleMembers(membersPartnerData as Member[])
</script>

<template>
  <div class="TeamPage">
    <TeamHero>
      <template #title>チーム紹介</template>
      <template #lead>
        Vue とそのエコシステムの開発は
        国際的なチームによって主導されています。
        その一部のメンバーを以下に記載します。
      </template>

      <template #action>
        <VTLink
          href="https://github.com/vuejs/governance/blob/master/Team-Charter.md"
        >
          チームについてもっと知る
        </VTLink>
      </template>
    </TeamHero>

    <TeamList :members="(membersCoreData as Member[])">
      <template #title>コアチームメンバー</template>
      <template #lead>
        コアチームメンバーは 1 つから複数のプロジェクトを
        積極的にメンテナンスしています。
        彼らは Vue エコシステムに有意な貢献をしており、
        プロジェクトとユーザーの成功のために長い期間献身しています。
      </template>
    </TeamList>

    <TeamList :members="(membersEmeritiData as Member[])">
      <template #title>名誉コアチーム</template>
      <template #lead>
        私達が誇る過去に価値のある貢献をした
        元コアチームメンバーです。
      </template>
    </TeamList>

    <TeamList :members="(membersPartnerData as Member[])">
      <template #title>コミュニティーパートナー</template>
      <template #lead>
        一部の Vue コミュニティーメンバーは
        コミュニティーを発展させたため、特筆します。
        私達は主要なパートナーとより親密に開発し、
        頻繁に今後の機能やニュースを決定しています。
      </template>
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
