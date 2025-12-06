<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div class="bg-white rounded-xl shadow-lg overflow-hidden">
      <div class="bg-gradient-to-r from-primary-600 to-primary-800 px-8 py-12 text-white">
        <h1 class="text-4xl font-bold mb-4">About Studio Inkless Blog</h1>
        <p class="text-xl text-primary-100">
          A modern blogging platform built with cutting-edge technologies
        </p>
      </div>

      <div class="px-8 py-12">
        <div class="prose prose-lg max-w-none">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
          <p class="text-gray-700 mb-6">
            We're dedicated to sharing knowledge about web development, design, and technology.
            Our goal is to create high-quality content that helps developers of all skill levels
            grow and succeed in their careers.
          </p>

          <h2 class="text-2xl font-bold text-gray-900 mb-4">Technology Stack</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div class="bg-gray-50 p-6 rounded-lg">
              <h3 class="text-lg font-semibold text-gray-900 mb-2">Nuxt 3</h3>
              <p class="text-gray-600">
                The intuitive Vue framework for building modern web applications with server-side rendering.
              </p>
            </div>

            <div class="bg-gray-50 p-6 rounded-lg">
              <h3 class="text-lg font-semibold text-gray-900 mb-2">Tailwind CSS</h3>
              <p class="text-gray-600">
                A utility-first CSS framework for rapidly building custom user interfaces.
              </p>
            </div>

            <div class="bg-gray-50 p-6 rounded-lg">
              <h3 class="text-lg font-semibold text-gray-900 mb-2">TypeScript</h3>
              <p class="text-gray-600">
                Strongly typed JavaScript that scales with type safety and enhanced developer experience.
              </p>
            </div>

            <div class="bg-gray-50 p-6 rounded-lg">
              <h3 class="text-lg font-semibold text-gray-900 mb-2">Cloudflare Pages</h3>
              <p class="text-gray-600">
                Global deployment platform ensuring fast, secure access from anywhere in the world.
              </p>
            </div>
          </div>

          <h2 class="text-2xl font-bold text-gray-900 mb-4">Features</h2>
          <ul class="space-y-3 mb-8">
            <li class="flex items-start">
              <svg class="w-6 h-6 text-primary-600 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <span class="text-gray-700">Server-side rendering for optimal SEO and performance</span>
            </li>
            <li class="flex items-start">
              <svg class="w-6 h-6 text-primary-600 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <span class="text-gray-700">RESTful API architecture for scalable data management</span>
            </li>
            <li class="flex items-start">
              <svg class="w-6 h-6 text-primary-600 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <span class="text-gray-700">Responsive design that works beautifully on all devices</span>
            </li>
            <li class="flex items-start">
              <svg class="w-6 h-6 text-primary-600 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <span class="text-gray-700">Category and tag-based filtering for easy content discovery</span>
            </li>
            <li class="flex items-start">
              <svg class="w-6 h-6 text-primary-600 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <span class="text-gray-700">Global CDN delivery for lightning-fast load times</span>
            </li>
          </ul>

          <div class="bg-primary-50 border-l-4 border-primary-600 p-6 rounded-r-lg">
            <p class="text-gray-800">
              <strong class="text-primary-900">Note:</strong> This is a demonstration project showcasing
              modern web development practices. The blog posts are mock data for illustration purposes.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
