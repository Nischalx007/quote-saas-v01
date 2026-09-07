import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!
);

// CREATE A NEW QUOTATION
export async function POST(request: Request) {
  try {
    const quote = await request.json();

    const { data, error } = await supabase
      .from('quotations')
      .insert({
        quote_number: quote.quoteNumber,
        customer_name: quote.customerName,
        customer_email: quote.customerEmail,
        customer_phone: quote.customerPhone,
        customer_company: quote.customerCompany,
        items: quote.items,
        subtotal: quote.subtotal,
        vat: quote.vat,
        total: quote.total,
        status: 'draft',
      })
      .select()
      .single();

    if (error) {
      return Response.json(
        {
          success: false,
          error: error.message,
        },
        {
          status: 500,
        }
      );
    }

    return Response.json({
      success: true,
      quotation: data,
    });
  } catch {
    return Response.json(
      {
        success: false,
        error: 'Unable to save quotation',
      },
      {
        status: 500,
      }
    );
  }
}

// GET ALL QUOTATIONS
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('quotations')
      .select('*')
      .order('created_at', {
        ascending: false,
      });

    if (error) {
      return Response.json(
        {
          success: false,
          error: error.message,
        },
        {
          status: 500,
        }
      );
    }

    return Response.json({
      success: true,
      quotations: data,
    });
  } catch {
    return Response.json(
      {
        success: false,
        error: 'Unable to load quotations',
      },
      {
        status: 500,
      }
    );
  }
}

// UPDATE AN EXISTING QUOTATION
export async function PATCH(request: Request) {
  try {
    const body = await request.json();

    const updates: Record<string, unknown> = {};

    if (body.status !== undefined) {
      updates.status = body.status;
    }

    if (body.quoteNumber !== undefined) {
      updates.quote_number = body.quoteNumber;
    }

    if (body.customerName !== undefined) {
      updates.customer_name = body.customerName;
    }

    if (body.customerEmail !== undefined) {
      updates.customer_email = body.customerEmail;
    }
    if (body.customerPhone !== undefined) updates.customer_phone = body.customerPhone;
if (body.customerCompany !== undefined) updates.customer_company = body.customerCompany;

    if (body.items !== undefined) {
      updates.items = body.items;
    }

    if (body.subtotal !== undefined) {
      updates.subtotal = body.subtotal;
    }

    if (body.vat !== undefined) {
      updates.vat = body.vat;
    }

    if (body.total !== undefined) {
      updates.total = body.total;
    }

    const { data, error } = await supabase
      .from('quotations')
      .update(updates)
      .eq('id', body.id)
      .select()
      .single();

    if (error) {
      return Response.json(
        {
          success: false,
          error: error.message,
        },
        {
          status: 500,
        }
      );
    }

    return Response.json({
      success: true,
      quotation: data,
    });
  } catch {
    return Response.json(
      {
        success: false,
        error: 'Unable to update quotation',
      },
      {
        status: 500,
      }
    );
  }
}