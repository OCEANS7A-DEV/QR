
import '../css/a_button.css';
import '../css/banner.css';
import React, { useRef, useEffect, useState } from 'react';

interface SettingProps {
  setCurrentPage: (page: string) => void;
}

export default function TopBanner({ setCurrentPage }: SettingProps) {
  const clickpage = (pageName: string) => {
    setCurrentPage(pageName);
  };
  const [scannedData, setscannedData] = useState<string>('');

  const handleQRClick = () => {
    // QR読み取りページを新しいタブで開く
    window.open(
      'https://script.google.com/macros/s/AKfycbwA4v7uWv585N8p3sUifQI1bKnLTSLQg79raDAVDgr1UEeAtgBdHQ7VxbCljONBwXTk2Q/exec',
      'QRReaderWindow',
      'width=800,height=600'
    );
  };

  // データを受信するためのメッセージイベントのリスナーを設定
  React.useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // 外部サイトからのデータを受信
      if (event.origin === 'https://script.google.com') {
        const scannedData = event.data;
        console.log('取得したデータ:', scannedData);
        setscannedData(scannedData);
        // 必要な処理をここで実行
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  return (
    <div>
      <div className='banner-area'>
        <a className="buttonUnderline" id="main_back" type="button" onClick={() => clickpage('ReceivingPage')}>
          入庫処理
        </a>
        <a className="buttonUnderline" id="main_back" type="button" onClick={() => clickpage('HQPage')}>
          納品書作成
        </a>
        {/* <a className="buttonUnderline" id="main_back" type="button" onClick={handleQRClick}>
          QR
        </a> */}
        <div>{scannedData}</div>
      </div>
    </div>
  );
}
