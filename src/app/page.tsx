import CurrencyConverter from '@/components/modules/CurrencyConverter'
import Logo from '../../public/logo.svg'
import Image from 'next/image'
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between bg-[#F9FAFB]">
      <div className="flex flex-col gap-10 h-screen w-full items-center justify-center">
        <Image src={Logo} alt="Neptune Mutual logo" width={340} />
        <CurrencyConverter />
      </div>
    </main>
  )
}
