<template>
  <div class="px-8 py-6">
    <!-- Page title -->
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-2xl font-semibold text-gray-900">Categories</h1>
        <p class="mt-1 text-sm text-gray-500">Manage blog post categories</p>
      </div>
      <button
        @click="showCreateModal = true"
        class="inline-flex items-center px-3 py-1.5 bg-gray-900 text-white text-sm hover:bg-gray-800 transition-colors"
      >
        <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        New Category
      </button>
    </div>

    <!-- Categories list -->
    <div class="border border-gray-200">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
              <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Slug
              </th>
              <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Posts
              </th>
              <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created
              </th>
              <th class="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr
              v-for="category in categories"
              :key="category.id"
              class="hover:bg-gray-50 transition-colors"
            >
              <td class="px-4 py-3">
                <span class="text-sm font-medium text-gray-900">{{ category.name }}</span>
              </td>
              <td class="px-4 py-3 whitespace-nowrap">
                <code class="text-xs text-gray-600">{{ category.slug }}</code>
              </td>
              <td class="px-4 py-3">
                <span class="text-xs text-gray-500">{{ category.description || '-' }}</span>
              </td>
              <td class="px-4 py-3 whitespace-nowrap">
                <span class="text-xs text-gray-900">{{ category.post_count }}</span>
              </td>
              <td class="px-4 py-3 whitespace-nowrap text-xs text-gray-500">
                {{ formatDate(category.created_at) }}
              </td>
              <td class="px-4 py-3 whitespace-nowrap text-right">
                <div class="flex items-center justify-end space-x-2">
                  <button
                    @click="editCategory(category)"
                    class="text-gray-400 hover:text-gray-900"
                    title="Edit"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    @click="deleteCategory(category.id)"
                    class="text-gray-400 hover:text-red-600"
                    title="Delete"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
      v-if="showCreateModal || editingCategory"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      @click.self="closeModal"
    >
      <div class="bg-white border border-gray-200 max-w-md w-full p-6">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-lg font-semibold text-gray-900">
            {{ editingCategory ? 'Edit Category' : 'New Category' }}
          </h2>
          <button
            @click="closeModal"
            class="text-gray-400 hover:text-gray-900"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div>
            <label for="category_name" class="block text-sm font-medium text-gray-700 mb-1.5">
              Category Name <span class="text-red-500">*</span>
            </label>
            <input
              id="category_name"
              v-model="categoryForm.name"
              type="text"
              required
              class="w-full px-3 py-2 text-sm border border-gray-200 focus:ring-1 focus:ring-gray-900 focus:border-gray-900 outline-none"
              placeholder="Technology"
            />
          </div>

          <div>
            <label for="category_slug" class="block text-sm font-medium text-gray-700 mb-1.5">
              URL Slug <span class="text-red-500">*</span>
            </label>
            <input
              id="category_slug"
              v-model="categoryForm.slug"
              type="text"
              required
              class="w-full px-3 py-2 text-sm border border-gray-200 focus:ring-1 focus:ring-gray-900 focus:border-gray-900 outline-none font-mono"
              placeholder="technology"
            />
          </div>

          <div>
            <label for="category_description" class="block text-sm font-medium text-gray-700 mb-1.5">
              Description
            </label>
            <textarea
              id="category_description"
              v-model="categoryForm.description"
              rows="3"
              class="w-full px-3 py-2 text-sm border border-gray-200 focus:ring-1 focus:ring-gray-900 focus:border-gray-900 outline-none resize-none"
              placeholder="Category description (optional)"
            ></textarea>
          </div>

          <div class="flex items-center justify-end space-x-3 pt-4">
            <button
              type="button"
              @click="closeModal"
              class="px-3 py-1.5 border border-gray-200 text-gray-700 text-sm hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="px-3 py-1.5 bg-gray-900 text-white text-sm hover:bg-gray-800 transition-colors"
            >
              {{ editingCategory ? 'Save' : 'Create' }}
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

const showCreateModal = ref(false)
const editingCategory = ref<any>(null)

const categoryForm = reactive({
  name: '',
  slug: '',
  description: ''
})

// 模拟数据
const categories = ref([
  {
    id: 1,
    name: '技术',
    slug: 'tech',
    description: '技术相关文章',
    post_count: 24,
    created_at: '2024-01-01'
  },
  {
    id: 2,
    name: '设计',
    slug: 'design',
    description: '设计相关文章',
    post_count: 12,
    created_at: '2024-01-05'
  },
  {
    id: 3,
    name: '生活',
    slug: 'life',
    description: '生活随笔',
    post_count: 8,
    created_at: '2024-01-10'
  }
])

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })
}

const closeModal = () => {
  showCreateModal.value = false
  editingCategory.value = null
  categoryForm.name = ''
  categoryForm.slug = ''
  categoryForm.description = ''
}

const editCategory = (category: any) => {
  editingCategory.value = category
  categoryForm.name = category.name
  categoryForm.slug = category.slug
  categoryForm.description = category.description || ''
}

const handleSubmit = async () => {
  // TODO: Implement create/update logic
  console.log('Submit category:', categoryForm)
  closeModal()
}

const deleteCategory = (id: number) => {
  if (confirm('Are you sure you want to delete this category? This action cannot be undone.')) {
    // TODO: Implement delete logic
    console.log('Delete category:', id)
  }
}

// Auto-generate slug
watch(() => categoryForm.name, (newName) => {
  if (newName && !editingCategory.value) {
    categoryForm.slug = newName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
  }
})
</script>
