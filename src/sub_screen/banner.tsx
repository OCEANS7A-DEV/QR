
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


  return (
    <div>
      <div className='banner-area'>
        <a className="buttonUnderline" id="main_back" type="button" onClick={() => clickpage('ReceivingPage')}>
          入庫処理
        </a>
        <a className="buttonUnderline" id="main_back" type="button" onClick={() => clickpage('HQPage')}>
          納品書作成
        </a>
        <a className="buttonUnderline" id="main_back" type="button" onClick={() => clickpage('QRPage')}>
          QR
        </a>
        <div>{scannedData}</div>
      </div>
    </div>
  );
}
