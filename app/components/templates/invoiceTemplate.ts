import { Company, BankDetails, IssuerInfo, InvoiceData } from "../../types/types";
import { formatUSD, formatInvoiceDate, getTodayFormatted } from "../../utils/formatting";

export interface InvoiceTemplateParams {
  invoiceNumber: string;
  company: Company;
  issuerInfo: IssuerInfo;
  bankDetails: BankDetails;
  invoiceData: InvoiceData;
}

const loadRobotoFont = (): Promise<void> => {
  return new Promise((resolve) => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;600;700&display=swap';
    link.rel = 'stylesheet';
    link.onload = () => resolve();
    link.onerror = () => resolve(); // Continue even if font fails to load
    document.head.appendChild(link);
  });
};

const generateInvoiceElement = ({
  invoiceNumber,
  company,
  issuerInfo,
  bankDetails,
  invoiceData,
}: InvoiceTemplateParams): HTMLDivElement => {
  const today = getTodayFormatted();
  const startDateFormatted = formatInvoiceDate(invoiceData.startDate);
  const endDateFormatted = formatInvoiceDate(invoiceData.endDate);
  const formattedAmount = formatUSD(invoiceData.amount);

  const container = document.createElement("div");
  container.style.cssText = `
    font-family: 'Roboto', sans-serif;
    padding: 60px;
    font-size: 14px;
    line-height: 1.6;
    color: #1a1a1a;
    background: white;
    width: 210mm;
    min-height: 297mm;
    box-sizing: border-box;
  `;

  container.innerHTML = `
    <div style="margin-bottom: 40px;">
      <div style="font-size: 24px; font-weight: bold; margin-bottom: 8px; color: #000;">${issuerInfo.name}</div>
      <div style="color: #444; white-space: pre-line;">${issuerInfo.address}</div>
    </div>
    <div style="margin-bottom: 40px;">
      <div style="display: flex; margin-bottom: 8px;"><span style="font-weight: 600; min-width: 120px; color: #000;">Note to:</span><span style="color: #333;">${company.name}</span></div>
      <div style="display: flex; margin-bottom: 8px;"><span style="font-weight: 600; min-width: 120px; color: #000;">Address:</span><span style="color: #333;">${company.address}</span></div>
      <div style="display: flex; margin-bottom: 8px;"><span style="font-weight: 600; min-width: 120px; color: #000;">Invoice No:</span><span style="color: #333;">${invoiceNumber}</span></div>
      <div style="display: flex; margin-bottom: 8px;"><span style="font-weight: 600; min-width: 120px; color: #000;">Date:</span><span style="color: #333;">${today}</span></div>
    </div>
    <div style="margin: 40px 0; border-top: 2px solid #000; border-bottom: 2px solid #000; padding: 20px 0;">
      <div style="display: flex; justify-content: space-between; align-items: flex-start;">
        <div style="flex: 1; padding-right: 20px;">
          <div style="font-weight: 600; font-size: 16px; color: #000; margin-bottom: 8px;">Purpose</div>
          <div style="color: #333;">Payment for ${invoiceData.purpose} provided from ${startDateFormatted} - ${endDateFormatted}</div>
        </div>
        <div style="text-align: right; min-width: 200px;">
          <div style="font-weight: 600; font-size: 16px; color: #000; margin-bottom: 8px;">TOTAL</div>
          <div style="font-size: 20px; font-weight: bold; color: #000;">USD $${formattedAmount}</div>
        </div>
      </div>
    </div>
    <div style="margin-top: 30px; font-style: italic; color: #666;">Make all checks payable to ${issuerInfo.name}.</div>
    <div style="margin-top: 40px; padding: 20px; background: #f9f9f9; border-radius: 4px;">
      <div style="font-weight: 600; font-size: 16px; margin-bottom: 12px; color: #000;">Payment Details</div>
      <div style="margin-bottom: 6px; display: flex;"><span style="font-weight: 500; min-width: 140px; color: #000;">Account Number:</span><span style="color: #333;">${bankDetails.accountNumber}</span></div>
      <div style="margin-bottom: 6px; display: flex;"><span style="font-weight: 500; min-width: 140px; color: #000;">Bank:</span><span style="color: #333;">${bankDetails.bankName}</span></div>
      <div style="margin-bottom: 6px; display: flex;"><span style="font-weight: 500; min-width: 140px; color: #000;">Swift Code:</span><span style="color: #333;">${bankDetails.swiftCode}</span></div>
      <div style="margin-bottom: 6px; display: flex;"><span style="font-weight: 500; min-width: 140px; color: #000;">Branch:</span><span style="color: #333;">${bankDetails.branch}</span></div>
      <div style="margin-bottom: 6px; display: flex;"><span style="font-weight: 500; min-width: 140px; color: #000;">Account Name:</span><span style="color: #333;">${bankDetails.accountName}</span></div>
    </div>
  `;

  return container;
};

const generatePDFFilename = (issuerName: string, invoiceNumber: string, endDate: string): string => {
  // Clean up name but keep spaces
  const formattedName = issuerName.trim().replace(/\s+/g, ' ').replace(/[^a-zA-Z\s]/g, '');

  // Parse the end date to get month and year
  const date = new Date(endDate);
  const month = date.toLocaleString('en-US', { month: 'long' });
  const year = date.getFullYear();

  return `${formattedName}_${invoiceNumber}_${month}_${year}.pdf`;
};

export const downloadInvoicePDF = async (
  params: InvoiceTemplateParams,
): Promise<void> => {
  // Load Roboto font
  await loadRobotoFont();

  const element = generateInvoiceElement(params);

  // Position element on screen but hidden behind everything
  element.style.position = "fixed";
  element.style.left = "0";
  element.style.top = "0";
  element.style.zIndex = "-9999";
  element.style.opacity = "1";
  document.body.appendChild(element);

  // Wait for fonts and styles to load
  await new Promise(resolve => setTimeout(resolve, 200));

  try {
    const html2canvas = (await import("html2canvas")).default;
    const { jsPDF } = await import("jspdf");

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff",
    });

    const imgData = canvas.toDataURL("image/jpeg", 0.98);
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeight);

    const filename = generatePDFFilename(
      params.issuerInfo.name,
      params.invoiceNumber,
      params.invoiceData.endDate
    );
    pdf.save(filename);
  } finally {
    document.body.removeChild(element);
  }
};
