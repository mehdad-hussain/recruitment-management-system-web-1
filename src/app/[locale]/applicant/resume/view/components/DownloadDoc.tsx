import React from 'react';
// prettier-ignore
import { Document, Packer, Paragraph, TextRun, Table, TableCell, TableRow, Media, Tab, HeadingLevel, VerticalAlign, TextDirection, ImageRun, TabStopType, TabStopPosition, AlignmentType, WidthType, convertInchesToTwip, ShadingType, BorderStyle, TableWidthElement, } from 'docx';
import { saveAs } from 'file-saver';

type DownloadDocProps = {
  resumeData: any;
  tableHeader: string[];
};

const getBlob = async (url: string) => {
  const blob = await fetch(url).then((r) => r.blob());

  return blob;
};

const DownloadDoc = ({ resumeData, tableHeader }: DownloadDocProps) => {
  // prettier-ignore
  const { basic, personal, total_experience, experiences,  trainings, certifications, specialization, languages,  references, career,educations } = resumeData.data as any;
  const data = resumeData.data;

  const { career_objective, career_summary, special_qualification } = basic;

  // Create a new document and add the table to it
  const blob = getBlob(basic?.photo?.url || 'https://i.imgur.com/7LFgo0K.png');
  const PHONE_NUMBER = '07534563401';
  const PROFILE_URL = 'https://www.linkedin.com/in/dolan1';
  const EMAIL = 'docx@docx.com';

  const educationList = [
    {
      degree: 'Master of Science (MSc)',
      fieldOfStudy: 'Computer Science',
      notes:
        'Exam Results: 1st Class with Distinction, Dissertation: 1st Class with Distinction\n\nRelevant Courses: Java and C# Programming, Software Engineering, Artificial Intelligence, \nComputational Photography, Algorithmics, Architecture and Hardware.\n\nCreated a Windows 8 game in JavaScript for the dissertation. \n\nCreated an award-winning 3D stereoscopic game in C# using XNA.',
      schoolName: 'University College London',
      startDate: {
        year: 2012,
      },
      endDate: {
        year: 2013,
      },
    },
    {
      degree: 'Bachelor of Engineering (BEng)',
      fieldOfStudy: 'Material Science and Engineering',
      notes:
        'Exam Results: 2:1, Dissertation: 1st Class with Distinction\n\nRelevant courses: C Programming, Mathematics and Business for Engineers.',
      schoolName: 'Imperial College London',
      startDate: {
        year: 2009,
      },
      endDate: {
        year: 2012,
      },
    },
  ];

  // new Paragraph({
  //   text: data?.basic?.name,
  //   heading: HeadingLevel.HEADING_1,
  // }),
  // new Paragraph({
  //   text: `Address: ${data?.basic?.address}`,
  // }),
  // new Paragraph({
  //   text: `Primary Mobile No: ${data?.basic?.primary_mobile}`,
  // }),
  // new Paragraph({
  //   text: `Secondary Mobile No: ${data?.basic?.secondary_mobile}`,
  // }),
  // new Paragraph({
  //   text: `Primary Email: ${data?.basic?.email}`,
  // }),

  // new Paragraph({
  //   children: [
  //     new ImageRun({
  //       data: blob,
  //       transformation: {
  //         width: 100,
  //         height: 100,
  //       },
  //     }),
  //   ],
  // }),

  const formattedParagraphs = experiences.flatMap((item: any) =>
    createFormattedParagraphs(item?.responsibilities || ''),
  );

  const doc = new Document({
    sections: [
      {
        children: [
          new Paragraph({
            text: 'Dolan Miu',
            heading: HeadingLevel.TITLE,
          }),
          createContactInfo(PHONE_NUMBER, PROFILE_URL, EMAIL),
          createHeading('Education'),
          ...educationList
            .map((education) => {
              const arr: Paragraph[] = [];
              arr.push(
                createInstitutionHeader(
                  education.schoolName,
                  `${education.startDate.year} - ${education.endDate.year}`,
                ),
              );
              arr.push(
                createRoleText(
                  `${education.fieldOfStudy} - ${education.degree}`,
                ),
              );

              const bulletPoints = splitParagraphIntoBullets(education.notes);
              bulletPoints.forEach((bulletPoint) => {
                arr.push(createBullet(bulletPoint));
              });

              return arr;
            })
            .reduce((prev: any, curr: any) => prev.concat(curr), []),

          // new TableRow({
          //   children: [
          //     createRowCellBorderNone('Father’s Name'),
          //     createRowCellBorderNone(':'),
          //     createRowCellBorderNone('father'),
          //   ],
          // }),
          // new TableRow({
          //   children: [
          //     createRowCellBorderNone('Mother’s Name'),
          //     createRowCellBorderNone(':'),
          //     createRowCellBorderNone('mother'),
          //   ],
          // }),
          new Table({
            rows: [],
            width: {
              size: 100,
              type: WidthType.PERCENTAGE,
            },
          }),

          // new Table({
          //   rows: [
          //     new TableRow({
          //       children: [
          //         new TableCell({
          //           width: {
          //             size: 25,
          //           },
          //           borders: {
          //             top: {
          //               style: BorderStyle.DASH_SMALL_GAP,
          //               size: 1,
          //               color: 'ff0000',
          //             },
          //             bottom: {
          //               style: BorderStyle.DASH_SMALL_GAP,
          //               size: 1,
          //               color: 'ff0000',
          //             },
          //             left: {
          //               style: BorderStyle.DASH_SMALL_GAP,
          //               size: 1,
          //               color: 'ff0000',
          //             },
          //             right: {
          //               style: BorderStyle.DASH_SMALL_GAP,
          //               size: 1,
          //               color: 'ff0000',
          //             },
          //           },
          //           children: [new Paragraph('Hello')],
          //         }),
          //         new TableCell({
          //           columnSpan: 2, // Set the columnSpan to 2 for the next cell
          //           children: [],
          //         }),
          //       ],
          //     }),

          //     new TableRow({
          //       children: [
          //         new TableCell({
          //           children: [],
          //         }),
          //         new TableCell({
          //           width: {
          //             size: 2,
          //           },
          //           children: [new Paragraph('World')],
          //         }),
          //         new TableCell({
          //           width: {
          //             size: 73,
          //           },
          //           children: [],
          //         }),
          //       ],
          //     }),
          //   ],
          // }),

          createSectionHeader('Career Objective:'),
          createSectionDescription(career_objective),
          createSectionHeader('Career Summary:'),
          createSectionDescription(career_summary),
          createSectionHeader('Special Qualification:'),
          createSectionDescription(special_qualification),
          createSectionHeader('Employment History:'),
          createSectionDescription(
            `Total Year of Experience: ${total_experience} yrs`,
          ),

          ...experiences
            .map((item: any, index: number) => {
              const formattedExpParagraphs = createFormattedParagraphs(
                item.responsibility,
              );
              return [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: `${index + 1}.`,
                    }),

                    new TextRun({
                      children: [new Tab(), `${item.designation}`],
                      size: 22,
                    }),
                    new TextRun({
                      text: `(${item.total_years})`,
                      size: 22,
                    }),
                  ],
                  tabStops: [
                    {
                      type: TabStopType.LEFT,
                      position: 380,
                    },
                  ],
                }),

                createEmploymentPara(
                  `${item.start_month} - ${
                    item.end_month ? item.end_month : 'continuing'
                  } `,
                ),

                createEmploymentPara(item.company_name, 0),
                createEmploymentPara(item.company_address),

                createEmploymentPara('Area of Expertise', 0),
                createEmploymentPara(item.expertise),

                createEmploymentPara('Duties/Responsibilities', 0),
                ...formattedExpParagraphs,
              ];
            })
            .reduce((prev: any, curr: any) => prev.concat(curr), []),
          new Paragraph({}),
          createSectionHeader('Career and Application Information:'),
          createSectionHeader('Specialization:'),
          createSectionHeader('Personal Details:'),
          createSectionHeader('Academic Qualification:'),
          createTable(
            [
              'Exam Title',
              'Concentration/Major',
              'Institute',
              'Result',
              'Pas.Year',
              'Duration',
              'Achievement',
            ],
            educations,
          ),
          createSectionHeader('Training Summary:'),
          createTable(
            [
              'Training Title',
              'Topic',
              'Institute',
              'Country',
              'Location',
              'Year',
              'Duration',
            ],
            trainings,
          ),
          createSectionHeader('Professional Qualification:'),
          createTable(
            ['Certification', 'Institute', 'Location', 'From', 'To'],
            certifications,
          ),
          createSectionHeader('Language Proficiency:'),
          createTable(
            ['Language', 'Reading', 'Writing', 'Speaking'],
            languages,
          ),
        ],
      },
    ],
  });

  const generate = () => {
    Packer.toBlob(doc).then((blob) => {
      saveAs(blob, 'example.docx');
      console.log('Document created successfully');
    });
  };

  return (
    <div>
      <button
        type="button"
        className="
          bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded
        "
        onClick={generate}
      >
        Generate DOCX
      </button>
    </div>
  );
};

