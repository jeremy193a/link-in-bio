'use client';

import { ContactMethod } from '@/types';
import { Input } from '@/components/ui';
import { MessageCircle, MessageSquare, Phone } from 'lucide-react';
import { clsx } from 'clsx';

interface ContactMethodSelectorProps {
  method: ContactMethod;
  value: string;
  onMethodChange: (method: ContactMethod) => void;
  onValueChange: (value: string) => void;
  error?: string;
}

const CONTACT_OPTIONS: Array<{
  value: ContactMethod;
  label: string;
  icon: typeof MessageCircle;
  placeholder: string;
  helperText: string;
}> = [
  {
    value: 'zalo',
    label: 'Zalo (Phổ biến nhất)',
    icon: MessageCircle,
    placeholder: '0912345678',
    helperText: 'Nhập số điện thoại Zalo của bạn',
  },
  {
    value: 'whatsapp',
    label: 'WhatsApp',
    icon: MessageSquare,
    placeholder: '+84912345678',
    helperText: 'Nhập số WhatsApp (bao gồm mã quốc gia)',
  },
  {
    value: 'phone',
    label: 'Số điện thoại',
    icon: Phone,
    placeholder: '0912345678',
    helperText: 'Nhập số điện thoại của bạn',
  },
];

export function ContactMethodSelector({
  method,
  value,
  onMethodChange,
  onValueChange,
  error,
}: ContactMethodSelectorProps) {
  const selectedOption = CONTACT_OPTIONS.find((opt) => opt.value === method);

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-slate-700 mb-3">
        Phương thức liên hệ <span className="text-red-500">*</span>
      </label>

      {/* Method Selector */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        {CONTACT_OPTIONS.map((option) => {
          const Icon = option.icon;
          const isSelected = method === option.value;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onMethodChange(option.value)}
              className={clsx(
                'flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all',
                isSelected
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
              )}
            >
              <Icon className={clsx('w-6 h-6', isSelected ? 'text-emerald-600' : 'text-slate-400')} />
              <span className="text-sm font-medium text-center">{option.label}</span>
            </button>
          );
        })}
      </div>

      {/* Contact Value Input */}
      <Input
        type="tel"
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        placeholder={selectedOption?.placeholder}
        helperText={selectedOption?.helperText}
        error={error}
      />
    </div>
  );
}
