import { useEffect, useRef, useState } from "react";
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
    const [isScanning, setIsScanning] = useState(false);

    const controlsRef = useRef<IScannerControls | null>(null);

    const switchCamera = () => {
        setCameraIndex((prev) => (prev + 1) % cameraQty);
    };

    useEffect(() => {
        codeReaderRef.current = new BrowserMultiFormatReader();
        return () => {
            controlsRef.current?.stop();
        };
    }, []);

    useEffect(() => {
        const startScanner = async () => {
            try {
                const devices = await BrowserMultiFormatReader.listVideoInputDevices();
                if (devices.length === 0) {
                    setError("No camera found");
                    return;
                }
                setCameraQty(devices.length);

                const selectedDeviceId = devices[cameraIndex].deviceId;

                controlsRef.current = await codeReaderRef.current!.decodeFromVideoDevice(
                    selectedDeviceId,
                    videoRef.current!,
                    (result, err) => {
                        if (result) {
                            const isbn = result.getText();
                            console.log("Detected result:", result);
                            onDetected(isbn);

                            // 停止扫描（只扫一次）
                            setIsScanning(false);
                        }
                        if (err && !(err.name === "NotFoundException")) {
                            console.warn(err);
                        }
                    }
                );
            } catch (e) {
                console.error("Camera Error: ", e);
                setError("Camera error");
            }
        };

        if (isScanning) {
            startScanner();
        } else {
            controlsRef.current?.stop();
        }

        return () => {
            controlsRef.current?.stop();
        };
    }, [isScanning, cameraIndex, onDetected]);

    return (
        <div className="flex flex-col items-center relative">
            <video ref={videoRef} className="w-full max-w-sm border rounded shadow" />
            {error && <p className="text-red-600">{error}</p>}

            {/* switch camera */}
            {cameraQty > 1 && isScanning && (
                <span
                    className="text-gray-600 absolute bottom-5 right-5 cursor-pointer"
                    onClick={switchCamera}
                >
                    🔄
                </span>
            )}

            {/* start/stop scanning*/}
            <div
                onClick={() => setIsScanning((prev) => !prev)}
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer text-4xl"
            >
                {!isScanning ? "▶️" : "⏹️"}
            </div>
        </div>
    );
}
