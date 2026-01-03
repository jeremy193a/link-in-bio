import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY!,
});

export interface GenerateDescriptionInput {
    title: string;
    price: string;
    currency: string;
    highlights: string[];
}

export async function generateProductDescription(
    input: GenerateDescriptionInput
): Promise<string> {
    const prompt = `Bạn là copywriter chuyên viết mô tả sản phẩm cho thị trường Việt Nam.

Thông tin sản phẩm:
- Tên: ${input.title}
- Giá: ${input.price} ${input.currency}
- Điểm nổi bật: ${input.highlights.join(', ')}

Yêu cầu viết mô tả:
1. Độ dài: 150-200 từ
2. Tập trung vào lợi ích của khách hàng, không chỉ mô tả tính năng
3. Tone: Thân thiện, chuyên nghiệp, dễ hiểu
4. Kết thúc bằng một call-to-action mềm mại (không aggressive)
5. KHÔNG sử dụng emoji
6. KHÔNG viết quá hoa mỹ hoặc phức tạp
7. Viết bằng tiếng Việt tự nhiên

Hãy viết mô tả sản phẩm:`;

    const message = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 600,
        messages: [{ role: 'user', content: prompt }],
    });

    const textContent = message.content.find((block) => block.type === 'text');
    if (textContent && textContent.type === 'text') {
        return textContent.text;
    }
    return '';
}
