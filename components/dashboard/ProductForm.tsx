'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Input, Textarea, Select, Button } from '@/components/ui';
import { HighlightList } from './HighlightList';
import { ContactMethodSelector } from './ContactMethodSelector';
import { ImageUploader } from './ImageUploader';
import { slugify } from '@/lib/slugify';
import { Currency, ContactMethod, ProductStatus, UploadedImage, APIResponse, Product } from '@/types';
import { Sparkles } from 'lucide-react';

interface ProductFormProps {
  userId: string;
}

export function ProductForm({ userId }: ProductFormProps) {
  const router = useRouter();

  // Form state
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [currency, setCurrency] = useState<Currency>('VNĐ');
  const [description, setDescription] = useState('');
  const [highlights, setHighlights] = useState<string[]>(['']);
  const [contactMethod, setContactMethod] = useState<ContactMethod>('zalo');
  const [contactValue, setContactValue] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);

  // UI state
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Generate slug preview
  const slugPreview = title ? slugify(title) : '';

  // Generate AI description
  const handleGenerateDescription = async () => {
    if (!title || !price || highlights.filter((h) => h.trim()).length === 0) {
      toast.error('Vui lòng nhập tên, giá và ít nhất 1 điểm nổi bật');
      return;
    }

    setIsGeneratingDescription(true);

    try {
      const response = await fetch('/api/generate-description', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          price,
          currency,
          highlights: highlights.filter((h) => h.trim()),
        }),
      });

      const data: APIResponse<{ description: string }> = await response.json();

      if (data.success && data.data) {
        setDescription(data.data.description);
        toast.success('Đã tạo mô tả tự động!');
      } else {
        toast.error(data.error || 'Không thể tạo mô tả');
      }
    } catch (error) {
      toast.error('Lỗi khi tạo mô tả');
    } finally {
      setIsGeneratingDescription(false);
    }
  };

  // Validate form
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) newErrors.title = 'Vui lòng nhập tên sản phẩm';
    if (!price.trim()) newErrors.price = 'Vui lòng nhập giá';
    if (isNaN(Number(price.replace(/[,.]/g, '')))) newErrors.price = 'Giá phải là số hợp lệ';

    const validHighlights = highlights.filter((h) => h.trim());
    if (validHighlights.length === 0) newErrors.highlights = 'Vui lòng thêm ít nhất 1 điểm nổi bật';

    if (!contactValue.trim()) newErrors.contactValue = 'Vui lòng nhập thông tin liên hệ';

    if (images.length === 0 && uploadedImages.length === 0) {
      newErrors.images = 'Vui lòng thêm ít nhất 1 hình ảnh';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Upload images
  const uploadImagesToR2 = async (): Promise<UploadedImage[]> => {
    if (images.length === 0) return uploadedImages;

    const formData = new FormData();
    images.forEach((image) => formData.append('images', image));

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    const data: APIResponse<UploadedImage[]> = await response.json();

    if (!data.success || !data.data) {
      throw new Error(data.error || 'Failed to upload images');
    }

    return [...uploadedImages, ...data.data];
  };

  // Submit form
  const handleSubmit = async (e: FormEvent, status: ProductStatus = 'draft') => {
    e.preventDefault();

    if (!validate()) {
      toast.error('Vui lòng kiểm tra lại thông tin');
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Upload images
      toast.loading('Đang tải ảnh lên...', { id: 'upload' });
      const allImages = await uploadImagesToR2();
      toast.success('Đã tải ảnh lên', { id: 'upload' });

      // 2. Create product
      toast.loading('Đang tạo sản phẩm...', { id: 'create' });

      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          price: price.trim(),
          currency,
          description: description.trim() || undefined,
          highlights: highlights.filter((h) => h.trim()),
          contactMethod,
          contactValue: contactValue.trim(),
          videoUrl: videoUrl.trim() || undefined,
          images: allImages,
          status,
        }),
      });

      const data: APIResponse<Product> = await response.json();

      if (!data.success || !data.data) {
        throw new Error(data.error || 'Failed to create product');
      }

      toast.success(
        status === 'active' ? 'Sản phẩm đã được xuất bản!' : 'Sản phẩm đã được lưu nháp!',
        { id: 'create' }
      );

      // Redirect to dashboard or product page
      router.push('/dashboard');
    } catch (error) {
      console.error('Submit error:', error);
      toast.error(error instanceof Error ? error.message : 'Có lỗi xảy ra', { id: 'create' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="space-y-8">
      {/* Basic Info */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <h2 className="text-xl font-semibold text-slate-900 mb-6">Thông tin cơ bản</h2>

        <div className="space-y-6">
          <div>
            <Input
              label="Tên sản phẩm"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="VD: Áo thun cao cấp 2024"
              required
              error={errors.title}
            />
            {slugPreview && (
              <p className="mt-2 text-sm text-slate-500">
                URL: <span className="font-mono text-emerald-600">{slugPreview}</span>
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <Input
                label="Giá"
                type="text"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="1500000"
                required
                error={errors.price}
              />
            </div>
            <div>
              <Select
                label="Đơn vị"
                value={currency}
                onChange={(e) => setCurrency(e.target.value as Currency)}
                required
              >
                <option value="VNĐ">VNĐ</option>
                <option value="USD">USD</option>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Highlights */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <h2 className="text-xl font-semibold text-slate-900 mb-6">Điểm nổi bật</h2>
        <HighlightList value={highlights} onChange={setHighlights} error={errors.highlights} />
      </div>

      {/* Description */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-slate-900">Mô tả sản phẩm</h2>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={handleGenerateDescription}
            loading={isGeneratingDescription}
            disabled={isGeneratingDescription}
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Tạo bằng AI
          </Button>
        </div>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Mô tả chi tiết về sản phẩm của bạn..."
          rows={6}
          helperText="Tùy chọn - có thể dùng AI để tạo tự động"
        />
      </div>

      {/* Contact */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <h2 className="text-xl font-semibold text-slate-900 mb-6">Thông tin liên hệ</h2>
        <ContactMethodSelector
          method={contactMethod}
          value={contactValue}
          onMethodChange={setContactMethod}
          onValueChange={setContactValue}
          error={errors.contactValue}
        />
      </div>

      {/* Images */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <h2 className="text-xl font-semibold text-slate-900 mb-6">Hình ảnh</h2>
        <ImageUploader
          images={images}
          uploadedImages={uploadedImages}
          onChange={setImages}
          onUploadedChange={setUploadedImages}
          error={errors.images}
        />
      </div>

      {/* Video (Optional) */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <h2 className="text-xl font-semibold text-slate-900 mb-6">Video giới thiệu</h2>
        <Input
          label="URL video"
          type="url"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          placeholder="https://youtube.com/watch?v=..."
          helperText="Tùy chọn - Link YouTube hoặc Vimeo"
        />
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between gap-4">
        <Button
          type="button"
          variant="ghost"
          onClick={() => router.push('/dashboard')}
          disabled={isSubmitting}
        >
          Hủy
        </Button>
        <div className="flex items-center gap-4">
          <Button
            type="button"
            variant="secondary"
            onClick={(e) => handleSubmit(e, 'draft')}
            disabled={isSubmitting}
            loading={isSubmitting}
          >
            Lưu nháp
          </Button>
          <Button
            type="submit"
            onClick={(e) => handleSubmit(e, 'active')}
            disabled={isSubmitting}
            loading={isSubmitting}
          >
            Xuất bản
          </Button>
        </div>
      </div>
    </form>
  );
}
