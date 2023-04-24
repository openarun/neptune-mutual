"use client";
import Button from "@/components/elements/Button";
import Modal from "@/components/elements/Modal/Modal";
import type { MetaMask } from '@web3-react/metamask'
import { hooks, metaMask } from "../../../lib/connectors/metaMask";
import { useEffect, useState } from "react";
import type { BigNumber } from '@ethersproject/bignumber'
import { formatEther } from '@ethersproject/units'


type WalletDetailsProps = {
    isOpen: boolean;
    onClose: () => void;
}
const { useChainId, useAccounts, useIsActivating, useIsActive, useProvider } = hooks


const connector = metaMask as MetaMask;
const WalletDetails = ({ isOpen, onClose }: WalletDetailsProps) => {
    const [balances, setBalances] = useState<BigNumber[]>();
    const [errorMsg, setErrorMsg] = useState<Error | undefined>();
    const isActive = useIsActive();
    const provider = useProvider();
    const accounts = useAccounts();
    const chainId = useChainId();
    const isActivating = useIsActivating();


    if (provider && accounts?.length) {
        void Promise.all(accounts.map((account) => provider.getBalance(account))).then((balances) => {
            setBalances(balances);
        })
    }

    const handleConnect = () => {
        connector.activate(chainId).catch(e => {
            setErrorMsg(e);
        });
    }
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="space-y-10">
                <h3 className="text-2xl">Wallet details</h3>
                {isActive && balances &&
                    (
                        <div>
                            <div className="flex gap-4">
                                <p>Address</p>
                                <p>{accounts?.[0]}</p>
                            </div>
                            <div className="flex gap-4">
                                <p>Chain ID</p>
                                <p>{chainId}</p>
                            </div>
                            <div className="flex gap-4">
                                <p>Balance</p>
                                <p>{formatEther(balances.toString())}</p>
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
                                        onClick={handleConnect}>{errorMsg ? "Try Again!" : "Connect"}</Button>
                                </div>
                                <div className="w-1/2">
                                    <Button
                                        variant="secondary"
                                        onClick={onClose}>Cancel</Button>
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