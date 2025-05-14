import React from 'react'
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter } from 'react-icons/fa'

const FooterAdmin = () => {
  return (
    <footer className="bg-[#111827] text-white px-6 py-10">
     
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 border-b border-[#1F2937] pb-10">
        
        <div className="space-y-3">
          <h4 className="font-bold text-base">SmartQR</h4>
          <p className="text-sm text-[#9CA3AF]">Empowering restaurants with modern technology solutions.</p>
        </div>

        <div className="space-y-2">
          <h4 className="font-semibold text-base">Product</h4>
          <div className="flex flex-col gap-1 text-[#9CA3AF] text-sm">
            <span>Features</span>
            <span>Pricing</span>
            <span>Integration</span>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="font-semibold text-base">Resources</h4>
          <div className="flex flex-col gap-1 text-[#9CA3AF] text-sm">
            <span>Documentation</span>
            <span>Blog</span>
            <span>Support</span>
          </div>
        </div>
        
        <div className="space-y-2">
          <h4 className="font-semibold text-base">Connect</h4>
          <div className="flex gap-4 text-xl text-[#9CA3AF]">
            <a href="https://twitter.com/" aria-label="Twitter"><FaTwitter /></a>
            <a href="https://linkedin.com/" aria-label="LinkedIn"><FaLinkedin /></a>
            <a href="https://facebook.com/" aria-label="Facebook"><FaFacebook /></a>
            <a href="https://instagram.com/" aria-label="Instagram"><FaInstagram /></a>
          </div>
        </div>

      </div>

      
      <div className="text-center text-xs text-[#9CA3AF] mt-6">
        © 2025 SmartQR. All rights reserved.
      </div>
    </footer>
  )
}

export default FooterAdmin
