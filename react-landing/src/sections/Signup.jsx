import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import { register } from '../api/registration';
import LegalModal from '../components/LegalModal';

export default function Signup() {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [referenceId, setReferenceId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    business: '',
    phone: '',
    email: '',
    city: '',
    type: '',
    message: '',
    termsAccepted: false
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [legalModal, setLegalModal] = useState({ isOpen: false, type: 'terms' });

  const openLegal = (type) => {
    setLegalModal({ isOpen: true, type });
  };

  const validateField = (id, value) => {
    let error = '';
    switch (id) {
      case 'name':
        if (!value.trim()) error = 'Full name is required';
        else if (value.trim().length < 3) error = 'Name must be at least 3 characters';
        else if (!/^[a-zA-Z\s]+$/.test(value.trim())) error = 'Name can only contain letters and spaces';
        break;
      case 'phone':
        if (!value.trim()) error = 'Phone number is required';
        else if (!/^[0-9]{10}$/.test(value.trim())) error = 'Enter a valid 10-digit mobile number';
        break;
      case 'email':
        if (!value.trim()) error = 'Email is required';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = 'Enter a valid email address';
        break;
      case 'city':
        if (!value) error = 'Please select your city';
        break;
      case 'type':
        if (!value) error = 'Please select registration type';
        break;
      case 'termsAccepted':
        if (!value) error = 'You must agree to the terms';
        break;
      default:
        break;
    }
    return error;
  };

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    let newValue = type === 'checkbox' ? checked : value;
    
    // Hard restriction: Don't allow numbers or symbols in name
    if (id === 'name' && typeof newValue === 'string') {
        newValue = newValue.replace(/[^a-zA-Z\s]/g, '');
    }
    
    setFormData(prev => ({ ...prev, [id]: newValue }));
    
    // Instant feedback for already touched fields
    if (touched[id]) {
      const error = validateField(id, newValue);
      setErrors(prev => ({ ...prev, [id]: error }));
    }
  };

  const handleBlur = (e) => {
    const { id, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;
    
    setTouched(prev => ({ ...prev, [id]: true }));
    const error = validateField(id, val);
    setErrors(prev => ({ ...prev, [id]: error }));
  };

  const scrollToField = (fieldId) => {
    const el = document.getElementById(fieldId);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');

    // Client-side validation first
    const newErrors = {};
    const newTouched = {};
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
      newTouched[key] = true;
    });

    setErrors(newErrors);
    setTouched(newTouched);

    if (Object.keys(newErrors).length > 0) {
      scrollToField(Object.keys(newErrors)[0]);
      return;
    }

    // Submit to backend
    setIsSubmitting(true);
    try {
      const result = await register(formData);

      if (result.success) {
        // Success (201)
        setReferenceId(result.data.referenceId);
        setSubmitted(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      // Handle specific error codes
      if (result.code === 'VALIDATION_ERROR') {
        // Validation Error (400)
        setErrors(prev => ({ ...prev, ...result.errors }));
        setSubmitError(result.message);
        scrollToField(Object.keys(result.errors)[0]);
      } else if (result.code === 'DUPLICATE_ENTRY') {
        // Duplicate Error (409)
        const field = result.field || 'email';
        setErrors(prev => ({ ...prev, [field]: result.message }));
        setSubmitError(result.message); // Also show as banner as requested
        scrollToField(field);
      } else {
        // Other errors
        setSubmitError(result.message || 'Something went wrong. Please try again.');
      }
    } catch (networkErr) {
      console.error('API error:', networkErr);
      setSubmitError('Unable to connect to the server. Please check your internet connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getInputClass = (id) => {
    const base = "ios-input p-4 rounded-2xl outline-none w-full ";
    if (touched[id] && errors[id]) {
      return base + "!border-red-500 !bg-red-50/80 focus:!border-red-600";
    }
    if (touched[id] && !errors[id] && formData[id] && id !== 'business' && id !== 'message') {
        return base + "!border-teal-500 !bg-teal-50/80 focus:!border-teal-600";
    }
    return base;
  };

  const ErrorMsg = ({ id }) => (
    touched[id] && errors[id] ? (
      <div className="text-red-500 text-[11px] font-bold mt-1 ml-2 animate-in fade-in slide-in-from-top-1">
        {errors[id]}
      </div>
    ) : null
  );

  return (
    <section id="signup" className="pt-6 pb-20 overflow-hidden relative ios-glass-section">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div 
          className="ios-glass-form p-8 sm:p-16 max-w-4xl mx-auto relative"
          initial={{ opacity: 0, y: 100, scale: 0.9, filter: 'blur(15px)' }}
          animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
          transition={{ 
            duration: 1.2, 
            ease: [0.16, 1, 0.3, 1], // Custom Apple-style ease
          }}
        >
          <div className="ios-border-layer" />
          {!submitted ? (
            <>
              <div className="text-center mb-12 relative z-10">
                <div className="flex flex-col items-center">
                  <span className="bg-gold/10 border border-gold/20 text-gold text-xs font-bold py-2 px-4 rounded-full mb-6 inline-block">
                    ★ Pre-launch registration · win huge prizes
                  </span>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="h-px w-8 bg-gray-200" />
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest flex items-center gap-1">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                      </svg>
                      Secure Investor-Grade Platform
                    </span>
                    <span className="h-px w-8 bg-gray-200" />
                  </div>
                </div>
                <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">Register your interest today</h2>
                <p className="text-text text-sm max-w-2xl mx-auto leading-relaxed">
                  Secure your shop position before launch and automatically enter the grand competition to win huge prizes including <strong className="text-coral">premium flats, cars, bikes, cash and more.</strong>
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <input type="text" id="name" placeholder="Your full name *" className={getInputClass('name')} value={formData.name} onChange={handleChange} onBlur={handleBlur} />
                    <ErrorMsg id="name" />
                  </div>
                  <div>
                    <input type="text" id="business" placeholder="Business / brand name (if any)" className={getInputClass('business')} value={formData.business} onChange={handleChange} onBlur={handleBlur} />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <input type="tel" id="phone" placeholder="WhatsApp / mobile number *" className={getInputClass('phone')} value={formData.phone} onChange={handleChange} onBlur={handleBlur} />
                    <ErrorMsg id="phone" />
                  </div>
                  <div>
                    <input type="email" id="email" placeholder="Email address *" className={getInputClass('email')} value={formData.email} onChange={handleChange} onBlur={handleBlur} />
                    <ErrorMsg id="email" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <select id="city" className={getInputClass('city') + " bg-white"} value={formData.city} onChange={handleChange} onBlur={handleBlur}>
                      <option value="">Select your city *</option>
                      <option>Indore</option>
                      <option>Mumbai</option>
                      <option>Delhi</option>
                      <option>Bengaluru</option>
                      <option>Other city</option>
                    </select>
                    <ErrorMsg id="city" />
                  </div>
                  <div>
                    <select id="type" className={getInputClass('type') + " bg-white"} value={formData.type} onChange={handleChange} onBlur={handleBlur}>
                      <option value="">I am registering as *</option>
                      <option value="vendor">Seller / Vendor — I want to open a shop</option>
                      <option value="buyer">Buyer / Visitor — I want to discover deals</option>
                      <option value="referrer">Referrer — I want to bring sellers on board</option>
                    </select>
                    <ErrorMsg id="type" />
                  </div>
                </div>

                <div>
                  <textarea id="message" placeholder="Tell us about your business or what you're looking for (optional)" className={getInputClass('message') + " min-h-[120px]"} value={formData.message} onChange={handleChange} onBlur={handleBlur} />
                </div>
                
                <div className="py-2">
                  <div className="flex items-start gap-3">
                    <input type="checkbox" id="termsAccepted" className="mt-1 accent-coral h-5 w-5 cursor-pointer" checked={formData.termsAccepted} onChange={handleChange} onBlur={handleBlur} />
                    <label htmlFor="termsAccepted" className="text-xs text-text leading-relaxed cursor-pointer select-none">
                      I agree to the <button type="button" onClick={() => openLegal('terms')} className="text-coral underline font-bold hover:text-coralDark transition-colors">Terms & Conditions</button> and <button type="button" onClick={() => openLegal('privacy')} className="text-coral underline font-bold hover:text-coralDark transition-colors">Privacy Policy</button>. I understand this is a pre‑launch registration and I will be contacted when AdTowns launches in my city.
                    </label>
                  </div>
                  <ErrorMsg id="termsAccepted" />
                </div>

                {submitError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 text-sm font-semibold px-4 py-3 rounded-2xl text-center">
                    ⚠️ {submitError}
                  </div>
                )}

                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-coral hover:bg-coralDark text-white font-extrabold py-5 rounded-[2rem] shadow-lg shadow-coral/20 text-lg mt-4 disabled:opacity-70 disabled:cursor-not-allowed"
                  whileHover={{ scale: 1.01, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 15 }}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-3">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                      </svg>
                      Sending your registration...
                    </span>
                  ) : 'Register my interest + enter grand competition ↗'}
                </motion.button>
                <p className="text-center text-[10px] text-gray-400 mt-4">
                  No payment needed · Competition entry is automatic and free · Multiple winners · T&C apply
                </p>
              </form>
            </>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-6">🎉</div>
              <h2 className="text-3xl font-extrabold text-teal mb-4 animate-bounce">You're registered! Welcome to AdTowns.</h2>
              <p className="text-text max-w-lg mx-auto mb-8 leading-relaxed">
                Your interest has been recorded. You are now officially entered in the grand prize competition. We'll contact you personally when AdTowns launches in your city.
              </p>
              <div className="inline-block bg-white border-2 border-dashed border-teal/30 px-8 py-3 rounded-2xl font-mono text-sm font-bold text-teal mb-8">
                Ref: {referenceId}
              </div>
              <div className="flex flex-col sm:flex-row justify-center gap-4 mt-4">
                <motion.button
                  onClick={() => navigate(formData.type === 'vendor' ? '/pixels/buy' : '/pixels')}
                  className="bg-coral hover:bg-coralDark text-white font-extrabold py-4 px-10 rounded-[2rem] shadow-lg shadow-coral/20 text-lg flex items-center gap-2 justify-center"
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                >
                  {formData.type === 'vendor' ? 'Continue to Purchase Pixels →' : 'Explore Pixel Grid →'}
                </motion.button>
                <Button variant="secondary" onClick={() => setSubmitted(false)}>Back</Button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
      <LegalModal 
        isOpen={legalModal.isOpen} 
        onClose={() => setLegalModal({ ...legalModal, isOpen: false })} 
        type={legalModal.type} 
      />
    </section>
  );
}
