import React, { useState } from "react";
import Breadcrumbs from "../../components/layout/Breadcrumbs";
import { Link } from "react-router-dom";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";

const FAQItem = ({ q, a, openId, id, setOpenId }) => {
  const open = openId === id;

  return (
    <div className="border-b last:border-b-0">
      <button
        onClick={() => setOpenId(open ? null : id)}
        aria-expanded={open}
        className="w-full text-left px-4 py-4 flex items-start justify-between gap-4 "
      >
        <div className="flex-1">
          <div className="font-medium text-slate-900 dark:text-white">{q}</div>
          {/* optional small subtitle placeholder kept for spacing */}
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1" aria-hidden="true"></div>
        </div>

        <div className="flex-shrink-0 text-amber-500">
          <svg
            className={`w-5 h-5 transform transition-transform ${open ? "rotate-180" : "rotate-0"}`}
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path d="M5 8l5 5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </button>

      <div
        className={`px-4 overflow-hidden transition-[max-height,opacity] duration-300 ${open ? "max-h-96 opacity-100 pb-4" : "max-h-0 opacity-0"}`}
        aria-hidden={!open}
      >
        <div className="text-sm text-slate-700 dark:text-slate-300">
          {Array.isArray(a)
            ? a.map((p, i) => (
                <p key={i} className="mb-2">
                  {p}
                </p>
              ))
            : <p className="mb-2">{a}</p>}
        </div>
      </div>
    </div>
  );
};

export default function FAQ() {
  useDocumentTitle("FAQ");
  const [openId, setOpenId] = useState(null);
  const [query, setQuery] = useState("");

  const faqs = [
    {
      id: "f1",
      q: "How does the adoption process work?",
      a: [
        "Browse our rescued pets and click 'View' on a pet you're interested in.",
        "Submit an adoption application — we review applications to ensure the best match for both pet and family.",
        "If approved, complete the adoption agreement. Your adoption fee directly supports our rescue operations, allowing us to save another pet in need.",
      ],
    },
    {
      id: "f2",
      q: "What documents do I need to adopt a pet?",
      a: [
        "A government-issued ID (Aadhaar, passport, driver’s license).",
        "Proof of address (utility bill or rental agreement) in some cases.",
        "Some adoptions may request a short home-check or references.",
      ],
    },
    {
      id: "f3",
      q: "Can I surrender (give) my pet to AdoptNest?",
      a: [
        "Yes — as a nonprofit rescue organization, we accept pets that need a new home. Use the 'Surrender a Pet' page to submit a surrender request with details and photos.",
        "We will review the request and arrange a safe pickup or advise on drop-off options. We provide medical care and rehabilitation before finding them a new home.",
        "If our rescue center is at capacity, we may provide alternatives or waitlist your pet. We never turn away pets in emergency situations.",
      ],
    },
    {
      id: "f4",
      q: "Are the rescued pets vaccinated and neutered?",
      a:
        "Yes! As part of our rescue and rehabilitation program, all pets receive comprehensive medical care including vaccinations, spay/neuter services, and health checks. Each pet detail page shows their complete health and vaccination status. This is included in the adoption fee, which directly supports our rescue operations.",
    },
    {
      id: "f5",
      q: "How long does approval take?",
      a: "Approval time varies — simple applications may be approved within 24–72 hours. Applications requiring reference checks or home visits may take longer.",
    },
    {
      id: "f6",
      q: "Can I return an adopted pet if things don’t work out?",
      a: [
        "Yes — we ask adopters to contact us as soon as possible. We have a return policy to ensure the pet’s safety and rehoming.",
        "Returning an adopted pet should be done through the Dashboard or by contacting support.",
      ],
    },
    {
      id: "f7",
      q: "Do you offer foster or volunteer opportunities?",
      a: "Yes. We frequently need foster homes and volunteers for transport, events, and socialization. Visit our Contact page to sign up or email jashkaranjoshi@gmail.com.",
    },
    {
      id: "f8",
      q: "How can I report a lost or found pet?",
      a: [
        "Use the Contact page to report lost or found pets — include a photo, location, and contact details.",
        "We also recommend posting in local community groups and visiting local shelters.",
      ],
    },
    {
      id: "f9",
      q: "Is there a fee to adopt?",
      a: "Yes, there is an adoption fee that covers the medical care, vaccinations, spay/neuter, and rehabilitation we provide to each rescued pet. This fee is essential for our nonprofit operations and allows us to continue rescuing more animals in need. Every adoption fee directly funds our rescue mission. Fee details appear on each pet's page.",
    },
    {
      id: "f10",
      q: "Can I sponsor a pet instead of adopting?",
      a: "Yes! As a nonprofit organization, we rely on sponsorships to care for rescued pets. Visit our Donate page to sponsor a specific pet's food, medical care, or rehabilitation. Your sponsorship directly supports our rescue mission and helps us save more lives.",
    },
  ];

  const filtered = faqs.filter((f) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    const hay = (typeof f.a === "string" ? f.a : f.a.join(" ")).toLowerCase();
    return f.q.toLowerCase().includes(q) || hay.includes(q);
  });

  return (
    <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-10 max-w-4xl">
      <Breadcrumbs />
      <header className="text-center mb-4 sm:mb-6 md:mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2 sm:mb-3 leading-tight">
          Frequently Asked Questions
        </h1>
        <p className="text-sm sm:text-base md:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Answers to common questions about our rescue operations, adoption process, surrendering pets, and how to support our nonprofit mission.
        </p>
      </header>

      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
          <div className="flex-1">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search FAQs (adoption, surrender, vaccination...)"
              className="w-full rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-2 bg-white dark:bg-slate-900 text-slate-800 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-amber-300 outline-none transition"
              aria-label="Search FAQs"
            />
          </div>

          <div className="flex items-center gap-2 mt-2 md:mt-0">
            <button
              onClick={() => {
                setQuery("");
                setOpenId(null);
              }}
              className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
            >
              Reset
            </button>

            <Link
              to="/contact"
              className="px-3 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-sm transition"
            >
              Contact Support
            </Link>
          </div>
        </div>

        <div className="divide-y rounded-md overflow-hidden">
          {filtered.length ? (
            filtered.map((f) => (
              <FAQItem key={f.id} id={f.id} q={f.q} a={f.a} openId={openId} setOpenId={setOpenId} />
            ))
          ) : (
            <div className="p-6 text-center text-slate-600 dark:text-slate-400">No FAQs match your search.</div>
          )}
        </div>
      </section>

      <section className="text-center mt-6">
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Didn’t find your question?{" "}
          <Link to="/contact" className="text-amber-500 font-semibold hover:underline">
            Get in touch
          </Link>{" "}
          and we’ll help.
        </p>
      </section>
    </main>
  );
}
