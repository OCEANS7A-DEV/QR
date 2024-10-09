import React, { useRef, useEffect, useState } from 'react';
import Webcam from 'react-webcam';
import jsQR from 'jsqr';

const QR = () => {
  const webcamRef = useRef<Webcam>(null);
  const [data, setData] = useState<string | null>(null);
  const videoConstraints = {
    facingMode: { exact: 'environment' },
  };
  useEffect(() => {
    const interval = setInterval(() => {
      if (webcamRef.current) {
        const imageSrc = webcamRef.current.getScreenshot();
        if (imageSrc) {
          const image = new Image();
          image.src = imageSrc;
          image.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = image.width;
            canvas.height = image.height;
            const context = canvas.getContext('2d');
            if (context) {
              context.drawImage(image, 0, 0, image.width, image.height);
              const imageData = context.getImageData(0, 0, image.width, image.height);
              const code = jsQR(imageData.data, imageData.width, imageData.height);
              if (code) {
                setData(code.data);
                clearInterval(interval);
              }
            }
          };
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/png"
        width={500}
        videoConstraints={videoConstraints}
      />
      <div>
        {data ? (
          <p>QRコードを読み取りました: {data}</p>
        ) : (
          <p>QRコードをスキャンしてください...</p>
        )}
      </div>
      <button type="button" onClick={() => window.close()}>閉じる</button>
    </div>
  );
};
export default QR;
