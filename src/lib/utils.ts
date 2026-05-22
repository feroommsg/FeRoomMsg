export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
}

export function success<T>(data: T): ApiResponse<T> {
  return { success: true, data }
}

export function error(message: string): ApiResponse {
  return { success: false, error: message }
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\-]+/g, "-")
    .replace(/\-\-+/g, "-")
    .trim()
}

export function validateImageType(mimeType: string): boolean {
  const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"]
  return allowed.includes(mimeType)
}

export function validateImageSize(size: number, maxMB: number = 5): boolean {
  return size <= maxMB * 1024 * 1024
}
