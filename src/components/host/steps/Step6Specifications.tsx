import React, { useState } from 'react';
import { Bell, PawPrint, Music2, Plus, Trash2, BellRing } from 'lucide-react';

const TITLE_LIMIT = 50;

interface HouseRule {
  id: string;
  label: string;
  icon: React.ReactNode;
  enabled: boolean;
}

export interface Step6SpecificationsData {
  title: string;
  description: string;
  houseRules: { [key: string]: boolean };
  customRules: string[];
}

export interface Step6SpecificationsProps {
  formData: Step6SpecificationsData;
  setFormData: React.Dispatch<React.SetStateAction<Step6SpecificationsData>>;
  onBack: () => void;
  onNext: () => void;
  canContinue: boolean;
  isSaving?: boolean;
}

const DEFAULT_RULES: HouseRule[] = [
  { id: 'no_smoking', label: 'No Smoking', icon: <Bell size={18} strokeWidth={1.8} className="text-[#6B7280]" />, enabled: true },
  { id: 'no_pets',    label: 'No Pets',    icon: <PawPrint size={18} strokeWidth={1.8} className="text-[#6B7280]" />, enabled: false },
  { id: 'no_parties', label: 'No Parties', icon: <Music2 size={18} strokeWidth={1.8} className="text-[#6B7280]" />, enabled: true },
];