const headerToPropertyMap = {
  'Training Title': 'title',
  Topic: 'topic',
  Institute: 'institute',
  Country: 'country',
  Location: 'location',
  Year: 'year',
  Duration: 'duration',

  'Exam Title': 'degree',
  'Concentration/Major': 'major',
  Result: 'result',
  'Pas.Year': 'passing_year',
  Achievement: 'achievement',
  From: 'from_date',
  To: 'to_date',
  Certification: 'title',

  Language: 'language',
  Reading: 'reading',
  Speaking: 'speaking',
  Writing: 'writing',
};

// Function to create a table row based on row data and headers
const createTableRow = (rowData: any, headers: string[]) => {
  return new TableRow({
    children: headers.map(
      (header) =>
        new TableCell({
          children: [
            new Paragraph({
              text:
                rowData[
                  headerToPropertyMap[
                    header
                  ] as keyof typeof headerToPropertyMap
                ] !== undefined &&
                rowData[
                  headerToPropertyMap[
                    header
                  ] as keyof typeof headerToPropertyMap
                ] !== null
                  ? rowData[
                      headerToPropertyMap[
                        header
                      ] as keyof typeof headerToPropertyMap
                    ]
                  : '.',
            }),
          ],
          verticalAlign: VerticalAlign.CENTER,
        }),
    ),
  });
};

