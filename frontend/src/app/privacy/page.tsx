import { PublicNav } from "@/components/PublicNav";
import { PublicFooter } from "@/components/PublicFooter";
import { ShieldCheck } from "lucide-react";

export const metadata = {
  title: "Privacy Policy | Jobtake",
  description: "Jobtake Privacy Policy — how we collect, use, and protect your personal information.",
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <PublicNav />
      <main className="min-h-screen bg-white pt-24 pb-20">
        <div className="mx-auto max-w-3xl px-6 md:px-12">

          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-blue-100 mb-5">
              <ShieldCheck className="h-8 w-8 text-blue-600" />
            </div>
            <h1 className="text-4xl font-black text-zinc-900">Privacy Policy</h1>
            <p className="text-zinc-500 mt-2 text-sm">Last updated: July 2026</p>
          </div>

          {/* Content */}
          <div className="prose prose-zinc max-w-none text-zinc-700 leading-relaxed space-y-8">

            {/* Intro */}
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6">
              <p className="text-zinc-700 text-base">
                At Jobtake, we use our best efforts to respect the privacy of our on-line visitors. However, all our visitors are advised that the Internet is not a completely secure medium and that confidential communication is not guaranteed. Jobtake accepts no responsibility for any damages that result from the transmission of confidential information via this website.
              </p>
            </div>

            {/* Data Collection */}
            <div>
              <h2 className="text-xl font-bold text-zinc-900 mb-3">Data Collection</h2>
              <p className="text-zinc-600 text-base mb-4">
                Jobtake only gathers personal data, such as name, address, e-mail address, etc. when voluntarily submitted by a visitor. There are two ways in which a visitor may submit personal information to Jobtake via this website:
              </p>
              <ol className="list-decimal list-inside space-y-3 text-zinc-600 text-base pl-2">
                <li>
                  In various areas of the web-site, Jobtake provides visitors with opportunities to contact us via e-mail to ask questions &amp; provide comments or, offer suggestions.
                </li>
                <li>
                  Forms may be available that provide the visitor an opportunity to join a mail list, apply for a position, etc. As part of the form(s), a visitor could be asked to provide a name and/or contact information.
                </li>
              </ol>
            </div>

            {/* Data Usage */}
            <div>
              <h2 className="text-xl font-bold text-zinc-900 mb-3">Data Usage &amp; Protection</h2>
              <p className="text-zinc-600 text-base">
                This information is used to respond to requests and verify submissions to Jobtake and will not be published without your explicit permission. In addition, your private information will not be sold, rented, leased, or disclosed in any manner to any person without your prior consent, unless otherwise required by law.
              </p>
            </div>

            {/* Third Party Links */}
            <div>
              <h2 className="text-xl font-bold text-zinc-900 mb-3">Third-Party Links</h2>
              <p className="text-zinc-600 text-base mb-3">
                Jobtake is not responsible for the privacy practices of any website that a visitor may access through this website via links. Jobtake has no control over these websites and does not approve their content. It does not guarantee the accuracy of any information that may be provided on these other websites.
              </p>
              <p className="text-zinc-600 text-base">
                Jobtake expressly disclaims all liability of any kind arising out of use of, reference to, or reliance on information contained on these linked websites. The Jobtake website is not an endorsement of the services or products found on linked websites.
              </p>
            </div>

            {/* Your Consent */}
            <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-zinc-900 mb-3">Your Consent</h2>
              <p className="text-zinc-600 text-base">
                By using this web site, you consent to the terms of our online Privacy Policy and to Jobtake processing of Personal Information for the purposes given above as well as those explained where &lsquo;Jobtake&rsquo; collects Personal Information on the web.
              </p>
            </div>

            {/* Information Security */}
            <div>
              <h2 className="text-xl font-bold text-zinc-900 mb-3">Information Security</h2>
              <p className="text-zinc-600 text-base">
                We take appropriate security measures to protect against unauthorized access to or unauthorized alteration, disclosure or destruction of data. We restrict access to your personally identifying information to employees who need to know that information in order to operate, develop or improve our services.
              </p>
            </div>

            {/* Updating Information */}
            <div>
              <h2 className="text-xl font-bold text-zinc-900 mb-3">Updating Your Information</h2>
              <p className="text-zinc-600 text-base">
                We provide mechanisms for updating and correcting your personally identifying information for many of our services. For more information, please see the help pages for each service.
              </p>
            </div>

            {/* Contact */}
            <div className="border-t border-zinc-200 pt-6">
              <p className="text-zinc-500 text-sm text-center">
                For any questions regarding this Privacy Policy, please contact us at{" "}
                <a href="mailto:support@jobtake.com" className="text-blue-600 hover:underline font-medium">
                  support@jobtake.com
                </a>
              </p>
            </div>

          </div>
        </div>
      </main>
      <PublicFooter />
    </>
  );
}
