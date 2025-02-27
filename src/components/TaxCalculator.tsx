import React, { useState, useEffect } from 'react';
import { SSNIT_RATE, monthlyTaxRates } from '../lib/rates';
import { calculateIncomeTax } from '../lib/core';
import { FaFacebook, FaTwitter, FaEnvelope } from "react-icons/fa";


const TaxCalculator: React.FC = () => {
  const [basicIncome, setBasicIncome] = useState<number>(0);
  const [allowances, setAllowances] = useState<number>(0);
  const [taxRelief, setTaxRelief] = useState<number>(0);
  const [netIncome, setNetIncome] = useState<number>(0);
  const [incomeTax, setIncomeTax] = useState<number>(0);
  const [ssnit, setSsnit] = useState<number>(0);
  const [showBreakdown, setShowBreakdown] = useState<boolean>(false);

  useEffect(() => {
    // Calculate SSNIT (5.5% of basic income)
    const ssnitAmount = basicIncome * (SSNIT_RATE / 100);
    setSsnit(ssnitAmount);

    // Taxable income
    const taxableIncome = basicIncome + allowances - ssnitAmount - taxRelief;
    
    // Calculate income tax based on Ghana tax brackets
    const calculatedTax = taxableIncome > 0 ? calculateIncomeTax(taxableIncome) : 0;
    setIncomeTax(calculatedTax);
    
    // Calculate net income
    setNetIncome(basicIncome + allowances - ssnitAmount - calculatedTax);
  }, [basicIncome, allowances, taxRelief]);

  const formatCurrency = (amount: number): string => {
    return amount.toFixed(2);
  };

  // Generate tax breakdown details for display
  

  return (
    <div className="flex flex-col items-center w-full max-w-lg mx-auto">
      <div className="bg-orange-500 text-white p-3 w-full text-center mb-4">
        Updated with {" "}
        <a
            href="https://gra.gov.gh/domestic-tax/tax-types/paye/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold underline">
            Jan. 2024
        </a>{" "} tax rates !
      </div>
      
      <div className="border border-gray-200 rounded p-6 w-full">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-4">Tax Calculator GH</h1>
        
        <p className="text-center mb-6">
          Compute your <span className="font-bold">net income</span>, PAYE <span className="font-bold">income tax</span> and <span className="font-bold">SSNIT deductions</span>.
        </p>
        
        <div className="mb-4">
          <label className="block text-green-700 mb-2">Monthly basic income</label>
          <div className="flex items-center border rounded">
            <span className="pl-2 text-gray-500">GH₵</span>
            <input
              type="number"
              className="w-full p-2 outline-none"
              value={basicIncome || ''}
              onChange={(e) => setBasicIncome(Number(e.target.value))}
            />
          </div>
        </div>
        
        <div className="mb-4">
          <label className="block text-green-700 mb-2">Monthly allowances*</label>
          <div className="flex items-center border rounded">
            <span className="pl-2 text-gray-500">GH₵</span>
            <input
              type="number"
              className="w-full p-2 outline-none"
              value={allowances || ''}
              onChange={(e) => setAllowances(Number(e.target.value))}
            />
          </div>
        </div>
        
        <div className="mb-6">
          <label className="block text-green-700 mb-2">Tax relief</label>
          <div className="flex items-center border rounded border-blue-500">
            <span className="pl-2 text-gray-500">GH₵</span>
            <input
              type="number"
              className="w-full p-2 outline-none"
              value={taxRelief || ''}
              onChange={(e) => setTaxRelief(Number(e.target.value))}
            />
          </div>
        </div>
        
        <div className="text-center mb-6">
          <p className="text-blue-600 mb-2">Net Income (take home)</p>
          <p className="text-4xl text-blue-600 font-bold">GH₵ {formatCurrency(netIncome)}</p>
        </div>
        
        <div className="flex justify-between mb-6">
          <div className="text-center">
            <p className="text-blue-600 mb-1">Income Tax</p>
            <p className="font-bold text-blue-600">GH₵ {formatCurrency(incomeTax)}</p>
          </div>
          <div className="text-center">
            <p className="text-blue-600 mb-1">SSNIT</p>
            <p className="font-bold text-blue-600">GH₵ {formatCurrency(ssnit)}</p>
          </div>
        </div>
        
        <div className="flex justify-center mb-2">
          <button 
            className="border border-blue-500 text-blue-500 rounded px-4 py-2 hover:bg-blue-50"
            onClick={() => setShowBreakdown(!showBreakdown)}
          >
            {showBreakdown ? 'Hide tax breakdown' : 'Show tax breakdown'}
          </button>
        </div>
        
        {showBreakdown && (
            <div className="border-t border-gray-200 pt-4 mt-4">
                <h3 className="font-bold text-lg mb-3">Tax Breakdown</h3>
                <div className="flex flex-col gap-2">
                <div className="flex justify-between">
                    <span>Taxable Income:</span>
                    <span>GH₵ {formatCurrency(basicIncome + allowances - ssnit - taxRelief)}</span>
                </div>
                <div className="flex justify-between">
                    <span>SSNIT Contribution ({SSNIT_RATE}%):</span>
                    <span>GH₵ {formatCurrency(ssnit)}</span>
                </div>

                <div className="my-3 py-2 border-y border-gray-100">
                    <div className="font-semibold mb-2">Income Tax Calculation:</div>

                    {/* Header row */}
                    <div className="flex text-sm font-medium border-b border-gray-200 pb-1 mb-2">
                    <div className="flex-1">Taxable amount</div>
                    <div className="w-16 text-center">Rate</div>
                    <div className="w-24 text-right">Tax due (GH₵)</div>
                    </div>

                    {/* Data rows */}
                    {monthlyTaxRates.rates.map((rate, index) => {
                    const [percentage, band] = rate;
                    let startAmount = 0;

                    for (let i = 0; i < index; i++) {
                        startAmount += monthlyTaxRates.rates[i][1];
                    }

                    const taxableIncome = basicIncome + allowances - ssnit - taxRelief;
                    if (startAmount >= taxableIncome) return null;

                    const amountInBracket = Math.min(
                        band,
                        Math.max(0, taxableIncome - startAmount)
                    );

                    const taxInBracket = (amountInBracket * percentage) / 100;

                    if (amountInBracket <= 0) return null;

                    return (
                        <div key={index} className="flex text-sm py-1">
                        <div className="flex-1">
                            {index === 0 ? "First" : "Next"} GH₵ {formatCurrency(amountInBracket)}
                        </div>
                        <div className="w-16 text-center">{percentage}%</div>
                        <div className="w-24 text-right">{formatCurrency(taxInBracket)}</div>
                        </div>
                    );
                    })}
                </div>

                <div className="border-t border-gray-200 pt-2 mt-1">
                    <div className="flex justify-between font-medium">
                    <span>Total Income Tax:</span>
                    <span>GH₵ {formatCurrency(incomeTax)}</span>
                    </div>
                    <div className="flex justify-between font-medium mt-1">
                    <span>Total Deductions:</span>
                    <span>GH₵ {formatCurrency(incomeTax + ssnit)}</span>
                    </div>
                </div>
                </div>
            </div>
            )}

        
        <p className="text-sm text-gray-600 mt-4">* Allowances are also taxed</p>
      </div>
      
      <p className="text-sm text-gray-600 mt-4">Last updated: February 1st, 2024</p>
      
      <p className="text-s text-gray-500 mt-8 w-full text-center">
        Disclaimer: We do our best to ensure the accuracy of this tool but we cannot be held responsible for any errors.
      </p>
      <p className="text-xs text-gray-500 mt-8 w-full text-center">
        Send <b>feedback</b> and <b>suggestions</b> to <a
            href="mailto:ankahdonatus@gmail"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold underline">
            ankahdonatus@gmail.com
        </a>{" "}
      </p>
      {/* Share with Others Section */}
      <div className="border-t border-gray-200 pt-4 mt-4">
        <h3 className="font-bold text-lg mb-3 text-center">Share with Others</h3>
        <div className="flex gap-4">
          {/* Facebook Share */}
          <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 transition text-2xl">
                <FaFacebook />
            </a>

            {/* X (Twitter) Share */}
            <a
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=Check%20out%20this%20tax%20breakdown!`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-black hover:text-gray-800 transition text-2xl">
                <FaTwitter />
            </a>

            {/* Email Share */}
            <a
                href={`mailto:?subject=Tax Breakdown&body=Check%20out%20this%20tax%20breakdown%20at%20${encodeURIComponent(window.location.href)}`}
                className="text-gray-600 hover:text-gray-700 transition text-2xl">
                <FaEnvelope />
            </a>
        </div>
      </div>
    </div>
  );
};

export default TaxCalculator;