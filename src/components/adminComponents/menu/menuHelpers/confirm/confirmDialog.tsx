'use client'
import React from 'react'

interface ConfirmDialogProps {
  isOpen: boolean
  title?: string
  message: string
  onConfirm: () => void
  onCancel: () => void
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({ isOpen, title, message, onConfirm, onCancel }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
      <div className="bg-white rounded-xl p-6 shadow-lg max-w-sm w-full pointer-events-auto">
        {title && <h2 className="text-xl font-semibold mb-4">{title}</h2>}
        <p className="mb-6">{message}</p>
        <div className="flex justify-end space-x-4">
          <button onClick={onCancel} className="px-4 py-2 text-default-800 border-default-800 border-2 rounded hover:bg-default-600 hover:text-white transition cursor-pointer">
            Cancel
          </button>
          <button onClick={onConfirm} className="px-4 py-2 bg-default-800 text-white rounded hover:bg-default-700 transition cursor-pointer">
            Confirm
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmDialog
