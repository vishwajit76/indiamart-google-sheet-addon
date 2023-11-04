export const onOpen = () => {
  const menu = SpreadsheetApp.getUi()
    .createMenu('Indiamart Addon') // edit me!
    // .addItem('Sheet Editor', 'openDialog')
    // .addItem('Sheet Editor (Bootstrap)', 'openDialogBootstrap')
    .addItem('Open', 'openDialogMUI')
    // .addItem('Sheet Editor (Tailwind CSS)', 'openDialogTailwindCSS')
    // .addItem('About me', 'openAboutSidebar');

  menu.addToUi();
};

// export const openDialog = () => {
//   const html = HtmlService.createHtmlOutputFromFile('dialog-demo')
//     .setWidth(600)
//     .setHeight(600);
//   SpreadsheetApp.getUi().showModalDialog(html, 'Sheet Editor');
// };

// export const openDialogBootstrap = () => {
//   const html = HtmlService.createHtmlOutputFromFile('dialog-demo-bootstrap')
//     .setWidth(600)
//     .setHeight(600);
//   SpreadsheetApp.getUi().showModalDialog(html, 'Sheet Editor (Bootstrap)');
// };

export const openDialogMUI = () => {
  // const html = HtmlService.createHtmlOutputFromFile('dialog-demo-mui')
  //   // .setWidth(600)
  //   // .setHeight(600);
  // SpreadsheetApp.getUi().showSidebar(html);

  const html = HtmlService.createHtmlOutputFromFile('dialog-demo-mui')
  .setWidth(330)
  .setHeight(550);
SpreadsheetApp.getUi().showModalDialog(html, 'Indiamart Addon');

};

// export const openDialogTailwindCSS = () => {
//   const html = HtmlService.createHtmlOutputFromFile('dialog-demo-tailwindcss')
//     .setWidth(600)
//     .setHeight(600);
//   SpreadsheetApp.getUi().showModalDialog(html, 'Sheet Editor (Tailwind CSS)');
// };

// export const openAboutSidebar = () => {
//   const html = HtmlService.createHtmlOutputFromFile('sidebar-about-page');
//   SpreadsheetApp.getUi().showSidebar(html);
// };
