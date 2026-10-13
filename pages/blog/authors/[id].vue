<template>
  <div>
    <!-- Loading State -->
    <div v-if="pending" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div class="animate-pulse flex items-center gap-6">
        <div class="w-24 h-24 bg-gray-200 rounded-full"></div>
        <div class="flex-1">
          <div class="h-8 bg-gray-200 rounded w-1/3 mb-3"></div>
          <div class="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error || !author" class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div class="text-center py-12 bg-red-50 rounded-xl border border-red-200">
        <h1 class="text-2xl font-bold text-gray-900 mb-3">Author Not Found</h1>
        <p class="text-gray-600 mb-8 max-w-md mx-auto">The author you're looking for doesn't exist or has been removed.</p>
        <NuxtLink
          to="/blog/authors"
          class="inline-flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors font-semibold"
        >
          All Authors
        </NuxtLink>
      </div>
    </div>

    <div v-else>
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
              <li>
                <NuxtLink to="/blog/authors" class="text-gray-600 hover:text-gray-900 transition-colors font-medium">
                  Authors
                </NuxtLink>
              </li>
              <li class="text-gray-400">/</li>
              <li class="text-gray-900 font-semibold">{{ author.name }}</li>
            </ol>
          </nav>

          <div class="flex items-start gap-6">
            <NuxtImg
              :src="getAvatarImage(author.avatar, author.name)"
              :alt="author.name"
              class="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover ring-4 ring-white shadow-lg flex-shrink-0"
              width="96"
              height="96"
            />
            <div class="flex-1 min-w-0">
              <h1 class="text-3xl md:text-4xl font-bold mb-3 text-gray-900">
                {{ author.name }}
              </h1>
              <p v-if="author.bio" class="text-base md:text-lg text-gray-600 leading-relaxed max-w-3xl">
                {{ author.bio }}
              </p>
              <p class="text-sm text-gray-500 mt-3">
                {{ author.postCount }} {{ author.postCount === 1 ? 'article' : 'articles' }}
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- Articles -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <h2 class="text-2xl font-bold text-gray-900 mb-8">Articles by {{ author.name }}</h2>

        <div v-if="author.posts.length === 0" class="text-center py-16 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
          <p class="text-gray-600">This author hasn't published any articles yet.</p>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          <BlogCard
            v-for="post in author.posts"
            :key="post.id"
            :post="post"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const authorId = route.params.id as string

const { getTitle, siteConfig } = useSiteConfig()
const { getAvatarImage } = useImageFallback()

const { data: author, pending, error } = await useFetch(`/api/authors/${authorId}`)

useSeoMeta({
  title: () => getTitle(author.value?.name || 'Author'),
  ogTitle: () => author.value?.name || 'Author',
  description: () => author.value?.bio || `Read articles by ${author.value?.name || 'this author'}.`,
  ogDescription: () => author.value?.bio || `Read articles by ${author.value?.name || 'this author'}.`,
  ogImage: () => siteConfig.value?.og_image || '',
  twitterCard: 'summary_large_image',
})
</script>
