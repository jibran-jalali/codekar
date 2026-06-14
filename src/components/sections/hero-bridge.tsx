import Image from "next/image";

export default function HeroBridgeSection() {
  return (
    <section className="relative -mt-6 -mb-4 overflow-hidden bg-black py-4 md:py-8">
      <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black to-transparent" />

      <div className="container mx-auto px-4 md:px-8">
        <div className="relative mx-auto max-w-6xl">
          <div className="absolute inset-x-8 top-6 h-24 rounded-full bg-white/[0.03] blur-3xl" />

          <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[#070707] shadow-[0_30px_120px_rgba(0,0,0,0.6)]">
            <div className="relative aspect-[16/10] w-full">
              <Image
                src="/hero-bridge.png"
                alt="CodeKar support dashboard preview"
                fill
                priority
                sizes="(max-width: 768px) 100vw, 1200px"
                className="object-contain object-center p-2 md:p-4"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
