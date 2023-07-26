import {
  handleClientInformationError,
  handleInitialInformationError,
  handleSendingInvoiceError,
} from "./errorHandling.utils.js";

const walmartNavigation = {
  async goToPage(page, link1, link2) {
    await page.goto(link1);

    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");
    await page.keyboard.press("Enter");

    await page.goto(link2);

    await page.waitForTimeout(3000);
  },
  async enterTicketInformation(browser, page, rfc, cp, ticket, transaction) {
    const inputRfc = await page.$("#ctl00_ContentPlaceHolder1_txtMemRFC");
    if (!inputRfc) {
      await browser.close();
      handleInitialInformationError();
    }

    const inputCP = await page.$("#ctl00_ContentPlaceHolder1_txtCP");
    const inputTicket = await page.$("#ctl00_ContentPlaceHolder1_txtTC");
    const inputTransaction = await page.$("#ctl00_ContentPlaceHolder1_txtTR");
    const buttonContinue = await page.$(
      "#ctl00_ContentPlaceHolder1_btnAceptar"
    );

    await inputRfc.type(rfc);
    await inputCP.type(cp);
    await inputTicket.type(ticket);
    await inputTransaction.type(transaction);
    await buttonContinue.click();

    await page.waitForTimeout(7000);
  },
  async enterInvoiceInformation(browser, page) {
    const regimenFiscalDropdown = await page.$(
      "#ctl00_ContentPlaceHolder1_ddlregimenFiscal"
    );
    if (!regimenFiscalDropdown) {
      await browser.close();
      handleClientInformationError();
    }

    await page.select("#ctl00_ContentPlaceHolder1_ddlregimenFiscal", "621");
    await page.waitForTimeout(1000);
    await page.select("#ctl00_ContentPlaceHolder1_ddlusoCFDI", "G03");
    await page.waitForTimeout(1000);

    const buttonAccept = await page.$("#ctl00_ContentPlaceHolder1_btnAceptar");
    await buttonAccept.click();

    await page.waitForTimeout(1000);

    const buttonConfirm = await page.$("#ctl00_btnContinuar");
    await buttonConfirm.click();

    await page.waitForTimeout(5000);
  },
  async sendInvoice(browser, page) {
    const buttonEmail = await page.$("#ctl00_ContentPlaceHolder1_rdCorreo");
    if (!buttonEmail) {
      await browser.close();
      handleSendingInvoiceError();
    }

    await buttonEmail.click();

    const buttonInvoice = await page.$(
      "#ctl00_ContentPlaceHolder1_btnFacturar"
    );
    await buttonInvoice.click();

    const buttonClose = await page.$("#ctl00_ContentPlaceHolder1_btnCerrar");
    await buttonClose.click();

    await page.waitForTimeout(5000);
  },
};

export default walmartNavigation;