// Function to create the table separately
const createTable = (tableHeader: string[], data: any[]) => {
  const rows = [
    new TableRow({
      children: tableHeader.map(
        (header) =>
          new TableCell({
            children: [
              new Paragraph({
                text: header,
                heading: HeadingLevel.HEADING_1,
              }),
            ],
            verticalAlign: VerticalAlign.CENTER,
          }),
      ),
    }),
    ...data.map((row: any) => createTableRow(row, tableHeader)),
  ];

  return new Table({
    width: {
      size: 100,
      type: WidthType.PERCENTAGE,
    },
    rows,
  });
};

function createContactInfo(
  phoneNumber: string,
  profileUrl: string,
  email: string,
): Paragraph {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [
      new TextRun(
        `Mobile: ${phoneNumber} | LinkedIn: ${profileUrl} | Email: ${email}`,
      ),
      new TextRun({
        text: 'Address: 58 Elm Avenue, Kent ME4 6ER, UK',
        break: 1,
      }),
    ],
  });
}

function createHeading(text: string): Paragraph {
  return new Paragraph({
    text: text,
    heading: HeadingLevel.HEADING_1,
    thematicBreak: true,
  });
}

function createInstitutionHeader(
  institutionName: string,
  dateText: string,
): Paragraph {
  return new Paragraph({
    tabStops: [
      {
        type: TabStopType.RIGHT,
        position: TabStopPosition.MAX,
      },
    ],
    children: [
      new TextRun({
        text: institutionName,
        bold: true,
      }),
      new TextRun({
        text: `\t${dateText}`,
        bold: true,
      }),
    ],
  });
}

function createRoleText(roleText: string): Paragraph {
  return new Paragraph({
    children: [
      new TextRun({
        text: roleText,
        italics: true,
      }),
    ],
  });
}

function createBullet(text: string): Paragraph {
  return new Paragraph({
    text: text,
    bullet: {
      level: 0,
    },
  });
}

function splitParagraphIntoBullets(text: string): string[] {
  return text.split('\n\n');
}

// Function to create a section header
function createSectionHeader(
  text: string,
  beforeSpacing = 0.1,
  afterSpacing = 0.1,
): Paragraph {
  return new Paragraph({
    children: [
      new TextRun({
        text: text,
        size: 24,
        bold: true,
        underline: {},
        color: '000000', // Black color
      }),
    ],
    alignment: AlignmentType.LEFT,
    shading: {
      type: ShadingType.SOLID,
      color: 'D3D3D3', // Gray color
    },
    spacing: {
      before: beforeSpacing,
      after: afterSpacing,
    },
  });
}

