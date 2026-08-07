import { Link } from "react-router-dom";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-16">
      <div className="mx-auto max-w-3xl px-6">
        <div className="mb-8">
          <Link to="/" className="text-violet-600 hover:text-violet-700 dark:text-violet-400 font-semibold text-sm">
            ← Back to CoDO
          </Link>
        </div>
        <h1 className="text-4xl font-black text-slate-900 dark:text-slate-100 mb-6">Privacy Policy</h1>
        <div className="prose prose-slate dark:prose-invert max-w-none space-y-6 text-slate-600 dark:text-slate-300">
          <p>
            At CoDO, we are committed to protecting your privacy. This Privacy Policy describes how we collect, use, and share your information when you use our platform.
          </p>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Information We Collect</h2>
          <p>We collect information you provide directly to us, including your name, email address, university affiliation, and profile details. We also collect information about your usage of the platform.</p>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">How We Use Your Information</h2>
          <p>We use your information to provide, maintain, and improve our services, facilitate connections between students, and send you notifications related to your activities on CoDO.</p>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Data Security</h2>
          <p>We implement industry-standard security measures to protect your data. However, no method of transmission over the internet is completely secure.</p>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Changes to This Policy</h2>
          <p>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page.</p>
          <p className="text-sm text-slate-500 dark:text-slate-400 pt-8">
            Last updated: August 2026
          </p>
        </div>
      </div>
    </div>
  );
}
