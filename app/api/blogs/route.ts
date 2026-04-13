export const dynamic = 'force-dynamic';

import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse, type NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 });
  }

  const body = await request.json();
  const { id, title, author_name, image_url, content, category } = body;

  if (!id || !title || !author_name || !image_url || !content || !category) {
    return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
  }

  const { error } = await supabase.from('blogs').insert({
    id,
    title:       title.trim(),
    author_name: author_name.trim(),
    image_url:   image_url.trim(),
    content,
    category,
    user_id:     user.id,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

export async function PATCH(request: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 });
  }

  const body = await request.json();
  const { id, title, author_name, image_url, content, category } = body;

  if (!id || !title || !author_name || !image_url || !content || !category) {
    return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
  }

  // Verify ownership before updating
  const { data: existing } = await supabase.from('blogs').select('user_id').eq('id', id).single();
  if (!existing || existing.user_id !== user.id) {
    return NextResponse.json({ error: 'Not authorized.' }, { status: 403 });
  }

  const { error } = await supabase.from('blogs').update({
    title:       title.trim(),
    author_name: author_name.trim(),
    image_url:   image_url.trim(),
    content,
    category,
  }).eq('id', id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
