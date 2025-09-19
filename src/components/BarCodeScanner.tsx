import { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";

interface BarcodeScannerProps {
    onDetected: (isbn: string) => void;
}

export default function BarcodeScanner({ onDetected }: BarcodeScannerProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const codeReaderRef = useRef<BrowserMultiFormatReader | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const codeReader = new BrowserMultiFormatReader();
        codeReaderRef.current = codeReader;

        const startScanner = async () => {
            try {
                const devices = await BrowserMultiFormatReader.listVideoInputDevices();
                if (devices.length === 0) {
                    setError("No camera found");
                    return;
                }

                await codeReader.decodeFromVideoDevice(
                    devices[0].deviceId,
                    videoRef.current!,
                    (result, err) => {
                        if (result) {
                            const isbn = result.getText();
                            onDetected(isbn);

                            // ✅ stop scanning
                            //codeReader.reset();
                            codeReaderRef.current = null;
                        }
                        if (err && !(err.name === "NotFoundException")) {
                            console.warn(err);
                        }
                    }
                );
            } catch (e: Error | unknown) {
                    // setError(e.message || "Camera error");
                console.log(e)
            }
        };

        startScanner();

        return () => {
            //codeReader.reset();
        };
    }, [onDetected]);

    return (
        <div className="flex flex-col items-center">
            <video ref={videoRef} className="w-full max-w-sm border rounded shadow" />
            {error && <p className="text-red-600">{error}</p>}
        </div>
    );
}
