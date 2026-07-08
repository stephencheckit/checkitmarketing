const fs = require("fs");
const path = require("path");
const {
  Document, Packer, Paragraph, TextRun, ImageRun,
  Table, TableRow, TableCell, WidthType, BorderStyle,
  AlignmentType, ShadingType, VerticalAlign,
} = require("docx");

const DARK = "111827";
const ACCENT = "2563EB";
const MUTED = "55627A";
const INK = "1A2230";
const LIGHT = "CBD5E1";

const logoPng = fs.readFileSync(path.join(__dirname, "logo-white.png"));

// ---- Brand band: 2-cell shaded table (logo + RFP tag) ----
const noBorders = {
  top: { style: BorderStyle.NONE, size: 0, color: "auto" },
  bottom: { style: BorderStyle.NONE, size: 0, color: "auto" },
  left: { style: BorderStyle.NONE, size: 0, color: "auto" },
  right: { style: BorderStyle.NONE, size: 0, color: "auto" },
};

const band = new Table({
  width: { size: 100, type: WidthType.PERCENTAGE },
  borders: noBorders,
  rows: [
    new TableRow({
      children: [
        new TableCell({
          width: { size: 60, type: WidthType.PERCENTAGE },
          shading: { type: ShadingType.CLEAR, color: "auto", fill: DARK },
          verticalAlign: VerticalAlign.CENTER,
          margins: { top: 220, bottom: 220, left: 240, right: 120 },
          children: [
            new Paragraph({
              children: [
                new ImageRun({
                  data: logoPng,
                  transformation: { width: 210, height: 45 },
                }),
              ],
            }),
          ],
        }),
        new TableCell({
          width: { size: 40, type: WidthType.PERCENTAGE },
          shading: { type: ShadingType.CLEAR, color: "auto", fill: DARK },
          verticalAlign: VerticalAlign.CENTER,
          margins: { top: 220, bottom: 220, left: 120, right: 240 },
          children: [
            new Paragraph({
              alignment: AlignmentType.RIGHT,
              children: [
                new TextRun({ text: "REQUEST FOR PROPOSAL", color: LIGHT, size: 18, characterSpacing: 30 }),
                new TextRun({ text: "RESPONSE", color: LIGHT, size: 18, characterSpacing: 30, break: 1 }),
              ],
            }),
          ],
        }),
      ],
    }),
  ],
});

const heading = (text) =>
  new Paragraph({
    spacing: { before: 320, after: 120 },
    border: { left: { style: BorderStyle.SINGLE, size: 24, color: ACCENT, space: 8 } },
    children: [new TextRun({ text, bold: true, size: 28, color: DARK })],
  });

const body = (text, opts = {}) =>
  new Paragraph({
    spacing: { after: 200, line: 300 },
    children: [new TextRun({ text, size: opts.lead ? 24 : 22, color: INK })],
  });

