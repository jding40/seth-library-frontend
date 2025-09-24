import { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader, type IScannerControls } from "@zxing/browser";
import "./SlidingDiagonalsBackground.css"

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
        <div className="mb-4">
            <div className="flex flex-col items-center relative overflow-hidden cssContainer rounded-xl">

                {/* background */}
                <div className="bg absolute w-full h-full z-0"></div>
                <div className="bg bg2 absolute w-full h-full z-0"></div>
                <div className="bg bg3 absolute w-full h-full z-0"></div>

                {/* foreground */}
                <video ref={videoRef} className="w-full border shadow rounded-xl relative z-10"/>

                <div className="absolute bottom-5 right-5 z-20">
                    {/* switch camera */}
                    {cameraQty > 1 && isScanning && (
                        <span
                            className="cursor-pointer text-4xl"
                            onClick={switchCamera}
                        >
                    🔄
                </span>
                    )}

                    {/* start/stop scanning */}
                    <span
                        onClick={() => setIsScanning((prev) => !prev)}
                        className="cursor-pointer text-4xl"
                    >
                {!isScanning ? "▶️" : "⏹️"}
            </span>
                </div>
            </div>

            {error && <p className="text-red-600">{error}</p>}
        </div>

    );
}
