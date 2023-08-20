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
    console.log("Entering ticket information");
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
    const buttonText = "Continuar"
    const buttonSelector = `button span span:contains("${buttonText}")`;
    await page.waitForSelector(buttonSelector);
    console.log("Waiting for confirmation of ticket information");

    console.log("Clicking button to go to Client information");
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
    await page.waitForTimeout(10000);

    const inputEmail = await page.$("#mat-input-7");
    await inputEmail.type(email);

    const inputInvoiceUse = await page.$("#mat-input-5");
    await inputInvoiceUse.type("G03");
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("Enter");

    await page.waitForTimeout(10000);
  },
  async sendInvoice(page) {
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");
    await page.keyboard.press("Enter");
    await page.waitForTimeout(15000);
  }
};

export default hebNavitation;
