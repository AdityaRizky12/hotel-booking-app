import Hero from "@/components/hero" 
import Main from "@/components/main"

export default function Home() {
  return (
   <div>
    <Hero/>
    <div className="mt-16 ">
      <div className="text-center">
          <h1 className="text-4xl font-bold uppercase">ROOMS & RATES</h1>
          <p className="py-3">Discover our selection of comfortable rooms with affordable prices tailored to your needs.</p>
      </div>
      <Main/>
    </div>
   </div>
  );
}
