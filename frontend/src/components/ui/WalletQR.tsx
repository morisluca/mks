import { useEffect, useState } from "react";
import QRCode from "qrcode";

export default function WalletQR({ address } : { address: string }) {
  const [qr, setQr] = useState("");

  useEffect(() => {
    QRCode.toDataURL(address).then(setQr);
  }, [address]);

  return qr ? <img src={qr} alt="QR Code" /> : "Generating...";
}