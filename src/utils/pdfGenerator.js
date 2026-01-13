import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { uploadPDFToStorage, isFirebaseConfigured } from '../firebase';

export async function generatePDF(elementId, filename = 'recomendacion-fuxion.pdf') {
    const element = document.getElementById(elementId);
    if (!element) {
        console.error('Element not found:', elementId);
        return null;
    }

    const a4Width = 210;
    const a4Height = 297;
    const margin = 10;
    const contentWidth = a4Width - (margin * 2);

    try {
        const originalWidth = element.style.width;
        element.style.width = '595px';

        const canvas = await html2canvas(element, {
            scale: 2,
            useCORS: true,
            allowTaint: true,
            backgroundColor: '#ffffff',
            logging: false,
            windowWidth: 595
        });

        element.style.width = originalWidth;

        const imgData = canvas.toDataURL('image/png');
        const imgWidth = contentWidth;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        const pageContentHeight = a4Height - (margin * 2);

        const pdf = new jsPDF('p', 'mm', 'a4');
        let heightLeft = imgHeight;
        let position = margin;

        pdf.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight);
        heightLeft -= pageContentHeight;

        while (heightLeft > 0) {
            pdf.addPage();
            position = margin - (imgHeight - heightLeft);
            pdf.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight);
            heightLeft -= pageContentHeight;
        }

        const pdfBlob = pdf.output('blob');
        const pdfFile = new File([pdfBlob], filename, { type: 'application/pdf' });

        return pdfFile;
    } catch (error) {
        console.error('Error generating PDF:', error);
        return null;
    }
}

export function downloadPDF(pdfFile) {
    const url = URL.createObjectURL(pdfFile);
    const link = document.createElement('a');
    link.href = url;
    link.download = pdfFile.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

// Shorten URL using TinyURL (free API)
async function shortenUrl(longUrl) {
    try {
        const response = await fetch(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(longUrl)}`);
        if (response.ok) {
            const shortUrl = await response.text();
            if (shortUrl.startsWith('https://tinyurl.com/')) {
                return shortUrl;
            }
        }
    } catch (error) {
        console.warn('URL shortening failed:', error);
    }
    return longUrl;
}

// Upload PDF to Firebase Storage and get short URL
export async function uploadPDFAndGetLink(pdfFile, clientName) {
    if (!isFirebaseConfigured()) {
        throw new Error('Firebase no está configurado');
    }

    const downloadURL = await uploadPDFToStorage(pdfFile, clientName);
    const shortUrl = await shortenUrl(downloadURL);
    return shortUrl;
}

// Share PDF via WhatsApp with short link (same format as text message)
export async function sharePDFViaWhatsApp(pdfFile, clientName, clientPhone, advisorProfile) {
    // Upload and get short URL
    const shortUrl = await uploadPDFAndGetLink(pdfFile, clientName);

    // Build WhatsApp message with link (same format as text message but with PDF link)
    let msg = `¡Hola ${clientName}! 👋\n\n`;
    msg += `📋 Te comparto tu recomendación personalizada:\n\n`;
    msg += `👉 ${shortUrl}\n\n`;
    msg += `_(Haz clic en el enlace para ver tu PDF)_\n`;

    if (advisorProfile?.name) {
        msg += `\n✨ Asesorado por: ${advisorProfile.name}`;
        if (advisorProfile.phone) msg += `\n📱 ${advisorProfile.phone}`;
    }

    msg += `\n\n_Powered by REXILIENCIA_`;

    // Open WhatsApp directly (same as text message button)
    const cleanPhone = (clientPhone || '').replace(/[\s\-\(\)\+]/g, '');
    window.location.href = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`;

    return { success: true, url: shortUrl };
}
