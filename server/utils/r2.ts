import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'

/**
 * Get S3 client configured for Cloudflare R2
 */
export function getR2Client() {
  const config = useRuntimeConfig()

  if (!config.r2AccountId || !config.r2AccessKeyId || !config.r2SecretAccessKey) {
    throw new Error('R2 configuration is missing. Please check environment variables.')
  }

  return new S3Client({
    region: 'auto',
    endpoint: `https://${config.r2AccountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: config.r2AccessKeyId,
      secretAccessKey: config.r2SecretAccessKey
    }
  })
}

/**
 * Generate unique file key with path structure: uploads/{year}/{month}/{uuid}.{ext}
 */
export function generateFileKey(originalName: string): string {
  const ext = originalName.split('.').pop()?.toLowerCase() || ''
  const uuid = crypto.randomUUID()
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')

  return `uploads/${year}/${month}/${uuid}.${ext}`
}

/**
 * Upload file buffer to R2
 */
export async function uploadToR2(
  buffer: Buffer,
  key: string,
  contentType: string
): Promise<void> {
  const config = useRuntimeConfig()
  const client = getR2Client()

  const command = new PutObjectCommand({
    Bucket: config.r2BucketName,
    Key: key,
    Body: buffer,
    ContentType: contentType
  })

  await client.send(command)
}

/**
 * Delete file from R2
 */
export async function deleteFromR2(key: string): Promise<void> {
  const config = useRuntimeConfig()
  const client = getR2Client()

  const command = new DeleteObjectCommand({
    Bucket: config.r2BucketName,
    Key: key
  })

  await client.send(command)
}

/**
 * Generate public URL for R2 file
 */
export function getPublicUrl(key: string): string {
  const config = useRuntimeConfig()

  if (!config.r2PublicUrl) {
    throw new Error('R2_PUBLIC_URL is not configured')
  }

  // Remove trailing slash from public URL if present
  const baseUrl = config.r2PublicUrl.replace(/\/$/, '')
  return `${baseUrl}/${key}`
}

/**
 * Extract image dimensions from buffer
 * Returns null for non-image files
 *
 * Note: Image dimension extraction is disabled for Cloudflare Pages compatibility
 * (sharp library requires native bindings which are not available in Workers environment)
 */
export async function getImageDimensions(
  buffer: Buffer,
  mimeType: string
): Promise<{ width: number; height: number } | null> {
  // Image dimension extraction is disabled for Cloudflare Pages compatibility
  // The sharp library requires native bindings which are not available in Workers environment
  return null
}

/**
 * Allowed MIME types for upload
 */
export const ALLOWED_MIME_TYPES = [
  // Images
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml',
  // Documents
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'text/plain',
  'text/csv',
  // Archives
  'application/zip',
  'application/x-rar-compressed',
  'application/x-7z-compressed',
  // Other
  'application/json',
  'application/xml',
  'text/xml'
]

/**
 * Maximum file size (10MB)
 */
export const MAX_FILE_SIZE = 10 * 1024 * 1024

/**
 * Validate file before upload
 */
export function validateFile(
  size: number,
  mimeType: string
): { valid: boolean; error?: string } {
  if (size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File size exceeds ${MAX_FILE_SIZE / 1024 / 1024}MB limit`
    }
  }

  if (!ALLOWED_MIME_TYPES.includes(mimeType)) {
    return {
      valid: false,
      error: `File type ${mimeType} is not allowed. Supported types: images, PDF, Word, Excel, PowerPoint, text files, and archives.`
    }
  }

  return { valid: true }
}
