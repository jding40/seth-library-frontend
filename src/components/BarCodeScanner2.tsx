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
        <div className="mb-4">
            <div
                className="flex flex-col items-center relative rounded overflow-hidden
               bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-90 "
                style={{
                    clipPath:
                        "polygon(74.1% 44.1%,100% 61.6%,97.5% 26.9%,85.5% 0.1%,80.7% 2%,72.5% 32.5%,60.2% 62.4%,52.4% 68.1%,47.5% 58.3%,45.2% 34.5%,27.5% 76.7%,0.1% 64.9%,17.9% 100%,27.6% 76.8%,76.1% 97.7%,74.1% 44.1%)",
                }}
            >
                {/* 视频本身 */}
                <video ref={videoRef} className="w-full border rounded shadow" />

                {/* 右下角按钮 */}
                <div className="absolute bottom-5 right-5">
                    {cameraQty > 1 && isScanning && (
                        <span
                            className="cursor-pointer text-4xl"
                            onClick={switchCamera}
                        >
          🔄
        </span>
                    )}
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
