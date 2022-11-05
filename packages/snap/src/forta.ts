import { FORTA_GRAPHQL_URL } from 'forta-agent/dist/sdk/graphql/forta';
import _ from 'lodash';

/* eslint-enable camelcase */

/**
 * As an example, get transaction insights by looking at the transaction data
 * and attempting to decode it.
 *
 * @param transaction - The transaction to get insights for.
 * @returns The transaction insights.
 */
export const getAlerts = async (
  transaction: Record<string, unknown>,
  chainId: string,
) => {
  try {
    const query = {
      input: {
        first: 3,
        chainId: parseInt(chainId.split(':')[1]),
        addresses: [transaction.to as string],
      },
    };

    const response = await fetch(FORTA_GRAPHQL_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        query:
          'query todaysAlerts($input: AlertsInput) {\n  alerts(input: $input) {alerts {\n      alertId\n      addresses\n      createdAt\n      description\n      hash\n      metadata\n      name\n      protocol\n      scanNodeCount\n      severity\n      findingType\n    }\n  }\n}',
        variables: JSON.stringify(query),
        operationName: 'todaysAlerts',
      }),
    });

    const alerts = (await response.json()).data.alerts.alerts.map((a: any) => {
      return { severity: a.severity, name: a.name };
    });

    return {
      to: transaction.to,
      chain: parseInt(chainId.split(':')[1]),
      alerts:
        alerts && alerts.length > 0
          ? `${alerts.length} alerts found.`
          : 'No alerts found for this address',
    };
  } catch (error) {
    console.error(error);
    return {
      type: 'Unknown transaction',
    };
  }
};
