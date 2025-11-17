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

        // Fetch data from CoinGecko API
        const coingeckoUrl = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1&sparkline=false&price_change_percentage=24h';
        
        const response = await fetch(coingeckoUrl, {
            headers: {
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`CoinGecko API error: ${response.status}`);
        }

        const coins = await response.json();

        // Update database with fresh data
        for (const coin of coins) {
            const updateData = {
                symbol: coin.symbol.toUpperCase(),
                name: coin.name,
                price: coin.current_price,
                volume_24h: coin.total_volume,
                price_change_24h: coin.price_change_percentage_24h || 0,
                market_cap: coin.market_cap,
                updated_at: new Date().toISOString()
            };

            // Upsert coin data
            await fetch(`${supabaseUrl}/rest/v1/market_data`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${serviceRoleKey}`,
                    'apikey': serviceRoleKey,
                    'Content-Type': 'application/json',
                    'Prefer': 'resolution=merge-duplicates'
                },
                body: JSON.stringify(updateData)
            });

            // Insert historical price
            await fetch(`${supabaseUrl}/rest/v1/historical_prices`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${serviceRoleKey}`,
                    'apikey': serviceRoleKey,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    symbol: coin.symbol.toUpperCase(),
                    price: coin.current_price,
                    volume: coin.total_volume,
                    timestamp: new Date().toISOString()
                })
            });
        }

        return new Response(JSON.stringify({
            data: {
                message: 'Market data updated successfully',
                coinsUpdated: coins.length,
                timestamp: new Date().toISOString()
            }
        }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Update market data error:', error);

        const errorResponse = {
            error: {
                code: 'UPDATE_MARKET_DATA_ERROR',
                message: error.message
            }
        };

        return new Response(JSON.stringify(errorResponse), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
});
