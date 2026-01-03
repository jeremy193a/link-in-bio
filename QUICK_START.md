# Quick Start Guide - Product Creation

## 🚀 Test Your Implementation

### Step 1: Add Missing Environment Variables
Add these to your `.env.local`:

```bash
# Clerk (for authentication)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_key
CLERK_SECRET_KEY=your_secret

# Anthropic (for AI descriptions)
ANTHROPIC_API_KEY=your_key
```

### Step 2: Deploy to Cloudflare Pages
```bash
npm run build
npx wrangler pages deploy .next
```

### Step 3: Test the Flow
1. Visit: `https://your-deployment.pages.dev/dashboard/products/new`
2. Fill in the form
3. Upload images
4. Click "Generate AI Description"
5. Publish!

---

## 📂 File Structure Reference

```
link-in-bio/
├── app/
│   ├── (dashboard)/
│   │   └── dashboard/
│   │       └── products/
│   │           └── new/
│   │               └── page.tsx ← Product creation page
│   └── api/
│       ├── upload/route.ts ← Image upload
│       ├── generate-description/route.ts ← AI
│       └── products/route.ts ← Product CRUD
│
├── components/
│   ├── ui/ ← Reusable UI components
│   │   ├── Input.tsx
│   │   ├── Textarea.tsx
│   │   ├── Select.tsx
│   │   ├── Button.tsx
│   │   └── Label.tsx
│   └── dashboard/ ← Feature components
│       ├── HighlightList.tsx
│       ├── ContactMethodSelector.tsx
│       ├── ImageUploader.tsx
│       └── ProductForm.tsx ← Main form
│
├── lib/
│   ├── slugify.ts ← Vietnamese slug generation
│   ├── db.ts ← Database helpers
│   ├── r2.ts ← Image upload
│   └── ai.ts ← AI description
│
└── types/
    └── index.ts ← TypeScript types
```

---

## 🔍 How It Works

### Form Submission Flow:
1. User fills form
2. Client validates
3. Images upload to R2 → Get CDN URLs
4. Product created in D1 with transaction:
   - Insert product
   - Insert highlights
   - Insert image records
5. Redirect to dashboard
6. Success!

### Vietnamese Slug Example:
```
Input:  "Áo Thun Cao Cấp 2024"
Output: "ao-thun-cao-cap-2024"

If exists:
Output: "ao-thun-cao-cap-2024-2"
```

---

## 🎨 Component Usage Examples

### Input
```tsx
<Input
  label="Product Name"
  value={name}
  onChange={(e) => setName(e.target.value)}
  placeholder="Enter product name"
  required
  error={errors.name}
/>
```

### Button
```tsx
<Button
  variant="primary"
  loading={isSubmitting}
  onClick={handleSubmit}
>
  Submit
</Button>
```

### HighlightList
```tsx
<HighlightList
  value={highlights}
  onChange={setHighlights}
  maxItems={10}
  error={errors.highlights}
/>
```

---

## 🛠️ Common Customizations

### Change Max Images
```tsx
// components/dashboard/ImageUploader.tsx
<ImageUploader
  maxFiles={10} // Change from 5 to 10
  maxSizeMB={10} // Change from 5MB to 10MB
  ...
/>
```

### Change Default Currency
```tsx
// components/dashboard/ProductForm.tsx
const [currency, setCurrency] = useState<Currency>('USD'); // Change from VNĐ
```

### Add More Contact Methods
```tsx
// components/dashboard/ContactMethodSelector.tsx
// Add to CONTACT_OPTIONS array
{
  value: 'telegram',
  label: 'Telegram',
  icon: MessageSquare,
  placeholder: '@username',
  helperText: 'Enter your Telegram username',
}
```

---

## 📝 Testing Checklist

### Before Going Live:
- [ ] Test with Clerk authentication
- [ ] Test AI description generation (requires Anthropic key)
- [ ] Upload real images to R2
- [ ] Create test product end-to-end
- [ ] Verify product in D1 database:
  ```bash
  npx wrangler d1 execute showcase-db --remote --command "SELECT * FROM products"
  ```
- [ ] Check Vietnamese characters in slugs
- [ ] Test all 3 contact methods
- [ ] Test draft vs publish

---

## 🐛 Debug Commands

```bash
# Check D1 database
npx wrangler d1 execute showcase-db --remote --command "SELECT * FROM products"

# Check uploaded images in R2
npx wrangler r2 object list showcase-images

# View logs
npx wrangler tail

# Local dev (UI only, no D1)
npm run dev

# Build and deploy
npm run build && npx wrangler pages deploy .next
```

---

## 📞 Need Help?

Check these files for details:
- `PHASE3_COMPLETE.md` - Full implementation details
- `SETUP_COMPLETE.md` - Infrastructure setup
- `SETUP_GUIDE.md` - Initial setup instructions

---

**You're all set! 🎉**

The product creation feature is ready to use. Deploy to Cloudflare Pages and start creating products!
