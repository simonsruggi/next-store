import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { stripe, constructWebhookEvent } from '@/lib/stripe';
import { createServiceClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  const body = await request.text();
  const headersList = await headers();
  const signature = headersList.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 });
  }

  let event;

  try {
    event = constructWebhookEvent(Buffer.from(body), signature);
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  const supabase = await createServiceClient();

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as any;
        const orderId = session.metadata?.orderId;

        if (orderId) {
          // Update order status
          await supabase
            .from('orders')
            .update({
              payment_status: 'paid',
              status: 'processing',
              stripe_payment_intent_id: session.payment_intent,
            })
            .eq('id', orderId);

          // Update stock quantities
          const { data: orderItems } = await supabase
            .from('order_items')
            .select('product_id, variant_id, quantity')
            .eq('order_id', orderId);

          if (orderItems) {
            for (const item of orderItems) {
              if (item.variant_id) {
                const { data: variant } = await supabase
                  .from('product_variants')
                  .select('stock_quantity')
                  .eq('id', item.variant_id)
                  .single();

                if (variant) {
                  await supabase
                    .from('product_variants')
                    .update({ stock_quantity: variant.stock_quantity - item.quantity })
                    .eq('id', item.variant_id);
                }
              } else {
                const { data: product } = await supabase
                  .from('products')
                  .select('stock_quantity')
                  .eq('id', item.product_id)
                  .single();

                if (product) {
                  await supabase
                    .from('products')
                    .update({ stock_quantity: product.stock_quantity - item.quantity })
                    .eq('id', item.product_id);
                }
              }
            }
          }

          // Create digital download links if applicable
          const { data: digitalItems } = await supabase
            .from('order_items')
            .select(`
              id,
              product:products!inner(type, digital_file_url)
            `)
            .eq('order_id', orderId)
            .eq('product.type', 'digital');

          if (digitalItems) {
            for (const item of digitalItems) {
              const token = crypto.randomUUID();
              const expiresAt = new Date();
              expiresAt.setDate(expiresAt.getDate() + 7); // 7 days expiry

              await supabase.from('digital_downloads').insert({
                order_item_id: item.id,
                download_token: token,
                max_downloads: 5,
                expires_at: expiresAt.toISOString(),
              });
            }
          }
        }
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as any;
        const orderId = paymentIntent.metadata?.orderId;

        if (orderId) {
          await supabase
            .from('orders')
            .update({ payment_status: 'failed' })
            .eq('id', orderId);
        }
        break;
      }

      case 'charge.refunded': {
        const charge = event.data.object as any;
        const paymentIntentId = charge.payment_intent;

        const { data: order } = await supabase
          .from('orders')
          .select('id')
          .eq('stripe_payment_intent_id', paymentIntentId)
          .single();

        if (order) {
          await supabase
            .from('orders')
            .update({
              payment_status: 'refunded',
              status: 'refunded',
            })
            .eq('id', order.id);
        }
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Webhook processing error:', error);
    return NextResponse.json(
      { error: error.message || 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
