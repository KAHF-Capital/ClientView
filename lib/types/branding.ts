/**
 * Branding configuration for PowerPoint export
 */

export interface BrandingConfig {
  author?: string
  company?: string
  logo?: string // base64 image data
  backgroundColor?: string
  primaryColor?: string
  secondaryColor?: string
  fontFamily?: string
  footer?: string
  header?: string
  watermark?: string
}

export const DEFAULT_BRANDING: BrandingConfig = {
  author: 'ClientView',
  company: 'KAHF Capital',
  backgroundColor: '#ffffff',
  primaryColor: '#16a34a',
  secondaryColor: '#15803d',
  fontFamily: 'Arial',
  footer: 'Confidential • ClientView Pro',
}

