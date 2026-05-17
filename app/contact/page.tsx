import {Metadata} from 'next'
import HeaderSection from "@/components/header-section"
import {
    IoMailOutline,
    IoCallOutline,
    IoLocationOutline
} from "react-icons/io5";
import ContactForm from "@/components/contact-form";

export const metadata:Metadata = {
    title: "Contact"
}

const ContactPage = () => {
  return (
    <div>
        <HeaderSection title='Contact Us' subTitle='Have questions before booking? We’re here'/>
        <div className="max-w-screen-xl mx-auto py-20 px-4">
            <div className="grid md:grid-cols-2 gap-8">
                <div>
                    <h1 className='text-lg text-gray-500 mb-3'>Contact Us</h1>
                    <h1 className='text-5xl font-semibold text-gray-900 mb-4'>Get In Touch Today</h1>
                    <p className='text-gray-700 py-5'>We’re ready to assist you with room availability, booking inquiries, and any questions about your stay. Our team will respond as soon as possible to make your experience smooth and hassle-free.</p>
                    <ul className="list-item space-y-6 pt-8">
                    <li className="flex gap-5">
                        <div className="flex-none bg-gray-300 p-3 shadow-sm rounded-sm">
                            <IoMailOutline className="size-7"/>
                        </div>
                        <div className='flex-1'>
                            <h4 className='text-lg font-semibold mb-1'>Email : </h4>
                            <p>email-us@example.com</p>
                        </div>
                    </li>
                    <li className="flex gap-5">
                        <div className="flex-none bg-gray-300 p-3 shadow-sm rounded-sm">
                            <IoCallOutline className="size-7"/>
                        </div>
                        <div className='flex-1'>
                            <h4 className='text-lg font-semibold mb-1'>Phone Number : </h4>
                            <p>+62 856 9219 1992</p>
                        </div>
                    </li>
                    <li className="flex gap-5">
                        <div className="flex-none bg-gray-300 p-3 shadow-sm rounded-sm">
                            <IoLocationOutline className="size-7"/>
                        </div>
                        <div className='flex-1'>
                            <h4 className='text-lg font-semibold mb-1'>Address: </h4>
                            <p>Grand Serenity Hotel, Jl. Sudirman Kav. 88, Jakarta, Indonesia</p>
                        </div>
                    </li>
                    </ul>
                </div>
                {/* Contact form */}
                <ContactForm/>
            </div>
        </div>
    </div>
  )
}

export default ContactPage