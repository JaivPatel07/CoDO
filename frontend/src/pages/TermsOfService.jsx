import { Link } from "react-router-dom";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-16">
      <div className="mx-auto max-w-3xl px-6">
        <div className="mb-8">
          <Link to="/" className="text-violet-600 hover:text-violet-700 dark:text-violet-400 font-semibold text-sm">
            ← Back to CoDO
          </Link>
        </div>
        <h1 className="text-4xl font-black text-slate-900 dark:text-slate-100 mb-6">Terms of Service</h1>
        <div className="prose prose-slate dark:prose-invert max-w-none space-y-6 text-slate-600 dark:text-slate-300">
          <p>
            Welcome to CoDO. By accessing or using our platform, you agree to be bound by these Terms of Service. Please read them carefully.
          </p>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Use of Our Service</h2>
          <p>You may use our service only for lawful purposes and in accordance with these Terms. You are responsible for your use of the platform and for any content you post.</p>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">User Content</h2>
          <p>You retain ownership of your content, but you grant us a license to use, display, and distribute it as necessary to provide our services. You represent that you have the right to post all content.</p>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Intellectual Property</h2>
          <p>All content, trademarks, and other intellectual property on CoDO are owned by their respective owners. These Terms do not grant you the right to use any trademarks without prior consent.</p>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Termination</h2>
          <p>We may terminate or suspend your access immediately, without prior notice, for any reason, including breach of these Terms.</p>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Disclaimer</h2>
          <p>The platform is provided on an "as is" and "as available" basis. We do not warrant that our service will be uninterrupted or error-free.</p>
          <p className="text-sm text-slate-500 dark:text-slate-400 pt-8">
            Last updated: August 2026
          </p>
        </div>
      </div>
    </div>
  );
}
