import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LEGAL_CONTENT = {
  terms: {
    title: 'Terms & Conditions',
    effectiveDate: 'May 05, 2026',
    sections: [
      {
        title: '1. Acceptance of Terms',
        content: 'By accessing or using this website ("Platform"), you agree to be bound by these Terms & Conditions. If you do not agree, please do not use the Platform.'
      },
      {
        title: '2. Eligibility',
        content: [
          'You must be at least 18 years old to use this Platform',
          'You agree to provide accurate and complete information',
          'You are responsible for maintaining the confidentiality of your information'
        ]
      },
      {
        title: '3. Use of the Platform',
        content: [
          'You agree not to:',
          '• Provide false, misleading, or incomplete information',
          '• Use the Platform for any unlawful or unauthorized purpose',
          '• Attempt to disrupt or harm the Platform or its users'
        ]
      },
      {
        title: '4. Data Submission',
        content: 'By submitting your details (such as email and mobile number), you confirm that the information provided is yours and consent to being contacted for updates, notifications, and related communication.'
      },
      {
        title: '5. Communication Consent',
        content: 'You agree to receive emails, SMS/WhatsApp messages, and Platform-related notifications. You may opt out at any time using unsubscribe options or by contacting us.'
      },
      {
        title: '6. Intellectual Property',
        content: 'All content on the Platform (excluding user-provided data) is the property of the Platform owner and may not be copied or reused without permission.'
      },
      {
        title: '7. Limitation of Liability',
        content: 'The Platform is provided on an "as-is" basis. We are not liable for any loss, damage, or inconvenience arising from use, or for delays, interruptions, or technical issues.'
      },
      {
        title: '8. Termination',
        content: 'We reserve the right to restrict or terminate access at any time without prior notice if these Terms are violated.'
      },
      {
        title: '9. Changes to Terms',
        content: 'We may update these Terms at any time. Continued use of the Platform implies acceptance of the updated Terms.'
      },
      {
        title: '10. Governing Law',
        content: 'These Terms shall be governed by the laws of India.'
      }
    ]
  },
  privacy: {
    title: 'Privacy Policy',
    effectiveDate: 'May 05, 2026',
    sections: [
      {
        title: '1. Information We Collect',
        content: 'We may collect the following information: Email address and Mobile number.'
      },
      {
        title: '2. Purpose of Data Collection',
        content: 'We collect your information to provide updates and notifications, communicate relevant information, and improve user experience.'
      },
      {
        title: '3. Consent',
        content: 'By submitting your information, you consent to its collection and use as outlined in this policy. By providing your mobile number, you agree to receive communications even if your number is registered under DND, in compliance with applicable regulations.'
      },
      {
        title: '4. Data Sharing',
        content: 'We do not sell your personal data. We may share information with service providers (for communication or technical support) or authorities if required by law.'
      },
      {
        title: '5. Data Security',
        content: 'We take reasonable steps to protect your information. However, no method of transmission over the internet is completely secure.'
      },
      {
        title: '6. User Rights',
        content: 'You may request access to your data, request correction or deletion, or opt out of communications. To do so, contact: themidastouchbs@gmail.com'
      },
      {
        title: '7. Data Retention',
        content: 'We retain your data only as long as necessary for communication and operational purposes.'
      },
      {
        title: '8. Cookies & Tracking',
        content: 'Basic cookies or tracking tools may be used to improve functionality and performance.'
      },
      {
        title: '9. Changes to Privacy Policy',
        content: 'We may update this policy at any time. Continued use of the Platform implies acceptance.'
      }
    ]
  }
};

export default function LegalModal({ isOpen, onClose, type }) {
  const content = LEGAL_CONTENT[type] || LEGAL_CONTENT.terms;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <motion.div 
            className="absolute inset-0 bg-navy/40 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal Container */}
          <motion.div 
            className="ios-glass-form max-w-2xl w-full max-h-[85vh] overflow-hidden relative flex flex-col"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <div className="ios-border-layer" />
            
            {/* Header */}
            <div className="p-6 border-b border-gray-100 flex items-center justify-between relative z-10">
              <div>
                <h2 className="text-2xl font-extrabold text-navy">{content.title}</h2>
                <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mt-1">
                  Effective Date: {content.effectiveDate}
                </p>
              </div>
              <button 
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center hover:bg-gray-100 transition-colors"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            {/* Content Body */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-8 relative z-10 custom-scrollbar">
              {content.sections.map((section, idx) => (
                <div key={idx} className="space-y-3">
                  <h3 className="text-lg font-bold text-navy flex items-center gap-2">
                    <span className="w-1.5 h-6 bg-coral rounded-full" />
                    {section.title}
                  </h3>
                  {Array.isArray(section.content) ? (
                    <ul className="space-y-2 pl-4">
                      {section.content.map((item, i) => (
                        <li key={i} className="text-sm text-text leading-relaxed flex gap-2">
                          {!item.startsWith('•') && <span className="text-coral font-bold">•</span>}
                          {item.startsWith('•') ? item.substring(1).trim() : item}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-text leading-relaxed pl-4">
                      {section.content}
                    </p>
                  )}
                </div>
              ))}

              {type === 'privacy' && (
                <div className="mt-8 pt-8 border-t border-gray-100 italic text-xs text-text bg-coral/5 p-4 rounded-xl">
                  "By providing your mobile number, you agree to receive communications even if your number is registered under DND, in compliance with applicable regulations."
                </div>
              )}
              
              <div className="h-4" /> {/* Bottom spacer */}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-100 flex justify-end relative z-10 bg-white/50 backdrop-blur-sm">
              <button 
                onClick={onClose}
                className="bg-navy text-white px-8 py-3 rounded-2xl font-bold text-sm hover:bg-navy/90 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                I Understand
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
