<template>
  <div class="absolute inset-0 overflow-hidden pointer-events-none" style="contain: layout style paint;">
    <!-- Neural network connections - GPU optimized -->
    <svg class="absolute inset-0 w-full h-full opacity-25" xmlns="http://www.w3.org/2000/svg" style="will-change: opacity;">
      <defs>
        <!-- AI gradient for connections -->
        <linearGradient id="neural-gradient-1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#8B5CF6;stop-opacity:0.6" />
          <stop offset="50%" style="stop-color:#06B6D4;stop-opacity:0.4" />
          <stop offset="100%" style="stop-color:#EC4899;stop-opacity:0.6" />
        </linearGradient>

        <linearGradient id="neural-gradient-2" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:#22D3EE;stop-opacity:0.6" />
          <stop offset="50%" style="stop-color:#8B5CF6;stop-opacity:0.4" />
          <stop offset="100%" style="stop-color:#06B6D4;stop-opacity:0.6" />
        </linearGradient>

        <!-- Simplified glow filter - reduced blur for performance -->
        <filter id="glow">
          <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      <!-- Neural network connection lines - simplified -->
      <g class="animate-neural-pulse">
        <!-- Main horizontal flow connections only -->
        <line x1="15%" y1="30%" x2="40%" y2="35%" stroke="url(#neural-gradient-1)" stroke-width="0.8" opacity="0.4" stroke-dasharray="4,4">
          <animate attributeName="stroke-dashoffset" from="0" to="8" dur="3s" repeatCount="indefinite"/>
        </line>

        <line x1="40%" y1="35%" x2="60%" y2="40%" stroke="url(#neural-gradient-2)" stroke-width="0.8" opacity="0.4" stroke-dasharray="4,4">
          <animate attributeName="stroke-dashoffset" from="0" to="8" dur="3.5s" repeatCount="indefinite"/>
        </line>

        <line x1="60%" y1="40%" x2="85%" y2="45%" stroke="url(#neural-gradient-1)" stroke-width="0.8" opacity="0.4" stroke-dasharray="4,4">
          <animate attributeName="stroke-dashoffset" from="0" to="8" dur="3.2s" repeatCount="indefinite"/>
        </line>
      </g>

      <!-- Neural nodes (neurons) - simplified, fewer nodes -->
      <g filter="url(#glow)">
        <!-- Main flow nodes only -->
        <circle cx="15%" cy="30%" r="3" class="fill-ai-purple animate-pulse-glow" opacity="0.7">
          <animate attributeName="r" values="3;4;3" dur="3s" repeatCount="indefinite"/>
        </circle>

        <circle cx="40%" cy="35%" r="4" class="fill-ai-cyan animate-pulse-glow" opacity="0.7">
          <animate attributeName="r" values="4;5;4" dur="3.5s" repeatCount="indefinite"/>
        </circle>

        <circle cx="60%" cy="40%" r="4" class="fill-ai-pink animate-pulse-glow" opacity="0.7">
          <animate attributeName="r" values="4;5;4" dur="3.2s" repeatCount="indefinite"/>
        </circle>

        <circle cx="85%" cy="45%" r="5" class="fill-ai-purple-dark animate-pulse-glow" opacity="0.8">
          <animate attributeName="r" values="5;6;5" dur="3s" repeatCount="indefinite"/>
        </circle>
      </g>
    </svg>
  </div>
</template>

<script setup lang="ts">
// Neural network background component for AI aesthetic
</script>

<style scoped>
/* Removed drop-shadow for performance - using SVG filter instead */
</style>
