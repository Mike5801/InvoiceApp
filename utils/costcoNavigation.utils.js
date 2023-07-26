import {
  handleClientInformationError,
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
};

export default costcoNavigation;
