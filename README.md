# Hotel Booking App

A full-stack hotel booking web application built with Next.js, Firebase, Midtrans, Cloudinary, and Resend.

## Features

- User authentication with Firebase Auth
- Admin dashboard
- Room management CRUD
- Image upload with Cloudinary
- Room search, filter, and sorting
- Online reservation system
- Check-in and check-out date selection
- Duplicate booking prevention
- Midtrans payment gateway integration
- Payment status: pending, paid, completed, cancelled
- Booking receipt / invoice
- Print or save receipt as PDF
- Email receipt with Resend
- Responsive UI for mobile and desktop

## Tech Stack

- Next.js
- React.js
- TypeScript
- Tailwind CSS
- Firebase Authentication
- Firebase Firestore
- Cloudinary
- Midtrans Payment Gateway
- Resend Email API
- React Toastify
- React Datepicker

## Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=

NEXT_PUBLIC_MIDTRANS_CLIENT_KEY=
MIDTRANS_SERVER_KEY=
NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION=false

RESEND_API_KEY=

Installation
npm install
npm run dev

Build
npm run build

Author
Aditya Rizky Ramadhan
