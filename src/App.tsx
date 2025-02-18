import { useEffect, useState } from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import './App.css';
import React, { useRef } from 'react';
import HQPage from './sub_screen/process_chack.tsx';
import ReceivingPage from './sub_screen/Receiving_stock.tsx';
import TopBanner from './sub_screen/banner.tsx';
import { localStorageSet, localStoreSet } from './backend/WebStorage.ts';
import QR from './sub_screen/QR.tsx';


export default function App() {
  const [currentPage, setCurrentPage] = useState('ReceivingPage');
  const nodeRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    localStorageSet();
    localStoreSet();
  },[]);

  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    if (/android|iphone|ipad|ipod/.test(userAgent)) {
      setIsMobile(true);
    }
  }, []);


  const getPageComponent = (page: string) => {

    if (isMobile) {
      switch (page) {
        case 'QRPage':
          return <QR />;
        default:
          return null;
      }
    } else {
      switch (page) {
        case 'ReceivingPage':
          return <ReceivingPage/>
        case 'HQPage':
          return <HQPage/>;
        default:
          return null;
      }
    }
  };

  return (
    <TransitionGroup component={null}>
      <TopBanner setCurrentPage={setCurrentPage}/>
      <CSSTransition
        key={currentPage}
        timeout={{ enter: 500, exit: 300 }}
        classNames="fade"
        nodeRef={nodeRef}
        unmountOnExit
      >
        <div ref={nodeRef} className="page">
          {getPageComponent(currentPage)}
        </div>
      </CSSTransition>
    </TransitionGroup>
  );
}


