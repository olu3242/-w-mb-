'use client'

import { QRCodeSVG } from 'qrcode.react'

type QRCodeProps = {
  value: string
  size?: number
  className?: string
}

export function QRCode({ value, size = 160, className }: QRCodeProps) {
  return (
    <div className={className}>
      <QRCodeSVG
        value={value}
        size={size}
        bgColor="transparent"
        fgColor="#e8a44a"
        level="M"
      />
    </div>
  )
}
