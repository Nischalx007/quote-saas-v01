export async function POST(request: Request) {
  try {
    const body = await request.json();
    const items = body.items || [];
const businessName = body.businessName || '';
const customerName = body.customerName || '';
const validUntil = body.validUntil || '';
const subtotal = body.subtotal || 0;
const vat = body.vat || 0;
const total = body.total || 0;
    const itemText = items
      .map(
        (item: any) =>
          `${item.description} - Quantity: ${item.quantity} - Price: AED ${item.price}`
      )
      .join('\n');

const prompt = `
You are helping a professional business prepare a customer quotation.

Business: ${businessName}
Customer: ${customerName}
Valid until: ${validUntil}

Quotation items:
${itemText}

Subtotal: AED ${subtotal}
VAT: AED ${vat}
Total: AED ${total}

Write clear and professional quotation notes suitable for sending directly to the customer.

Include:
1. A short summary of the quoted work or services.
2. A professional statement that pricing is based on the listed scope and quantities.
3. Mention the quotation validity date if available.
4. A polite closing sentence.

Keep it between 60 and 90 words.
Use simple business English.
Do not invent payment terms, warranties, discounts, or services.
Do not use markdown headings.
`;

    const response = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': process.env.GEMINI_API_KEY || '',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error(data);

      return Response.json(
        {
          success: false,
          error: 'Gemini generation failed',
        },
        { status: 500 }
      );
    }

    const text =
      data.candidates?.[0]?.content?.parts?.[0]?.text || '';

    return Response.json({
      success: true,
      text,
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        success: false,
        error: 'AI generation failed',
      },
      { status: 500 }
    );
  }
}