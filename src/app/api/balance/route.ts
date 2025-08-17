import { NextRequest, NextResponse } from 'next/server';

const RPC_URLS: Record<string, string> = {
  'sepolia': 'https://sepolia.drpc.org',
  'bsc-testnet': 'https://bsc-testnet.drpc.org',
};

export async function POST(request: NextRequest) {
  const { address, networkId } = await request.json();

  if (!address || !networkId || !RPC_URLS[networkId]) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  try {
    const response = await fetch(RPC_URLS[networkId], {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'eth_getBalance',
        params: [address, 'latest'],
        id: 1,
      }),
    });

    const data = await response.json();
    
    if (!response.ok || data.error) {
      return NextResponse.json({ error: 'RPC failed' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      balance: data.result || '0x0',
    });
  } catch {
    return NextResponse.json({ error: 'Request failed' }, { status: 500 });
  }
}