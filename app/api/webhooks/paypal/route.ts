import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { createServiceClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  const body = await request.text();
  const headersList = await headers();

  // In production, verify webhook signature
  // const isValid = await verifyWebhookSignature(body, headers, WEBHOOK_ID);

  const event = JSON.parse(body);
  const supabase = await createServiceClient();

  try {
    switch (event.event_type) {
      case 'CHECKOUT.ORDER.APPROVED':
      case 'PAYMENT.CAPTURE.COMPLETED': {
        const paypalOrderId = event.resource.id || event.resource.supplementary_data?.related_ids?.order_id;
        const orderId = event.resource.purchase_units?.[0]?.reference_id;

        if (orderId) {
          await supabase
            .from('orders')
            .update({
              payment_status: 'paid',
              status: 'processing',
              paypal_order_id: paypalOrderId,
            })
            .eq('id', orderId);

          // Update stock quantities (same as Stripe webhook)
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
        }
        break;
      }

      case 'PAYMENT.CAPTURE.DENIED':
      case 'PAYMENT.CAPTURE.REFUNDED': {
        const orderId = event.resource.purchase_units?.[0]?.reference_id;

        if (orderId) {
          const status = event.event_type === 'PAYMENT.CAPTURE.REFUNDED' ? 'refunded' : 'failed';
          await supabase
            .from('orders')
            .update({
              payment_status: status,
              status: status === 'refunded' ? 'refunded' : 'cancelled',
            })
            .eq('id', orderId);
        }
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('PayPal webhook error:', error);
    return NextResponse.json(
      { error: error.message || 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
