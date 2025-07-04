// generator.js
import fs from 'fs';
import path from 'path';
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';

export async function generateDocTof(req, res) {
  const {
    date,
    collegeName,
    address,
    programmeName,
    eventsCovered,
    mode,
    duration,
    dates,
    batchDet,
    strength,
    batchNum,
    studentsPerBatch,
    sessionsPerDay,
    hours,
    FNfrom,
    FNto,
    ANfrom,
    ANto,
    travel,
    Accomodation,
    conveyance,
    food,
    spocName,
    spocdesignation,
    spocemail,
    spocmobile,
    smartSpoc,
    smartDesgination,
    smartEmail,
    smartmobile,
    landlinesmart
  } = req.body;

  try {
    const content = fs.readFileSync(
      path.resolve('Generators/templates/TOE.docx'),
      'binary'
    );

    const zip = new PizZip(content);
    const doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true });

    doc.setData({
      date,
      collegeName,
      address,
      programmeName,
      eventsCovered,
      mode,
      duration,
      dates,
      batchDet,
      strength,
      batchNum,
      studentsPerBatch,
      sessionsPerDay,
      hours,
      FNfrom,
      FNto,
      ANfrom,
      ANto,
      travel,
      Accomodation,
      conveyance,
      food,
      spocName,
      spocdesignation,
      spocemail,
      spocmobile,
      smartSpoc,
      smartDesgination,
      smartEmail,
      smartmobile,
      landlinesmart
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