// Function to create a section description paragraph
function createSectionDescription(
  text: string,
  beforeSpacing = 0.1,
  afterSpacing = 0.1,
): Paragraph {
  return new Paragraph({
    children: [
      new TextRun({
        text: text,
        size: 22,
        color: '000000', // Black color
      }),
    ],
    alignment: AlignmentType.LEFT,
    spacing: {
      before: beforeSpacing,
      after: afterSpacing,
    },
  });
}

function createFormattedTextRun(text: string, formatting: any): TextRun {
  const textRun = new TextRun({
    text: text,
    bold: formatting.bold,
    color: formatting.color,
    shading: formatting.bgColor,
    italics: formatting.italics,
    underline: formatting.underline,
  });

  return textRun;
}

// function createFormattedParagraphs(htmlContent: string): Paragraph[] {
//   const segments = htmlContent.split(/<\/?li>/);
//   const formattedParagraphs: Paragraph[] = [];

//   segments.forEach((segment) => {
//     if (segment.trim() !== '') {
//       const textRuns: TextRun[] = [];
//       const textSegments = segment.split(
//         /(<span style="color: rgb\(\d+, \d+, \d+\);">|<\/span>|<span style="background-color: rgb\(\d+, \d+, \d+\);">)/,
//       );

//       textSegments.forEach((textSegment) => {
//         if (textSegment.trim() !== '') {
//           const formatting = {
//             color: '000000', // Default black color
//             bgColor: 'FFFFFF', // Default white background color
//             bold: false,
//             italics: false,
//             underline: false,
//           };

//           // Create a text run with the formatted text
//           const textRun = createFormattedTextRun(
//             textSegment.trim().replace(/<\/?[^>]+(>|$)/g, ''),
//             formatting,
//           );
//           textRuns.push(textRun);
//         }
//       });

//       if (textRuns.length > 0) {
//         const bulletTextRun = new TextRun({
//           text: '• ',
//           bold: true,
//         });
//         textRuns.unshift(bulletTextRun); // Add the bullet point at the beginning

//         const paragraph = new Paragraph({
//           children: textRuns,
//         });

//         formattedParagraphs.push(paragraph);
//       }
//     }
//   });

//   return formattedParagraphs;
// }

// const createFormattedParagraphs = (richText: string) => {
//   const segments = richText.split(/(<\/?[a-zA-Z0-9-]+[^>]*>)/g);

//   let formatting: any = {}; // To keep track of current inline styles
//   const formattedParagraphs: any[] = [];

//   segments.forEach((segment, index) => {
//     if (segment.startsWith('<strong>')) {
//       formatting = { ...formatting, bold: true };
//       segment = segment.replace(/<\/?strong>/g, '');
//     } else if (segment.startsWith('</strong>')) {
//       formatting = { ...formatting, bold: false };
//       return;
//     } else if (segment.startsWith('<u>')) {
//       formatting = { ...formatting, underline: true };
//       segment = segment.replace(/<\/?u>/g, '');
//     } else if (segment.startsWith('</u>')) {
//       formatting = { ...formatting, underline: false };
//       return;
//     } else if (segment.startsWith('<em>')) {
//       if (formatting.bold) {
//         formatting = { ...formatting, italics: true };
//       } else {
//         formatting = { ...formatting, italics: true };
//       }
//       segment = segment.replace(/<\/?em>/g, '');
//     } else if (segment.startsWith('<span style="color:')) {
//       const match = segment.match(/color: (.*?);/);
//       if (match) {
//         formatting = { ...formatting, color: match[1] };
//       }
//       segment = segment.replace(/<\/?span[^>]+>/g, '');
//     } else if (segment.startsWith('<span style="background-color:')) {
//       const match = segment.match(/background-color: (.*?);/);
//       if (match) {
//         formatting = { ...formatting, backgroundColor: match[1] };
//       }
//       segment = segment.replace(/<\/?span[^>]+>/g, '');
//     } else if (segment === '</span>') {
//       formatting = {};
//       return;
//     } else if (segment.startsWith('<li>')) {
//       segment = segment.replace(/<li>/g, '');
//       if (index !== 0 && index !== segments.length - 1) {

//       }
//       return;
//     } else if (segment.startsWith('<p>')) {
//       segment = segment.replace(/<p>/g, '');
//     } else if (segment.startsWith('</p>')) {
//       segment = segment.replace(/<\/p>/g, '\n');

//       return;
//     }

