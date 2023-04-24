"use client";
import { useEffect, useState } from "react";
import Button from "@/components/elements/Button";
import Modal from "@/components/elements/Modal/Modal";
import { MdOutlineContentCopy } from 'react-icons/md';
import type { MetaMask } from '@web3-react/metamask'
import type { BigNumber } from '@ethersproject/bignumber'
import { formatEther } from '@ethersproject/units'
import { hooks, metaMask } from "@/lib/connectors/metaMask";
import Spinner from "@/components/elements/Spinner";


type WalletDetailsProps = {
    isOpen: boolean;
    onClose: () => void;
}

const { useChainId, useAccounts, useIsActivating, useIsActive, useProvider } = hooks
const connector = metaMask as MetaMask;

const WalletDetails = ({ isOpen, onClose }: WalletDetailsProps) => {
    const [balances, setBalances] = useState<BigNumber[]>();
    const [errorMsg, setErrorMsg] = useState<Error | null>();
    const [showClipboardToolTip, setShowClipboardToolTip] = useState(false);
    const isActive = useIsActive();
    const provider = useProvider();
    const accounts = useAccounts();
    const chainId = useChainId();
    const isActivating = useIsActivating();

    const handleConnect = () => {
        connector.activate(chainId).catch(e => {
            setErrorMsg(e);
        });
    }

    const handleClose = () => {
        onClose();
        setErrorMsg(null);
    }

    const handleCopyToClipboard = () => {
        accounts && navigator.clipboard.writeText(accounts.toString());
        setShowClipboardToolTip(true);

    }

    useEffect(() => {
        if (provider && accounts?.length) {
            void Promise.all(accounts.map((account) => provider.getBalance(account))).then((balances) => {
                setBalances(balances);
            })
        }
    }), [provider, accounts]

    useEffect(() => {
        if (showClipboardToolTip) {
            const timeout = setTimeout(() => {
                setShowClipboardToolTip(false);
            }, 500);

            return () => {
                clearTimeout(timeout);
            };
        }
    }, [showClipboardToolTip]);

    return (
        <Modal isOpen={isOpen} onClose={handleClose} title="Wallet Details">
            <div className="space-y-10">
                {isActive && balances &&
                    (
                        <div className="space-y-6 mx-4">
                            <div className="flex justify-between border-b border-gray-300">
                                <p>Account</p>
                                <div className="flex">
                                    <p className="truncate w-32 text-center inline-block">{accounts?.toString()}</p>
                                    <div className="relative">
                                        <MdOutlineContentCopy onClick={handleCopyToClipboard} className="hover:text-blue-700" />
                                        {showClipboardToolTip &&
                                            <span className="absolute bottom-8 transform -translate-x-1/3 bg-gray-600 text-gray-200 py-1 px-2 rounded text-xs animate-fade-in-out">
                                                Copied
                                            </span>
                                        }
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-between border-b border-gray-300">
                                <p>Chain ID</p>
                                <p>{chainId}</p>
                            </div>
                            <div className="flex justify-between border-b border-gray-300">
                                <p>Balance</p>
                                <p>Ξ {formatEther(balances.toString())}</p>
                            </div>
                        </div>
                    )
                }
                {isActive ?
                    (
                        <div>
                            <Button
                                variant="danger"
                                onClick={() => {
                                    if (connector?.deactivate) {
                                        void connector.deactivate()
                                    } else {
                                        void connector.resetState()
                                    }
                                }}
                            >
                                Disconnect
                            </Button>
                        </div>
                    )
                    :
                    (
                        <div className="space-y-6">
                            <p className="text-gray-600">Wallet not connected. Please click the {"Connect Now"} button below.</p>
                            <div className="w-full flex gap-2">
                                <div className="w-1/2">
                                    <Button
                                        variant="primary"
                                        disabled={isActivating}
                                        onClick={handleConnect}>
                                        {isActivating && <Spinner />} {errorMsg ? "Try Again!" : "Connect Now"}
                                    </Button>
                                </div>
                                <div className="w-1/2">
                                    <Button
                                        variant="secondary"
                                        onClick={handleClose}>
                                        Cancel
                                    </Button>
                                </div>
                            </div>
                            {errorMsg &&
                                <p className="text-red-600">Error: {errorMsg.message}</p>
                            }
                        </div>
                    )
                }
            </div>
        </Modal>
    )

}

export default WalletDetails;