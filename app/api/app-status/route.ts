import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!
);

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('app_settings')
      .select('app_active')
      .eq('id', 1)
      .single();

    if (error) {
      return Response.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return Response.json({
      success: true,
      active: data.app_active,
    });
  } catch {
    return Response.json(
      { success: false, error: 'Unable to check app status' },
      { status: 500 }
    );
  }
}
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const adminKey = request.headers.get('x-admin-key');

if (adminKey !== process.env.ADMIN_CONTROL_KEY) {
  return Response.json(
    { success: false, error: 'Unauthorized' },
    { status: 401 }
  );
}

    const { data, error } = await supabase
      .from('app_settings')
      .update({
        app_active: body.active,
      })
      .eq('id', 1)
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
      active: data.app_active,
    });
  } catch {
    return Response.json(
      { success: false, error: 'Unable to update app status' },
      { status: 500 }
    );
  }
}