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
        const plans = [
            {
                id: 'free',
                name: 'Free',
                price: 0,
                period: 'forever',
                features: [
                    'Basic wallet tracking (5 wallets)',
                    'Real-time feed (limited)',
                    'Basic alerts (3 alerts)',
                    '24h data retention',
                    'Community support'
                ],
                limits: {
                    maxWallets: 5,
                    maxAlerts: 3,
                    dataRetention: 1,
                    apiAccess: false
                }
            },
            {
                id: 'premium',
                name: 'Premium',
                price: 29,
                period: 'month',
                features: [
                    'Unlimited wallet tracking',
                    'Extended history (30 days)',
                    'Advanced analytics',
                    'Unlimited alerts',
                    'Priority support',
                    'Export data',
                    'API access'
                ],
                limits: {
                    maxWallets: -1,
                    maxAlerts: -1,
                    dataRetention: 30,
                    apiAccess: true
                },
                popular: true
            },
            {
                id: 'professional',
                name: 'Professional',
                price: 99,
                period: 'month',
                features: [
                    'Everything in Premium',
                    '90 days data retention',
                    'Custom alerts',
                    'Advanced charts',
                    'Portfolio management',
                    'Webhook notifications',
                    'Dedicated support',
                    'Custom API limits'
                ],
                limits: {
                    maxWallets: -1,
                    maxAlerts: -1,
                    dataRetention: 90,
                    apiAccess: true,
                    webhooks: true
                }
            }
        ];

        return new Response(JSON.stringify({
            data: plans
        }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Subscription plans error:', error);

        const errorResponse = {
            error: {
                code: 'SUBSCRIPTION_PLANS_ERROR',
                message: error.message
            }
        };

        return new Response(JSON.stringify(errorResponse), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
});
