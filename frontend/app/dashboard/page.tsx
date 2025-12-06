'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { io, Socket } from 'socket.io-client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, LogOut, Trash2 } from 'lucide-react';
import SUPPORTED_STOCKS from '@/data/stocks';
import Loader from '@/components/custom/Loader';
import { API_URL } from '@/config/api';
import { getSubscriptions, subscribeToStock, unsubscribeFromStock } from '@/lib/api/subscriptions';

interface StockPrice {
    ticker: string;
    price: number;
    timestamp: number;
    change?: number;
}

export default function DashboardPage() {
    const router = useRouter();
    const socketRef = useRef<Socket | null>(null);
    const [userEmail] = useState<string>(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('userEmail') || '';
        }
        return '';
    });
    const [token] = useState<string>(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('token') || '';
        }
        return '';
    });
    const [subscriptions, setSubscriptions] = useState<string[]>([]);
    const [stockPrices, setStockPrices] = useState<Map<string, StockPrice>>(new Map());
    const [newTicker, setNewTicker] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [success, setSuccess] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(true);

    // Check authentication and initialize
    useEffect(() => {
        if (!token || !userEmail) {
            router.push('/login');
            return;
        }

        // Fetch subscriptions
        getSubscriptions(token)
            .then((data) => {
                if (data.subscriptions) {
                    setSubscriptions(data.subscriptions);
                }
            })
            .catch((err) => {
                console.error('Failed to fetch subscriptions:', err);
            });

        // Initialize socket
        const newSocket = io(API_URL, {
            transports: ['websocket'],
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
        });

        newSocket.on('connect', () => {
            console.log('Socket connected');
            newSocket.emit('authenticate', token);
        });

        newSocket.on('auth-success', (data: { subscriptions: string[] }) => {
            console.log('Authentication successful:', data);
            setSubscriptions(data.subscriptions);
            setIsLoading(false);
        });

        newSocket.on('auth-error', (data: { error: string }) => {
            console.error('Authentication error:', data.error);
            setError('Authentication failed. Please login again.');
            setIsLoading(false);
            setTimeout(() => {
                newSocket.close();
                localStorage.removeItem('token');
                localStorage.removeItem('userEmail');
                router.push('/login');
            }, 2000);
        });

        newSocket.on('stock-update', (data: StockPrice) => {
            setStockPrices((prev) => {
                const newMap = new Map(prev);
                const oldPrice = newMap.get(data.ticker);
                const change = oldPrice ? data.price - oldPrice.price : 0;
                newMap.set(data.ticker, { ...data, change });
                return newMap;
            });
        });

        newSocket.on('connect_error', (err) => {
            console.error('Socket connection error:', err);
            setError('Failed to connect to real-time server');
        });

        socketRef.current = newSocket;

        return () => {
            newSocket.close();
        };
    }, [token, userEmail, router]);

    const handleSubscribe = async (tickerToSubscribe?: string) => {
        const ticker = (tickerToSubscribe || newTicker).toUpperCase().trim();

        if (!ticker) {
            setError('Please enter a stock ticker');
            return;
        }

        if (!SUPPORTED_STOCKS.includes(ticker)) {
            setError(`Supported stocks: ${SUPPORTED_STOCKS.join(', ')}`);
            return;
        }

        if (subscriptions.includes(ticker)) {
            setError('Already subscribed to this stock');
            return;
        }

        setError('');
        setSuccess('');

        try {
            const data = await subscribeToStock(ticker, token);

            setSubscriptions(data.subscriptions);
            setNewTicker('');
            setSuccess(`Successfully subscribed to ${ticker}`);
            setTimeout(() => setSuccess(''), 3000);

            // Notify socket to update subscriptions
            if (socketRef.current) {
                socketRef.current.emit('update-subscriptions');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to connect to server');
            console.error('Subscribe error:', err);
        }
    };

    const handleUnsubscribe = async (ticker: string) => {
        setError('');
        setSuccess('');

        try {
            const data = await unsubscribeFromStock(ticker, token);

            setSubscriptions(data.subscriptions);
            setStockPrices((prev) => {
                const newMap = new Map(prev);
                newMap.delete(ticker);
                return newMap;
            });
            setSuccess(`Unsubscribed from ${ticker}`);
            setTimeout(() => setSuccess(''), 3000);

            // Notify socket to update subscriptions
            if (socketRef.current) {
                socketRef.current.emit('update-subscriptions');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to connect to server');
            console.error('Unsubscribe error:', err);
        }
    };

    const handleLogout = () => {
        if (socketRef.current) {
            socketRef.current.close();
        }
        localStorage.removeItem('token');
        localStorage.removeItem('userEmail');
        router.push('/login');
    };

    if (isLoading) {
        return (
            <Loader />
        );
    }

    // Get unsubscribed stocks
    const unsubscribedStocks = SUPPORTED_STOCKS.filter(
        (ticker) => !subscriptions.includes(ticker)
    );

    return (
        <div className="min-h-screen bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-blue-200 shadow-lg">
                    <div>
                        <h1 className="text-4xl font-bold bg-linear-to-r  bg-clip-text text-black mb-2">Stock Broker Dashboard</h1>
                        <p className="text-gray-700 text-lg">Welcome back, <span className="text-blue-600 font-semibold">{userEmail}</span></p>
                        <div className="flex items-center gap-4 mt-3">
                            <Badge variant="outline" className="text-sm px-3 py-1 border-blue-300 text-blue-700 bg-blue-50">
                                {subscriptions.length} Active Subscriptions
                            </Badge>
                            <Badge variant="outline" className="text-sm px-3 py-1 border-purple-300 text-purple-700 bg-purple-50">
                                {SUPPORTED_STOCKS.length} Available Stocks
                            </Badge>
                        </div>
                    </div>
                    <Button onClick={handleLogout} variant="outline" className="gap-2 border-gray-300 hover:bg-gray-100 text-gray-700">
                        <LogOut className="h-4 w-4" />
                        Logout
                    </Button>
                </div>

                {/* Messages */}
                {error && (
                    <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-lg shadow-md">
                        {error}
                    </div>
                )}
                {success && (
                    <div className="bg-green-50 border border-green-300 text-green-700 px-4 py-3 rounded-lg shadow-md">
                        {success}
                    </div>
                )}

                {/* My Subscribed Stocks - TOP SECTION */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">My Subscribed Stocks</h2>
                            <p className="text-gray-600 mt-1">Real-time prices updating every second</p>
                        </div>
                    </div>

                    {subscriptions.length === 0 ? (
                        <Card className="bg-white/80 border-blue-200 shadow-lg">
                            <CardContent className="py-16">
                                <div className="text-center space-y-4">
                                    <div className="text-6xl mb-4">📈</div>
                                    <h3 className="text-xl font-semibold text-gray-800">No Active Subscriptions</h3>
                                    <p className="text-gray-600 max-w-md mx-auto">
                                        Start tracking stocks by subscribing to them from the available stocks section below.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                            {subscriptions.map((ticker) => {
                                const stockData = stockPrices.get(ticker);
                                const change = stockData?.change || 0;
                                const isPositive = change >= 0;

                                return (
                                    <Card key={ticker} className="bg-linear-to-br from-white to-blue-50 border-blue-200 hover:border-blue-400 transition-all duration-300 hover:shadow-xl shadow-md">
                                        <CardHeader className="pb-3">
                                            <div className="flex justify-between items-start">
                                                <div className="flex-1">
                                                    <CardTitle className="text-2xl text-gray-800 mb-2">{ticker}</CardTitle>
                                                    {stockData && (
                                                        <div className="flex items-center gap-2">
                                                            {isPositive ? (
                                                                <TrendingUp className="h-4 w-4 text-green-600" />
                                                            ) : (
                                                                <TrendingDown className="h-4 w-4 text-red-600" />
                                                            )}
                                                            <Badge
                                                                variant={isPositive ? 'default' : 'destructive'}
                                                                className={`text-xs ${isPositive ? 'bg-green-100 text-green-700 border-green-300' : 'bg-red-100 text-red-700 border-red-300'}`}
                                                            >
                                                                {isPositive ? '+' : ''}
                                                                {change.toFixed(2)}
                                                            </Badge>
                                                        </div>
                                                    )}
                                                </div>
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    onClick={() => handleUnsubscribe(ticker)}
                                                    className="h-8 w-8 hover:bg-red-100 hover:text-red-600"
                                                    title="Unsubscribe"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            {stockData ? (
                                                <div>
                                                    <p className="text-4xl font-bold text-gray-900 mb-2">
                                                        ${stockData.price.toFixed(2)}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        Updated: {new Date(stockData.timestamp).toLocaleTimeString()}
                                                    </p>
                                                </div>
                                            ) : (
                                                <div className="space-y-2">
                                                    <div className="h-10 bg-blue-100 rounded animate-pulse"></div>
                                                    <p className="text-gray-500 text-sm">Loading price data...</p>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Available Stocks - BOTTOM SECTION */}
                <div className="space-y-4 pt-8 border-t border-blue-200">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">Available Stocks</h2>
                        <p className="text-gray-600 mt-1">Click on any stock to subscribe and start tracking prices</p>
                    </div>

                    {unsubscribedStocks.length === 0 ? (
                        <Card className="bg-white/80 border-blue-200 shadow-lg">
                            <CardContent className="py-12">
                                <div className="text-center space-y-3">
                                    <div className="text-5xl mb-3">✅</div>
                                    <h3 className="text-xl font-semibold text-gray-800">All Stocks Subscribed!</h3>
                                    <p className="text-gray-600">
                                        You&apos;re tracking all available stocks. Check your subscriptions above.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                            {unsubscribedStocks.map((ticker) => {
                                const stockData = stockPrices.get(ticker);
                                const change = stockData?.change || 0;
                                const isPositive = change >= 0;

                                return (
                                    <Card
                                        key={ticker}
                                        className="bg-white/70 border-purple-200 hover:bg-white hover:border-purple-400 transition-all duration-300 cursor-pointer group shadow-md hover:shadow-xl"
                                        onClick={() => handleSubscribe(ticker)}
                                    >
                                        <CardHeader className="pb-3">
                                            <div className="flex justify-between items-start">
                                                <div className="flex-1">
                                                    <CardTitle className="text-2xl text-gray-800 group-hover:text-purple-600 transition-colors mb-2">
                                                        {ticker}
                                                    </CardTitle>
                                                    {stockData && (
                                                        <div className="flex items-center gap-2">
                                                            {isPositive ? (
                                                                <TrendingUp className="h-4 w-4 text-green-600" />
                                                            ) : (
                                                                <TrendingDown className="h-4 w-4 text-red-600" />
                                                            )}
                                                            <Badge
                                                                variant={isPositive ? 'default' : 'destructive'}
                                                                className={`text-xs ${isPositive ? 'bg-green-100 text-green-700 border-green-300' : 'bg-red-100 text-red-700 border-red-300'}`}
                                                            >
                                                                {isPositive ? '+' : ''}
                                                                {change.toFixed(2)}
                                                            </Badge>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            {stockData ? (
                                                <div className="space-y-3">
                                                    <p className="text-3xl font-bold text-gray-900">
                                                        ${stockData.price.toFixed(2)}
                                                    </p>
                                                    <p className="text-xs text-gray-500 mb-3">
                                                        Updated: {new Date(stockData.timestamp).toLocaleTimeString()}
                                                    </p>
                                                    <Button
                                                        className="w-full bg-black hover:bg-gray-900 text-white"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleSubscribe(ticker);
                                                        }}
                                                    >
                                                        <TrendingUp className="mr-2 h-4 w-4" />
                                                        Subscribe
                                                    </Button>
                                                </div>
                                            ) : (
                                                <div className="space-y-3">
                                                    <div className="h-12 bg-purple-100 rounded animate-pulse"></div>
                                                    <p className="text-gray-500 text-sm">Loading price...</p>
                                                    <Button
                                                        className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleSubscribe(ticker);
                                                        }}
                                                    >
                                                        <TrendingUp className="mr-2 h-4 w-4" />
                                                        Subscribe
                                                    </Button>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
