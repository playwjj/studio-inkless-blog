<template>
  <article class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
    <NuxtLink :to="`/blog/${post.slug}`">
      <div class="aspect-video w-full overflow-hidden bg-gray-100">
        <NuxtImg
          :src="coverImageUrl"
          :alt="post.title"
          class="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          loading="lazy"
          width="600"
          height="400"
        />
      </div>
    </NuxtLink>

    <div class="p-6">
      <div class="flex items-center gap-4 mb-3">
        <NuxtLink
          :to="`/blog/category/${post.category.toLowerCase().replace(/\s+/g, '-')}`"
          class="inline-block px-3 py-1 text-xs font-semibold text-primary-600 bg-primary-50 rounded-full hover:bg-primary-100 hover:shadow-sm transition-all"
          @click.stop
        >
          {{ post.category }}
        </NuxtLink>
        <span class="text-sm text-gray-500 hidden">{{ post.readTime }} min read</span>
      </div>

      <NuxtLink :to="`/blog/${post.slug}`">
        <h2 class="text-xl font-bold text-gray-900 mb-2 hover:text-primary-600 transition-colors">
          {{ post.title }}
        </h2>
      </NuxtLink>

      <p class="text-gray-600 mb-4 line-clamp-2">
        {{ post.excerpt }}
      </p>

      <div class="flex flex-wrap gap-2 mb-4">
        <AiChipTag
          v-for="tag in post.tags"
          :key="tag"
          :text="tag"
          :to="`/blog/tag/${tag.toLowerCase().replace(/\s+/g, '-')}`"
        />
      </div>

      <div class="flex items-center justify-between pt-4 border-t border-gray-200">
        <div class="flex items-center gap-3">
          <NuxtImg
            :src="post.author.avatar"
            :alt="post.author.name"
            class="w-10 h-10 rounded-full object-cover"
            width="40"
            height="40"
          />
          <div>
            <p class="text-sm font-medium text-gray-900">{{ post.author.name }}</p>
            <p class="text-xs text-gray-500">{{ formatDate(post.publishedAt) }}</p>
          </div>
        </div>

        <NuxtLink
          :to="`/blog/${post.slug}`"
          class="text-primary-600 hover:text-primary-700 font-medium text-sm"
        >
          Read more →
        </NuxtLink>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import type { BlogListItem } from '~/types/blog'

interface Props {
  post: BlogListItem
}

const props = defineProps<Props>()

const { formatDate } = useFormatDate()
const { getBlogCoverImage } = useImageFallback()

// Get cover image with fallback
const coverImageUrl = computed(() => getBlogCoverImage(props.post.coverImage, props.post.title))
</script>
