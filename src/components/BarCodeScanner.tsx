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
    const [cameraIndex, setCameraIndex] = useState(0);
    const [cameraQty, setCameraQty] = useState(1);

    const switchCamera = ()=>{
        setCameraIndex((prev) => (prev + 1) % cameraQty);
    }



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
                setCameraQty(devices.length);
                console.log("cameraQty: ", cameraQty);

                const selectedDeviceId:string = devices[cameraIndex].deviceId;


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
    }, [onDetected, cameraIndex]);

    return (
        <div className="flex flex-col items-center relative">
            <video ref={videoRef} className="w-full max-w-sm border rounded shadow" />
            {error && <p className="text-red-600">{error}</p>}
            {cameraQty>1 && <span className="text-gray-600 absolute bottom-5 right-5" onClick={switchCamera}>🔄</span>}
        </div>
    );
}
