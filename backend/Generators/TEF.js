// generator.js
import fs from 'fs';
import path from 'path';
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';

export async function generateDocTef(req, res) {
  const {  date,collegeName,address1, address2,address3,sl1,sacNum1,desc1,batch1,Days1,Rate1,Amt1,total,totalInwords,gst,finalTotal} = req.body;

  try {
    const content = fs.readFileSync(
      path.resolve('Generators/templates/TEFTemplate.docx'), // no __dirname needed if path relative to root
      'binary'
    );

    const zip = new PizZip(content);
    const doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true });

    doc.setData({ date,collegeName,address1, address2,address3,sl1,sacNum1,desc1,batch1,Days1,Rate1,Amt1,total,totalInwords,gst,finalTotal});

    doc.render(); // Throws if template tags are missing

    const buf = doc.getZip().generate({ type: 'nodebuffer' });

    res.setHeader('Content-Disposition', 'attachment; filename=generated.docx');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.send(buf);
  } catch (error) {
    console.error('Error generating document:', error);
    return res.status(500).json({ status: 'failed', message: 'Document generation failed' });
  }
}
