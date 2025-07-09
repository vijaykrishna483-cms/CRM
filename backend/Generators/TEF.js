// generator.js
import fs from 'fs';
import path from 'path';
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';

export async function generateDocTef(req, res) {
  // All fields are either string or empty string
  const {
    date, collegeName, address1, address2, address3,
    sl1, sacNum1, desc1, batch1, Days1, Rate1, Amt1,
    sl2, sacNum2, desc2, batch2, Days2, Rate2, Amt2,
    sl3, sacNum3, desc3, batch3, Days3, Rate3, Amt3,
    sl4, sacNum4, desc4, batch4, Days4, Rate4, Amt4,
    total, totalInwords, gst, finalTotal
  } = req.body;

  try {
    const content = fs.readFileSync(
      path.resolve('Generators/templates/TEFTemplate.docx'),
      'binary'
    );

    const zip = new PizZip(content);
    const doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true });

    doc.setData({
      date: date || '',
      collegeName: collegeName || '',
      address1: address1 || '',
      address2: address2 || '',
      address3: address3 || '',
      sl1: sl1 || '', sacNum1: sacNum1 || '', desc1: desc1 || '', batch1: batch1 || '', Days1: Days1 || '', Rate1: Rate1 || '', Amt1: Amt1 || '',
      sl2: sl2 || '', sacNum2: sacNum2 || '', desc2: desc2 || '', batch2: batch2 || '', Days2: Days2 || '', Rate2: Rate2 || '', Amt2: Amt2 || '',
      sl3: sl3 || '', sacNum3: sacNum3 || '', desc3: desc3 || '', batch3: batch3 || '', Days3: Days3 || '', Rate3: Rate3 || '', Amt3: Amt3 || '',
      sl4: sl4 || '', sacNum4: sacNum4 || '', desc4: desc4 || '', batch4: batch4 || '', Days4: Days4 || '', Rate4: Rate4 || '', Amt4: Amt4 || '',
      total: total || '',
      totalInwords: totalInwords || '',
      gst: gst || '',
      finalTotal: finalTotal || ''
    });

    doc.render();

    const buf = doc.getZip().generate({ type: 'nodebuffer' });

    res.setHeader('Content-Disposition', 'attachment; filename=generated.docx');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.send(buf);
  } catch (error) {
    console.error('Error generating document:', error);
    return res.status(500).json({ status: 'failed', message: 'Document generation failed' });
  }
}
