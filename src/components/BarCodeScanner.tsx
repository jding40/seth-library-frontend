import { useEffect, useRef, useState } from "react";
//https://www.npmjs.com/package/@zxing/browser/v/0.1.5
import { BrowserMultiFormatReader, type IScannerControls } from "@zxing/browser";

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

        let controls: IScannerControls | null = null;

        const startScanner = async () => {
            try {
                const devices = await BrowserMultiFormatReader.listVideoInputDevices();
                if (devices.length === 0) {
                    setError("No camera found");
                    return;
                }

                const selectedDeviceId:string = devices[devices.length -1].deviceId;

                controls = await codeReader.decodeFromVideoDevice(
                    selectedDeviceId,
                    videoRef.current!,
                    (result, err) => {
                        if (result) {
                            const isbn = result.getText();
                            console.log("Detected result:", result);
                            onDetected(isbn);

                            // ✅ stop scanning
                            //codeReader.reset();
                            // codeReaderRef.current = null;
                            controls?.stop()
                        }
                        if (err && !(err.name === "NotFoundException")) {
                            console.warn(err);
                        }
                    }
                );


            } catch (e: unknown) {
                    // setError(e.message || "Camera error");
                console.error("Camera Error: ",e)
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
