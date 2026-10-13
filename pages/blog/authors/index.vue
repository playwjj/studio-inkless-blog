<template>
  <div>
    <!-- Hero Section -->
    <section class="relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-12 md:py-16">
      <div class="absolute inset-0 bg-gradient-to-br from-primary-600/5 via-indigo-500/5 to-purple-600/5"></div>
      <div class="absolute inset-0" style="background-image: radial-gradient(circle at 1px 1px, rgb(148 163 184 / 0.1) 1px, transparent 0); background-size: 40px 40px;"></div>

      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Breadcrumb -->
        <nav class="mb-6">
          <ol class="flex items-center gap-2 text-sm">
            <li>
              <NuxtLink to="/blog" class="text-gray-600 hover:text-gray-900 transition-colors font-medium">
                Blog
              </NuxtLink>
            </li>
            <li class="text-gray-400">/</li>
            <li class="text-gray-900 font-semibold">Authors</li>
          </ol>
        </nav>

        <div class="max-w-3xl">
          <h1 class="text-3xl md:text-4xl font-bold mb-3 text-gray-900">
            Meet Our Authors
          </h1>
          <p class="text-base md:text-lg text-gray-600">
            {{ authors.length }} author{{ authors.length !== 1 ? 's' : '' }} writing for this blog
          </p>
        </div>
      </div>
    </section>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <!-- Loading State -->
      <div v-if="pending" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="i in 6" :key="i" class="animate-pulse">
          <div class="bg-gray-200 h-48 rounded-xl"></div>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-16 bg-red-50 rounded-xl border border-red-200">
        <p class="text-red-600 font-medium">Failed to load authors. Please try again later.</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="authors.length === 0" class="text-center py-16 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
        <h3 class="text-xl font-semibold text-gray-900 mb-2">No authors yet</h3>
      </div>

      <!-- Authors Grid -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <NuxtLink
          v-for="author in authors"
          :key="author.id"
          :to="`/blog/authors/${author.id}`"
          class="group bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:border-primary-300 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
        >
          <div class="flex items-start gap-4 mb-4">
            <NuxtImg
              :src="getAvatarImage(author.avatar, author.name)"
              :alt="author.name"
              class="w-16 h-16 rounded-full object-cover ring-2 ring-primary-200 shadow-md flex-shrink-0"
              width="64"
              height="64"
            />
            <div class="flex-1 min-w-0">
              <h2 class="text-xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors truncate">
                {{ author.name }}
              </h2>
              <p class="text-sm text-gray-500 mt-1">
                {{ author.postCount }} {{ author.postCount === 1 ? 'article' : 'articles' }}
              </p>
            </div>
          </div>

          <p v-if="author.bio" class="text-sm text-gray-600 leading-relaxed line-clamp-3">
            {{ author.bio }}
          </p>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { getTitle, siteConfig } = useSiteConfig()
const { getAvatarImage } = useImageFallback()

const { data, pending, error } = await useFetch('/api/authors')
const authors = computed(() => data.value || [])

useSeoMeta({
  title: () => getTitle('Authors'),
  ogTitle: () => 'Authors',
  description: () => 'Meet the authors behind the articles on this blog.',
  ogDescription: () => 'Meet the authors behind the articles on this blog.',
  ogImage: () => siteConfig.value?.og_image || '',
  twitterCard: 'summary_large_image',
})
</script>
