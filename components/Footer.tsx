'use client';

import { Github, Linkedin, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer
      id="contact"
      // Updated: background to use semantic color
      className="bg-background-dark border-t border-slate-800 py-12"
    >
      <div className="max-w-6xl mx-auto px-6">

        {/* Top Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
          
          {/* Branding */}
          <div className="text-center md:text-left">
            {/* Updated: gradient to primary/accent */}
            <h3 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              TravelScope Intelligence
            </h3>
            <p className="text-slate-400 text-sm mt-2">
              Strategic Revenue Analytics for Global Tourism
            </p>
          </div>

          {/* Social / Contact */}
          <div className="flex items-center gap-5">
            <a
              href="https://github.com/Akshaya1307/"
              target="_blank"
              rel="noopener noreferrer"
              // Updated: hover to primary
              className="text-slate-400 hover:text-primary transition-colors"
              aria-label="GitHub"
            >
              <Github className="w-5 h-5" />
            </a>

            <a
              href="https://linkedin.com/in/naga-akshaya-boyidi-25995635b/"
              target="_blank"
              rel="noopener noreferrer"
              // Updated: hover to primary
              className="text-slate-400 hover:text-primary transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-5 h-5" />
            </a>

            <a
              href="mailto:boyidinagaakshaya@gmail.com"
              // Updated: hover to primary
              className="text-slate-400 hover:text-primary transition-colors"
              aria-label="Email"
            >
              <Mail className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-800 pt-6 text-center text-sm text-slate-500">
          © {new Date().getFullYear()} Naga Akshaya Boyidi | Infosys Springboard Internship Project  
          <br />
          Built with Power BI, DAX, Next.js & Tailwind CSS
        </div>

      </div>
    </footer>
  );
}