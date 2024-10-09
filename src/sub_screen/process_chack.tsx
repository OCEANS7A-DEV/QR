import React, { useEffect, useState } from 'react';
import { ProcessConfirmationGet, OrderDeadline } from '../backend/Server_end.ts';
import '../css/process_check.css';
import DeadLineDialog from './DeadLineDialog.tsx';

function findStore(storeList, targetStore) {
  return storeList.find(item => item.storeName === targetStore);
}

const CurrentDate = () => {
  const today = new Date()
  const year = today.getFullYear()
  const month = ('0' + (today.getMonth() + 1)).slice(-2)
  const day = ('0' + today.getDate()).slice(-2)
  const resultdate = year + '/' + month + '/' + day
  return resultdate
}
const DateNow = CurrentDate();

export default function HQPage() {
  const [checkresult, setCheckResult] = useState([]); // 処理結果を管理する状態
  const [isDialogOpen, setDialogOpen] = useState(false);
  const message = `今回の店舗からの注文を${DateNow}で締め切りますか？`;

  const PrintProcessList = async () => {
    const result = await ProcessConfirmationGet();
    console.log(result)
    const storeList = JSON.parse(localStorage.getItem('storeData'));
    const processData = [];
    const storeProcessMap = {}; // 店舗ごとのプロセスを蓄積するオブジェクト
    result.forEach(item => {
      const store = item[1]; // 店舗名（2列目）
      const process = item[10]; // 11列目の値
      if (!storeProcessMap[store]) {
        storeProcessMap[store] = []; // 初めての店舗なら初期化
      }
      storeProcessMap[store].push(process); // 店舗にプロセスを追加
    });
    for (let store in storeProcessMap) {
      processData.push({ storeName: store, process: storeProcessMap[store] });
    }
    const checkresult = [];
    for (let i = 0; i < storeList.length; i++) {
      var storename = storeList[i];
      var storeData = findStore(processData, storeList[i]);
      var completedCount = 0;
      var pendingCount = 0;
      if (storeData) {
        var Process = processData[i].process;
        for (let i = 0; i < Process.length; i++) {
          if (Process[i] === 'completed') {
            completedCount += 1;
          }else if (Process[i] === 'pending') {
            pendingCount += 1;
          }
        }
        if (completedCount === 0 && pendingCount >= 1) {
          checkresult.push({ storeName: storename, process: "未印刷"});
        }else if (pendingCount === 0 && completedCount >= 1) {
          checkresult.push({ storeName: storename, process: "印刷済"});
        }else if (completedCount >= 1 && pendingCount >= 1) {
          checkresult.push({ storeName: storename, process: "一部未印刷"});
        }
      } else {
        checkresult.push({ storeName: storename, process: "未注文"});
      }
    }
    setCheckResult(checkresult);
  };
  useEffect(() => {
    PrintProcessList();
  },[])

  const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  const handleConfirm = () => {
    OrderDeadline();
    alert('確認が完了しました');
    setDialogOpen(false);
  };

  const handleCancel = () => {
    alert('キャンセルされました');
    setDialogOpen(false);
  };



  return (
    <div className='check_window'>
      <div className="check_area">
        <div>
          <button type="button" onClick={PrintProcessList}>確認と更新</button>
        </div>
        {/* テーブルを表示 */}
        <div className="check">
          <table className='check'>
            <thead>
              <tr>
                <th>店舗名</th>
                <th>処理状況</th>
              </tr>
            </thead>
            <tbody>
              {checkresult.map((row, index) => (
                <tr key={index}>
                  <td className='PCstoreName'>{row.storeName}</td>
                  <td className='PCprocess'>{row.process}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className='operation_area'>
        <a className="buttonUnderline" type="button" onClick={handleOpenDialog}>
          発注区切
        </a>
        <DeadLineDialog
          title="確認"
          message={message}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
          isOpen={isDialogOpen}
        />
      </div>
    </div>
  );
}
