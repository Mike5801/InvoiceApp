import {
  handleClientInformationError,
  handleInitialInformationError,
} from "./errorHandling.utils.js";

const hebNavitation = {
  async goToPage(page, link) {
    await page.goto(link);

    await page.waitForTimeout(5000);

    await page.keyboard.press("Tab");
    await page.keyboard.press("Enter");
  },
  async enterTicketInformation(
    browser,
    page,
    branchOffice,
    ticket,
    numDays,
    totalSale
  ) {
    const inputBranchOffice = await page.$("#mat-input-0");
    if (!inputBranchOffice) {
      await browser.close();
      handleInitialInformationError();
    }

    await inputBranchOffice.type(branchOffice);
    await page.keyboard.press("Enter");

    const inputTicket = await page.$("#mat-input-1");
    await inputTicket.type(ticket);

    const inputDate = await page.$("#mat-input-2");
    await inputDate.click();
    for (let i = 0; i < numDays; i++) {
      await page.keyboard.press("ArrowLeft");
    }
    await page.keyboard.press("Enter");

    const inputTotalSale = await page.$("#mat-input-3");
    await inputTotalSale.type(totalSale);

    await page.keyboard.press("Tab");
    await page.keyboard.press("Enter");
    await page.waitForTimeout(5000);

    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");
    await page.keyboard.press("Enter");

    await page.waitForTimeout(7000);
  },
  async enterInvoiceInformation(browser, page, rfc, email) {
    const inputRfc = await page.$("#mat-input-6");
    if (!inputRfc) {
      await browser.close();
      handleClientInformationError();
    }

    await inputRfc.type(rfc);
    await page.keyboard.press("Tab");
    await page.waitForTimeout(5000);

    const inputEmail = await page.$("#mat-input-7");
    await inputEmail.type(email);

    const inputInvoiceUse = await page.$("#mat-input-5");
    await inputInvoiceUse.type("G03");
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("Enter");

    await page.waitForTimeout(2000);
  },
  async sendInvoice(page) {
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");
    await page.keyboard.press("Enter");
    await page.waitForTimeout(7000);
  }
};

export default hebNavitation;
