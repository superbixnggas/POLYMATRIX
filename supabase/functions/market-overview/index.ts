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
        const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY');

        if (!supabaseUrl || !supabaseAnonKey) {
            throw new Error('Supabase configuration missing');
        }

        // Fetch all market data using anon key (public access)
        const response = await fetch(`${supabaseUrl}/rest/v1/market_data?select=*&order=market_cap.desc`, {
            headers: {
                'apikey': supabaseAnonKey,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Database query failed: ${errorText}`);
        }

        const marketData = await response.json();

        // Calculate market overview
        const totalMarketCap = marketData.reduce((sum, coin) => sum + parseFloat(coin.market_cap || 0), 0);
        const totalVolume24h = marketData.reduce((sum, coin) => sum + parseFloat(coin.volume_24h || 0), 0);
        const btcData = marketData.find(c => c.symbol === 'BTC');
        const btcDominance = btcData ? (parseFloat(btcData.market_cap) / totalMarketCap) * 100 : 0;

        // Get top gainers and losers
        const gainers = [...marketData]
            .filter(c => parseFloat(c.price_change_24h) > 0)
            .sort((a, b) => parseFloat(b.price_change_24h) - parseFloat(a.price_change_24h))
            .slice(0, 5);

        const losers = [...marketData]
            .filter(c => parseFloat(c.price_change_24h) < 0)
            .sort((a, b) => parseFloat(a.price_change_24h) - parseFloat(b.price_change_24h))
            .slice(0, 5);

        return new Response(JSON.stringify({
            data: {
                overview: {
                    totalMarketCap,
                    totalVolume24h,
                    btcDominance,
                    totalCoins: marketData.length
                },
                topGainers: gainers,
                topLosers: losers,
                allCoins: marketData
            }
        }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Market overview error:', error);

        const errorResponse = {
            error: {
                code: 'MARKET_OVERVIEW_ERROR',
                message: error.message
            }
        };

        return new Response(JSON.stringify(errorResponse), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
});
