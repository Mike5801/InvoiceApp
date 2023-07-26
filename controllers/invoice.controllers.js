import puppeteer from "puppeteer";
import dotenv from "dotenv"
import { successStatus, errorStatus } from "../utils/statusHandler.utils.js";
import costcoNavigation from "../utils/costcoNavigation.utils.js";
import walmartNavigation from "../utils/walmartNavigation.utils.js";
import hebNavitation from "../utils/hebNavigation.utils.js";
import {
  renderCostcoPage,
  renderWalmartPage,
  renderHebPage,
} from "../utils/renderPage.utils.js";

const viewVariables = {
  status: null,
  message: "",
};

dotenv.config();

const RFC = process.env.RFC;
const CP = process.env.CP;
const EMAIL = process.env.EMAIL;

// Toggle Feature Costco
// export const getCostcoInvoicePage = (req, res) => {
//   viewVariables.status = null;
//   viewVariables.message = "";

//   renderCostcoPage(res, viewVariables);
// };

// export const getCostcoInvoice = async (req, res) => {
//   const { ticket, monto } = req.body;

//   try {
//     const browser = await puppeteer.launch({ headless: false });
//     const page = await browser.newPage();
//     page.setDefaultNavigationTimeout(0);


//     await costcoNavigation.goToPage(
//       page,
//       "https://www3.costco.com.mx/facturacion"
//     );

//     await costcoNavigation.enterTicketInformation(
//       browser,
//       page,
//       ticket,
//       monto,
//       RFC
//     );

//     // const buttonEnviar2 = await page.$("#btnEnviar");
//     // await buttonEnviar2.evaluate((b) => {
//     //   b.click();
//     // });

//     await page.waitForTimeout(2000);

//     await browser.close();

//     viewVariables.status = successStatus.status;
//     viewVariables.message = successStatus.message;

//     renderCostcoPage(res, viewVariables);

//     /* If treated as a REST API */
//     // res.status(200).json({ message: "Successfully created and sent invoice" });
//   } catch (error) {
//     viewVariables.status = errorStatus.status;
//     viewVariables.message = errorStatus.message;

//     console.error(error);

//     renderCostcoPage(res, viewVariables);

//     /* If treated as a REST API */
//     // res.status(400).json({ message: error.message });
//   }
// };

export const getWalmartInvoicePage = (req, res) => {
  const { company } = req.query;

  viewVariables.company = company;
  viewVariables.status = null;
  viewVariables.message = "";

  renderWalmartPage(res, viewVariables);
};

export const getWalmartInvoice = async (req, res) => {
  const { transaction, ticket } = req.body;

  try {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    page.setDefaultNavigationTimeout(0);

    await walmartNavigation.goToPage(
      page,
      "https://facturacion.walmartmexico.com.mx/Default.aspx",
      "https://facturacion.walmartmexico.com.mx/frmDatos.aspx"
    );
  
    await walmartNavigation.enterTicketInformation(
      browser,
      page,
      RFC,
      CP,
      ticket,
      transaction
    );

    await walmartNavigation.enterInvoiceInformation(page);

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

export const getHebInvoicePage = (req, res) => {
  viewVariables.status = null;
  viewVariables.message = "";

  renderHebPage(res, viewVariables);
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
    page.setDefaultNavigationTimeout(0);


    await hebNavitation.goToPage(
      page,
      "https://facturacion.heb.com.mx/cli/invoice-create"
    );

    await hebNavitation.enterTicketInformation(
      browser,
      page,
      branchOffice,
      ticket,
      numDays,
      totalSale
    );

    await hebNavitation.enterInvoiceInformation(browser, page, RFC, EMAIL);

    await hebNavitation.sendInvoice(page);

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
