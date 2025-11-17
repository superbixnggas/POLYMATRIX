Deno.serve(async (req) => {
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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

        const { wallet_address, volume_threshold, alert_type, user_id } = await req.json();

        if (!alert_type) {
            throw new Error('Alert type is required');
        }

        if (alert_type === 'volume' && !volume_threshold) {
            throw new Error('Volume threshold is required for volume alerts');
        }

        if (alert_type === 'wallet' && !wallet_address) {
            throw new Error('Wallet address is required for wallet alerts');
        }

        // Create alert
        const response = await fetch(`${supabaseUrl}/rest/v1/alerts`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${serviceRoleKey}`,
                'apikey': serviceRoleKey,
                'Content-Type': 'application/json',
                'Prefer': 'return=representation'
            },
            body: JSON.stringify({
                user_id: user_id || 'anonymous',
                wallet_address,
                volume_threshold,
                alert_type,
                is_active: true
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Database insert failed: ${errorText}`);
        }

        const alert = await response.json();

        return new Response(JSON.stringify({
            data: alert[0],
            message: 'Alert created successfully'
        }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Alert subscribe error:', error);

        const errorResponse = {
            error: {
                code: 'ALERT_SUBSCRIBE_ERROR',
                message: error.message
            }
        };

        return new Response(JSON.stringify(errorResponse), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
});
