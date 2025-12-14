<template>
  <div class="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 p-6">
    <div class="max-w-3xl w-full bg-white dark:bg-slate-800 rounded-xl shadow-md p-8">
      <!-- Step 1: Missing Environment Variables -->
      <template v-if="setupStep === 'missing-env'">
        <h1 class="text-3xl font-semibold text-slate-900 dark:text-slate-100">Environment Configuration Required</h1>
        <p class="mt-3 text-slate-600 dark:text-slate-300">Your database API credentials are not configured. Please add them to your environment variables.</p>

        <div class="mt-6 grid gap-4">
          <div class="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded">
            <h2 class="font-medium text-amber-900 dark:text-amber-100">Quick Setup</h2>
            <p class="mt-2 text-amber-800 dark:text-amber-200">Add these environment variables to your <code class="px-1 py-0.5 bg-amber-100 dark:bg-amber-800 rounded">.env</code> file:</p>
            <pre class="mt-3 p-3 bg-slate-800 text-slate-100 rounded text-sm"><code>DB_API_KEY=your_api_key
DB_API_URL=https://your-db-api.example.com</code></pre>
          </div>

          <div class="p-4 bg-slate-50 dark:bg-slate-700 border rounded">
            <h2 class="font-medium">Using Cloudflare Dashboard</h2>
            <ol class="mt-2 list-decimal list-inside text-slate-700 dark:text-slate-200 space-y-2">
              <li>Open your Pages project in the Cloudflare dashboard</li>
              <li>Go to <strong>Settings → Environment variables</strong></li>
              <li>Add two variables:
                <ul class="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li><code>DB_API_KEY</code> — your API key</li>
                  <li><code>DB_API_URL</code> — your database API URL</li>
                </ul>
              </li>
              <li>Restart your dev server or trigger a new deployment</li>
            </ol>
          </div>

          <div class="p-4 bg-slate-50 dark:bg-slate-700 border rounded">
            <h2 class="font-medium">D1 SQL Studio</h2>
            <p class="mt-2 text-slate-700 dark:text-slate-200">If you don't have a database yet, you can use <strong>D1 SQL Studio</strong>:</p>
            <a class="inline-block mt-3 text-sm text-white bg-sky-600 hover:bg-sky-700 px-3 py-2 rounded" href="https://github.com/playwjj/d1-sql-studio" target="_blank" rel="noreferrer">D1 SQL Studio on GitHub</a>
          </div>
        </div>

        <div class="mt-6 flex items-center gap-3">
          <button @click="checkSetupStatus" :disabled="checking" class="px-4 py-2 bg-slate-900 text-white rounded hover:opacity-95 disabled:opacity-50">
            {{ checking ? 'Checking...' : 'Retry after configuration' }}
          </button>
          <div v-if="error" class="text-sm text-rose-600 dark:text-rose-400">{{ error }}</div>
        </div>
      </template>

      <!-- Step 2: Database Setup Needed -->
      <template v-else-if="setupStep === 'needs-setup'">
        <h1 class="text-3xl font-semibold text-slate-900 dark:text-slate-100">Initialize Database</h1>
        <p class="mt-3 text-slate-600 dark:text-slate-300">Your database is configured but the required tables don't exist yet. We'll create them all for you.</p>

        <div class="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded">
          <h2 class="font-medium text-blue-900 dark:text-blue-100">What happens next?</h2>
          <ul class="mt-2 list-disc list-inside text-blue-800 dark:text-blue-200 space-y-1">
            <li>We'll create 10 database tables with proper relationships</li>
            <li>You'll be prompted to enter your site's basic information</li>
            <li>An admin user will be created for you to manage the blog</li>
            <li>After that, your blog will be ready to use!</li>
          </ul>
        </div>

        <div class="mt-6 flex items-center gap-3">
          <button @click="initializeDatabase" :disabled="initializing" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50">
            {{ initializing ? 'Creating tables...' : 'Create database tables' }}
          </button>
          <button @click="checkSetupStatus" :disabled="initializing" class="px-4 py-2 border rounded hover:bg-slate-50 dark:hover:bg-slate-700">
            Back
          </button>
          <div v-if="error" class="text-sm text-rose-600 dark:text-rose-400">{{ error }}</div>
        </div>
      </template>

      <!-- Step 3: Site Configuration Form -->
      <template v-else-if="setupStep === 'configure-site'">
        <h1 class="text-3xl font-semibold text-slate-900 dark:text-slate-100">Configure Your Site</h1>
        <p class="mt-3 text-slate-600 dark:text-slate-300">Enter your site's basic information. You can edit these settings later.</p>

        <form @submit.prevent="saveSiteConfiguration" class="mt-6 space-y-4">
          <!-- Required Fields -->
          <div>
            <label class="block text-sm font-medium text-slate-900 dark:text-slate-100 mb-1">Site Name *</label>
            <input 
              v-model="siteForm.name" 
              type="text" 
              required
              placeholder="e.g., My Blog"
              class="w-full px-3 py-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-900 dark:text-slate-100 mb-1">Site Title *</label>
            <input
              v-model="siteForm.title"
              type="text"
              required
              placeholder="e.g., My Awesome Blog"
              class="w-full px-3 py-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-900 dark:text-slate-100 mb-1">Site Description *</label>
            <textarea
              v-model="siteForm.description"
              required
              rows="3"
              placeholder="A brief description of your blog"
              class="w-full px-3 py-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100"
            ></textarea>
          </div>

          <!-- Admin User Section -->
          <div class="border-t pt-4">
            <h3 class="text-sm font-medium text-slate-900 dark:text-slate-100 mb-4">Create Initial Admin User *</h3>
            <p class="text-sm text-slate-600 dark:text-slate-400 mb-4">Create your administrator account to manage the blog</p>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Username *</label>
                <input 
                  v-model="siteForm.admin_username" 
                  type="text"
                  required
                  placeholder="admin"
                  class="w-full px-3 py-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email *</label>
                <input 
                  v-model="siteForm.admin_email" 
                  type="email"
                  required
                  placeholder="admin@example.com"
                  class="w-full px-3 py-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100"
                />
              </div>

              <div class="col-span-2">
                <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Password *</label>
                <input 
                  v-model="siteForm.admin_password" 
                  type="password"
                  required
                  placeholder="••••••••"
                  class="w-full px-3 py-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100"
                />
                <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Minimum 8 characters recommended</p>
              </div>
            </div>
          </div>

          <div class="flex items-center gap-3 pt-4">
            <button
              type="submit"
              :disabled="saving"
              class="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 disabled:opacity-50"
            >
              {{ saving ? 'Saving...' : 'Complete setup' }}
            </button>
            <button 
              type="button"
              @click="setupStep = 'needs-setup'"
              :disabled="saving"
              class="px-4 py-2 border rounded hover:bg-slate-50 dark:hover:bg-slate-700"
            >
              Back
            </button>
            <div v-if="error" class="text-sm text-rose-600 dark:text-rose-400">{{ error }}</div>
          </div>
        </form>
      </template>

      <!-- Step 4: Error State -->
      <template v-else-if="setupStep === 'error'">
        <div class="text-center">
          <div class="text-5xl mb-4">⚠️</div>
          <h1 class="text-3xl font-semibold text-slate-900 dark:text-slate-100">Setup Error</h1>
          <p class="mt-3 text-slate-600 dark:text-slate-300">Something went wrong during the setup process.</p>

          <div class="mt-6 p-4 bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 rounded text-left">
            <h2 class="font-medium text-rose-900 dark:text-rose-100">Error Details</h2>
            <p class="mt-2 text-sm text-rose-800 dark:text-rose-200">{{ error || 'An unexpected error occurred' }}</p>
          </div>

          <div class="mt-6 flex items-center justify-center gap-3">
            <button @click="checkSetupStatus" :disabled="checking" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50">
              {{ checking ? 'Retrying...' : 'Try again' }}
            </button>
          </div>
        </div>
      </template>

      <!-- Step 5: Setup Complete -->
      <template v-else-if="setupStep === 'ready'">
        <div class="text-center">
          <div class="text-5xl mb-4">✨</div>
          <h1 class="text-3xl font-semibold text-slate-900 dark:text-slate-100">Setup Complete!</h1>
          <p class="mt-3 text-slate-600 dark:text-slate-300">Your blog is now ready to use.</p>

          <NuxtLink to="/" class="inline-block mt-6 px-4 py-2 bg-slate-900 text-white rounded hover:opacity-95">
            Go to homepage
          </NuxtLink>
        </div>
      </template>

      <!-- Initial Loading State -->
      <template v-else>
        <div class="text-center">
          <div class="inline-block animate-spin text-2xl mb-4">⏳</div>
          <h1 class="text-3xl font-semibold text-slate-900 dark:text-slate-100">Checking setup status...</h1>
          <p class="mt-3 text-slate-600 dark:text-slate-300">Please wait a moment.</p>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
