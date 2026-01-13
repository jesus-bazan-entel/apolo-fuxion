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
    const margin = 10; // 10mm margin
    const contentWidth = a4Width - (margin * 2);

    try {
        // Temporarily set element width for better A4 rendering
        const originalWidth = element.style.width;
        element.style.width = '595px'; // A4 width in pixels at 72 DPI

        // Capture the element as canvas
        const canvas = await html2canvas(element, {
            scale: 2, // Higher quality
            useCORS: true,
            allowTaint: true,
            backgroundColor: '#ffffff',
            logging: false,
            windowWidth: 595
        });

        // Restore original width
        element.style.width = originalWidth;

        const imgData = canvas.toDataURL('image/png');

        // Calculate dimensions maintaining aspect ratio
        const imgWidth = contentWidth;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        const pageContentHeight = a4Height - (margin * 2);

        const pdf = new jsPDF('p', 'mm', 'a4');
        let heightLeft = imgHeight;
        let position = margin;

        // Add first page
        pdf.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight);
        heightLeft -= pageContentHeight;

        // Add additional pages if needed
        while (heightLeft > 0) {
            pdf.addPage();
            position = margin - (imgHeight - heightLeft);
            pdf.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight);
            heightLeft -= pageContentHeight;
        }

        // Return as blob for sharing
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

export async function sharePDF(pdfFile, title = 'Recomendación Fuxion') {
    // Check if Web Share API is available and supports files
    if (navigator.canShare && navigator.canShare({ files: [pdfFile] })) {
        try {
            await navigator.share({
                files: [pdfFile],
                title: title,
                text: '¡Mira tu recomendación personalizada de productos Fuxion!'
            });
            return true;
        } catch (error) {
            if (error.name !== 'AbortError') {
                console.error('Error sharing:', error);
            }
            return false;
        }
    } else {
        // Fallback: download the PDF
        downloadPDF(pdfFile);
        return false;
    }
}
