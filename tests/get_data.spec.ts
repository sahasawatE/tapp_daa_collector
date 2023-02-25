import { Util } from "./../functions/util";
import { test } from "@playwright/test";
var fs = require("fs");

const user = {
  username: {
    apple: "B0016641",
    motto: "",
    union: "",
  },
  password: {
    apple: "Apple@245",
    motto: "",
    union: "",
  },
};

let result = {};

test.describe("apple auction", () => {
  test("get car information", async ({ page }) => {
    const util = new Util(page);
    await page.goto("https://www.appleauction.co.th/catalog");
    await page.locator("#btn-login").click();
    await page.locator('//input[@id="UserName"]').fill(user.username.apple);
    await page.locator('//input[@id="Password"]').fill(user.password.apple);
    await page.locator('//button[@id="btn-sign"]').click();

    await page.waitForTimeout(1000);
    await page.goto("https://www.appleauction.co.th/catalog");

    await page.waitForTimeout(2000);
    await page
      .locator(
        '//*[text()="การประมูล"]/parent::div/div[@class="button-select dropdown"]'
      )
      .click();
    await page.waitForTimeout(1000);
    const auction_options = page.locator(
      '//div[@id="ddl-auction"]/ul[@role="menu"]/li/span'
    );
    let auction_fields = await auction_options.evaluateAll(async (options) => {
      return options.map((e) => e.getAttribute("data-value"));
    });
    auction_fields = auction_fields.splice(1);

    for (let cr_id of auction_fields) {
      await page.waitForTimeout(1000);
      await page.goto(`https://www.appleauction.co.th/catalog/CR/${cr_id}`);

      const next_page = page.locator('//*[text()="›"]/parent::li');
      await next_page.scrollIntoViewIfNeeded();
      const next_page_class = await next_page.getAttribute("class");
      await page.waitForTimeout(1000);
      let clickable = !next_page_class?.includes("disabled");

      let table_slt: any[] = [];

      const table_img = await util.getImgModal();
      const table_data = await page
        .locator("//tbody/tr")
        .evaluateAll((rows) => {
          return rows.map((cols) => {
            const col = cols.querySelectorAll("td");
            const text = Array.from(col, (data) => {
              return data.innerText;
            }).splice(2);
            return text;
          });
        });

      table_slt.push({ text: table_data, img: table_img });

      while (clickable) {
        const table_img = await util.getImgModal();
        const table_data = await page
          .locator("//tbody/tr")
          .evaluateAll((rows) => {
            return rows.map((cols) => {
              const col = cols.querySelectorAll("td");
              const text = Array.from(col, (data) => {
                return data.innerText;
              }).splice(2);
              return text;
            });
          });

        table_slt.push({ text: table_data, img: table_img });

        await next_page.click();
        const np = page.locator('//*[text()="›"]/parent::li');
        const np_class = await np.getAttribute("class");
        clickable = !np_class?.includes("disabled");
      }
      result[cr_id || "none"] = table_slt;
      await page.waitForTimeout(1000);
    }

    result = JSON.stringify(result);

    fs.writeFile("result.json", result, "utf8", (err) => {
      if (err) throw err;
      console.log("complete");
    });
  });
});

// test.describe("union auction", () => {});

// test.describe("motto auction", () => {});
