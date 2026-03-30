"use client";

import Image from "next/image";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Mail, Phone, Send, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) {
      setErrorMessage("Supabase is not configured.");
      setStatus('error');
      return;
    }

    setLoading(true);
    setStatus('idle');
    setErrorMessage("");

    try {
      const { error } = await supabase.from('contacts').insert([
        {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          subject: formData.subject,
          message: formData.message
        }
      ]);

      if (error) throw error;

      setStatus('success');
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch (err: any) {
      console.error("Submission error:", err);
      setErrorMessage(err.message || "Failed to send message. Please try again.");
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-4 px-4 md:px-10 bg-white">
      <div className="max-w-[1400px] mx-auto relative rounded-[32px] md:rounded-[48px] overflow-hidden min-h-[600px] md:min-h-[700px] flex items-center shadow-xl">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/contactus.jpg"
            alt="Luxury Villa Background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px]" />
        </div>

        <div className="relative z-10 w-full h-full px-6 py-12 md:px-20 md:py-20 flex flex-col md:flex-row items-center gap-12 md:gap-20">
          {/* Left Side: Contact Info */}
          <div className="flex-1 text-white max-w-xl">
            <h2 className="text-[36px] md:text-[56px] font-serif font-bold leading-tight mb-6">
              Connect with Excellence
            </h2>
            <p className="text-[16px] md:text-[18px] text-white/80 leading-relaxed mb-12">
              Whether you're looking for a seasonal retreat or a permanent luxury residence in Goa, our team is dedicated to finding your perfect sanctuary.
            </p>

            <div className="space-y-8">
              <div className="flex items-center gap-5">
                <div className="w-12 h-12 rounded-full bg-[#FF5A5F] flex items-center justify-center shadow-lg transition-transform hover:scale-110">
                  <Mail size={20} className="text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-[17px] mb-1">Email Us</h4>
                  <p className="text-white/70 text-[15px]">concierge@thestarfruit.com</p>
                  <p className="text-white/70 text-[15px]">sales@thestarfruit.com</p>
                </div>
              </div>

              <div className="flex items-center gap-5">
                <div className="w-12 h-12 rounded-full bg-[#FF5A5F] flex items-center justify-center shadow-lg transition-transform hover:scale-110">
                  <Phone size={20} className="text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-[17px] mb-1">Call Us</h4>
                  <p className="text-white/70 text-[15px]">+91 22 4567 8901</p>
                  <p className="text-white/70 text-[15px]">+91 9876 543 210</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Inquiry Form */}
          <div className="w-full md:w-[500px] lg:w-[550px]">
            <div className="bg-white/95 backdrop-blur-xl rounded-[32px] p-8 md:p-10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] border border-white/20">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[13px] font-bold text-gray-900 ml-1">Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#FF5A5F]/20 focus:border-[#FF5A5F] transition-all text-[15px]"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[13px] font-bold text-gray-900 ml-1">Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#FF5A5F]/20 focus:border-[#FF5A5F] transition-all text-[15px]"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[13px] font-bold text-gray-900 ml-1">Phone Number</label>
                    <input
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#FF5A5F]/20 focus:border-[#FF5A5F] transition-all text-[15px]"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[13px] font-bold text-gray-900 ml-1">Subject</label>
                    <input
                      type="text"
                      placeholder="Inquiry about Villa Sol"
                      value={formData.subject}
                      onChange={(e) => setFormData({...formData, subject: e.target.value})}
                      className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#FF5A5F]/20 focus:border-[#FF5A5F] transition-all text-[15px]"
                    />
                  </div>
                </div>


                <div className="space-y-2">
                  <label className="text-[13px] font-bold text-gray-900 ml-1">Message</label>
                  <textarea
                    required
                    placeholder="Tell us more about your requirements..."
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#FF5A5F]/20 focus:border-[#FF5A5F] transition-all text-[15px] resize-none"
                  ></textarea>
                </div>

                {status === 'success' && (
                  <div className="flex items-center gap-2 text-green-600 bg-green-50 p-4 rounded-xl">
                    <CheckCircle size={20} />
                    <p className="text-sm font-bold">Message sent successfully! We'll get back to you soon.</p>
                  </div>
                )}

                {status === 'error' && (
                  <div className="flex items-center gap-2 text-red-600 bg-red-50 p-4 rounded-xl">
                    <AlertCircle size={20} />
                    <p className="text-sm font-bold">{errorMessage}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="group w-full py-5 bg-[#FF5A5F] text-white rounded-2xl font-bold text-[16px] flex items-center justify-center gap-3 shadow-lg shadow-[#FF5A5F]/20 transition-all hover:bg-[#FF4147] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Message
                      <Send size={18} className="transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </button>

              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
