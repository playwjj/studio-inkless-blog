<template>
  <div>
    <div v-if="pending" class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="animate-pulse">
        <div class="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div class="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
        <div class="bg-gray-200 aspect-video rounded-lg mb-8"></div>
        <div class="space-y-4">
          <div class="h-4 bg-gray-200 rounded"></div>
          <div class="h-4 bg-gray-200 rounded"></div>
          <div class="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
      </div>
    </div>

    <div v-else-if="error" class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="text-center py-12">
        <h1 class="text-2xl font-bold text-gray-900 mb-4">Post Not Found</h1>
        <p class="text-gray-600 mb-8">The post you're looking for doesn't exist.</p>
        <NuxtLink
          to="/blog"
          class="inline-block bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
        >
          Back to Blog
        </NuxtLink>
      </div>
    </div>

    <article v-else-if="data" class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <header class="mb-8">
        <div class="mb-4">
          <NuxtLink
            to="/blog"
            class="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium"
          >
            ← Back to Blog
          </NuxtLink>
        </div>

        <div class="flex items-center gap-4 mb-4">
          <span class="inline-block px-3 py-1 text-sm font-semibold text-primary-600 bg-primary-50 rounded-full">
            {{ data.category }}
          </span>
          <span class="text-sm text-gray-500">{{ data.readTime }} min read</span>
        </div>

        <h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          {{ data.title }}
        </h1>

        <div class="flex items-center gap-4 mb-6">
          <img
            :src="data.author.avatar"
            :alt="data.author.name"
            class="w-12 h-12 rounded-full object-cover"
          />
          <div>
            <p class="font-medium text-gray-900">{{ data.author.name }}</p>
            <p class="text-sm text-gray-500">{{ formatDate(data.publishedAt) }}</p>
          </div>
        </div>

        <div class="flex flex-wrap gap-2 mb-6">
          <span
            v-for="tag in data.tags"
            :key="tag"
            class="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full"
          >
            #{{ tag }}
          </span>
        </div>

        <div class="aspect-video w-full overflow-hidden rounded-xl mb-8">
          <img
            :src="data.coverImage"
            :alt="data.title"
            class="w-full h-full object-cover"
          />
        </div>
      </header>

      <div class="prose prose-lg max-w-none">
        <div class="whitespace-pre-wrap text-gray-700 leading-relaxed" v-html="formattedContent"></div>
      </div>

      <footer class="mt-12 pt-8 border-t border-gray-200">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <img
              :src="data.author.avatar"
              :alt="data.author.name"
              class="w-16 h-16 rounded-full object-cover"
            />
            <div>
              <p class="text-sm text-gray-500">Written by</p>
              <p class="font-semibold text-gray-900">{{ data.author.name }}</p>
            </div>
          </div>

          <NuxtLink
            to="/blog"
            class="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors font-medium"
          >
            More Articles
          </NuxtLink>
        </div>
      </footer>
    </article>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const slug = route.params.slug

const { data, pending, error } = await useFetch(`/api/posts/${slug}`)

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const formattedContent = computed(() => {
  if (!data.value?.content) return ''

  return data.value.content
    .replace(/\n/g, '<br>')
    .replace(/#{1,6}\s+(.+)/g, (match, title) => {
      const level = match.match(/^#+/)[0].length
      return `<h${level} class="text-${4-level}xl font-bold mt-8 mb-4 text-gray-900">${title}</h${level}>`
    })
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/```(\w+)?\n([\s\S]+?)```/g, '<pre class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto my-4"><code>$2</code></pre>')
    .replace(/`([^`]+)`/g, '<code class="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm">$1</code>')
    .replace(/^-\s+(.+)/gm, '<li class="ml-4">$1</li>')
    .replace(/^\d+\.\s+(.+)/gm, '<li class="ml-4">$1</li>')
})

useHead({
  title: () => data.value ? `${data.value.title} - Studio Inkless Blog` : 'Post - Studio Inkless Blog',
  meta: [
    {
      name: 'description',
      content: () => data.value?.excerpt || 'Read this post on Studio Inkless Blog'
    }
  ]
})
</script>
