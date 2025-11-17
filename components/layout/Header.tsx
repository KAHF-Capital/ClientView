/**
 * Professional Header Component
 * Top navigation bar with KAHF Capital LLC branding
 */

'use client'

import { useRouter, usePathname } from 'next/navigation'
import { Building2, Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

export default function Header() {
  const router = useRouter()
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const isActive = (path: string) => pathname === path

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="bg-green-600 p-2 rounded-lg">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-lg font-bold text-gray-900">KAHF Capital LLC</div>
                <div className="text-xs text-gray-500 -mt-1">Wealth Management</div>
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            <Button
              variant={isActive('/') ? 'default' : 'ghost'}
              size="sm"
              onClick={() => router.push('/')}
              className={isActive('/') ? 'bg-green-600 hover:bg-green-700' : ''}
            >
              Home
            </Button>
            <Button
              variant={isActive('/canvas') ? 'default' : 'ghost'}
              size="sm"
              onClick={() => router.push('/canvas')}
              className={isActive('/canvas') ? 'bg-green-600 hover:bg-green-700' : ''}
            >
              Canvas Editor
            </Button>
            <Button
              variant={isActive('/builder') ? 'default' : 'ghost'}
              size="sm"
              onClick={() => router.push('/builder/demo')}
              className={isActive('/builder') ? 'bg-green-600 hover:bg-green-700' : ''}
            >
              Legacy Builder
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/charts-demo')}
            >
              Charts
            </Button>
          </nav>

          {/* CTA Button */}
          <div className="hidden md:flex items-center gap-3">
            <Button
              size="sm"
              onClick={() => router.push('/canvas')}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Get Started
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-gray-600" />
            ) : (
              <Menu className="w-6 h-6 text-gray-600" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col gap-2">
              <Button
                variant={isActive('/') ? 'default' : 'ghost'}
                size="sm"
                onClick={() => {
                  router.push('/')
                  setMobileMenuOpen(false)
                }}
                className={isActive('/') ? 'bg-green-600 hover:bg-green-700 justify-start' : 'justify-start'}
              >
                Home
              </Button>
              <Button
                variant={isActive('/canvas') ? 'default' : 'ghost'}
                size="sm"
                onClick={() => {
                  router.push('/canvas')
                  setMobileMenuOpen(false)
                }}
                className={isActive('/canvas') ? 'bg-green-600 hover:bg-green-700 justify-start' : 'justify-start'}
              >
                Canvas Editor
              </Button>
              <Button
                variant={isActive('/builder') ? 'default' : 'ghost'}
                size="sm"
                onClick={() => {
                  router.push('/builder/demo')
                  setMobileMenuOpen(false)
                }}
                className={isActive('/builder') ? 'bg-green-600 hover:bg-green-700 justify-start' : 'justify-start'}
              >
                Legacy Builder
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  router.push('/charts-demo')
                  setMobileMenuOpen(false)
                }}
                className="justify-start"
              >
                Charts
              </Button>
              <div className="pt-2 border-t border-gray-200 mt-2">
                <Button
                  size="sm"
                  onClick={() => {
                    router.push('/canvas')
                    setMobileMenuOpen(false)
                  }}
                  className="bg-green-600 hover:bg-green-700 text-white w-full"
                >
                  Get Started
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

