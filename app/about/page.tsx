import HeaderSection from "@/components/header-section"
import {IoEyeOutline, IoLocateOutline} from "react-icons/io5"
import {Metadata} from "next"
import Image from "next/image"

export const metadata: Metadata = {
        title: "About Us - Hotel Booking",
        description: "Who we are"
}

const AboutPage = () => {
  return (
   <div>
    <HeaderSection title="About Us" subTitle=" Lorem ipsum dolor sit amet."/>
   <div className="max-w-screen-xl mx-auto py-20 px-4">
        <div className="grid md:grid-cols-2 gap-8">
           <Image src="/about-image.jpg" width={650} height={579} alt="About Image"/>
           <div>
            <h1 className="text-5xl font-semibold text-gray-900 mb-4 ">Who We Are </h1>
            <p className="text-gray-700 py-5"> We are a hotel booking platform focused on comfort, convenience, and customer trust. 
            With a wide range of room options from budget-friendly to luxury, we are committed to providing the best stay experience for every guest. 
            Powered by modern systems and responsive service, we ensure the booking process is fast, secure, and hassle-free.</p>
            <ul className="list-item space-y-6 pt-8">
                <li className="flex gap-5">
                    <div className="flex-none mt-1">
                        <IoEyeOutline className="size-7"/>
                    </div>
                    <div className="flex-1">
                        <h4 className="text-lg font-semibold mb-1">Vision :</h4>
                        <p className="text-gray-600">  To become a trusted hotel booking platform that delivers the best stay experience through seamless access, modern technology, and high-quality service.</p>
                    </div>
                </li>
                 <li className="flex gap-5">
                    <div className="flex-none mt-1">
                        <IoLocateOutline className="size-7"/>
                    </div>
                    <div className="flex-1">
                        <h4 className="text-lg font-semibold mb-1">Mission :</h4>
                        <p className="text-gray-600">To provide a fast, secure, and user-friendly hotel booking service while offering a wide range of accommodations at competitive prices to meet every customer’s needs.</p>
                    </div>
                </li>
            </ul>
           </div>
         </div>
   </div>
   </div>
  )
}

export default AboutPage