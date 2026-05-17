"use client"

import React, { useEffect, useState } from "react"
import {
  collection,
  getDocs,
  updateDoc,
  deleteDoc,
  doc
} from "firebase/firestore"
import { db } from "@/firebase/firebase.config"

const AdminContactPage = () => {
  const [messages, setMessages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchMessages = async () => {
    setLoading(true)

    const querySnapshot = await getDocs(collection(db, "contactMessages"))
    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }))

    setMessages(data)
    setLoading(false)
  }

  useEffect(() => {
    fetchMessages()
  }, [])

  // MARK AS READ
  const markAsRead = async (id: string) => {
    await updateDoc(doc(db, "contactMessages", id), {
      read: true
    })

    fetchMessages()
  }

  // DELETE MESSAGE
  const deleteMessage = async (id: string) => {
    const confirmDelete = confirm("Are you sure want to delete this message?")
    if (!confirmDelete) return

    await deleteDoc(doc(db, "contactMessages", id))
    fetchMessages()
  }

  return (
    <div className="max-w-screen-xl mx-auto p-4 md:p-6">
  <h1 className="text-xl md:text-2xl font-semibold mb-6">
    Contact Messages
  </h1>

  {/* LOADING */}
  {loading && <p className="text-gray-500">Loading messages...</p>}

  {/* EMPTY */}
  {!loading && messages.length === 0 && (
    <p className="text-gray-500">No messages found.</p>
  )}

  {/* ✅ DESKTOP TABLE */}
  {!loading && messages.length > 0 && (
    <>
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full border border-gray-200">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-3">Name</th>
              <th>Email</th>
              <th>Subject</th>
              <th>Message</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {messages.map((msg) => (
              <tr key={msg.id} className="border-t">
                <td className="p-3">{msg.name}</td>
                <td>{msg.email}</td>
                <td>{msg.subject}</td>
                <td className="max-w-xs truncate">{msg.message}</td>

                <td>
                  {msg.read ? (
                    <span className="text-green-600 font-semibold">
                      Read
                    </span>
                  ) : (
                    <span className="text-red-500 font-semibold">
                      Unread
                    </span>
                  )}
                </td>

                <td className="flex gap-2 p-2">
                  {!msg.read && (
                    <button
                      onClick={() => markAsRead(msg.id)}
                      className="px-3 py-1 bg-blue-500 text-white rounded-sm"
                    >
                      Read
                    </button>
                  )}

                  <button
                    onClick={() => deleteMessage(msg.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded-sm"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 📱 MOBILE CARD */}
      <div className="md:hidden space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className="border border-gray-200 rounded-md p-4 shadow-sm"
          >
            <div className="mb-2">
              <p className="font-semibold">{msg.name}</p>
              <p className="text-sm text-gray-500">{msg.email}</p>
            </div>

            <p className="text-sm font-medium mb-1">
              {msg.subject}
            </p>

            <p className="text-sm text-gray-600 mb-3">
              {msg.message}
            </p>

            <div className="flex justify-between items-center">
              <span
                className={`text-sm font-semibold ${
                  msg.read ? "text-green-600" : "text-red-500"
                }`}
              >
                {msg.read ? "Read" : "Unread"}
              </span>

              <div className="flex gap-2">
                {!msg.read && (
                  <button
                    onClick={() => markAsRead(msg.id)}
                    className="px-3 py-1 text-xs bg-blue-500 text-white rounded-sm"
                  >
                    Read
                  </button>
                )}

                <button
                  onClick={() => deleteMessage(msg.id)}
                  className="px-3 py-1 text-xs bg-red-500 text-white rounded-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  )}
</div>
  )
}

export default AdminContactPage