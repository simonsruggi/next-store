import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { captureOrder } from '@/lib/paypal';

export async function POST(request: NextRequest) {
  try {
    const { orderId, paypalOrderId } = await request.json();

    if (!orderId || !paypalOrderId) {
      return NextResponse.json(
        { error: 'Order ID and PayPal Order ID required' },
        { status: 400 }
      );
    }

    // Capture the PayPal order
    const captureResult = await captureOrder(paypalOrderId);

    if (captureResult.status !== 'COMPLETED') {
      return NextResponse.json(
        { error: 'Payment not completed' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Update order status
    await supabase
      .from('orders')
      .update({
        payment_status: 'paid',
        status: 'processing',
        paypal_order_id: paypalOrderId,
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

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('PayPal capture error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
