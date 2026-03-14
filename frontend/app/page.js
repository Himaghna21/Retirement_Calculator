'use client';

import { useEffect, useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { CalculatorWrapper } from '@/components/calculator/CalculatorWrapper';
import { Disclaimer } from '@/components/compliance/Disclaimer';
import { ComplianceBanner } from '@/components/compliance/ComplianceBanner';
import { checkDrupalHealth } from '@/utils/drupalClient';

export default function Home() {
  const [drupalStatus, setDrupalStatus] = useState('checking');

  useEffect(() => {
    const checkHealth = async () => {
      const isHealthy = await checkDrupalHealth();
      setDrupalStatus(isHealthy ? 'healthy' : 'unavailable');
    };

    checkHealth();
  }, []);

  return (
    <>
      <Header />
      
      <PageWrapper 
        mainId="main-content"
        ariaLabel="Retirement Planning Calculator Application"
      >
        {/* Compliance Banner - Always at top */}
        <ComplianceBanner 
          dismissible={false}
          autoHideMobile={false}
        />

        {/* Status Indicator (optional) */}
        {drupalStatus === 'unavailable' && (
          <div style={{
            backgroundColor: '#fff3cd',
            borderLeft: '4px solid #f57c00',
            padding: '12px 16px',
            borderRadius: '4px',
            marginBottom: '16px',
            fontSize: '12px',
            color: '#856404',
          }}>
            Note: Some content is using default values as the content management system is currently unavailable.
          </div>
        )}

        {/* Calculator Form */}
        <CalculatorWrapper />

        {/* Mandatory Disclaimer */}
        <Disclaimer 
          collapsible={true}
          initiallyExpanded={true}
        />
      </PageWrapper>

      <Footer />
    </>
  );
}