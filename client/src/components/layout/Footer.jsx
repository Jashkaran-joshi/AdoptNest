import React from "react";
import { Link } from "react-router-dom";
import { siteInfo } from "../../config/siteInfo";

export default function Footer() {
  return (
    <footer className="mt-16 md:mt-20 lg:mt-24 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 text-slate-300 border-t-2 border-slate-700/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-12 lg:py-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-10 lg:gap-12 max-w-7xl">
        {/* Logo + tagline */}
        <div className="space-y-4 md:space-y-5">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-xl md:text-2xl shadow-lg flex-shrink-0">
              🐾
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-white">AdoptNest</h2>
              <p className="text-xs md:text-sm text-slate-400 font-medium">Rescuing hope, one pet at a time</p>
            </div>
          </div>
          <p className="text-sm md:text-base text-slate-400 leading-relaxed">
            A nonprofit animal rescue organization dedicated to saving homeless and neglected pets. 
            Every adoption helps us rescue another life in need.
          </p>
        </div>

        {/* Adopt Links */}
        <div>
          <h3 className="text-white font-bold mb-4 md:mb-5 text-base md:text-lg">Adopt</h3>
          <ul className="space-y-2 md:space-y-3 text-sm md:text-base">
            <li>
              <Link to="/adopt" className="text-slate-400 hover:text-amber-400 transition-colors duration-200 flex items-center gap-2 group">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                All Pets
              </Link>
            </li>
            <li>
              <Link to="/adopt?type=Dog" className="text-slate-400 hover:text-amber-400 transition-colors duration-200 flex items-center gap-2 group">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                Dogs
              </Link>
            </li>
            <li>
              <Link to="/adopt?type=Cat" className="text-slate-400 hover:text-amber-400 transition-colors duration-200 flex items-center gap-2 group">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                Cats
              </Link>
            </li>
            <li>
              <Link to="/adopt?type=Rabbit" className="text-slate-400 hover:text-amber-400 transition-colors duration-200 flex items-center gap-2 group">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                Rabbits
              </Link>
            </li>
          </ul>
        </div>

        {/* Useful Pages */}
        <div>
          <h3 className="text-white font-bold mb-4 md:mb-5 text-base md:text-lg">Useful Links</h3>
          <ul className="space-y-2 md:space-y-3 text-sm md:text-base">
            <li>
              <Link to="/give" className="text-slate-400 hover:text-amber-400 transition-colors duration-200 flex items-center gap-2 group">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                Surrender a Pet
              </Link>
            </li>
            <li>
              <Link to="/donate" className="text-slate-400 hover:text-amber-400 transition-colors duration-200 flex items-center gap-2 group">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                Donate
              </Link>
            </li>
            <li>
              <Link to="/about" className="text-slate-400 hover:text-amber-400 transition-colors duration-200 flex items-center gap-2 group">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                About Us
              </Link>
            </li>
            <li>
              <Link to="/contact" className="text-slate-400 hover:text-amber-400 transition-colors duration-200 flex items-center gap-2 group">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                Contact
              </Link>
            </li>
            <li>
              <Link to="/faq" className="text-slate-400 hover:text-amber-400 transition-colors duration-200 flex items-center gap-2 group">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                FAQs
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-white font-bold mb-4 md:mb-5 text-base md:text-lg">Contact</h3>
          <ul className="space-y-2 md:space-y-3 text-sm md:text-base">
            <li className="text-slate-400 flex items-center gap-3 group hover:text-amber-400 transition-colors duration-200">
              <span className="text-lg">📍</span>
              <span>{siteInfo.location.city}</span>
            </li>
            <li className="text-slate-400 flex items-center gap-3 group hover:text-amber-400 transition-colors duration-200">
              <span className="text-lg">📞</span>
              <a href={`tel:${siteInfo.contact.phone.replace(/\s/g, '')}`} className="hover:underline">
                {siteInfo.contact.phone}
              </a>
            </li>
            <li className="text-slate-400 flex items-center gap-3 group hover:text-amber-400 transition-colors duration-200">
              <span className="text-lg">📧</span>
              <a href={`mailto:${siteInfo.contact.email}`} className="hover:underline">
                {siteInfo.contact.email}
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t-2 border-slate-700/50 mt-8 md:mt-10 lg:mt-12 pt-8 md:pt-10 pb-6 md:pb-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6">
            <p className="text-xs sm:text-sm text-slate-400 dark:text-slate-500 text-center md:text-left">
              © {new Date().getFullYear()} AdoptNest • All Rights Reserved
            </p>
            <div className="flex items-center gap-4 md:gap-6 text-xs sm:text-sm">
              <Link to="/privacy" className="text-slate-400 dark:text-slate-500 hover:text-amber-400 dark:hover:text-amber-300 transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-slate-400 dark:text-slate-500 hover:text-amber-400 dark:hover:text-amber-300 transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
