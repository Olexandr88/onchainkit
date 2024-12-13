import { ENVIRONMENT, ENVIRONMENT_VARIABLES } from '@/lib/constants';
import { FundSwap, type LifecycleStatus } from '@coinbase/onchainkit/swap';
import type { SwapError } from '@coinbase/onchainkit/swap';
import type { Token } from '@coinbase/onchainkit/token';
import { useCallback, useContext } from 'react';
import type { TransactionReceipt } from 'viem';
import { base } from 'viem/chains';
import { AppContext } from '../AppProvider';

const FALLBACK_DEFAULT_MAX_SLIPPAGE = 3;

const daiToken: Token = {
  name: 'DAI',
  address: '0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb',
  symbol: 'DAI',
  decimals: 18,
  image:
    'https://d3r81g40ycuhqg.cloudfront.net/wallet/wais/92/13/9213e31b84c98a693f4c624580fdbe6e4c1cb550efbba15aa9ea68fd25ffb90c-ZTE1NmNjMGUtZGVkYi00ZDliLWI2N2QtNTY2ZWRjMmYwZmMw',
  chainId: base.id,
};

const degenToken: Token = {
  name: 'DEGEN',
  address: '0x4ed4e862860bed51a9570b96d89af5e1b0efefed',
  symbol: 'DEGEN',
  decimals: 18,
  image:
    'https://d3r81g40ycuhqg.cloudfront.net/wallet/wais/3b/bf/3bbf118b5e6dc2f9e7fc607a6e7526647b4ba8f0bea87125f971446d57b296d2-MDNmNjY0MmEtNGFiZi00N2I0LWIwMTItMDUyMzg2ZDZhMWNm',
  chainId: base.id,
};

// const wethToken: Token = {
//   name: 'Wrapped Ether',
//   address: '0x4200000000000000000000000000000000000006',
//   symbol: 'WETH',
//   decimals: 6,
//   image:
//     'https://d3r81g40ycuhqg.cloudfront.net/wallet/wais/47/bc/47bc3593c2dec7c846b66b7ba5f6fa6bd69ec34f8ebb931f2a43072e5aaac7a8-YmUwNmRjZDUtMjczYy00NDFiLWJhZDUtMzgwNjFmYWM0Njkx',
//   chainId: base.id,
// };

function FundSwapComponent() {
  const { chainId, isSponsored, defaultMaxSlippage } = useContext(AppContext);

  const handleOnStatus = useCallback((lifecycleStatus: LifecycleStatus) => {
    console.log('Status:', lifecycleStatus);
  }, []);

  const handleOnSuccess = useCallback(
    (transactionReceipt: TransactionReceipt) => {
      console.log('Success:', transactionReceipt);
    },
    [],
  );

  const handleOnError = useCallback((swapError: SwapError) => {
    console.log('Error:', swapError);
  }, []);

  return (
    <div className="relative flex h-full w-full flex-col items-center">
      {chainId !== base.id ? (
        <div className="absolute top-0 left-0 z-10 flex h-full w-full flex-col justify-center rounded-xl bg-[#000000] bg-opacity-50 text-center">
          <div className="mx-auto w-2/3 rounded-md bg-muted p-6 text-sm">
            Swap Demo is only available on Base.
            <br />
            You're connected to a different network. Switch to Base to continue
            using the app.
          </div>
        </div>
      ) : (
        <></>
      )}

      {ENVIRONMENT_VARIABLES[ENVIRONMENT.ENVIRONMENT] === 'production' &&
      chainId === base.id ? (
        <div className="mb-5 italic">
          Note: Swap is disabled on production. To test, run the app locally.
        </div>
      ) : null}

      <FundSwap
        className="w-full"
        onStatus={handleOnStatus}
        onSuccess={handleOnSuccess}
        onError={handleOnError}
        config={{
          maxSlippage: defaultMaxSlippage || FALLBACK_DEFAULT_MAX_SLIPPAGE,
        }}
        // experimental={{
        //   useAggregator: true,
        // }}
        isSponsored={isSponsored}
        toToken={degenToken}
        fromToken={daiToken}
      />
    </div>
  );
}

export default function FundSwapDemo() {
  return (
    <div className="mx-auto">
      <FundSwapComponent />
    </div>
  );
}