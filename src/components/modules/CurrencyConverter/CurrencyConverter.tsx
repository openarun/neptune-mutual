"use client";
import { useEffect, useState } from "react";
import { RiSwapFill } from "react-icons/ri"
import WalletDetails from "../WalletDetails";
import Button from "@/components/elements/Button";

type Currency = {
    name: string;
    rate: number;
};

type Currencies = {
    [key: string]: Currency;
};

const currencyRates: Currencies = {
    NEP: { name: 'Neptune Token', rate: 1.0 },
    BUSD: { name: 'Binance USD', rate: 3.0 },
};

function CurrencyConverter() {

    const [baseCurrency, setBaseCurrency] = useState<string>('NEP');
    const [targetCurrency, setTargetCurrency] = useState<string>('BUSD');
    const [openWalletDetails, setOpenWalletDetails] = useState(false);

    const [baseAmt, setBaseAmt] = useState<number | string>(currencyRates.NEP.rate);
    const [targetAmt, setTargetAmt] = useState<number | string>(currencyRates.BUSD.rate);

    const handleBaseChange = (amount: number) => {
        setBaseAmt(amount);
        const updatedAmt = (amount / currencyRates[baseCurrency].rate) * currencyRates[targetCurrency].rate;
        setTargetAmt(updatedAmt.toFixed(2));
    }
    const handleTargetChange = (amount: number) => {
        setTargetAmt(amount);
        const updatedAmt = (amount / currencyRates[targetCurrency].rate) * currencyRates[baseCurrency].rate;
        setBaseAmt(updatedAmt.toFixed(2));
    }
    const swapCurrency = () => {
        setBaseCurrency(targetCurrency);
        setTargetCurrency(baseCurrency);
    }

    useEffect(() => {
        handleBaseChange(Number(baseAmt));
    }, [baseCurrency])

    return (
        <>
            <div className="space-y-12 bg-white px-12 py-10 rounded-xl shadow-2xl">
                <h2 className="text-3xl font-semibold">Currency Converter</h2>
                <div className="flex flex-col gap-4">
                    <div className="space-y-4">
                        <label htmlFor="basecurrency">{baseCurrency} ({currencyRates[baseCurrency].name})</label>
                        <div className="border-2 border-gray-300 focus-within:border-gray-400 rounded-md p-4">
                            <input type="number" id="basecurrency" className="outline-none" value={baseAmt || ''} onChange={(e) => handleBaseChange(+e.target.value)} />
                        </div>
                    </div>
                    <div className="flex justify-center">
                        <RiSwapFill role="button" aria-label="Swap" size={32} className="text-[#5D5D5E] hover:text-gray-900" onClick={swapCurrency} />
                    </div>
                    <div className="space-y-4">
                        <label htmlFor="targetcurrency">{targetCurrency} ({currencyRates[targetCurrency].name})</label>
                        <div className="border-2 border-gray-300 focus-within:border-gray-400 rounded-md p-4">
                            <input type="number" id="targetcurrency" className="outline-none" value={targetAmt || ''} onChange={(e) => handleTargetChange(+e.target.value)} />
                        </div>
                    </div>
                    <div className="pt-6">
                        <Button onClick={() => setOpenWalletDetails(true)} variant="text">Get Wallet Details</Button>
                    </div>
                </div>
            </div>
            <WalletDetails isOpen={openWalletDetails} onClose={() => setOpenWalletDetails(false)} />
        </>
    )

}


export default CurrencyConverter;