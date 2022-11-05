import { defaultSnapOrigin } from '../config';
import { GetSnapsResponse, Snap } from '../types';

/**
 * Get the installed snaps in MetaMask.
 *
 * @returns The snaps installed in MetaMask.
 */
export const getSnaps = async (): Promise<GetSnapsResponse> => {
  return (await window.ethereum.request({
    method: 'wallet_getSnaps',
  })) as unknown as GetSnapsResponse;
};

/**
 * Connect a snap to MetaMask.
 *
 * @param snapId - The ID of the snap.
 * @param params - The params to pass with the snap to connect.
 */
export const connectSnap = async (
  snapId: string = defaultSnapOrigin,
  params: Record<'version' | string, unknown> = {},
) => {
  await window.ethereum.request({
    method: 'wallet_enable',
    params: [
      {
        wallet_snap: {
          [snapId]: {
            ...params,
          },
        },
      },
    ],
  });
};

/**
 * Get the snap from MetaMask.
 *
 * @param version - The version of the snap to install (optional).
 * @returns The snap object returned by the extension.
 */
export const getSnap = async (version?: string): Promise<Snap | undefined> => {
  try {
    const snaps = await getSnaps();

    return Object.values(snaps).find(
      (snap) =>
        snap.id === defaultSnapOrigin && (!version || snap.version === version),
    );
  } catch (e) {
    console.log('Failed to obtain installed snap', e);
    return undefined;
  }
};

/**
 * Invoke the "hello" method from the example snap.
 */

const send = (data: string) => async () => {
  console.log('send', data);
  try {
    // Get the user's account from MetaMask.
    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts',
    });

    console.log('accounts:', accounts);
    const from = (accounts as any)[0];
    console.log('from', from);

    // Send a transaction to MetaMask.
    await window.ethereum.request({
      method: 'eth_sendTransaction',
      params: [
        {
          from,
          to: '0x08A8fDBddc160A7d5b957256b903dCAb1aE512C5',
          value: '0x0',
          data,
        },
      ],
    });
  } catch (err) {
    console.error(err);
    alert('Problem happened: ' + err.message || err);
  }
};

export const sendHello = async () => {
  // Get the user's account from MetaMask.
  const accounts = await window.ethereum.request({
    method: 'eth_requestAccounts',
  });

  const from = (accounts as any)[0];

  // Send a transaction to MetaMask.
  await window.ethereum.request({
    method: 'eth_sendTransaction',
    params: [
      {
        from,
        to: '0x15b7c0c907e4c6b9adaaaabc300c08991d6cea05',
        value: '0x0',
        data: '0x6057361d0000000000000000000000000000000000000000000000000000000000000001',
      },
    ],
  });
};

export const isLocalSnap = (snapId: string) => snapId.startsWith('local:');