const sections = [
  ["Why Checkit", [
    "Checkit is a global leader in environmental monitoring. We understand how critical it is to have a strong partner, and we have built long-standing partnerships in the environmental monitoring space with some of the largest plasma and laboratory customers in the United States. Checkit combines highly accurate monitoring with 24/7 alarm management, FDA 21 CFR Part 11 compliant audit trails, and enterprise-wide visibility with long-term data integrity. These capabilities align closely with BioIVT's requirements for protecting high-value biospecimens, maintaining regulatory compliance, and ensuring operational continuity across multiple laboratory and biorepository locations.",
    "Our wireless temperature sensors are consistently shown to be extremely robust and accurate, with exceptionally low failure rates. Our sensors operate without maintenance and, when necessary, can be easily replaced by lab staff. The solution is easy to operate and designed with frontline staff in mind.",
  ]],
  ["Uniquely Able to Deliver", [
    "Checkit has no inventory, resourcing, or platform risks to delivery. We can guarantee adherence to the installation schedule that meets your needs and can complete the full deployment on your timeline. We employ our own trained engineers, staffed throughout the continental United States, who have a combined 25+ years of installation experience in a variety of applications.",
  ]],
  ["Compelling Commercial Offer", [
    "Checkit is unique in offering a full subscription-based proposal. Our subscription fee is inclusive of hardware, warranty, calibration, maintenance, and support for the life of the agreement. Risk of hardware failure rests with Checkit, demonstrating confidence in the robustness of our technology, eliminating upfront capital investment, and providing certainty in future costs. Checkit accelerates time to value, maximises ROI, and minimises risk.",
  ]],
  ["Proven to Deliver at Scale", [
    "Checkit has delivered more than 500 successful installations in the United States, including many at significant scale with large enterprises such as Grifols, NAMSA, Quest Diagnostics, and the Center for Organ Recovery and Education. We provide temperature monitoring solutions covering a vast range of applications, and our specialty is multi-site organizations.",
    "Checkit offers 24x7 support and a nationwide network of skilled engineers. Our support and implementation capability is complemented by a dedicated customer success structure focused on building a long-term partnership.",
  ]],
  ["Stable, Future-Ready Partner", [
    "In addition to meeting BioIVT's current requirements \u201Cout of the box,\u201D Checkit is \u201Cfuture ready\u201D with further capability, available today, that could deliver long-term value. This includes Checkit's Asset Intelligence, which adds advanced machine learning capability and enables identification of assets that were not performing in an optimal manner \u2014 enabling early identification of maintenance issues and an opportunity for energy reduction. This functionality is already saving customers significant sums in energy, maintenance, and waste costs.",
    "Checkit continues to maintain a robust innovation pipeline which will be available to BioIVT. Put simply, the low-risk nature of the Checkit solution extends well beyond the deployment project and initial scope.",
  ]],
  ["In Closing", [
    "We are excited about this partnership with BioIVT and believe that our many years of expertise in the environmental monitoring space make us well poised to be the best partner you can select. We pride ourselves in providing quality products and services to our customers, especially when lifesaving inventory is at stake. We understand the importance of a solid environmental monitoring solution and do not take that responsibility lightly. In closing, we appreciate the opportunity to present our proposal to you and look forward to next steps.",
  ]],
];

const children = [band];

// Title block
children.push(
  new Paragraph({
    spacing: { before: 360, after: 80 },
    children: [new TextRun({ text: "TEMPERATURE MONITORING & VALIDATION", bold: true, color: ACCENT, size: 20, characterSpacing: 20 })],
  }),
  new Paragraph({
    spacing: { after: 120 },
    children: [new TextRun({ text: "Response to BioIVT's Request for Proposal", bold: true, color: DARK, size: 44 })],
  }),
  new Paragraph({
    spacing: { after: 80 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 18, color: DARK, space: 6 } },
    children: [
      new TextRun({ text: "Prepared for: ", bold: true, color: INK, size: 20 }),
      new TextRun({ text: "BioIVT", color: MUTED, size: 20 }),
      new TextRun({ text: "     Prepared by: ", bold: true, color: INK, size: 20 }),
      new TextRun({ text: "Checkit", color: MUTED, size: 20 }),
    ],
  }),
);

// Lead paragraph
children.push(
  new Paragraph({
    spacing: { before: 240, after: 200, line: 300 },
    children: [new TextRun({
      text: "Thank you for the opportunity to respond to your Temperature Monitoring and Validation Request for Proposal. After reviewing the information laid out in the Technical Requirements Document and the questionnaire, it is apparent that Checkit has several strengths that align well with BioIVT's requirements.",
      size: 24, color: INK,
    })],
  }),
);

// Sections
for (const [title, paras] of sections) {
  children.push(heading(title));
  for (const p of paras) children.push(body(p));
}

// Closing line
children.push(
  new Paragraph({
    spacing: { before: 320 },
    border: { top: { style: BorderStyle.SINGLE, size: 8, color: "E2E6EE", space: 8 } },
    children: [new TextRun({
      text: "Checkit  \u2022  Temperature Monitoring & Validation Proposal  \u2022  Prepared for BioIVT",
      color: MUTED, size: 18,
    })],
  }),
);

const doc = new Document({
  sections: [{
    properties: { page: { margin: { top: 720, bottom: 720, left: 1080, right: 1080 } } },
    children,
  }],
});

Packer.toBuffer(doc).then((buf) => {
  fs.writeFileSync(path.join(__dirname, "Checkit-BioIVT-RFP-Response.docx"), buf);
  console.log("wrote Checkit-BioIVT-RFP-Response.docx", buf.length, "bytes");
});
