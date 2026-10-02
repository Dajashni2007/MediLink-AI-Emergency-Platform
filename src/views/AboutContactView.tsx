import React, { useState } from 'react';
import { EMERGENCY_HOTLINES } from '../data/mockData';
import { Shield, PhoneCall, Mail, Send, CheckCircle2, AlertTriangle, Building, Heart } from 'lucide-react';

export const AboutContactView: React.FC = () => {
  const [formSent, setFormSent] = useState(false);
  const [ticketData, setTicketData] = useState({ name: '', email: '', subject: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSent(true);
  };

  return (
    <div className="space-y-8 pb-16 text-slate-800 dark:text-slate-200">
      {/* Banner */}
      <div className="p-8 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-3xl shadow-xl space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1 bg-white/10 rounded-full text-xs font-bold text-blue-200">
          <Shield className="w-4 h-4 text-blue-400" />
          <span>About MediLink Healthcare Network</span>
        </div>
        <h2 className="text-2xl font-black">AI Smart Emergency Medical Assistance Platform</h2>
        <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
          MediLink is engineered to eliminate critical delay in medical emergencies by dynamically connecting patients to nearby hospitals, ICU beds, ambulances, blood banks, and AI symptom triage.
        </p>
      </div>

      {/* Emergency Hotlines Directory */}
      <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-4 shadow-sm">
        <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center">
          <PhoneCall className="w-5 h-5 text-red-600 mr-2 animate-pulse" />
          National Emergency Hotline Directory
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          {EMERGENCY_HOTLINES.map((item, idx) => (
            <a
              key={idx}
              href={`tel:${item.number}`}
              className="p-3.5 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 border border-slate-200 dark:border-slate-700 rounded-2xl flex items-center justify-between transition-colors"
            >
              <div>
                <p className="font-bold text-slate-900 dark:text-white">{item.title}</p>
                <p className="text-[10px] text-slate-400">Emergency Line</p>
              </div>
              <span className="font-black text-red-600 text-sm">Dial {item.number}</span>
            </a>
          ))}
        </div>
      </div>

      {/* Contact & Helpdesk Form */}
      <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-4 shadow-sm max-w-xl">
        <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center">
          <Mail className="w-5 h-5 text-blue-600 mr-2" />
          Contact MediLink Emergency Helpdesk
        </h3>

        {!formSent ? (
          <form onSubmit={handleSubmit} className="space-y-3 text-xs">
            <input
              type="text"
              required
              placeholder="Your Full Name"
              value={ticketData.name}
              onChange={e => setTicketData({ ...ticketData, name: e.target.value })}
              className="w-full p-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
            />
            <input
              type="email"
              required
              placeholder="Email Address"
              value={ticketData.email}
              onChange={e => setTicketData({ ...ticketData, email: e.target.value })}
              className="w-full p-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
            />
            <textarea
              required
              rows={3}
              placeholder="Describe your inquiry or technical feedback..."
              value={ticketData.message}
              onChange={e => setTicketData({ ...ticketData, message: e.target.value })}
              className="w-full p-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
            />
            <button
              type="submit"
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-xl shadow"
            >
              Submit Ticket to Support Team
            </button>
          </form>
        ) : (
          <div className="p-4 bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200 rounded-2xl flex items-center space-x-2 text-xs font-bold">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>Support ticket submitted successfully! Reference ID #TKT-8821.</span>
          </div>
        )}
      </div>
    </div>
  );
};
