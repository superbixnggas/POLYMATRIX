Deno.serve(async (req) => {
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, stripe-signature',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE, PATCH',
        'Access-Control-Max-Age': '86400',
        'Access-Control-Allow-Credentials': 'false'
    };

    if (req.method === 'OPTIONS') {
        return new Response(null, { status: 200, headers: corsHeaders });
    }

    try {
        const supabaseUrl = Deno.env.get('SUPABASE_URL');
        const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

        if (!supabaseUrl || !serviceRoleKey) {
            throw new Error('Supabase configuration missing');
        }

        // Get webhook payload
        const payload = await req.text();
        const signature = req.headers.get('stripe-signature');

        // In production, verify Stripe signature here
        // const event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);

        // Parse event (simplified for demo)
        const event = JSON.parse(payload);

        // Handle different event types
        switch (event.type) {
            case 'checkout.session.completed':
                const session = event.data.object;
                
                // Update subscription status
                await fetch(`${supabaseUrl}/rest/v1/user_subscriptions?user_id=eq.${session.client_reference_id}`, {
                    method: 'PATCH',
                    headers: {
                        'Authorization': `Bearer ${serviceRoleKey}`,
                        'apikey': serviceRoleKey,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        status: 'active',
                        updated_at: new Date().toISOString()
                    })
                });
                break;

            case 'customer.subscription.deleted':
                const subscription = event.data.object;
                
                // Mark subscription as cancelled
                await fetch(`${supabaseUrl}/rest/v1/user_subscriptions?user_id=eq.${subscription.metadata.user_id}`, {
                    method: 'PATCH',
                    headers: {
                        'Authorization': `Bearer ${serviceRoleKey}`,
                        'apikey': serviceRoleKey,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        status: 'cancelled',
                        updated_at: new Date().toISOString()
                    })
                });
                break;

            default:
                console.log(`Unhandled event type: ${event.type}`);
        }

        return new Response(JSON.stringify({
            received: true,
            eventType: event.type
        }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Stripe webhook error:', error);

        const errorResponse = {
            error: {
                code: 'STRIPE_WEBHOOK_ERROR',
                message: error.message
            }
        };

        return new Response(JSON.stringify(errorResponse), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
});
