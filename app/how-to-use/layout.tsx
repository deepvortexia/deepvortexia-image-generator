import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'How to Use the AI Image Generator | Deep Vortex AI',
  description: 'Step-by-step guide to generating stunning AI images with Deep Vortex AI. Enter a prompt, choose your style, and download in seconds.',
  alternates: {
    canonical: 'https://images.deepvortexai.com/how-to-use',
  },
}

export default function HowToUseLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
