import { UserLayout } from '@/components/layout/UserLayout';
import React, { useEffect, useRef, memo } from 'react';

interface TradingViewConfig {
  defaultColumn: string;
  screener_type: string;
  displayCurrency: string;
  colorTheme: string;
  isTransparent: boolean;
  locale: string;
  width: string;
  height: number;
}

const config: TradingViewConfig = {
  defaultColumn: "overview",
  screener_type: "crypto_mkt",
  displayCurrency: "USD",
  colorTheme: "light",
  isTransparent: false,
  locale: "en",
  width: "100%",
  height: 550,
};

function TradingViewWidget() {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!container.current) return;

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-screener.js";
    script.async = true;
    script.innerHTML = JSON.stringify(config);
    script.onerror = () => console.error("Failed to load TradingView script");

    container.current.appendChild(script);

    return () => {
      if (container.current && script.parentNode) {
        container.current.removeChild(script);
      }
    };
  }, []);

  return (
        <UserLayout>
          <div className="tradingview-widget-container" ref={container}>
            <div className="tradingview-widget-container__widget"></div>
            <div className="tradingview-widget-copyright">
              <a 
                href="https://www.tradingview.com/markets/cryptocurrencies/prices-all/" 
                rel="noopener nofollow" 
                target="_blank"
                aria-label="View crypto markets on TradingView"
              >
                <span className="blue-text">Crypto markets</span>
              </a>
              <span className="trademark"> by TradingView</span>
            </div>
          </div>
        </UserLayout>
  );
}

export default memo(TradingViewWidget);