const setupStep = ref<SetupStep>('checking')
const checking = ref(false)
const initializing = ref(false)
const saving = ref(false)
const error = ref<string | null>(null)

const siteForm = ref({
  name: '',
  title: '',
  description: '',
  admin_username: '',
  admin_email: '',
  admin_password: ''
})

type SetupStep = 'checking' | 'missing-env' | 'needs-setup' | 'configure-site' | 'error' | 'ready'

onMounted(() => {
  checkSetupStatus()
})

async function checkSetupStatus() {
  checking.value = true
  error.value = null

  try {
    const response = await $fetch<any>('/api/admin/setup/check', {
      method: 'POST'
    })

    if (response.status === 'missing-env') {
      setupStep.value = 'missing-env'
    } else if (response.status === 'needs-setup') {
      setupStep.value = 'needs-setup'
    } else if (response.status === 'ready') {
      setupStep.value = 'ready'
    } else if (response.status === 'error') {
      error.value = response.message || 'An error occurred during setup check'
      setupStep.value = 'error'
    }
  } catch (err: any) {
    console.error('Setup check failed:', err)
    error.value = err?.message || 'Failed to check setup status'
    setupStep.value = 'error'
  } finally {
    checking.value = false
  }
}

async function initializeDatabase() {
  initializing.value = true
  error.value = null

  try {
    await $fetch<any>('/api/admin/setup/init-db', {
      method: 'POST'
    })
    setupStep.value = 'configure-site'
  } catch (err: any) {
    console.error('Database initialization failed:', err)
    error.value = err?.message || 'Failed to initialize database'
    // Keep on needs-setup step to allow retry (not moving to error step for this specific error)
    if (err?.status === 409) {
      // For conflict errors (database already has data), show error but stay on current step
      setupStep.value = 'needs-setup'
    }
  } finally {
    initializing.value = false
  }
}

async function saveSiteConfiguration() {
  saving.value = true
  error.value = null

  try {
    await $fetch('/api/admin/setup/save-site', {
      method: 'POST',
      body: siteForm.value
    })
    setupStep.value = 'ready'
  } catch (err: any) {
    console.error('Site configuration save failed:', err)
    error.value = err?.message || 'Failed to save site configuration'
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
/* Form styling handled by Tailwind */
</style>
