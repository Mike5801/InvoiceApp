import {
  handleSendingInvoiceError,
  handleInitialInformationError,
} from "./errorHandling.utils.js";

const costcoNavigation = {
  async goToPage(page, link) {
    await page.goto(link);
    await page.waitForTimeout(3000);
  },
  async enterTicketInformation(browser, page, ticket, monto, rfc) {
    const inputTicket = await page.$("#ticket");
    if (!inputTicket) {
      await browser.close();
      handleInitialInformationError();
      return;
    }

    const inputMonto = await page.$("#monto");
    const inputRfc = await page.$("#rfc");
    const buttonEnviar = await page.$("#btnEnviar");

    await inputTicket.type(ticket);
    await inputMonto.type(monto);
    await inputRfc.type(rfc);
    await buttonEnviar.click();

    await page.waitForTimeout(2000);
  },
  async sendInvoice(browser, page) {
    await page.waitForTimeout(3000);
    const buttons = await page.$$("#btnEnviar");

    if (buttons.length < 2) {
      await browser.close();
      handleSendingInvoiceError();
      return;
    }

    const buttonEnviar = buttons[1];
    await buttonEnviar.click();
  },
};

export default costcoNavigation;
