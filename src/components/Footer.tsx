import Link from "next/link";
import Image from "next/image";
import { MapPin, Phone, Mail, Shield, Award, CheckCircle } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const certifications = [
    { icon: <Shield className="w-5 h-5" />, title: "PSQCA Certified", subtitle: "Pakistan Standards & Quality Control" },
    { icon: <CheckCircle className="w-5 h-5" />, title: "Halal Certified", subtitle: "Pakistan Halal Authority" },
    { icon: <Award className="w-5 h-5" />, title: "ISO 22000", subtitle: "Food Safety Management" },
    { icon: <Shield className="w-5 h-5" />, title: "FSMS Compliant", subtitle: "Food Safety Standards" },
  ];

  return (
    <footer className="bg-[var(--color-charcoal)] text-white">
      {/* Certifications Section */}
      <div className="border-b border-[#3D3D35]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h3 className="text-center text-sm font-semibold text-[var(--color-gold)] uppercase tracking-[0.2em] mb-8">Certifications & Licenses</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {certifications.map((cert, i) => (
              <div key={i} className="flex flex-col items-center text-center p-5 rounded-2xl bg-[#3D3D35]/50 border border-[#4D4D45] hover:border-[var(--color-gold)]/30 hover:bg-[#3D3D35] transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-[var(--color-gold)]/20 border border-[var(--color-gold)]/30 flex items-center justify-center text-[var(--color-gold)] mb-3">
                  {cert.icon}
                </div>
                <p className="text-sm font-bold text-white leading-snug">{cert.title}</p>
                <p className="text-xs text-gray-400 mt-1 leading-snug">{cert.subtitle}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-xl bg-[var(--color-forest)] flex items-center justify-center overflow-hidden">
                <Image src="/logo.png" alt="Bereket Foods" width={44} height={44} className="object-contain" />
              </div>
              <div>
                <span className="text-xl font-bold text-white block leading-none">Bereket Foods</span>
                <span className="text-[10px] text-[var(--color-gold)] tracking-[0.2em] uppercase">Premium Natural Foods</span>
              </div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed max-w-sm mb-6">
              Bringing prosperity to your table through the perfect amalgamation of nature and science. 
              Premium natural foods — Halal certified, delivered across Pakistan.
            </p>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[var(--color-gold)] mt-0.5 flex-shrink-0" />
                <p className="text-sm text-gray-400">3rd Floor, 13-Plaza, Overseas V Commercial, Bahria Town Phase 8, Islamabad</p>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-[var(--color-gold)] flex-shrink-0" />
                <a href="tel:+923335647799" className="text-sm text-gray-400 hover:text-[var(--color-gold)] transition-colors">+92 333 5647799</a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-[var(--color-gold)] flex-shrink-0" />
                <a href="mailto:info@bereketfoods.com" className="text-sm text-gray-400 hover:text-[var(--color-gold)] transition-colors">info@bereketfoods.com</a>
              </div>
            </div>
            {/* Social Links - WhatsApp */}
            <div className="flex items-center gap-3 mt-6">
              <a href="https://wa.me/923335647799" target="_blank" rel="noopener noreferrer" className="px-4 py-2 rounded-full bg-[#3D3D35] text-gray-400 hover:bg-[#25D366] hover:text-white text-sm font-medium transition-all">
                WhatsApp
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-white mb-5 tracking-wide">Quick Links</h4>
            <ul className="space-y-3">
              {[{ href: "/", label: "Home" }, { href: "/products", label: "Shop" }, { href: "/about", label: "About Us" }, { href: "/checkout", label: "Checkout" }].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-gray-400 hover:text-[var(--color-gold)] transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-sm font-bold text-white mb-5 tracking-wide">Categories</h4>
            <ul className="space-y-3">
              {["Breakfast Cereals", "Granola & Snacks", "Superfoods", "Jams & Condiments", "Natural Sweeteners"].map((cat) => (
                <li key={cat}>
                  <Link href={`/products?category=${encodeURIComponent(cat)}`} className="text-sm text-gray-400 hover:text-[var(--color-gold)] transition-colors">
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[#3D3D35] px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">© {currentYear} Bereket Foods. All Rights Reserved.</p>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">Payment:</span>
            <div className="flex items-center gap-2">
              <span className="bg-[#8B1C3C] text-white text-[10px] font-bold px-2.5 py-1 rounded">JazzCash</span>
              <span className="bg-[#00A650] text-white text-[10px] font-bold px-2.5 py-1 rounded">EasyPaisa</span>
              <span className="bg-[#3D3D35] text-gray-300 text-[10px] font-bold px-2.5 py-1 rounded border border-gray-600">COD</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
