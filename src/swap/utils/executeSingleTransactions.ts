import type { TransactionReceipt } from 'viem';
import { waitForTransactionReceipt } from 'wagmi/actions';
import type { ExecuteSingleTransactionsParams } from '../types';

export async function executeSingleTransactions({
  config,
  sendTransactionAsync,
  transactions,
  updateLifecycleStatus,
}: ExecuteSingleTransactionsParams) {
  let transactionReceipt: TransactionReceipt | undefined;

  // Execute the non-batched transactions sequentially
  for (let i = 0; i < transactions.length; i++) {
    const tx = transactions[i];
    updateLifecycleStatus({
      statusName: 'transactionPending',
    });
    const txHash = await sendTransactionAsync(tx);
    transactionReceipt = await waitForTransactionReceipt(config, {
      hash: txHash,
      confirmations: 1,
    });

    if (transactions.length === 3) {
      if (i === transactions.length - 3) {
        updateLifecycleStatus({
          statusName: 'transactionApproved',
          statusData: {
            transactionHash: txHash,
            transactionType: 'Permit2',
          },
        });
      }
    }
    if (i === transactions.length - 2) {
      updateLifecycleStatus({
        statusName: 'transactionApproved',
        statusData: {
          transactionHash: txHash,
          transactionType: 'ERC20',
        },
      });
    }
  }

  // For non-batched transactions, emit the last transaction receipt
  if (transactionReceipt) {
    updateLifecycleStatus({
      statusName: 'success',
      statusData: {
        transactionReceipt,
      },
    });
  }
}