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

        // Get wallet address from request body
        const { address } = await req.json();

        if (!address) {
            throw new Error('Wallet address is required');
        }

        // Fetch wallet details
        const response = await fetch(`${supabaseUrl}/rest/v1/wallets?select=*&address=eq.${address}`, {
            headers: {
                'Authorization': `Bearer ${serviceRoleKey}`,
                'apikey': serviceRoleKey,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Database query failed: ${errorText}`);
        }

        const wallets = await response.json();

        if (wallets.length === 0) {
            throw new Error('Wallet not found');
        }

        return new Response(JSON.stringify({
            data: wallets[0]
        }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Wallet details error:', error);

        const errorResponse = {
            error: {
                code: 'WALLET_DETAILS_ERROR',
                message: error.message
            }
        };

        return new Response(JSON.stringify(errorResponse), {
            status: error.message === 'Wallet not found' ? 404 : 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
});
