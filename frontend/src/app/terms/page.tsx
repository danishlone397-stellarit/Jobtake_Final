import { PublicNav } from "@/components/PublicNav";
import { PublicFooter } from "@/components/PublicFooter";
import { FileText } from "lucide-react";

export const metadata = {
  title: "Terms & Conditions | Jobtake",
  description: "Jobtake Terms and Conditions — please read before using our platform.",
};

export default function TermsPage() {
  return (
    <>
      <PublicNav />
      <main className="min-h-screen bg-white pt-24 pb-20">
        <div className="mx-auto max-w-3xl px-6 md:px-12">

          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-orange-100 mb-5">
              <FileText className="h-8 w-8 text-orange-500" />
            </div>
            <h1 className="text-4xl font-black text-zinc-900">Terms &amp; Conditions</h1>
            <p className="text-zinc-500 mt-2 text-sm">Last updated: July 2026</p>
          </div>

          <div className="space-y-8 text-zinc-700 text-base leading-relaxed">

            {/* Intro */}
            <div className="bg-orange-50 border border-orange-100 rounded-2xl p-6 space-y-4">
              <p>
                Text, photographs, graphics and sound contained on the site are owned by Jobtake.
              </p>
              <p>
                All information, illustrations, photographs, images, text, video clips (with or without sound), and other content appearing on the existing site are subject to industrial and/or intellectual property rights; they are the property of either Jobtake or the third-party authorizing their limited use by Jobtake or one of its subsidiaries.
              </p>
              <p>
                Accordingly, any reproduction, broadcast, adaptation, translation and/or modification, partial or complete, or distribution to another website is prohibited. Partial or complete reproduction of this proprietary content without Jobtake prior written consent is strictly prohibited, with the exception of press photographs included in the photo library of the News section.
              </p>
              <p>
                All Jobtake brands listed on this site are registered brand names and all the information given by job seeker is marking to the recruiter&apos;s risk and vice versa.
              </p>
              <p>
                Jobtake is a public site which is not responsible for any genuineness, inaccuracy and the quality of both job seekers and recruiters. It is the responsibility of the visitor to further research the information on the site. Jobtake does not guarantee confidentiality of information provided to it by any person acquiring/using all/any information displayed on the site. The individual/company would have to conduct its own background checks on the bonafide nature of all responses.
              </p>
              <p>
                Jobtake may revise these Terms at any time by posting an updated version to this Web page. You should visit this page periodically to review the most current Terms because they are binding on &lsquo;You&rsquo;.
              </p>
            </div>

            {/* Eligibility */}
            <div>
              <h2 className="text-xl font-bold text-zinc-900 mb-3">Eligibility</h2>
              <p>
                You must be 18 years of age or 18+ to visit Jobtake.com in any manner. By visiting Jobtake.com or accepting these Terms of Use, You represent and warrant to the Company that You are 18 years of age or older, and that You have the right, authority and capacity to use the Web Site and agree by these Terms of Use.
              </p>
            </div>

            {/* Site Restrictions */}
            <div>
              <h2 className="text-xl font-bold text-zinc-900 mb-3">Jobtake Site Restrictions</h2>
              <p className="mb-4">
                Users shall not use any Jobtake Site in order to host, display, upload, modify, publish, transmit, update, distribute, share, store or destroy material, including without limitation Jobtake Content:
              </p>
              <ol className="list-decimal list-outside pl-6 space-y-2 text-zinc-600">
                <li>in violation of any applicable law or regulation,</li>
                <li>in a manner that will infringe the copyright, trademark, trade secret or other intellectual property or proprietary rights of others or violate the privacy, publicity or other personal rights of others,</li>
                <li>that belongs to another person and to which the user does not have any right to,</li>
                <li>that is grossly harmful, harassing, blasphemous, defamatory, obscene, pornographic, pedophilic, libelous, invasive of another&apos;s privacy, threatening, abusive or hateful or racially, ethnically objectionable, disparaging, relating encouraging money laundering or gambling or otherwise unlawful in any manner whatsoever,</li>
                <li>harm minors in any way,</li>
                <li>deceives or misleads the addressee about the origin of such message or communicates any information which is grossly offensive or menacing in nature,</li>
                <li>impersonate another person or entity,</li>
                <li>contains software viruses or any other computer code, files or programs designed to interrupt, destroy or limit the functionality of Jobtake&apos;s computer systems or site or Jobtake&apos;s users, customer&apos;s computer systems or site.</li>
              </ol>

              <p className="mt-5 mb-4">
                Users are also prohibited from violating or attempting to violate the security of any Jobtake Site, including, without limitation the following activities:
              </p>
              <ol className="list-decimal list-outside pl-6 space-y-2 text-zinc-600">
                <li>accessing data not intended for such user or logging into a server or account which the user is not authorized to access;</li>
                <li>attempting to probe, scan or test the vulnerability of a system or network or to breach security or authentication measures without proper authorization;</li>
                <li>attempting to interfere with service to any user, host or network, including, without limitation, via means of submitting a virus to any Jobtake Site, overloading, &ldquo;flooding&rdquo;, &ldquo;spamming&rdquo;, &ldquo;mail bombing&rdquo; or &ldquo;crashing&rdquo;; or</li>
                <li>Forging any TCP/IP packet header or any part of the header information in any e-mail or newsgroup posting. Violations of system or network security may result in civil or criminal liability. The Company will investigate occurrences which may involve such violations and may involve, and cooperate with, law enforcement authorities in prosecuting users who are involved in such violations.</li>
              </ol>
            </div>

            {/* Registration */}
            <div>
              <h2 className="text-xl font-bold text-zinc-900 mb-3">Registration Information</h2>
              <p>
                When You register with any Jobtake Site, You will be asked to provide the Company with certain information including, without limitation, a valid email address (your &ldquo;Information&rdquo;). In addition to the Terms of Use and any privacy policy applicable to any Jobtake Web Site, You understand and agree that the Company may disclose to third parties, on an anonymous basis, certain aggregate information contained in your registration application. The Company will not disclose to any third party your name, address, e-mail address or telephone number without your prior consent, except to the extent necessary or appropriate to comply with applicable laws or in legal proceedings where such information is relevant.
              </p>
            </div>

            {/* User Content */}
            <div>
              <h2 className="text-xl font-bold text-zinc-900 mb-3">User Content and Submissions</h2>
              <p className="mb-4">
                You are solely responsible for your My Jobtake Account information, content, messages or other information that You submit, publish or display on any Jobtake Site.
              </p>
              <p className="mb-4">
                By posting User Content to any public or non-public area of Jobtake Site, including message boards, forums, contests and chat rooms, You grant the Company and its parent company and affiliates the loyalty-free, perpetual, irrevocable, sublicense able (through multiple tiers), non-exclusive right (including any moral rights) and license to use, reproduce, modify, adapt, publish, translate, create derivative works from, distribute, communicate to the public, perform and display the User Content worldwide and/or to incorporate it in other works in any form, media, or technology now known or later developed, for the full term of any rights that may exist in such content.
              </p>
              <p className="mb-4">
                Jobtake reserves the right in its sole discretion to investigate and take legal action against anyone who engages in any illegal or prohibited conduct or otherwise violates these Terms of Use, including without limitation, removing the User Content from the Jobtake Site and/or terminating the offending User&apos;s ability to access the Jobtake Site and/or use Jobtake services.
              </p>
              <p>
                The Company does not represent or guarantee the truthfulness, accuracy, or reliability of User Content or any other communications posted by Users or endorse any opinions expressed by Users. You acknowledge that any reliance on material posted by other Users will be at your own risk.
              </p>
            </div>

            {/* Password */}
            <div>
              <h2 className="text-xl font-bold text-zinc-900 mb-3">Registration and Password</h2>
              <p>
                You are responsible for maintaining the confidentiality of your account access information and passwords. You shall be responsible for all uses of your Web Site registrations and passwords, whether or not authorized by You. You are not authorized to share your password or other account access information with any other party, temporarily or permanently, and breach of this obligation may tantamount to disabling the Jobtake account and Jobtake Services. You agree to immediately notify the Company of any unauthorized use of your Account, and passwords.
              </p>
            </div>

            {/* Data Privacy & SMS */}
            <div>
              <h2 className="text-xl font-bold text-zinc-900 mb-3">Data Privacy and SMS Alerts</h2>
              <p className="mb-4">
                In the context of the &lsquo;alerts&rsquo; service being introduced by Jobtake; the candidate consents to the use of his personal data in the form of cellular phone number(s) being used by Jobtake to forward relevant job alerts and other information as and when they become available.
              </p>
              <p className="mb-4">
                Jobtake reserves the right to remove any job posting or content from any Jobtake Site, which in the reasonable exercise of Jobtake&apos;s discretion, does not comply with the above Terms, or if any content is posted that Jobtake believes is not in the best interest of Jobtake.
              </p>
              <p className="mb-4">
                If at any time during your use of the Jobtake Services, You made a misrepresentation of fact to Jobtake or otherwise misled Jobtake in regards to the nature of your business activities, Jobtake will have grounds to terminate your use of the Jobtake Services.
              </p>
              <p className="mb-4">
                The terms in this agreement may be changed by Jobtake at any time and it is free to offer its services to any client without restriction.
              </p>
            </div>

            {/* Governing Law */}
            <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-zinc-900 mb-3">Governing Law</h2>
              <p>
                The Agreement shall be governed by the Laws of India. The Courts of law at Delhi/New Delhi shall have exclusive jurisdiction over any disputes arising under this agreement.
              </p>
            </div>

            {/* Contact */}
            <div className="border-t border-zinc-200 pt-6">
              <p className="text-zinc-500 text-sm text-center">
                For any questions regarding these Terms &amp; Conditions, please contact us at{" "}
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
