import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!
);

// ADD CUSTOMER
export async function POST(request: Request) {
  try {
    const customer = await request.json();

    const { data, error } = await supabase
      .from('customers')
      .insert({
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        company_name: customer.companyName,
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
      customer: data,
    });
  } catch {
    return Response.json(
      {
        success: false,
        error: 'Unable to save customer',
      },
      {
        status: 500,
      }
    );
  }
}

// GET CUSTOMERS
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('customers')
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
      customers: data,
    });
  } catch {
    return Response.json(
      {
        success: false,
        error: 'Unable to load customers',
      },
      {
        status: 500,
      }
    );
  }
}
// UPDATE CUSTOMER
export async function PATCH(request: Request) {
  try {
    const body = await request.json();

    const { data, error } = await supabase
      .from('customers')
      .update({
        name: body.name,
        email: body.email,
        phone: body.phone,
        company_name: body.companyName,
      })
      .eq('id', body.id)
      .select()
      .single();

    if (error) {
      return Response.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return Response.json({
      success: true,
      customer: data,
    });
  } catch {
    return Response.json(
      { success: false, error: 'Unable to update customer' },
      { status: 500 }
    );
  }
}
// DELETE CUSTOMER
export async function DELETE(request: Request) {
  try {
    const body = await request.json();

    const { error } = await supabase
      .from('customers')
      .delete()
      .eq('id', body.id);

    if (error) {
      return Response.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return Response.json({ success: true });
  } catch {
    return Response.json(
      { success: false, error: 'Unable to delete customer' },
      { status: 500 }
    );
  }
}