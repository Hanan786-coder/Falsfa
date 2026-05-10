import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import { Loader2, Printer, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export default function FeeVoucher() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [voucher, setVoucher] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVoucher = async () => {
      try {
        const res = await api.get(`/fees/${id}`); 
        if (res.data.success) {
          setVoucher(res.data.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchVoucher();
  }, [id]);

  if (loading) return <div className="flex justify-center items-center h-screen"><Loader2 className="animate-spin text-primary h-12 w-12" /></div>;
  if (!voucher) return <div className="flex flex-col items-center justify-center h-screen space-y-4">
    <h1 className="text-2xl font-bold text-red-500">Voucher Not Found</h1>
    <Button onClick={() => navigate('/finance')}>Back to Finance</Button>
  </div>;

  const VoucherCopy = ({ title }) => (
    <div className="border-2 border-dashed border-gray-400 p-6 mb-8 bg-white text-black font-serif relative overflow-hidden break-inside-avoid">
      <div className="absolute top-0 right-0 bg-gray-100 px-4 py-1 text-[10px] font-bold uppercase tracking-widest border-b border-l border-gray-400">
        {title}
      </div>
      
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          {voucher.school?.logo ? (
            <img src={voucher.school.logo} alt="Logo" className="w-16 h-16 object-contain" />
          ) : (
            <div className="w-12 h-12 bg-black flex items-center justify-center rounded text-white font-bold text-xl">
              {voucher.school?.name?.charAt(0) || 'S'}
            </div>
          )}
          <div>
            <h1 className="text-2xl font-black uppercase tracking-tighter">{voucher.school?.name || 'School Fee Voucher'}</h1>
            <p className="text-[10px] text-gray-500 font-sans uppercase tracking-widest">Official Fee Receipt</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm font-bold">Voucher No: <span className="text-primary">{voucher._id.slice(-8).toUpperCase()}</span></p>
          <p className="text-[10px] text-gray-500 uppercase tracking-wider">Issued: {new Date(voucher.createdAt).toLocaleDateString()}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8 mb-6 border-y border-gray-200 py-4 bg-gray-50/50 px-2">
        <div className="space-y-1">
          <p className="text-[10px] uppercase text-gray-400 font-sans font-bold">Student Details</p>
          <p className="text-lg font-bold text-gray-900">{voucher.studentName}</p>
          <div className="flex gap-4 text-xs">
            <p>Roll: <span className="font-bold">{(voucher.student?.rollNo || 'N/A').toUpperCase()}</span></p>
            <p>Class: <span className="font-bold">{voucher.class} {voucher.section ? `- ${voucher.section}` : ''}</span></p>
          </div>
        </div>
        <div className="space-y-1 text-right">
          <p className="text-[10px] uppercase text-gray-400 font-sans font-bold">Fee Period</p>
          <p className="text-lg font-bold text-gray-900">{voucher.month}</p>
          <div className="flex flex-col items-end text-xs">
            <p>Year: <span className="font-bold">{voucher.academicYear}</span></p>
            <p className="text-red-600 font-bold">Due Date: {new Date(voucher.dueDate).toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      <table className="w-full mb-6 text-sm">
        <thead>
          <tr className="border-b-2 border-black">
            <th className="text-left py-2 uppercase text-[10px] tracking-wider">Description</th>
            <th className="text-right py-2 uppercase text-[10px] tracking-wider">Amount (PKR)</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          <tr><td className="py-2">Tuition Fee</td><td className="text-right py-2">{(voucher.tuitionFee || 0).toLocaleString()}</td></tr>
          <tr><td className="py-2">Examination Fee</td><td className="text-right py-2">{(voucher.examFee || 0).toLocaleString()}</td></tr>
          <tr><td className="py-2">Library Fee</td><td className="text-right py-2">{(voucher.libraryFee || 0).toLocaleString()}</td></tr>
          <tr><td className="py-2">Miscellaneous Fee</td><td className="text-right py-2">{(voucher.miscFee || 0).toLocaleString()}</td></tr>
        </tbody>
        <tfoot>
          <tr className="border-t-2 border-black font-bold">
            <td className="py-2 pt-4">Total Amount</td>
            <td className="text-right py-2 pt-4">{(voucher.totalAmount || 0).toLocaleString()}</td>
          </tr>
          {voucher.discount > 0 && (
            <tr className="text-emerald-600 italic text-xs">
              <td className="py-1">Discount {voucher.discountReason && `(${voucher.discountReason})`}</td>
              <td className="text-right py-1">-{voucher.discount.toLocaleString()}</td>
            </tr>
          )}
          <tr className="bg-gray-900 text-white font-black text-lg">
            <td className="py-3 px-3 rounded-l">Net Payable</td>
            <td className="text-right py-3 px-3 rounded-r">{formatCurrency(voucher.netAmount)}</td>
          </tr>
        </tfoot>
      </table>

      <div className="grid grid-cols-3 gap-8 mt-12 pt-8">
        <div className="border-t border-gray-300 text-center text-[10px] pt-1 uppercase tracking-widest text-gray-500">Cashier Signature</div>
        <div className="border-t border-gray-300 text-center text-[10px] pt-1 uppercase tracking-widest text-gray-500">Parent/Guardian</div>
        <div className="border-t border-gray-300 text-center text-[10px] pt-1 uppercase tracking-widest text-gray-500">Principal / Stamp</div>
      </div>
      
      <div className="mt-8 pt-4 border-t border-gray-100 flex justify-between items-center text-[8px] text-gray-400 italic">
        <span>* Please pay before the due date to avoid late fees.</span>
        <span>Computer Generated Voucher | {voucher.school?.name}</span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8 print:bg-white print:p-0">
      <div className="max-w-4xl mx-auto space-y-0 print:max-w-full">
        <div className="flex justify-between items-center mb-8 print:hidden">
          <Button variant="ghost" onClick={() => navigate('/finance')} className="gap-2">
            <ChevronLeft className="h-4 w-4" /> Back to Finance
          </Button>
          <Button onClick={() => window.print()} className="gap-2 shadow-lg">
            <Printer className="h-4 w-4" /> Print Voucher
          </Button>
        </div>
        <VoucherCopy title="Bank Copy" />
        <div className="my-12 border-b-2 border-dashed border-gray-300 print:block hidden"></div>
        <VoucherCopy title="School Copy" />
        <div className="my-12 border-b-2 border-dashed border-gray-300 print:block hidden"></div>
        <VoucherCopy title="Student Copy" />
      </div>
    </div>
  );
}