export default function Step6Specifications({
  formData,
  setFormData,
  onBack,
  onNext,
  canContinue,
  isSaving
}: Step6SpecificationsProps) {
  const [newRule, setNewRule] = useState('');
  const [isAddingRule, setIsAddingRule] = useState(false);

  const updateField = (field: keyof Step6SpecificationsData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleRule = (ruleId: string) => {
    setFormData(prev => ({
      ...prev,
      houseRules: {
        ...prev.houseRules,
        [ruleId]: !prev.houseRules[ruleId]
      }
    }));
  };

  const addCustomRule = () => {
    if (!newRule.trim()) return;
    setFormData(prev => ({
      ...prev,
      customRules: [...prev.customRules, newRule.trim()]
    }));
    setNewRule('');
    setIsAddingRule(false);
  };

  const removeCustomRule = (idx: number) => {
    setFormData(prev => ({
      ...prev,
      customRules: prev.customRules.filter((_, i) => i !== idx)
    }));
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-6 md:px-12 flex flex-col min-h-[600px]">
      <div className="flex-1">

        {/* Motivational Subheader */}
        <p className="text-[#EC5B13] font-semibold text-sm mb-3 tracking-wide">
          Almost there! Your luxury listing is nearly ready.
        </p>

        <h2 className="text-3xl md:text-4xl font-black text-[#1A1A24] mb-3 tracking-tight">
          Tell us about your place
        </h2>
        <p className="text-[#6B7280] font-medium text-[15px] mb-10 leading-relaxed max-w-2xl">
          Great titles and descriptions help your listing stand out to potential guests. Give them a reason to choose your home.
        </p>

        {/* Catchy Title */}
        <div className="mb-8">
          <label className="block text-[#1A1A24] font-bold text-[17px] mb-3">Catchy Title</label>
          <input
            type="text"
            maxLength={TITLE_LIMIT}
            value={formData.title}
            onChange={e => updateField('title', e.target.value)}
            placeholder="e.g., Sunset Serenity Villa"
            className="w-full border border-gray-200 rounded-2xl px-5 py-4 text-[15px] text-[#1A1A24] placeholder-gray-400 outline-none focus:border-[#EC5B13] focus:ring-2 focus:ring-[#EC5B13]/20 transition-all bg-white"
          />
          <p className="text-gray-400 text-xs mt-2">
            Character limit: {TITLE_LIMIT}
            {formData.title.length > 0 && (
              <span className={`ml-2 font-medium ${formData.title.length >= TITLE_LIMIT ? 'text-red-500' : 'text-gray-400'}`}>
                ({formData.title.length}/{TITLE_LIMIT} used)
              </span>
            )}
          </p>
        </div>

        {/* Detailed Description */}
        <div className="mb-10">
          <label className="block text-[#1A1A24] font-bold text-[17px] mb-3">Detailed Description</label>
          <textarea
            value={formData.description}
            onChange={e => updateField('description', e.target.value)}
            placeholder="Describe what makes your place unique, the neighborhood, and the amenities..."
            rows={6}
            className="w-full border border-gray-200 rounded-2xl px-5 py-4 text-[15px] text-[#1A1A24] placeholder-gray-400 outline-none focus:border-[#EC5B13] focus:ring-2 focus:ring-[#EC5B13]/20 transition-all bg-white resize-none"
          />
          <p className="text-gray-400 text-xs mt-2">Recommended length: 500 characters</p>
        </div>

        {/* House Rules */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-5">
            <BellRing size={16} className="text-[#EC5B13]" />
            <h3 className="text-[#1A1A24] font-bold text-[17px]">House Rules</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {DEFAULT_RULES.map(rule => {
              const isOn = formData.houseRules[rule.id] ?? rule.enabled;
              return (
                <div key={rule.id} className="flex items-center justify-between bg-white border border-gray-100 rounded-2xl px-5 py-4 shadow-sm">
                  <div className="flex items-center gap-3">
                    {rule.icon}
                    <span className="text-[#1A1A24] font-semibold text-sm">{rule.label}</span>
                  </div>
                  {/* Toggle Switch */}
                  <button
                    onClick={() => toggleRule(rule.id)}
                    className={`relative w-12 h-6 rounded-full transition-colors duration-200 focus:outline-none ${isOn ? 'bg-[#EC5B13]' : 'bg-gray-200'}`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${isOn ? 'translate-x-6' : 'translate-x-0'}`}
                    />
                  </button>
                </div>
              );
            })}

            {/* Custom Rules: rendered */}
            {formData.customRules.map((rule, idx) => (
              <div key={idx} className="flex items-center justify-between bg-white border border-gray-100 rounded-2xl px-5 py-4 shadow-sm group">
                <div className="flex items-center gap-3">
                  <BellRing size={18} strokeWidth={1.8} className="text-[#6B7280]" />
                  <span className="text-[#1A1A24] font-semibold text-sm">{rule}</span>
                </div>
                <button
                  onClick={() => removeCustomRule(idx)}
                  className="text-gray-300 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}

            {/* Add Custom Rule */}
            {isAddingRule ? (
              <div className="flex items-center gap-2 border border-dashed border-[#EC5B13] rounded-2xl px-5 py-3 bg-[#FFF9F7]">
                <input
                  autoFocus
                  type="text"
                  value={newRule}
                  onChange={e => setNewRule(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') addCustomRule(); if (e.key === 'Escape') setIsAddingRule(false); }}
                  placeholder="e.g., No loud music after 10pm"
                  className="flex-1 bg-transparent text-sm outline-none text-[#1A1A24] placeholder-gray-400"
                />
                <button onClick={addCustomRule} className="text-[#EC5B13] font-bold text-sm">Add</button>
                <button onClick={() => setIsAddingRule(false)} className="text-gray-400 text-sm">Cancel</button>
              </div>
            ) : (
              <button
                onClick={() => setIsAddingRule(true)}
                className="flex items-center gap-2 border-2 border-dashed border-[#EC5B13]/50 rounded-2xl px-5 py-4 text-[#EC5B13] font-semibold text-sm hover:border-[#EC5B13] hover:bg-[#FFF9F7] transition-all"
              >
                <Plus size={16} />
                Add a custom rule
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Step Actions */}
      <div className="mt-8 mb-12 flex items-center justify-between">
        <button
          onClick={onBack}
          className="px-6 py-3 text-sm font-bold text-gray-800 hover:bg-gray-100 bg-[#F3F4F6] rounded-xl transition-colors flex items-center gap-2"
        >
          <span>&larr;</span> Back
        </button>
        <button
          onClick={onNext}
          disabled={!canContinue || isSaving}
          className={`px-8 py-3 text-sm font-bold rounded-xl transition-all shadow-md flex items-center gap-2 ${
            (canContinue && !isSaving)
              ? 'bg-[#1A1A24] text-white hover:bg-black hover:shadow-lg'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none'
          }`}
        >
          {isSaving ? 'Saving...' : <>Continue <span>&rarr;</span></>}
        </button>
      </div>
    </div>
  );
}
