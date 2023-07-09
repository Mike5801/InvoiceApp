import puppeteer from "puppeteer";

export const getCostcoInvoice = async (req, res) => {
  const { ticket, monto } = req.body;
  
  try {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto("https://www3.costco.com.mx/facturacion")
  
    const inputTicket = await page.$("#ticket");
    const inputMonto = await page.$("#monto");
    const inputRfc = await page.$("#rfc");
    const buttonEnviar = await page.$("#btnEnviar");

    await inputTicket.type(ticket);
    await inputMonto.type(monto);
    await inputRfc.type(process.env.RFC);
    await buttonEnviar.click();
    await buttonEnviar.click();

    browser.close();

    res.status(200).json({ message: "Successfully created and sent invoice" });
  } catch (error) {
    res.status(400).json({ message: error.message })
  }

};
