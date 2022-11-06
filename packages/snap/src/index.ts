import { OnTransactionHandler } from '@metamask/snap-types';
import { getAlerts } from './forta';

/**
 * Handle an incoming transaction, and return any insights.
 *
 * @param args - The request handler args as object.
 * @param args.transaction - The transaction object.
 * @param args.chainId - The transaction network chain ID.
 * @returns The transaction insights.
 */
export const onTransaction: OnTransactionHandler = async ({
  transaction,
  chainId,
}) => {
  return {
    insights: await getAlerts(transaction, chainId),
  };
};