//     segment = segment.replace(/<\/?[a-zA-Z0-9-]+[^>]*>/g, '');
//     console.log(
//       '🚀 ~ file: DownloadDoc.tsx:533 ~ segments.forEach ~ segment:',
//       segment,
//     );

//   });

//   return formattedParagraphs;
// };

// HTML content with complex formatting

function createFormattedParagraphs(richText: string): Paragraph[] {
  const segments = richText.split(/(<\/?[a-zA-Z0-9-]+[^>]*>)/g);

  let formatting: any = {}; // To keep track of current inline styles
  const formattedParagraphs: Paragraph[] = [];

  segments.forEach((segment) => {
    if (segment.startsWith('<strong>')) {
      formatting = { ...formatting, bold: true };
      segment = segment.replace(/<\/?strong>/g, '');
    } else if (segment.startsWith('</strong>')) {
      formatting = { ...formatting, bold: false };
      return;
    } else if (segment.startsWith('<u>')) {
      formatting = { ...formatting, underline: true };
      segment = segment.replace(/<\/?u>/g, '');
    } else if (segment.startsWith('</u>')) {
      formatting = { ...formatting, underline: false };
      return;
    } else if (segment.startsWith('<em>')) {
      if (formatting.bold) {
        formatting = { ...formatting, italics: true };
      } else {
        formatting = { ...formatting, italics: true };
      }
      segment = segment.replace(/<\/?em>/g, '');
    } else if (segment.startsWith('<span style="color:')) {
      const match = segment.match(/color: (.*?);/);
      if (match) {
        formatting = { ...formatting, color: match[1] };
      }
      segment = segment.replace(/<\/?span[^>]+>/g, '');
    } else if (segment.startsWith('<span style="background-color:')) {
      const match = segment.match(/background-color: (.*?);/);
      if (match) {
        formatting = { ...formatting, backgroundColor: match[1] };
      }
      segment = segment.replace(/<\/?span[^>]+>/g, '');
    } else if (segment === '</span>') {
      formatting = {};
      return;
    } else if (segment.startsWith('<li>')) {
      segment = segment.replace(/<li>/g, '');
      const bulletTextRun = new TextRun({
        text: '• ',
        bold: true,
      });
      const textRun = createFormattedTextRun(segment, formatting);
      const paragraph = new Paragraph({
        children: [bulletTextRun, textRun],
      });
      formattedParagraphs.push(paragraph);
      return;
    } else if (segment.startsWith('<p>')) {
      segment = segment.replace(/<p>/g, '');
      const textRun = createFormattedTextRun(segment, formatting);
      const paragraph = new Paragraph({
        children: [textRun],
      });
      formattedParagraphs.push(paragraph);
    } else if (segment.startsWith('</p>')) {
      segment = segment.replace(/<\/p>/g, '\n');
      const textRun = createFormattedTextRun(segment, formatting);
      const paragraph = new Paragraph({
        children: [textRun],
      });
      formattedParagraphs.push(paragraph);
      return;
    }

    segment = segment.replace(/<\/?[a-zA-Z0-9-]+[^>]*>/g, '');

    const textRun = createFormattedTextRun(segment, formatting);
    const paragraph = new Paragraph({
      children: [textRun],
    });
    formattedParagraphs.push(paragraph);
  });

  return formattedParagraphs;
}

function createEmploymentPara(
  text: string,
  spacingAfter = 200,
  indentLeft = 0.26,
): Paragraph {
  return new Paragraph({
    children: [
      new TextRun({
        text,
        size: 22,
      }),
    ],
    spacing: {
      after: spacingAfter,
    },
    indent: { left: convertInchesToTwip(indentLeft) },
  });
}

function createRowCellBorderNone(
  text: string,
  size = 22,
  bold = false,
  color = '000000',
): TableCell {
  const cell = new TableCell({
    borders: {
      top: {
        style: BorderStyle.NONE,
        size: 0,
        color: 'FFFFFF',
      },
      bottom: {
        style: BorderStyle.NONE,
        size: 0,
        color: 'FFFFFF',
      },
      left: {
        style: BorderStyle.NONE,
        size: 0,
        color: 'FFFFFF',
      },
      right: {
        style: BorderStyle.NONE,
        size: 0,
        color: 'FFFFFF',
      },
    },
    children: [
      new Paragraph({
        children: [
          new TextRun({
            text,
            size,
            bold,
            color,
          }),
        ],
      }),
    ],
  });

  return cell;
}

export default DownloadDoc;
