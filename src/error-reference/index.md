<script setup>
import { ref, onMounted } from 'vue'
import { data } from './errors.data.ts'
import ErrorsTable from './ErrorsTable.vue'

const highlight = ref()
onMounted(() => {
  highlight.value = location.hash.slice(1)
})
</script>

# プロダクションエラーコードのリファレンス {#error-reference}

## ランタイムエラー {#runtime-errors}

プロダクションビルドにおいて、以下のエラーハンドラー API に渡される第 3 引数は完全な情報の文字列ではなく短いコードになります:

- [`app.config.errorHandler`](/api/application#app-config-errorhandler)
- [`onErrorCaptured`](/api/composition-api-lifecycle#onerrorcaptured) (Composition API)
- [`errorCaptured`](/api/options-lifecycle#errorcaptured) (Options API)

以下の表は、コードを元の完全な情報文字列にマッピングしたものです。

<ErrorsTable kind="runtime" :errors="data.runtime" :highlight="highlight" />

## コンパイラーエラー {#compiler-errors}

次の表は、プロダクションコンパイラーのエラーコードと元のメッセージの対応表です。

<ErrorsTable kind="compiler" :errors="data.compiler" :highlight="highlight" />
