import { jsPDF } from "jspdf";
import { Itinerary, PdfOptions } from "../types";

export const createPDF = (itinerary: Itinerary, options?: PdfOptions) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  
  // Margins & Constants
  const marginX = 15;
  const contentWidth = pageWidth - (marginX * 2);
  const primaryColor = options?.primaryColor || '#0f766e';
  const secondaryColor = options?.secondaryColor || '#f59e0b';
  const font = options?.font || 'helvetica';
  
  let y = 35; 

  const dayPageMap: { dayNumber: number; theme: string; page: number }[] = [];

  const checkPageBreak = (heightNeeded: number) => {
    if (y + heightNeeded > pageHeight - 20) {
      doc.addPage();
      y = 35; 
      return true;
    }
    return false;
  };

  // --- CONTENT GENERATION (Starting from Page 2) ---
  doc.setFontSize(22);
  doc.setTextColor(primaryColor);
  doc.setFont(font, "bold");
  doc.text(itinerary.destination, marginX, y);
  y += 15;

  itinerary.days.forEach((day) => {
    checkPageBreak(60);
    
    dayPageMap.push({
      dayNumber: day.dayNumber,
      theme: day.theme,
      page: doc.internal.getNumberOfPages()
    });

    // Day Header Background
    doc.setFillColor(248, 250, 252); 
    doc.setDrawColor(226, 232, 240);
    doc.rect(10, y - 7, pageWidth - 20, 18, "FD");
    
    doc.setFontSize(15);
    doc.setTextColor(primaryColor);
    doc.setFont(font, "bold");
    
    const dayTitle = `Giorno ${day.dayNumber}: ${day.theme}`;
    const splitDayTitle = doc.splitTextToSize(dayTitle, contentWidth - 10);
    doc.text(splitDayTitle, marginX + 2, y + 2);
    y += (splitDayTitle.length * 8) + 12;

    if (day.dailyContext) {
       doc.setFontSize(10.5);
       doc.setTextColor(71, 85, 105);
       doc.setFont(font, "italic");
       
       // Optimization: Increased Indentation and Line Spacing for Context
       const contextIndent = 15;
       const contextWidth = contentWidth - contextIndent;
       const splitContext = doc.splitTextToSize(day.dailyContext, contextWidth);
       
       doc.text(splitContext, marginX + contextIndent, y);
       // Line height factor approx 1.6x
       y += (splitContext.length * 8) + 14; 
    } else {
       y += 10;
    }

    day.activities.forEach((activity, index) => {
      checkPageBreak(100);

      const baseLabel = activity.type === 'FOOD' ? "RISTORANTE" : "VISITA";
      const subtypeLabel = activity.subtype ? activity.subtype.toUpperCase() : baseLabel;
      const typeLabel = `[${subtypeLabel}]`;
      
      doc.setFontSize(13);
      doc.setTextColor(15, 23, 42);
      doc.setFont(font, "bold");
      
      const titleFull = `${activity.time} - ${typeLabel} ${activity.title}`;
      const splitTitle = doc.splitTextToSize(titleFull, contentWidth);
      doc.text(splitTitle, marginX, y);
      y += (splitTitle.length * 8) + 6;

      // Metadata with clear vertical blocks
      if (activity.rating) {
        doc.setFontSize(10);
        doc.setTextColor(secondaryColor);
        doc.setFont(font, "bold");
        doc.text(`VOTO: ${activity.rating} ${activity.reviews ? `(${activity.reviews})` : ''}`, marginX + 5, y);
        y += 6;
      }

      if (activity.price) {
        doc.setFontSize(10);
        doc.setTextColor(primaryColor);
        doc.setFont(font, "bold");
        doc.text(`PREZZO: ${activity.price}`, marginX + 5, y);
        y += 6;
      }

      // Logistics Metadata
      doc.setFontSize(9.5);
      doc.setTextColor(100, 116, 139);
      doc.setFont(font, "normal");
      
      let metaParts = [`DURATA: ${activity.estimatedDuration}`];
      if (index > 0) {
          if (activity.distanceFromPrevious) metaParts.push(`DIST: ${activity.distanceFromPrevious}`);
          if (activity.travelTime) metaParts.push(`VIAGGIO: ${activity.travelTime}`);
          if (activity.transportCost) metaParts.push(`COSTO TRASP: ${activity.transportCost}`);
      }
      
      const metaText = metaParts.join("  |  ");
      const splitMeta = doc.splitTextToSize(metaText, contentWidth - 5);
      doc.text(splitMeta, marginX + 5, y);
      y += (splitMeta.length * 6) + 8;

      // Optimization: Description Paragraph - Greater Indentation (20mm) and higher line-height
      doc.setFontSize(11);
      doc.setTextColor(51, 65, 85);
      doc.setFont(font, "normal");
      
      const descIndent = 20;
      const descWidth = contentWidth - descIndent;
      const splitDesc = doc.splitTextToSize(activity.description, descWidth);
      
      doc.text(splitDesc, marginX + descIndent, y);
      // Increased vertical space per line (9 units) for better mobile legibility
      y += (splitDesc.length * 9) + 6;

      // Map Link with clear separate row
      doc.setTextColor(secondaryColor);
      doc.setFontSize(10);
      doc.setFont(font, "bold");
      doc.textWithLink("Vedi su Google Maps >>", marginX + descIndent, y, {
        url: `https://www.google.com/maps/search/?api=1&query=${activity.coordinates.lat},${activity.coordinates.lng}`
      });
      
      y += 22; 
    });

    // Optional Activities Section
    if (day.optionalActivities && day.optionalActivities.length > 0) {
        checkPageBreak(65);
        y += 4;
        doc.setDrawColor(203, 213, 225);
        doc.setLineDashPattern([2, 2], 0);
        doc.line(marginX, y, pageWidth - marginX, y);
        doc.setLineDashPattern([], 0);
        y += 12;

        doc.setFontSize(12);
        doc.setTextColor(secondaryColor);
        doc.setFont(font, "bolditalic");
        doc.text("Alternative & Consigli:", marginX, y);
        y += 10;

        day.optionalActivities.forEach((opt) => {
            checkPageBreak(50);
            
            doc.setFontSize(11);
            doc.setTextColor(15, 23, 42);
            doc.setFont(font, "bold");
            const title = `- [${(opt.subtype || 'EXTRA').toUpperCase()}] ${opt.title}`;
            const splitOptTitle = doc.splitTextToSize(title, contentWidth);
            doc.text(splitOptTitle, marginX, y);
            y += (splitOptTitle.length * 7) + 2;

            doc.setFontSize(10);
            doc.setTextColor(100, 116, 139);
            doc.setFont(font, "normal");
            const metaInfo = `TIPO: ${opt.subtype || 'Extra'} ${opt.price ? `| COSTO: ${opt.price}` : ''}`;
            doc.text(metaInfo, marginX + 6, y);
            y += 7;

            doc.setFontSize(10.5);
            doc.setTextColor(71, 85, 105);
            const optDescIndent = 18;
            const optDescWidth = contentWidth - optDescIndent;
            const splitDesc = doc.splitTextToSize(opt.description, optDescWidth);
            doc.text(splitDesc, marginX + optDescIndent, y);
            y += (splitDesc.length * 8) + 14;
        });
    }

    y += 15; 
  });

  // --- INSERT INDEX PAGE AT THE BEGINNING ---
  doc.insertPage(1);
  doc.setPage(1);
  y = 35;

  if (options?.logoBase64) {
    try {
      const imgProps = doc.getImageProperties(options.logoBase64);
      const imgWidth = 35;
      const imgHeight = (imgProps.height * imgWidth) / imgProps.width;
      doc.addImage(options.logoBase64, 'PNG', pageWidth - marginX - imgWidth, 15, imgWidth, imgHeight);
    } catch (e) {
      console.error("Error adding cover logo", e);
    }
  }

  doc.setFontSize(28);
  doc.setTextColor(primaryColor);
  doc.setFont(font, "bold");
  doc.text(`Itinerario di Viaggio`, marginX, y);
  y += 12;
  
  doc.setFontSize(22);
  doc.setTextColor(51, 65, 85);
  const splitDest = doc.splitTextToSize(itinerary.destination, contentWidth);
  doc.text(splitDest, marginX, y);
  y += (splitDest.length * 10) + 10;

  doc.setFontSize(12);
  doc.setTextColor(100, 116, 139);
  doc.setFont(font, "normal");
  const subCover = `${itinerary.totalDays} Giorni | Creato il ${new Date().toLocaleDateString('it-IT')}`;
  doc.text(subCover, marginX, y);
  y += 25;

  doc.setDrawColor(primaryColor);
  doc.setLineWidth(0.8);
  doc.line(marginX, y - 6, marginX + 30, y - 6);
  
  doc.setFontSize(18);
  doc.setTextColor(primaryColor);
  doc.setFont(font, "bold");
  doc.text("INDICE", marginX, y);
  y += 15;

  dayPageMap.forEach((item) => {
    if (y > pageHeight - 30) {
        doc.addPage();
        y = 30;
    }

    const targetPage = item.page + 1; 

    doc.setFontSize(12);
    doc.setTextColor(15, 23, 42);
    doc.setFont(font, "bold");
    const dayLabel = `Giorno ${item.dayNumber}`;
    doc.text(dayLabel, marginX, y);
    
    doc.setFont(font, "normal");
    doc.setTextColor(71, 85, 105);
    const themeText = `: ${item.theme}`;
    const truncatedTheme = doc.splitTextToSize(themeText, contentWidth - 45)[0];
    doc.text(truncatedTheme, marginX + 25, y);

    doc.setTextColor(secondaryColor);
    doc.setFont(font, "bold");
    doc.text(`${targetPage}`, pageWidth - marginX, y, { align: 'right' });

    doc.link(marginX, y - 5, contentWidth, 8, { pageNumber: targetPage });
    
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.2);
    doc.line(marginX + 25, y + 2, pageWidth - marginX - 10, y + 2);

    y += 12;
  });

  const totalPages = doc.internal.getNumberOfPages();
  const generationDate = new Date().toLocaleDateString('it-IT');

  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.5);
    doc.line(10, 22, pageWidth - 10, 22);

    doc.setFontSize(10);
    doc.setFont(font, "bold");
    doc.setTextColor(primaryColor);
    doc.text("ItineraPDF", marginX, 16);

    doc.setFontSize(9);
    doc.setFont(font, "normal");
    doc.setTextColor(148, 163, 184);
    const headerMeta = `${generationDate} | ${itinerary.destination}`;
    doc.text(headerMeta, pageWidth - marginX, 16, { align: 'right' });

    doc.setFontSize(9);
    doc.setTextColor(148, 163, 184);
    doc.text(`Pagina ${i} di ${totalPages}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
  }

  doc.save(`Itinerario-${itinerary.destination.replace(/\s+/g, '_')}.pdf`);
};