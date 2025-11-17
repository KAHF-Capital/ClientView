/**
 * Professional Footer Component
 * Bottom banner with KAHF Capital LLC information
 */

'use client'

import { Building2, Mail, Phone, MapPin, Linkedin, Twitter } from 'lucide-react'
import Link from 'next/link'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 text-gray-300 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-green-600 p-2 rounded-lg">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-lg font-bold text-white">KAHF Capital LLC</div>
                <div className="text-xs text-gray-400">Wealth Management Solutions</div>
              </div>
            </div>
            <p className="text-sm text-gray-400 mb-4 max-w-md">
              Professional investment proposal tools designed for wealth advisors. 
              Create stunning presentations with our drag-and-drop canvas editor.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="text-gray-400 hover:text-green-400 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-green-400 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-green-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/canvas" className="hover:text-green-400 transition-colors">
                  Canvas Editor
                </Link>
              </li>
              <li>
                <Link href="/builder/demo" className="hover:text-green-400 transition-colors">
                  Legacy Builder
                </Link>
              </li>
              <li>
                <Link href="/charts-demo" className="hover:text-green-400 transition-colors">
                  Charts Demo
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <Mail className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                <a href="mailto:info@kahfcapital.com" className="hover:text-green-400 transition-colors">
                  info@kahfcapital.com
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Phone className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                <a href="tel:+1234567890" className="hover:text-green-400 transition-colors">
                  (123) 456-7890
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                <span className="text-gray-400">
                  123 Financial District<br />
                  New York, NY 10004
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">
            <div>
              © {currentYear} KAHF Capital LLC. All rights reserved.
            </div>
            <div className="flex gap-6">
              <Link href="#" className="hover:text-green-400 transition-colors">
                Privacy Policy
              </Link>
              <Link href="#" className="hover:text-green-400 transition-colors">
                Terms of Service
              </Link>
              <Link href="#" className="hover:text-green-400 transition-colors">
                Disclaimer
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

