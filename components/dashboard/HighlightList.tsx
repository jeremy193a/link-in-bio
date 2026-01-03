'use client';

import { useState } from 'react';
import { Input } from '@/components/ui';
import { Plus, X } from 'lucide-react';
import { clsx } from 'clsx';

interface HighlightListProps {
  value: string[];
  onChange: (highlights: string[]) => void;
  maxItems?: number;
  error?: string;
}

export function HighlightList({
  value,
  onChange,
  maxItems = 10,
  error,
}: HighlightListProps) {
  const highlights = value.length > 0 ? value : [''];

  const handleAdd = () => {
    if (highlights.length < maxItems) {
      onChange([...highlights, '']);
    }
  };

  const handleRemove = (index: number) => {
    if (highlights.length > 1) {
      const newHighlights = highlights.filter((_, i) => i !== index);
      onChange(newHighlights);
    }
  };

  const handleChange = (index: number, text: string) => {
    const newHighlights = [...highlights];
    newHighlights[index] = text;
    onChange(newHighlights);
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <label className="block text-sm font-medium text-slate-700">
          Điểm nổi bật <span className="text-red-500">*</span>
        </label>
        <span className="text-sm text-slate-500">
          {highlights.length}/{maxItems}
        </span>
      </div>

      <div className="space-y-3">
        {highlights.map((highlight, index) => (
          <div key={index} className="flex items-start gap-2">
            <div className="flex-1">
              <div className="relative">
                <Input
                  value={highlight}
                  onChange={(e) => handleChange(index, e.target.value)}
                  placeholder="VD: Chất liệu cotton 100%"
                  className="pr-10"
                />
                {highlights.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemove(index)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-red-600 transition-colors"
                    aria-label="Xóa điểm nổi bật"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {highlights.length < maxItems && (
        <button
          type="button"
          onClick={handleAdd}
          className={clsx(
            'mt-3 w-full flex items-center justify-center gap-2',
            'px-4 py-2.5 rounded-lg border-2 border-dashed',
            'border-slate-300 hover:border-emerald-500',
            'text-slate-600 hover:text-emerald-600',
            'transition-colors'
          )}
        >
          <Plus className="w-4 h-4" />
          <span className="text-sm font-medium">Thêm điểm nổi bật</span>
        </button>
      )}

      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

      <p className="mt-2 text-sm text-slate-500">
        Thêm ít nhất 1 điểm nổi bật về sản phẩm của bạn
      </p>
    </div>
  );
}
