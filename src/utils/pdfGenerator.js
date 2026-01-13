import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export async function generatePDF(elementId, filename = 'recomendacion-fuxion.pdf') {
    const element = document.getElementById(elementId);
    if (!element) {
        console.error('Element not found:', elementId);
        return null;
    }

    // A4 dimensions in mm
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

// Convert File to base64 for API upload
export async function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            // Remove the data:application/pdf;base64, prefix
            const base64 = reader.result.split(',')[1];
            resolve(base64);
        };
        reader.onerror = error => reject(error);
    });
}

// Upload PDF to Firebase Storage and get short URL
export async function uploadPDFAndGetLink(pdfFile, clientName) {
    try {
        const base64Data = await fileToBase64(pdfFile);

        const response = await fetch('/api/upload-pdf', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                pdfBase64: base64Data,
                filename: pdfFile.name,
                clientName: clientName
            }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Error uploading PDF');
        }

        const result = await response.json();
        return result.shortUrl || result.url;
    } catch (error) {
        console.error('Upload error:', error);
        throw error;
    }
}

// Share PDF via WhatsApp with short link
export async function sharePDFViaWhatsApp(pdfFile, clientName, clientPhone, advisorProfile) {
    try {
        // Upload and get short URL
        const shortUrl = await uploadPDFAndGetLink(pdfFile, clientName);

        // Build WhatsApp message with link
        let msg = `¡Hola *${clientName}*! 👋\n\n`;
        msg += `📋 Te comparto tu recomendación personalizada de productos Fuxion:\n\n`;
        msg += `👉 ${shortUrl}\n\n`;
        msg += `_(Haz clic en el enlace para ver tu PDF)_\n`;

        if (advisorProfile?.name) {
            msg += `\n✨ Asesorado por: *${advisorProfile.name}*`;
            if (advisorProfile.phone) msg += `\n📱 ${advisorProfile.phone}`;
        }

        msg += `\n\n_Powered by REXILIENCIA_`;

        // Open WhatsApp
        const cleanPhone = (clientPhone || '').replace(/[\s\-\(\)\+]/g, '');
        const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`;
        window.open(url, '_blank');

        return { success: true, url: shortUrl };
    } catch (error) {
        console.error('Share error:', error);
        throw error;
    }
}
