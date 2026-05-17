"use client"

import React, { useState } from 'react'
import { addDoc, collection } from "firebase/firestore"
import { toast } from "react-toastify";
import { db } from "@/firebase/firebase.config"

const ContactForm = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })

  const [errors, setErrors] = useState<any>({})
  const [loading, setLoading] = useState(false)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  const validate = () => {
    let newErrors: any = {}

    Object.entries(form).forEach(([key, value]) => {
      if (!value || value.trim().length < 6) {
        newErrors[key] = `${key} minimal 6 karakter`
      }
    })

    setErrors(newErrors)

    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) return

    try {
      setLoading(true)

   await addDoc(collection(db, "contactMessages"), {
  name: form.name,
  email: form.email,
  subject: form.subject,
  message: form.message,
  read: false, 
  createdAt: new Date()
})

      toast.success("Message sent successfully!")

     
      setForm({
        name: '',
        email: '',
        subject: '',
        message: ''
      })

    } catch (error) {
      console.error(error)
      toast.error("Failed to send message")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='bg-white p-8 rounded-sm shadow-sm'>
      <form onSubmit={handleSubmit}>
        <div className="grid md:grid-cols-2 gap-7 mt-6">

          {/* NAME */}
          <div>
            <input
              type="text"
              name='name'
              value={form.name}
              onChange={handleChange}
              className='bg-gray-50 p-3 border border-gray-200 rounded-sm w-full font-light'
              placeholder='Name*'
            />
            <p className='text-sm text-red-500 mt-2'>
              {errors.name}
            </p>
          </div>

        
          <div>
            <input
              type="email"
              name='email'
              value={form.email}
              onChange={handleChange}
              className='bg-gray-50 p-3 border border-gray-200 rounded-sm w-full font-light'
              placeholder='your@gmail.com'
            />
            <p className='text-sm text-red-500 mt-2'>
              {errors.email}
            </p>
          </div>

       
          <div className='md:col-span-2'>
            <input
              type="text"
              name='subject'
              value={form.subject}
              onChange={handleChange}
              className='bg-gray-50 p-3 border border-gray-200 rounded-sm w-full font-light'
              placeholder='Subject'
            />
            <p className='text-sm text-red-500 mt-2'>
              {errors.subject}
            </p>
          </div>

     
          <div className='md:col-span-2'>
            <textarea
              name='message'
              rows={6}
              value={form.message}
              onChange={handleChange}
              className='bg-gray-50 p-3 border border-gray-200 rounded-sm w-full font-light'
              placeholder='Your Message'
            />
            <p className='text-sm text-red-500 mt-2'>
              {errors.message}
            </p>
          </div>

        </div>

        <button
          type='submit'
          disabled={loading}
          className='px-10 py-4 text-center font-semibold text-white w-full bg-orange-400 rounded-sm hover:bg-orange-500 cursor-pointer mt-6'
        >
          {loading ? "Sending..." : "Send Message"}
        </button>
      </form>
    </div>
  )
}

export default ContactForm;