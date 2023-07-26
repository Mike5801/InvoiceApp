import puppeteer from "puppeteer";
import {
  renderCostcoPage,
  renderWalmartPage,
  renderHebPage,
} from "../utils/renderPage.utils.js";
import { successStatus, errorStatus } from "../utils/statusHandler.utils.js";
import {
  handleClientInformationError,
  handleInitialInformationError,
  handleSendingInvoiceError,
} from "../utils/errorHandling.utils.js";

import walmartNavigation from "../utils/walmartNavigation.utils.js";

const viewVariables = {
  status: null,
  message: "",
};

const RFC = process.env.RFC;
const CP = process.env.CP;

export const getCostcoInvoicePage = (req, res) => {
  viewVariables.status = null;
  viewVariables.message = "";

  renderCostcoPage(res, viewVariables);
};

export const getWalmartInvoicePage = (req, res) => {
  const { company } = req.query;

  viewVariables.company = company;
  viewVariables.status = null;
  viewVariables.message = "";

  renderWalmartPage(res, viewVariables);
};

export const getHebInvoicePage = (req, res) => {
  viewVariables.status = null;
  viewVariables.message = "";

  renderHebPage(res, viewVariables);
};

export const getCostcoInvoice = async (req, res) => {
  const { ticket, monto } = req.body;

  try {
    /* Enter to Costco's invoice page */
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto("https://www3.costco.com.mx/facturacion");

    await page.waitForTimeout(3000);

    /* Enter information for invoice */
    const inputTicket = await page.$("#ticket");
    if (!inputTicket) handleInitialInformationError();

    const inputMonto = await page.$("#monto");
    const inputRfc = await page.$("#rfc");
    const buttonEnviar = await page.$("#btnEnviar");

    await inputTicket.type(ticket);
    await inputMonto.type(monto);
    await inputRfc.type(process.env.RFC);
    await buttonEnviar.click();

    await page.waitForTimeout(2000);

    // const buttonEnviar2 = await page.$("#btnEnviar");
    // await buttonEnviar2.evaluate((b) => {
    //   b.click();
    // });

    await page.waitForTimeout(2000);

    await browser.close();

    viewVariables.status = successStatus.status;
    viewVariables.message = successStatus.message;

    renderCostcoPage(res, viewVariables);

    /* If treated as a REST API */
    // res.status(200).json({ message: "Successfully created and sent invoice" });
  } catch (error) {
    viewVariables.status = errorStatus.status;
    viewVariables.message = errorStatus.message;

    console.error(error);

    renderCostcoPage(res, viewVariables);

    /* If treated as a REST API */
    // res.status(400).json({ message: error.message });
  }
};

export const getWalmartInvoice = async (req, res) => {
  const { transaction, ticket } = req.body;

  try {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    await walmartNavigation.goToPage(page, "https://facturacion.walmartmexico.com.mx/Default.aspx", "https://facturacion.walmartmexico.com.mx/frmDatos.aspx");

    await walmartNavigation.enterTicketInformation(browser, page, RFC, CP, ticket, transaction);

    await walmartNavigation.enterInvoiceInformation(browser, page);

    await walmartNavigation.sendInvoice(browser, page);

    await browser.close();

    viewVariables.status = successStatus.status;
    viewVariables.message = successStatus.message;

    renderWalmartPage(res, viewVariables);

    /* If treated as a REST API */
    // res.status(200).json({ message: "Successfully created and sent invoice" });
  } catch (error) {
    viewVariables.status = errorStatus.status;
    viewVariables.message = errorStatus.message;

    console.error(error);

    renderWalmartPage(res, viewVariables);

    /* If treated as a REST API */
    // res.status(400).json({ message: error.message });
  }
};

export const getHebInvoice = async (req, res) => {
  const { ticket, date, totalSale } = req.body;
  const branchOffice = "(2986) HEB SLP SAN LUIS POTOSI";

  const today = new Date();
  const todayTime = today.getTime();

  const dateFormat = new Date(date);
  const dateTime = dateFormat.getTime();
  const diffDates = Math.abs(todayTime - dateTime);
  const numDays = Math.floor(diffDates / (1000 * 60 * 60 * 24));

  try {
    /* Enter to HEB Invoice Page */
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto("https://facturacion.heb.com.mx/cli/invoice-create");

    await page.waitForTimeout(5000);

    await page.keyboard.press("Tab");
    await page.keyboard.press("Enter");

    const inputBranchOffice = await page.$("#mat-input-0");
    if (!inputBranchOffice) handleInitialInformationError();

    await inputBranchOffice.type(branchOffice);
    await page.keyboard.press("Enter");

    /* Enter initial information of invoice (ticket, date, branch office and total sale) */
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

    /* Enter client information (RFC, email and invoice use) */
    const inputRfc = await page.$("#mat-input-6");
    if (!inputRfc) handleClientInformationError();

    await inputRfc.type(process.env.RFC);
    await page.keyboard.press("Tab");
    await page.waitForTimeout(5000);

    const inputEmail = await page.$("#mat-input-7");
    await inputEmail.type(process.env.EMAIL);

    const inputInvoiceUse = await page.$("#mat-input-5");
    await inputInvoiceUse.type("G03");
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("Enter");

    /* Send invoice to email */
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");
    await page.keyboard.press("Enter");
    await page.waitForTimeout(7000);

    await browser.close();

    viewVariables.status = successStatus.status;
    viewVariables.message = successStatus.message;

    renderHebPage(res, viewVariables);

    /* If treated as a REST API */
    // res.status(200).json({ message: "Successfully created and sent invoice" });
  } catch (error) {
    viewVariables.message = errorStatus.message;
    viewVariables.status = errorStatus.status;

    console.error(error);

    renderHebPage(res, viewVariables);

    /* If treated as a REST API */
    // res.status(400).json({ message: error.message });
  }
};
