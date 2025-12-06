<template>
  <NuxtLink
    :to="`/blog/${post.slug}`"
    class="group relative overflow-hidden rounded-2xl bg-white shadow-xl hover:shadow-2xl transition-all duration-500"
  >
    <div class="grid md:grid-cols-2 gap-0 min-h-[400px]">
      <!-- Image Section -->
      <div class="relative overflow-hidden order-2 md:order-1">
        <div class="absolute inset-0 bg-gradient-to-r from-primary-600/20 to-transparent z-10"></div>
        <NuxtImg
          :src="post.coverImage"
          :alt="post.title"
          class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          loading="eager"
          width="800"
          height="600"
        />
      </div>

      <!-- Content Section -->
      <div class="p-8 md:p-12 flex flex-col justify-center order-1 md:order-2 bg-gradient-to-br from-gray-50 to-white">
        <div class="flex items-center gap-3 mb-4">
          <span class="inline-flex items-center px-4 py-1.5 text-sm font-semibold text-white bg-gradient-to-r from-primary-600 to-primary-700 rounded-full shadow-md">
            Featured
          </span>
          <span class="text-sm text-gray-500">{{ post.readTime }} min read</span>
        </div>

        <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4 group-hover:text-primary-600 transition-colors line-clamp-2">
          {{ post.title }}
        </h2>

        <p class="text-gray-600 text-lg mb-6 line-clamp-3">
          {{ post.excerpt }}
        </p>

        <div class="flex flex-wrap gap-2 mb-6">
          <span
            v-for="tag in post.tags.slice(0, 3)"
            :key="tag"
            class="text-sm text-primary-700 bg-primary-50 px-3 py-1 rounded-lg font-medium"
          >
            #{{ tag }}
          </span>
        </div>

        <div class="flex items-center gap-4">
          <NuxtImg
            :src="post.author.avatar"
            :alt="post.author.name"
            class="w-12 h-12 rounded-full object-cover ring-2 ring-primary-100"
            width="48"
            height="48"
          />
          <div>
            <p class="font-semibold text-gray-900">{{ post.author.name }}</p>
            <p class="text-sm text-gray-500">{{ formatDate(post.publishedAt) }}</p>
          </div>
        </div>

        <div class="mt-6 inline-flex items-center text-primary-600 font-semibold group-hover:gap-3 gap-2 transition-all">
          Read article
          <svg class="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </div>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import type { BlogListItem } from '~/types/blog'

interface Props {
  post: BlogListItem
}

defineProps<Props>()

const { formatDate } = useFormatDate()
</script>
