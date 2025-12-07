<template>
  <div>
    <!-- Page title -->
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Tags</h1>
        <p class="mt-2 text-gray-600">Manage blog post tags</p>
      </div>
      <button
        @click="showCreateModal = true"
        class="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
      >
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        New Tag
      </button>
    </div>

    <!-- Search -->
    <div class="bg-white rounded-xl shadow-sm p-6 mb-6">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search tags..."
        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
      />
    </div>

    <!-- Tags list -->
    <div class="bg-white rounded-xl shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tag Name
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Slug
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Usage Count
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr
              v-for="tag in filteredTags"
              :key="tag.id"
              class="hover:bg-gray-50 transition-colors"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800">
                  {{ tag.name }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <code class="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                  {{ tag.slug }}
                </code>
              </td>
              <td class="px-6 py-4">
                <span class="text-sm text-gray-500">{{ tag.description || '-' }}</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="text-sm text-gray-900">{{ tag.usage_count }}</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(tag.created_at) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex items-center justify-end space-x-2">
                  <button
                    @click="editTag(tag)"
                    class="text-primary-600 hover:text-primary-900"
                    title="Edit"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    @click="deleteTag(tag.id)"
                    class="text-red-600 hover:text-red-900"
                    title="Delete"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Create/Edit modal -->
    <div
      v-if="showCreateModal || editingTag"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      @click.self="closeModal"
    >
      <div class="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-bold text-gray-900">
            {{ editingTag ? 'Edit Tag' : 'New Tag' }}
          </h2>
          <button
            @click="closeModal"
            class="text-gray-400 hover:text-gray-600"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div>
            <label for="tag_name" class="block text-sm font-medium text-gray-700 mb-2">
              Tag Name <span class="text-red-500">*</span>
            </label>
            <input
              id="tag_name"
              v-model="tagForm.name"
              type="text"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              placeholder="Vue.js"
            />
          </div>

          <div>
            <label for="tag_slug" class="block text-sm font-medium text-gray-700 mb-2">
              URL Slug <span class="text-red-500">*</span>
            </label>
            <input
              id="tag_slug"
              v-model="tagForm.slug"
              type="text"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none font-mono text-sm"
              placeholder="vuejs"
            />
          </div>

          <div>
            <label for="tag_description" class="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              id="tag_description"
              v-model="tagForm.description"
              rows="3"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none resize-none"
              placeholder="Tag description (optional)"
            ></textarea>
          </div>

          <div class="flex items-center justify-end space-x-3 pt-4">
            <button
              type="button"
              @click="closeModal"
              class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
            >
              {{ editingTag ? 'Save' : 'Create' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin'
})

const searchQuery = ref('')
const showCreateModal = ref(false)
const editingTag = ref<any>(null)

const tagForm = reactive({
  name: '',
  slug: '',
  description: ''
})

// 模拟数据
const tags = ref([
  {
    id: 1,
    name: 'Vue.js',
    slug: 'vuejs',
    description: 'Vue.js 框架相关',
    usage_count: 18,
    created_at: '2024-01-01'
  },
  {
    id: 2,
    name: 'Nuxt',
    slug: 'nuxt',
    description: 'Nuxt 框架相关',
    usage_count: 15,
    created_at: '2024-01-02'
  },
  {
    id: 3,
    name: 'TypeScript',
    slug: 'typescript',
    description: 'TypeScript 编程语言',
    usage_count: 22,
    created_at: '2024-01-03'
  },
  {
    id: 4,
    name: 'Tailwind CSS',
    slug: 'tailwind-css',
    description: 'Tailwind CSS 框架',
    usage_count: 12,
    created_at: '2024-01-04'
  },
  {
    id: 5,
    name: 'JavaScript',
    slug: 'javascript',
    description: 'JavaScript 编程语言',
    usage_count: 25,
    created_at: '2024-01-05'
  },
  {
    id: 6,
    name: 'Web Design',
    slug: 'web-design',
    description: '网页设计相关',
    usage_count: 8,
    created_at: '2024-01-06'
  }
])

const filteredTags = computed(() => {
  if (!searchQuery.value) return tags.value

  return tags.value.filter(tag =>
    tag.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    tag.slug.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })
}

const closeModal = () => {
  showCreateModal.value = false
  editingTag.value = null
  tagForm.name = ''
  tagForm.slug = ''
  tagForm.description = ''
}

const editTag = (tag: any) => {
  editingTag.value = tag
  tagForm.name = tag.name
  tagForm.slug = tag.slug
  tagForm.description = tag.description || ''
}

const handleSubmit = async () => {
  // TODO: Implement create/update logic
  console.log('Submit tag:', tagForm)
  closeModal()
}

const deleteTag = (id: number) => {
  if (confirm('Are you sure you want to delete this tag? This action cannot be undone.')) {
    // TODO: Implement delete logic
    console.log('Delete tag:', id)
  }
}

// Auto-generate slug
watch(() => tagForm.name, (newName) => {
  if (newName && !editingTag.value) {
    tagForm.slug = newName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
  }
})
</script>
