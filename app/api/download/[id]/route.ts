import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: token } = await params;

  if (!token) {
    return NextResponse.json({ error: 'Token required' }, { status: 400 });
  }

  const supabase = await createClient();

  // Get download record
  const { data: download, error } = await supabase
    .from('digital_downloads')
    .select(`
      *,
      order_item:order_items!inner(
        product:products!inner(
          digital_file_url,
          name
        )
      )
    `)
    .eq('download_token', token)
    .single();

  if (error || !download) {
    return NextResponse.json({ error: 'Invalid download link' }, { status: 404 });
  }

  // Check expiry
  if (new Date(download.expires_at) < new Date()) {
    return NextResponse.json({ error: 'Download link expired' }, { status: 410 });
  }

  // Check download count
  if (download.download_count >= download.max_downloads) {
    return NextResponse.json({ error: 'Maximum downloads reached' }, { status: 403 });
  }

  const fileUrl = download.order_item.product.digital_file_url;

  if (!fileUrl) {
    return NextResponse.json({ error: 'File not found' }, { status: 404 });
  }

  // Increment download count
  await supabase
    .from('digital_downloads')
    .update({ download_count: download.download_count + 1 })
    .eq('id', download.id);

  // Redirect to file URL or stream file
  // For Supabase Storage, you would generate a signed URL
  // For external URLs, redirect directly
  return NextResponse.redirect(fileUrl);
}
