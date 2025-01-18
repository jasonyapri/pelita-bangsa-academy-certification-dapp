import { jsPDF } from 'jspdf';
import './lucidity-expanded.js';
import './montserrat-medium.js';

export const generateCertificates = (fullName: string, certificateId: string) => {
  const img = new Image();
  img.src = '/assets/certificate-template.png';

  img.onload = () => {
    const imgWidth = img.width;
    const imgHeight = img.height;

    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'px',
      format: [imgWidth, imgHeight],
    });

    const currentDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    const verificationLink = `https://certificate.pelitabangsa.co.id/verify/${certificateId}`;

    doc.addImage(img, 'PNG', 0, 0, imgWidth, imgHeight);

    doc.setFont('lucidity-expanded', 'normal');
    doc.setFontSize(90);
    doc.setTextColor('#FFD54F');
    doc.text(fullName, imgWidth * 0.5, imgHeight * 0.46, { align: 'center' });

    doc.setFont('montserrat-medium', 'normal');
    doc.setFontSize(28);
    doc.setTextColor('#000000');
    doc.text(currentDate, imgWidth * 0.93, imgHeight * 0.85, { align: 'right' });
    doc.text(verificationLink, imgWidth * 0.93, imgHeight * 0.93, { align: 'right' });

    const fileName = `${fullName.replace(/\s+/g, '_')}_${certificateId}.pdf`;
    doc.save(fileName);
  };
};
