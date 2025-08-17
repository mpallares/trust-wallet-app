import { NextRequest, NextResponse } from 'next/server';
import { getNetworkById } from '../../../config/networks';

export async function POST(request: NextRequest) {
  try {
    const { address, networkId } = await request.json();

    if (!address || !networkId) {
      return NextResponse.json(
        { error: 'Address and networkId are required' },
        { status: 400 }
      );
    }

    const network = getNetworkById(networkId);
    if (!network) {
      return NextResponse.json(
        { error: `Invalid network ID: ${networkId}` },
        { status: 400 }
      );
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    const rpcResponse = await fetch(network.rpcUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'eth_getBalance',
        params: [address, 'latest'],
        id: Date.now(),
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!rpcResponse.ok) {
      throw new Error(`RPC request failed: ${rpcResponse.status}`);
    }

    const rpcData = await rpcResponse.json();

    if (rpcData.error) {
      return NextResponse.json(
        { error: rpcData.error.message || 'RPC error' },
        { status: 500 }
      );
    }

    if (!rpcData.result) {
      return NextResponse.json(
        { error: 'No balance result' },
        { status: 500 }
      );
    }

    // Return the balance
    return NextResponse.json({
      success: true,
      balance: rpcData.result,
      network: network.displayName,
    });

  } catch (error) {
    console.error('Balance API error:', error);
    
    let errorMessage = 'Unknown error';
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        errorMessage = 'Request timeout - RPC endpoint too slow';
      } else {
        errorMessage = error.message;
      }
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}