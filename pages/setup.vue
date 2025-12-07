<template>
  <div class="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 p-6">
    <div class="max-w-3xl w-full bg-white dark:bg-slate-800 rounded-xl shadow-md p-8">
      <h1 class="text-3xl font-semibold text-slate-900 dark:text-slate-100">Site setup required</h1>
      <p class="mt-3 text-slate-600 dark:text-slate-300">The site couldn't connect to its database. To get the blog working you need to configure the database/data API.</p>

      <div class="mt-6 grid gap-4">
        <div class="p-4 bg-slate-50 dark:bg-slate-700 border rounded">
          <h2 class="font-medium">Quick checklist</h2>
          <ul class="mt-2 list-disc list-inside text-slate-700 dark:text-slate-200 space-y-1">
            <li>Add a <code class="px-1 py-0.5 bg-slate-100 dark:bg-slate-600 rounded">DB_API_KEY</code> and <code class="px-1 py-0.5 bg-slate-100 dark:bg-slate-600 rounded">DB_API_URL</code> to your environment (.env).</li>
            <li>Restart the dev server after updating environment variables.</li>
            <li>If you need a local DB + API, try D1 SQL Studio: a lightweight way to create a D1 database and simple API.</li>
          </ul>
        </div>

        <div class="p-4 bg-slate-50 dark:bg-slate-700 border rounded">
          <h2 class="font-medium">Install D1 SQL Studio (optional)</h2>
          <p class="mt-2 text-slate-700 dark:text-slate-200">D1 SQL Studio helps you quickly create a D1 database and exposes a small API compatible with this project.</p>
          <a class="inline-block mt-3 text-sm text-white bg-sky-600 hover:bg-sky-700 px-3 py-2 rounded" href="https://github.com/playwjj/d1-sql-studio" target="_blank" rel="noreferrer">Open D1 SQL Studio on GitHub</a>
        </div>

        <div class="p-4 bg-slate-50 dark:bg-slate-700 border rounded">
          <h2 class="font-medium">How to test</h2>
          <ol class="mt-2 list-decimal list-inside text-slate-700 dark:text-slate-200 space-y-1">
            <li>Set environment variables in a <code class="px-1 py-0.5 bg-slate-100 dark:bg-slate-600 rounded">.env</code> file at the project root:</li>
            <pre class="mt-2 p-3 bg-slate-800 text-slate-100 rounded"><code>DB_API_KEY=your_db_api_key
DB_API_URL=https://your-db-api.example.com</code></pre>
            <li>Restart your dev server: the runtime config reads environment variables on startup.</li>
            <li>Click Retry below — the page will test <code class="px-1 py-0.5 bg-slate-100 dark:bg-slate-600 rounded">/api/site</code> and, if successful, let you continue to the site.</li>
          </ol>
        </div>
      </div>

      <div class="mt-6 flex items-center gap-3">
        <button @click="check" :disabled="loading" class="px-4 py-2 bg-slate-900 text-white rounded hover:opacity-95 disabled:opacity-50">{{ loading ? 'Checking...' : 'Retry connection' }}</button>
        <NuxtLink to="/" v-if="connected" class="px-4 py-2 border rounded">Go to homepage</NuxtLink>
        <button v-if="!connected" @click="openEnvExample" class="px-4 py-2 border rounded">Show .env example</button>

        <div v-if="error" class="ml-4 text-sm text-rose-600 dark:text-rose-400">{{ error }}</div>
        <div v-if="connected" class="ml-4 text-sm text-emerald-600 dark:text-emerald-400">Connected! You can continue.</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const loading = ref(false)
const connected = ref(false)
const error = ref<string | null>(null)

async function check() {
  loading.value = true
  error.value = null
  connected.value = false
  try {
    // call the same server API the site uses
    const res = await $fetch('/api/site')
    if (res) {
      connected.value = true
    } else {
      error.value = 'Unexpected response from /api/site'
    }
  } catch (err: any) {
    // show friendly hint
    error.value = err?.message || String(err)
  } finally {
    loading.value = false
  }
}

function openEnvExample() {
  // open a small modal-like view by showing a new tab with instructions (simple fallback)
  const text = `# .env example\nDB_API_KEY=your_db_api_key\nDB_API_URL=https://your-db-api.example.com`
  const w = window.open('', '_blank')
  if (w) {
    w.document.title = '.env example'
    const pre = w.document.createElement('pre')
    pre.textContent = text
    pre.style.padding = '16px'
    pre.style.background = '#0f172a'
    pre.style.color = '#fff'
    pre.style.fontFamily = 'monospace'
    w.document.body.appendChild(pre)
  }
}
</script>

<style scoped>
/* keep small, mostly tailwind driven */
</style>
